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
            @click="router.push('/assessment')"
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
          :current-step="recommendationStep"
          :step-progress="recommendationProgress"
          :streaming-content="streamingContent"
          :is-streaming="isStreaming"
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
      :streaming-content="analysisStreamingContent"
      :is-streaming="isAnalysisStreaming"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PreferenceCollector from '@/components/school-recommendation/PreferenceCollector.vue'
import RecommendationList from '@/components/school-recommendation/RecommendationList.vue'
import SchoolAnalysisDialog from '@/components/school-recommendation/SchoolAnalysisDialog.vue'
import { useAIRecommendation } from '@/composables/useAIRecommendation'
import { schoolsData } from '@/utils/recommendationEngine'

const router = useRouter()
const {
  loading,
  currentStep: recommendationStep,
  stepProgress: recommendationProgress,
  streamingContent,
  isStreaming,
  generateRecommendations,
  generateAnalysis,
  // 分析相关
  analysisLoading,
  analysisStreamingContent,
  isAnalysisStreaming,
  globalState
} = useAIRecommendation()

// 状态
const hasAssessment = ref(false)
const assessment = ref(null)
const currentStep = ref('preference')
const recommendations = ref([])
const summary = ref('')
const favorites = ref([])
const userPreference = ref(null)

// 恢复全局状态
const restoreGlobalState = () => {
  // 检查是否有进行中的推荐
  if (globalState.hasOngoingRecommendation()) {
    // 恢复到生成中的状态
    currentStep.value = 'preference'
    userPreference.value = globalState.state.preference
    ElMessage.info('正在恢复之前的推荐进度...')
    return true
  }
  
  // 检查是否有已完成的推荐
  if (globalState.state.currentStep === 'completed' && globalState.state.recommendations.length > 0) {
    recommendations.value = globalState.state.recommendations
    summary.value = globalState.state.summary
    userPreference.value = globalState.state.preference
    currentStep.value = 'recommendation'
    return true
  }
  
  return false
}

// 分析对话框状态
const analysisVisible = ref(false)
const selectedRecommendation = ref(null)
const currentAnalysis = ref(null)
// 使用全局状态中的 loading，不再使用本地 ref
// const analysisLoading = ref(false) // 已移除，使用 analysisLoading computed

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
  const keyData = {
    basic: assessmentData.basic,
    academic: assessmentData.academic,
    practice: assessmentData.practice,
    savedAt: assessmentData.savedAt
  }
  try {
    return btoa(encodeURIComponent(JSON.stringify(keyData)))
  } catch (_e) {
    return JSON.stringify(keyData)
  }
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
  currentAnalysis.value = null

  const providers = JSON.parse(localStorage.getItem('ai_providers') || '[]')
  const defaultProvider = providers.length > 0 ? providers[0].id : null

  if (!defaultProvider) {
    return
  }

  // 检查是否有进行中的分析（可能是用户离开页面后返回）
  const ongoingSchoolId = globalState.getOngoingAnalysisSchoolId()
  if (ongoingSchoolId === recommendation.schoolId) {
    // 恢复进行中的分析状态
    ElMessage.info('正在恢复之前的分析进度...')
    // currentAnalysis 会在流式完成后自动更新
    return
  }

  // 检查是否有已完成的分析缓存
  if (globalState.isAnalysisStateValid(recommendation.schoolId) && globalState.state.schoolAnalysis.analysis) {
    currentAnalysis.value = globalState.state.schoolAnalysis.analysis
    return
  }

  // 开始新的分析
  const analysis = await generateAnalysis(
    assessment.value,
    recommendation.schoolId,
    defaultProvider,
    (streamContent) => {
      // 流式更新回调 - 可以在这里添加额外的UI更新逻辑
      console.log('Analysis streaming:', streamContent.substring(0, 100) + '...')
    }
  )
  currentAnalysis.value = analysis
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
  if (!userPreference.value) {
    ElMessage.warning('请先完成偏好设置')
    return
  }
  
  ElMessage.info(`AI正在理解你的需求："${message}"`)
  
  try {
    const adjustedPreference = {
      ...userPreference.value,
      specialRequirements: `${userPreference.value.specialRequirements || ''}; ${message}`
    }
    
    await handlePreferenceSubmit(adjustedPreference)
    ElMessage.success('推荐已更新！')
  } catch (error) {
    console.error('调整推荐失败:', error)
    ElMessage.error('调整推荐失败，请重试')
  }
}

// 检查评估数据
const checkAssessment = () => {
  const savedAssessment = localStorage.getItem('assessment_report')
  console.log('检查评估数据:', savedAssessment ? '存在' : '不存在')
  
  if (savedAssessment) {
    try {
      const parsed = JSON.parse(savedAssessment)
      assessment.value = parsed
      console.log('评估数据解析成功, basic:', parsed.basic)
      
      if (parsed.basic && (parsed.basic.name || parsed.basic.university)) {
        hasAssessment.value = true
        console.log('hasAssessment 设置为 true')
      } else {
        hasAssessment.value = false
        console.log('basic 数据不完整, hasAssessment 为 false')
      }
    } catch (e) {
      console.error('解析评估数据失败:', e)
      hasAssessment.value = false
    }
  } else {
    hasAssessment.value = false
  }
}

// 监听全局分析状态变化 - 当流式完成后更新 currentAnalysis
watch(() => globalState.state.schoolAnalysis, (newState) => {
  // 如果分析完成且有结果，更新 currentAnalysis
  if (newState.currentStep === 'completed' && newState.analysis && selectedRecommendation.value) {
    if (newState.schoolId === selectedRecommendation.value.schoolId) {
      currentAnalysis.value = newState.analysis
    }
  }
}, { deep: true })

// 初始化
onMounted(() => {
  checkAssessment()

  // 加载收藏
  const savedFavorites = localStorage.getItem('school_favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }

  // 首先尝试恢复全局状态（进行中的推荐）
  const restored = restoreGlobalState()

  // 如果没有恢复全局状态，再尝试从 localStorage 加载
  if (!restored) {
    // 加载之前的推荐
    const savedRecommendations = localStorage.getItem('school_recommendations')
    if (savedRecommendations) {
      const data = JSON.parse(savedRecommendations)
      // 检查是否有推荐数据
      if (data.recommendations && data.recommendations.length > 0) {
        // 检查是否在24小时内
        const isWithin24Hours = Date.now() - data.timestamp < 24 * 60 * 60 * 1000

        // 如果有评估数据，检查评估是否变化；如果没有评估数据，直接恢复推荐
        const currentHash = generateAssessmentHash(assessment.value)
        const isAssessmentUnchanged = !currentHash || data.assessmentHash === currentHash

        if (isWithin24Hours && isAssessmentUnchanged) {
          recommendations.value = data.recommendations
          summary.value = data.summary
          userPreference.value = data.preference
          currentStep.value = 'recommendation'
        } else if (!isAssessmentUnchanged) {
          localStorage.removeItem('school_recommendations')
          currentStep.value = 'preference'
          ElMessage.info('检测到背景信息已更新，请重新生成院校推荐')
        }
      }
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
  padding: 24px;
}

.compare-table :deep(.el-table__body .el-button) {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
