<template>
  <div class="school-recommendation-page">
    <h2 class="page-title">
      AI智能选校推荐
    </h2>

    <!-- 未完成背景评估提示 -->
    <el-card
      v-if="!hasAssessment"
      class="intro-card"
    >
      <el-result
        icon="info"
        title="请先完成背景评估"
        sub-title="系统需要您的背景信息才能进行精准推荐"
      >
        <template #extra>
          <el-button
            type="primary"
            @click="$router.push('/assessment')"
          >
            去评估
          </el-button>
        </template>
      </el-result>
    </el-card>

    <template v-else>
      <!-- Step 1: 偏好收集 -->
      <el-card
        v-if="currentStep === 'preference'"
        class="main-card"
      >
        <PreferenceCollector
          :assessment="assessment"
          :loading="loading"
          @submit="handlePreferenceSubmit"
        />
      </el-card>

      <!-- Step 2: 推荐结果 -->
      <template v-if="currentStep === 'recommendation'">
        <el-card class="main-card">
          <RecommendationList
            :recommendations="recommendations"
            :favorites="favorites"
            :summary="summary"
            @toggle-favorite="toggleFavorite"
            @view-detail="viewSchoolDetail"
            @show-analysis="showAnalysis"
            @reset="resetToPreference"
            @compare="openCompareDialog"
            @adjust="handleAdjustRequest"
          />
        </el-card>
      </template>
    </template>

    <!-- 深度分析对话框 -->
    <SchoolAnalysisDialog
      v-model="analysisVisible"
      :recommendation="selectedRecommendation"
      :analysis="currentAnalysis"
      :loading="analysisLoading"
      @view-detail="viewSchoolDetail"
    />

    <!-- 对比对话框 -->
    <el-dialog
      v-model="compareVisible"
      title="学校对比"
      width="80%"
    >
      <el-table
        :data="compareSchools"
        style="width: 100%"
        class="compare-table"
      >
        <el-table-column
          prop="name"
          label="学校"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="country"
          label="国家"
          min-width="80"
        />
        <el-table-column
          prop="ranking"
          label="排名"
          min-width="80"
        />
        <el-table-column
          prop="match"
          label="匹配度"
          min-width="160"
        >
          <template #default="{ row }">
            <el-progress
              :percentage="row.match"
              :color="getScoreColor(row.match)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="tuition"
          label="学费"
          min-width="100"
        />
        <el-table-column
          prop="acceptanceRate"
          label="录取率"
          min-width="90"
        />
        <el-table-column
          label="操作"
          min-width="110"
        >
          <template #default="{ row }">
            <el-button
              size="small"
              type="danger"
              plain
              @click="removeFavorite(row.id)"
            >
              取消收藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PreferenceCollector from '@/components/school-recommendation/PreferenceCollector.vue'
import RecommendationList from '@/components/school-recommendation/RecommendationList.vue'
import SchoolAnalysisDialog from '@/components/school-recommendation/SchoolAnalysisDialog.vue'
import { useAIRecommendation } from '@/composables/useAIRecommendation'
import { schoolsData } from '@/utils/recommendationEngine'

const router = useRouter()
const { loading, generateRecommendations, generateAnalysis } = useAIRecommendation()

// 状态
const hasAssessment = ref(false)
const assessment = ref(null)
const currentStep = ref('preference')
const recommendations = ref([])
const summary = ref('')
const favorites = ref([])
const userPreference = ref(null)

// 分析对话框状态
const analysisVisible = ref(false)
const selectedRecommendation = ref(null)
const currentAnalysis = ref(null)
const analysisLoading = ref(false)

// 对比对话框状态
const compareVisible = ref(false)

// 计算属性
const compareSchools = computed(() => {
  return schoolsData
    .filter(s => favorites.value.includes(s.id))
    .map(s => ({
      ...s,
      match: recommendations.value.find(r => r.schoolId === s.id)?.matchScore || 50
    }))
})

const getScoreColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 生成评估数据的简单哈希（用于检测评估数据是否变化）
const generateAssessmentHash = (assessmentData) => {
  if (!assessmentData) return ''
  // 提取关键字段生成哈希
  const keyData = {
    basic: assessmentData.basic,
    academic: assessmentData.academic,
    practice: assessmentData.practice,
    savedAt: assessmentData.savedAt
  }
  return btoa(JSON.stringify(keyData))
}

// 处理偏好提交
const handlePreferenceSubmit = async (preference) => {
  userPreference.value = preference
  
  // 获取默认的AI provider
  const providers = JSON.parse(localStorage.getItem('ai_providers') || '[]')
  const defaultProvider = providers.length > 0 ? providers[0].id : null
  
  if (!defaultProvider) {
    ElMessage.warning('请先配置AI模型')
    router.push('/ai-config')
    return
  }

  const result = await generateRecommendations(assessment.value, preference, defaultProvider)
  
  if (result) {
    recommendations.value = result.recommendations
    summary.value = result.summary
    currentStep.value = 'recommendation'
    
    // 保存到localStorage，同时记录评估数据的标识（用于检测评估数据是否变化）
    localStorage.setItem('school_recommendations', JSON.stringify({
      recommendations: result.recommendations,
      summary: result.summary,
      preference: preference,
      timestamp: Date.now(),
      assessmentHash: generateAssessmentHash(assessment.value)
    }))
    
    ElMessage.success('推荐生成完成！')
  }
}

// 显示深度分析
const showAnalysis = async (recommendation) => {
  selectedRecommendation.value = recommendation
  analysisVisible.value = true
  analysisLoading.value = true
  currentAnalysis.value = null
  
  const providers = JSON.parse(localStorage.getItem('ai_providers') || '[]')
  const defaultProvider = providers.length > 0 ? providers[0].id : null
  
  if (!defaultProvider) {
    analysisLoading.value = false
    return
  }
  
  const analysis = await generateAnalysis(assessment.value, recommendation.schoolId, defaultProvider)
  currentAnalysis.value = analysis
  analysisLoading.value = false
}

// 收藏操作
const toggleFavorite = (schoolId) => {
  const index = favorites.value.indexOf(schoolId)
  if (index > -1) {
    favorites.value.splice(index, 1)
    ElMessage.success('已取消收藏')
  } else {
    favorites.value.push(schoolId)
    ElMessage.success('已收藏')
  }
  localStorage.setItem('school_favorites', JSON.stringify(favorites.value))
}

const removeFavorite = (schoolId) => {
  const index = favorites.value.indexOf(schoolId)
  if (index > -1) {
    favorites.value.splice(index, 1)
    localStorage.setItem('school_favorites', JSON.stringify(favorites.value))
    ElMessage.success('已取消收藏')
  }
}

// 查看学校详情
const viewSchoolDetail = (schoolId) => {
  router.push(`/school-detail/${schoolId}`)
}

// 重置到偏好收集
const resetToPreference = () => {
  currentStep.value = 'preference'
  recommendations.value = []
  summary.value = ''
}

// 打开对比对话框
const openCompareDialog = () => {
  if (favorites.value.length < 2) {
    ElMessage.warning('请至少收藏2所学校后再对比')
    return
  }
  compareVisible.value = true
}

// 处理调整请求
const handleAdjustRequest = async (message) => {
  ElMessage.info(`AI正在理解你的需求："${message}"`)
  
  // 这里可以实现更复杂的对话式调整逻辑
  // 目前简单地重新生成推荐
  if (userPreference.value) {
    // 将调整请求添加到特殊要求中
    const adjustedPreference = {
      ...userPreference.value,
      specialRequirements: `${userPreference.value.specialRequirements || ''}; ${message}`
    }
    
    await handlePreferenceSubmit(adjustedPreference)
  }
}

// 初始化
onMounted(() => {
  // 加载评估数据
  const savedAssessment = localStorage.getItem('assessment_report')
  if (savedAssessment) {
    assessment.value = JSON.parse(savedAssessment)
    if (assessment.value.basic) {
      hasAssessment.value = true
    }
  }
  
  // 加载收藏
  const savedFavorites = localStorage.getItem('school_favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
  
  // 加载之前的推荐
  const savedRecommendations = localStorage.getItem('school_recommendations')
  if (savedRecommendations && assessment.value) {
    const data = JSON.parse(savedRecommendations)
    // 检查是否在24小时内，并且评估数据没有变化
    const isWithin24Hours = Date.now() - data.timestamp < 24 * 60 * 60 * 1000
    const currentHash = generateAssessmentHash(assessment.value)
    const isAssessmentUnchanged = data.assessmentHash === currentHash
    
    if (isWithin24Hours && isAssessmentUnchanged) {
      recommendations.value = data.recommendations
      summary.value = data.summary
      userPreference.value = data.preference
      if (recommendations.value.length > 0) {
        currentStep.value = 'recommendation'
      }
    } else if (!isAssessmentUnchanged) {
      // 评估数据已变化，清除旧的推荐数据，要求重新生成
      localStorage.removeItem('school_recommendations')
      currentStep.value = 'preference'
      ElMessage.info('检测到背景信息已更新，请重新生成院校推荐')
    }
  }
})
</script>

<style scoped>
.school-recommendation-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
}

.main-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.main-card :deep(.el-card__body) {
  padding: 0;
}

.compare-table :deep(.el-table__body .el-button) {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
