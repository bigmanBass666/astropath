<template>
  <div class="school-recommendation-page" ref="pageRoot">
    <h2 class="page-title">AI智能选校推荐</h2>

    <el-card class="intro-card" v-if="!hasAssessment">
      <el-result icon="info" title="请先完成背景评估" sub-title="系统需要您的背景信息才能进行精准推荐">
        <template #extra>
          <el-button type="primary" @click="$router.push('/assessment')">去评估</el-button>
        </template>
      </el-result>
    </el-card>

    <template v-else>
      <!-- 背景摘要 -->
      <el-card class="summary-card">
        <template #header>
          <span>您的背景摘要</span>
        </template>
        <div class="summary-content">
          <el-tag type="primary">GPA: {{ assessment.basic.gpa }}</el-tag>
          <el-tag type="success">院校: {{ assessment.basic.university }}</el-tag>
          <el-tag type="warning">均分: {{ assessment.academic.averageScore }}</el-tag>
          <el-tag type="info">总分: {{ assessment.scores?.overall?.toFixed(1) || 'N/A' }}</el-tag>
        </div>
      </el-card>

      <!-- 筛选与排序控制 -->
      <el-card class="filter-card">
        <div class="filter-row">
          <el-select v-model="selectedCountry" ref="countryFilter" placeholder="筛选国家" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option v-for="country in availableCountries" :key="country" :label="country" :value="country" />
          </el-select>
          <el-select v-model="selectedMajor" placeholder="筛选专业" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option v-for="major in availableMajors" :key="major" :label="major" :value="major" />
          </el-select>
          <el-select v-model="rankingRange" placeholder="排名范围" clearable style="width: 150px;">
            <el-option v-for="range in rankingRanges" :key="range.value" :label="range.label" :value="range.value" />
          </el-select>
          <el-select v-model="filterFavorites" placeholder="显示收藏" style="width: 120px;">
            <el-option label="全部" :value="false" />
            <el-option label="仅收藏" :value="true" />
          </el-select>
          <el-select v-model="sortBy" ref="sortSelect" placeholder="排序方式" style="width: 150px;">
            <el-option label="默认顺序" value="default" />
            <el-option label="匹配度 (高→低)" value="match-desc" />
            <el-option label="匹配度 (低→高)" value="match-asc" />
            <el-option label="截止日期 (近→远)" value="deadline-asc" />
            <el-option label="截止日期 (远→近)" value="deadline-desc" />
          </el-select>
          <el-button v-if="hasActiveFilters" type="primary" link @click="clearAllFilters" class="clear-filters-btn">
            清除筛选
          </el-button>
          <span class="result-count">共 {{ filteredAndSortedSchools.length }} 所学校</span>
        </div>
      </el-card>

      <!-- 推荐控制 -->
      <el-card class="control-card">
        <div class="control-row">
          <el-button type="primary" @click="startRecommendation" :loading="recommending">
            {{ recommending ? '计算中...' : '开始推荐' }}
          </el-button>
          <el-select v-model="strategy" placeholder="推荐策略" style="width: 180px;">
            <el-option label="全部展示" value="all" />
            <el-option label="冲刺院校" value="reach" />
            <el-option label="匹配院校" value="match" />
            <el-option label="保底院校" value="safe" />
          </el-select>
          <el-button @click="toggleCompare" :disabled="selectedSchools.length === 0">
            对比选中 ({{ selectedSchools.length }})
          </el-button>
          <el-button @click="toggleCompareFavorites" :disabled="favorites.length === 0" type="success" plain>
            对比已收藏 ({{ favorites.length }})
          </el-button>
          <el-button 
            v-if="schools.length > 0" 
            @click="openAIAnalysis" 
            type="warning" 
            plain
            :icon="Cpu"
          >
            AI深度分析
          </el-button>
        </div>
        <!-- 进度条 -->
        <el-progress v-if="recommending" :percentage="progress" :status="progressStatus" style="margin-top: 15px;" />
      </el-card>

      <!-- 推荐列表：三个分类区域 -->
      <div class="schools-container">
        <!-- 冲刺院校 -->
        <el-card class="category-card reach" v-if="reachSchools.length > 0">
          <template #header>
            <div class="category-header">
              <span class="category-title">冲刺院校</span>
              <span class="category-count">{{ reachSchools.length }} 所</span>
            </div>
          </template>
          <div class="schools-grid">
            <div v-for="school in reachSchools" :key="school.id" class="school-card"
              :class="{ 'is-selected': selectedSchools.includes(school.id), 'is-favorite': favorites.includes(school.id) }">
              <div class="school-header" @click="toggleSelect(school.id)">
                <el-checkbox :model-value="selectedSchools.includes(school.id)" @click.stop />
                <span class="school-name" @click="showDetail(school)">{{ school.name }}</span>
                <el-tag type="danger" class="match-badge">匹配度 {{ school.match }}%</el-tag>
              </div>
              <div class="school-info">
                <p><strong>国家：</strong>{{ school.country }}</p>
                <p><strong>专业：</strong>{{ school.major }}</p>
                <p><strong>排名：</strong>{{ school.ranking }}</p>
                <p><strong>截止日期：</strong>{{ school.deadline }}</p>
              </div>
              <div class="school-actions">
                <el-button size="small" type="primary" plain @click="showDetail(school)">查看详情</el-button>
                <el-button size="small" :type="favorites.includes(school.id) ? 'warning' : 'default'"
                  @click="toggleFavorite(school.id)">
                  {{ favorites.includes(school.id) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 匹配院校 -->
        <el-card class="category-card match" v-if="matchSchools.length > 0">
          <template #header>
            <div class="category-header">
              <span class="category-title">匹配院校</span>
              <span class="category-count">{{ matchSchools.length }} 所</span>
            </div>
          </template>
          <div class="schools-grid">
            <div v-for="school in matchSchools" :key="school.id" class="school-card"
              :class="{ 'is-selected': selectedSchools.includes(school.id), 'is-favorite': favorites.includes(school.id) }">
              <div class="school-header" @click="toggleSelect(school.id)">
                <el-checkbox :model-value="selectedSchools.includes(school.id)" @click.stop />
                <span class="school-name" @click="showDetail(school)">{{ school.name }}</span>
                <el-tag type="warning" class="match-badge">匹配度 {{ school.match }}%</el-tag>
              </div>
              <div class="school-info">
                <p><strong>国家：</strong>{{ school.country }}</p>
                <p><strong>专业：</strong>{{ school.major }}</p>
                <p><strong>排名：</strong>{{ school.ranking }}</p>
                <p><strong>截止日期：</strong>{{ school.deadline }}</p>
              </div>
              <div class="school-actions">
                <el-button size="small" type="primary" plain @click="showDetail(school)">查看详情</el-button>
                <el-button size="small" :type="favorites.includes(school.id) ? 'warning' : 'default'"
                  @click="toggleFavorite(school.id)">
                  {{ favorites.includes(school.id) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 保底院校 -->
        <el-card class="category-card safe" v-if="safeSchools.length > 0">
          <template #header>
            <div class="category-header">
              <span class="category-title">保底院校</span>
              <span class="category-count">{{ safeSchools.length }} 所</span>
            </div>
          </template>
          <div class="schools-grid">
            <div v-for="school in safeSchools" :key="school.id" class="school-card"
              :class="{ 'is-selected': selectedSchools.includes(school.id), 'is-favorite': favorites.includes(school.id) }">
              <div class="school-header" @click="toggleSelect(school.id)">
                <el-checkbox :model-value="selectedSchools.includes(school.id)" @click.stop />
                <span class="school-name" @click="showDetail(school)">{{ school.name }}</span>
                <el-tag type="success" class="match-badge">匹配度 {{ school.match }}%</el-tag>
              </div>
              <div class="school-info">
                <p><strong>国家：</strong>{{ school.country }}</p>
                <p><strong>专业：</strong>{{ school.major }}</p>
                <p><strong>排名：</strong>{{ school.ranking }}</p>
                <p><strong>截止日期：</strong>{{ school.deadline }}</p>
              </div>
              <div class="school-actions">
                <el-button size="small" type="primary" plain @click="showDetail(school)">查看详情</el-button>
                <el-button size="small" :type="favorites.includes(school.id) ? 'warning' : 'default'"
                  @click="toggleFavorite(school.id)">
                  {{ favorites.includes(school.id) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 空状态 -->
        <el-empty v-if="schools.length === 0 && !recommending" description="暂无推荐学校">
          <el-button type="primary" size="large" @click="startRecommendation">开始推荐</el-button>
        </el-empty>
      </div>
    </template>


    <!-- 对比对话框 -->
    <el-dialog v-model="compareVisible" title="学校对比" width="80%">
      <div class="compare-header" v-if="compareMode === 'favorites'">
        <el-alert type="info" :closable="false" show-icon>
          正在对比您收藏的学校，可点击右侧操作取消收藏
        </el-alert>
      </div>
      <el-table :data="compareSchools" style="width: 100%" class="compare-table">
        <el-table-column prop="name" label="学校" min-width="140" show-overflow-tooltip />
        <el-table-column prop="country" label="国家" min-width="80" />
        <el-table-column prop="ranking" label="排名" min-width="80" />
        <el-table-column prop="match" label="匹配度" min-width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.match" :color="getScoreColor(row.match)" />
          </template>
        </el-table-column>
        <el-table-column prop="tuition" label="学费" min-width="100" />
        <el-table-column prop="acceptanceRate" label="录取率" min-width="90" />
        <el-table-column label="操作" min-width="110" v-if="compareMode === 'favorites'">
          <template #default="{ row }">
            <el-button size="small" type="danger" plain @click="removeFavoriteAndClose(row.id)">
              取消收藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- AI 深度分析对话框 -->
    <el-dialog 
      v-model="aiAnalysisVisible" 
      title="AI 选校深度分析" 
      width="85%"
      :close-on-click-modal="false"
      @close="closeAIAnalysis"
    >
      <div class="ai-analysis-container">
        <!-- 模型选择 -->
        <div class="ai-model-selector" v-if="!aiAnalyzing && !aiAnalysisContent">
          <el-form label-width="100px">
            <el-form-item label="选择AI模型">
              <el-select v-model="selectedProvider" placeholder="请选择AI模型" style="width: 300px;">
                <el-option 
                  v-for="provider in providers" 
                  :key="provider.id" 
                  :label="provider.name" 
                  :value="provider.id" 
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="ai-start-section">
            <p class="ai-description">
              AI 将基于您的背景信息和推荐院校，生成一份详细的选校分析报告，包括：
            </p>
            <ul class="ai-features">
              <li>背景竞争力总结</li>
              <li>冲刺/匹配/保底院校详细分析</li>
              <li>整体申请策略建议</li>
              <li>风险提示与备选方案</li>
            </ul>
            <el-button 
              type="primary" 
              size="large" 
              @click="startAIAnalysis"
              :loading="aiAnalyzing"
              :disabled="!selectedProvider"
            >
              开始AI分析
            </el-button>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="aiAnalyzing && !aiAnalysisContent" class="ai-loading">
          <div class="thinking-animation">
            <div class="thinking-dot"></div>
            <div class="thinking-dot"></div>
            <div class="thinking-dot"></div>
          </div>
          <p class="thinking-text">AI正在进行深度分析...</p>
          <p class="thinking-tip">这可能需要10-30秒，请耐心等待</p>
        </div>

        <!-- 分析结果 -->
        <div v-if="aiAnalysisContent" class="ai-result">
          <div class="ai-content" v-html="renderAiContent(aiAnalysisContent)"></div>
          <span v-if="aiAnalyzing" class="typing-cursor"></span>
        </div>

        <!-- AI推荐院校区域 -->
        <div v-if="aiRecommendedSchools && !aiAnalyzing" class="ai-recommendation-section">
          <el-divider content-position="left">
            <span class="recommendation-divider">AI 推荐院校</span>
            <el-tag v-if="aiRecommendationSummary" type="warning" size="small" style="margin-left: 10px;">
              {{ aiRecommendationSummary }}
            </el-tag>
          </el-divider>
          
          <div v-if="aiRecommendedSchools.reach && aiRecommendedSchools.reach.length > 0" class="ai-rec-category">
            <h4 class="ai-rec-category-title reach-title">冲刺院校</h4>
            <div class="ai-rec-cards">
              <div v-for="(item, idx) in aiRecommendedSchools.reach" :key="'reach-' + idx" class="ai-rec-card reach-card">
                <div class="ai-rec-card-header">
                  <span class="ai-rec-school-name">{{ item.schoolName }}</span>
                  <el-tag type="danger" size="small">匹配度 {{ item.matchScore }}%</el-tag>
                </div>
                <div class="ai-rec-card-body">
                  <p class="ai-rec-item"><strong>推荐理由：</strong>{{ item.reason }}</p>
                  <p class="ai-rec-item"><strong>录取概率：</strong>{{ item.admissionProbability }}</p>
                  <p class="ai-rec-item" v-if="item.gap"><strong>差距分析：</strong>{{ item.gap }}</p>
                  <p class="ai-rec-item" v-if="item.strategy"><strong>申请策略：</strong>{{ item.strategy }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="aiRecommendedSchools.match && aiRecommendedSchools.match.length > 0" class="ai-rec-category">
            <h4 class="ai-rec-category-title match-title">匹配院校</h4>
            <div class="ai-rec-cards">
              <div v-for="(item, idx) in aiRecommendedSchools.match" :key="'match-' + idx" class="ai-rec-card match-card">
                <div class="ai-rec-card-header">
                  <span class="ai-rec-school-name">{{ item.schoolName }}</span>
                  <el-tag type="warning" size="small">匹配度 {{ item.matchScore }}%</el-tag>
                </div>
                <div class="ai-rec-card-body">
                  <p class="ai-rec-item"><strong>推荐理由：</strong>{{ item.reason }}</p>
                  <p class="ai-rec-item"><strong>录取概率：</strong>{{ item.admissionProbability }}</p>
                  <p class="ai-rec-item" v-if="item.fit"><strong>契合度：</strong>{{ item.fit }}</p>
                  <p class="ai-rec-item" v-if="item.strategy"><strong>申请策略：</strong>{{ item.strategy }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="aiRecommendedSchools.safe && aiRecommendedSchools.safe.length > 0" class="ai-rec-category">
            <h4 class="ai-rec-category-title safe-title">保底院校</h4>
            <div class="ai-rec-cards">
              <div v-for="(item, idx) in aiRecommendedSchools.safe" :key="'safe-' + idx" class="ai-rec-card safe-card">
                <div class="ai-rec-card-header">
                  <span class="ai-rec-school-name">{{ item.schoolName }}</span>
                  <el-tag type="success" size="small">匹配度 {{ item.matchScore }}%</el-tag>
                </div>
                <div class="ai-rec-card-body">
                  <p class="ai-rec-item"><strong>推荐理由：</strong>{{ item.reason }}</p>
                  <p class="ai-rec-item"><strong>录取概率：</strong>{{ item.admissionProbability }}</p>
                  <p class="ai-rec-item" v-if="item.notes"><strong>注意事项：</strong>{{ item.notes }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ai-rec-actions">
            <el-button type="primary" size="large" @click="applyAIRecommendation">
              应用此推荐
            </el-button>
            <el-button size="large" @click="useOriginalRecommendation" v-if="schools.length > 0">
              使用原始推荐
            </el-button>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="aiError" class="ai-error">
          <el-alert
            :title="getErrorTitle(aiError.type)"
            :description="aiError.message"
            type="error"
            show-icon
            :closable="false"
          />
          <el-button type="primary" style="margin-top: 12px;" @click="startAIAnalysis">
            重新分析
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import { Cpu } from '@element-plus/icons-vue'
import { schoolsData, getAllSchoolsWithMatch, getRecommendedSchools, buildRecommendationAnalysisPrompt } from '@/utils/recommendationEngine'
import { sendMessageToAI, AIError } from '@/utils/ai-api'

const router = useRouter()

const hasAssessment = ref(false)
const assessment = ref(null)
const schools = ref([])
const recommending = ref(false)
const progress = ref(0)
const progressStatus = ref('')
const favorites = ref([])
const selectedSchools = ref([])
const detailVisible = ref(false)
const compareVisible = ref(false)
const currentSchool = ref(null)
const selectedCountry = ref('')
const selectedMajor = ref('')
const rankingRange = ref('')
const sortBy = ref('default')
const filterFavorites = ref(false)
const compareMode = ref('selected')
const strategy = ref('all')

const matchBreakdownVisible = ref(false)
const selectedSchoolBreakdown = ref(null)

const aiAnalysisVisible = ref(false)
const aiAnalysisContent = ref('')
const aiReasoningContent = ref('')
const aiAnalyzing = ref(false)
const aiError = ref(null)
const selectedProvider = ref(null)
const showReasoning = ref(false)
const isThinking = ref(false)
const reasoningComplete = ref(false)
const aiRecommendedSchools = ref(null)
const aiRecommendationSummary = ref('')
const showAIRecommendation = ref(false)
const providers = computed(() => {
  const saved = localStorage.getItem('ai_providers')
  return saved ? JSON.parse(saved) : []
})

watch(showReasoning, (val) => {
  localStorage.setItem('ai_show_reasoning', JSON.stringify(val))
})

watch([reasoningComplete, aiReasoningContent, aiAnalysisContent], () => {
  localStorage.setItem('ai_reasoning_complete', JSON.stringify(reasoningComplete.value))
  localStorage.setItem('ai_reasoning_content', aiReasoningContent.value)
  localStorage.setItem('ai_analysis_content', aiAnalysisContent.value)
}, { deep: true })

const mockSchools = computed(() => {
  if (hasAssessment.value && assessment.value) {
    return getAllSchoolsWithMatch(assessment.value)
  }
  return schoolsData.map(s => ({ ...s, match: s.match || 50, category: 'match' }))
})

const availableCountries = computed(() => {
  const countries = new Set()
  mockSchools.value.forEach(s => countries.add(s.country))
  return Array.from(countries).sort()
})

const availableMajors = computed(() => {
  const majors = new Set()
  mockSchools.value.forEach(s => majors.add(s.major))
  return Array.from(majors).sort()
})

// 计算属性：可用的排名范围选项
const rankingRanges = [
  { label: '全部', value: '' },
  { label: 'Top 10', value: 'top10' },
  { label: 'Top 20', value: 'top20' },
  { label: 'Top 50', value: 'top50' },
  { label: 'Top 100', value: 'top100' }
]

// 将排名字符串转换为数字用于比较
const getRankingNumber = (ranking) => {
  const match = ranking.match(/QS #(\d+)/)
  return match ? parseInt(match[1]) : 999
}

// 计算属性：是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return !!(selectedCountry.value || selectedMajor.value || rankingRange.value || filterFavorites.value)
})

// 清除所有筛选条件
const clearAllFilters = () => {
  selectedCountry.value = ''
  selectedMajor.value = ''
  rankingRange.value = ''
  filterFavorites.value = false
  sortBy.value = 'default'
  ElMessage.info('已清除所有筛选条件')
}

// 计算属性：过滤和排序后的学校列表
const filteredAndSortedSchools = computed(() => {
  let result = [...schools.value]

  // 收藏筛选
  if (filterFavorites.value) {
    result = result.filter(s => favorites.value.includes(s.id))
  }

  // 国家筛选
  if (selectedCountry.value) {
    result = result.filter(s => s.country === selectedCountry.value)
  }

  // 专业方向筛选
  if (selectedMajor.value) {
    result = result.filter(s => s.major === selectedMajor.value)
  }

  // 排名范围筛选
  if (rankingRange.value) {
    result = result.filter(s => {
      const rank = getRankingNumber(s.ranking)
      switch (rankingRange.value) {
        case 'top10': return rank <= 10
        case 'top20': return rank <= 20
        case 'top50': return rank <= 50
        case 'top100': return rank <= 100
        default: return true
      }
    })
  }

  // 排序
  switch (sortBy.value) {
    case 'match-desc':
      result.sort((a, b) => b.match - a.match)
      break
    case 'match-asc':
      result.sort((a, b) => a.match - b.match)
      break
    case 'deadline-asc':
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      break
    case 'deadline-desc':
      result.sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
      break
    default:
      // 默认按匹配度降序
      result.sort((a, b) => b.match - a.match)
  }

  return result
})

// 计算属性：三类学校分类
const reachSchools = computed(() => {
  return filteredAndSortedSchools.value.filter(s => s.match >= 85)
})
const matchSchools = computed(() => {
  return filteredAndSortedSchools.value.filter(s => s.match >= 70 && s.match < 85)
})
const safeSchools = computed(() => {
  return filteredAndSortedSchools.value.filter(s => s.match < 70)
})

const getScoreTagType = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

const getScoreColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

const startRecommendation = () => {
  recommending.value = true
  progress.value = 0
  progressStatus.value = ''

  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
      if (progress.value > 90) progress.value = 90
    }
  }, 300)

  setTimeout(() => {
    clearInterval(progressInterval)
    progress.value = 100
    progressStatus.value = 'success'

    let allSchools = mockSchools.value
    
    const filterByStrategy = (list) => {
      switch (strategy.value) {
        case 'reach': return list.filter(s => s.category === 'reach' || s.match >= 80)
        case 'safe': return list.filter(s => s.category === 'safe' || s.match < 55)
        case 'match': return list.filter(s => s.category === 'match' || (s.match >= 55 && s.match < 80))
        default: return list
      }
    }
    schools.value = filterByStrategy(allSchools)
    recommending.value = false
    
    // 保存推荐结果到 localStorage，同时备份原始推荐
    localStorage.setItem('recommended_schools_backup', JSON.stringify(schools.value))
    localStorage.setItem('recommended_schools', JSON.stringify(schools.value))
    
    // 重置AI推荐状态
    showAIRecommendation.value = false
    aiRecommendedSchools.value = null
    aiRecommendationSummary.value = ''
    
    ElMessage.success(`为您推荐了 ${schools.value.length} 所学校`)
  }, 2000)
}

const toggleSelect = (id) => {
  const idx = selectedSchools.value.indexOf(id)
  if (idx > -1) {
    selectedSchools.value.splice(idx, 1)
  } else {
    selectedSchools.value.push(id)
  }
}

const toggleFavorite = (id) => {
  const idx = favorites.value.indexOf(id)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
    ElMessage.success('已取消收藏')
  } else {
    favorites.value.push(id)
    ElMessage.success('已收藏')
  }
  localStorage.setItem('school_favorites', JSON.stringify(favorites.value))
}

const showDetail = (school) => {
  router.push(`/school-detail/${school.id}`)
}

const toggleCompare = () => {
  compareMode.value = 'selected'
  compareSchools.value = schools.value.filter(s => selectedSchools.value.includes(s.id))
  compareVisible.value = true
}

const toggleCompareFavorites = () => {
  compareMode.value = 'favorites'
  compareSchools.value = schools.value.filter(s => favorites.value.includes(s.id))
  compareVisible.value = true
}

const removeFavoriteAndClose = (schoolId) => {
  const idx = favorites.value.indexOf(schoolId)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
    localStorage.setItem('school_favorites', JSON.stringify(favorites.value))
    ElMessage.success('已取消收藏')

    // 从对比列表中移除该学校
    compareSchools.value = compareSchools.value.filter(s => s.id !== schoolId)

    // 如果对比列表为空，关闭对话框并返回
    if (compareSchools.value.length === 0) {
      compareVisible.value = false
    }
  }
}

const compareSchools = ref([])

const openAIAnalysis = () => {
  if (providers.value.length === 0) {
    ElMessage.warning('请先配置AI模型')
    router.push('/ai-config')
    return
  }
  selectedProvider.value = providers.value[0].id
  aiAnalysisVisible.value = true
  aiAnalysisContent.value = ''
  aiError.value = null
}

const startAIAnalysis = async () => {
  if (!selectedProvider.value) {
    ElMessage.warning('请选择AI模型')
    return
  }
  
  aiAnalyzing.value = true
  aiAnalysisContent.value = ''
  aiReasoningContent.value = ''
  aiError.value = null
  aiRecommendedSchools.value = null
  aiRecommendationSummary.value = ''
  isThinking.value = true
  
  try {
    const prompt = buildRecommendationAnalysisPrompt(assessment.value, schools.value)
    
    const messages = [
      { role: 'user', content: prompt }
    ]
    
    const stream = await sendMessageToAI(selectedProvider.value, messages, {
      temperature: 0.7,
      stream: true,
      enableThinking: true
    })
    
    for await (const chunk of stream) {
      if (!aiAnalyzing.value) break
      if (chunk.type === 'reasoning') {
        aiReasoningContent.value += chunk.content
      } else if (chunk.type === 'content') {
        if (isThinking.value) {
          isThinking.value = false
          reasoningComplete.value = true
        }
        aiAnalysisContent.value += chunk.content
      }
    }
    
    // 分析完成后尝试解析AI推荐院校JSON
    if (aiAnalysisContent.value) {
      parseAIRecommendation(aiAnalysisContent.value)
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    if (error instanceof AIError) {
      aiError.value = {
        type: error.type,
        message: error.message
      }
    } else {
      aiError.value = {
        type: 'unknown',
        message: error.message
      }
    }
  } finally {
    aiAnalyzing.value = false
    isThinking.value = false
  }
}

const renderAiContent = (content) => {
  if (!content) return ''
  try {
    return marked(content)
  } catch (e) {
    return content
  }
}

const parseAIRecommendation = (content) => {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonMatch && jsonMatch[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1].trim())
      if (parsed.summary) {
        aiRecommendationSummary.value = parsed.summary
      }
      if (parsed.reach || parsed.match || parsed.safe) {
        aiRecommendedSchools.value = parsed
        return true
      }
    } catch (e) {
      console.error('Failed to parse AI recommendation JSON:', e)
    }
  }
  return false
}

const convertAIRecommendationToSchools = () => {
  if (!aiRecommendedSchools.value) return []
  
  const schoolMap = {}
  schoolsData.forEach(s => { schoolMap[s.name] = s })
  
  const convertCategory = (category, type) => {
    if (!category || !Array.isArray(category)) return []
    return category.map(item => {
      const originalSchool = schoolMap[item.schoolName]
      if (originalSchool) {
        return {
          ...originalSchool,
          match: item.matchScore || 50,
          category: type,
          aiRecommendation: item
        }
      }
      return null
    }).filter(Boolean)
  }
  
  const reach = convertCategory(aiRecommendedSchools.value.reach, 'reach')
  const match = convertCategory(aiRecommendedSchools.value.match, 'match')
  const safe = convertCategory(aiRecommendedSchools.value.safe, 'safe')
  
  return { reach, match, safe, all: [...reach, ...match, ...safe] }
}

const applyAIRecommendation = () => {
  const converted = convertAIRecommendationToSchools()
  if (converted.all.length === 0) {
    ElMessage.warning('AI推荐数据解析失败，无法应用')
    return
  }
  schools.value = converted.all
  showAIRecommendation.value = true
  localStorage.setItem('recommended_schools', JSON.stringify(schools.value))
  localStorage.setItem('ai_recommended_schools', JSON.stringify(aiRecommendedSchools.value))
  ElMessage.success('已应用AI推荐院校')
  aiAnalysisVisible.value = false
}

const useOriginalRecommendation = () => {
  showAIRecommendation.value = false
  aiRecommendedSchools.value = null
  aiRecommendationSummary.value = ''
  const savedSchools = localStorage.getItem('recommended_schools_backup')
  if (savedSchools) {
    try {
      schools.value = JSON.parse(savedSchools)
    } catch (e) {
      console.error('Failed to restore original schools:', e)
    }
  }
  ElMessage.info('已切换回原始推荐')
  aiAnalysisVisible.value = false
}

const getErrorTitle = (errorType) => {
  const titles = {
    network: '网络连接失败',
    auth: 'API认证失败',
    config: '配置问题',
    unsupported: '不支持的提供商',
    api: '服务请求失败'
  }
  return titles[errorType] || '发生错误'
}

const closeAIAnalysis = () => {
  aiAnalysisVisible.value = false
  aiAnalyzing.value = false
  aiAnalysisContent.value = ''
  aiError.value = null
}

onMounted(() => {
  const saved = localStorage.getItem('assessment_report')
  if (saved) {
    assessment.value = JSON.parse(saved)
    if (assessment.value.basic) {
      hasAssessment.value = true
    }
  }
  const savedFavs = localStorage.getItem('school_favorites')
  if (savedFavs) {
    favorites.value = JSON.parse(savedFavs)
  }

  // 暴露组件实例到window用于测试
  window.schoolRecommendationComponent = {
    get strategy() { return strategy.value },
    set strategy(val) { strategy.value = val },
    get selectedCountry() { return selectedCountry.value },
    set selectedCountry(val) { selectedCountry.value = val },
    get selectedMajor() { return selectedMajor.value },
    set selectedMajor(val) { selectedMajor.value = val },
    get rankingRange() { return rankingRange.value },
    set rankingRange(val) { rankingRange.value = val },
    get filterFavorites() { return filterFavorites.value },
    set filterFavorites(val) { filterFavorites.value = val },
    get sortBy() { return sortBy.value },
    set sortBy(val) { sortBy.value = val },
    get schools() { return schools.value },
    get filteredAndSortedSchools() { return filteredAndSortedSchools.value },
    get favorites() { return favorites.value },
    get selectedSchools() { return selectedSchools.value },
    startRecommendation,
    get mockSchools() { return mockSchools.value },
    get compareVisible() { return compareVisible.value },
    get compareMode() { return compareMode.value },
    toggleCompare,
    toggleCompareFavorites,
    removeFavoriteAndClose,
    clearAllFilters,
    get hasActiveFilters() { return hasActiveFilters.value },
    get availableMajors() { return availableMajors.value },
    get rankingRanges() { return rankingRanges.value }
  }
})
</script>

<style scoped>
.school-recommendation-page {
  max-width: 1200px;
  margin: 0 auto;
}

.summary-card, .control-card {
  margin-bottom: 20px;
}

.summary-content {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-card, .control-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
.clear-filters-btn {  margin-left: 8px;}
  flex-wrap: wrap;
}

.result-count {
  margin-left: auto;
  color: #909399;
  font-size: 14px;
}

.control-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.school-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.school-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.school-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.school-card:hover::before {
  opacity: 1;
}

.school-card.is-selected {
  border-color: #667eea;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.25);
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.school-card.is-selected::before {
  opacity: 1;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.school-card.is-favorite {
  border-color: #f0c239;
  box-shadow: 0 8px 30px rgba(240, 194, 57, 0.2);
  background: linear-gradient(135deg, #fffdf5 0%, #ffffff 100%);
}

.school-card.is-favorite::before {
  opacity: 1;
  background: linear-gradient(90deg, #f0c239 0%, #ff9f43 100%);
}

.school-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.school-name {
  font-weight: 700;
  font-size: 17px;
  cursor: pointer;
  flex: 1;
  color: #1a1a2e;
  line-height: 1.3;
  transition: color 0.2s ease;
}

.school-name:hover {
  color: #667eea;
}

.match-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.school-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.school-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.school-info-label {
  color: #8c8c8c;
  font-weight: 500;
  min-width: 60px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.school-info-value {
  color: #333;
  font-weight: 500;
}

.school-info p {
  margin: 0;
  color: #555;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.school-info p strong {
  color: #8c8c8c;
  font-weight: 500;
  min-width: 60px;
  display: inline-block;
}

.school-actions {
  margin-top: 18px;
  display: flex;
  gap: 10px;
}

.school-actions .el-button {
  flex: 1;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.school-actions .el-button:hover {
  transform: translateY(-2px);
}

.compare-header {
  margin-bottom: 15px;
}

.school-detail .requirement-section {
  margin-top: 20px;
}

.official-link {
  margin-top: 15px;
}

/* 对比表格：操作按钮不换行 */
.compare-table :deep(.el-table__body .el-button) {
  flex-shrink: 0;
  white-space: nowrap;
}

/* 分类卡片样式 */
.category-card {
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
}

.category-card :deep(.el-card__header) {
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e8e8e8;
}

.category-card.reach :deep(.el-card__header) {
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
}

.category-card.match :deep(.el-card__header) {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
}

.category-card.safe :deep(.el-card__header) {
  background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-title::before {
  content: '';
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.category-card.reach .category-title::before {
  background: linear-gradient(180deg, #ff6b6b 0%, #ee5a6f 100%);
}

.category-card.match .category-title::before {
  background: linear-gradient(180deg, #ffa502 0%, #ff7f50 100%);
}

.category-card.safe .category-title::before {
  background: linear-gradient(180deg, #2ed573 0%, #1dd1a1 100%);
}

.category-count {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 20px;
}

/* AI 深度分析样式 */
.ai-analysis-container {
  min-height: 300px;
}

.ai-model-selector {
  padding: 20px;
}

.ai-start-section {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  margin-top: 20px;
}

.ai-description {
  font-size: 16px;
  color: #475569;
  margin-bottom: 16px;
}

.ai-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: inline-block;
  text-align: left;
}

.ai-features li {
  padding: 8px 0;
  color: #334155;
  font-size: 14px;
  position: relative;
  padding-left: 24px;
}

.ai-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.ai-loading {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
  border-radius: 12px;
}

.thinking-animation {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.thinking-dot {
  width: 12px;
  height: 12px;
  background: #f59e0b;
  border-radius: 50%;
  animation: thinking-bounce 1.4s ease-in-out infinite;
}

.thinking-dot:nth-child(1) { animation-delay: -0.32s; }
.thinking-dot:nth-child(2) { animation-delay: -0.16s; }
.thinking-dot:nth-child(3) { animation-delay: 0s; }

@keyframes thinking-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

.thinking-text {
  font-size: 18px;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 8px 0;
}

.thinking-tip {
  font-size: 14px;
  color: #b45309;
  margin: 0;
  opacity: 0.8;
}

.ai-result {
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.ai-content {
  line-height: 1.8;
  color: #334155;
}

.ai-content :deep(h1) {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
}

.ai-content :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 28px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.ai-content :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 20px 0 10px 0;
}

.ai-content :deep(h4) {
  font-size: 16px;
  font-weight: 600;
  color: #475569;
  margin: 16px 0 8px 0;
}

.ai-content :deep(p) {
  margin: 0 0 12px 0;
  line-height: 1.8;
}

.ai-content :deep(ul), .ai-content :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.ai-content :deep(li) {
  margin-bottom: 8px;
  line-height: 1.7;
}

.ai-content :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}

.ai-content :deep(code) {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  color: #667eea;
}

.ai-content :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 16px;
  margin: 16px 0;
  color: #64748b;
  font-style: italic;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: #667eea;
  margin-left: 4px;
  animation: blink 1s infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.ai-error {
  padding: 20px;
  text-align: center;
}

/* AI推荐院校样式 */
.ai-recommendation-section {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.recommendation-divider {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.ai-rec-category {
  margin-bottom: 20px;
}

.ai-rec-category-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #667eea;
}

.ai-rec-category-title.reach-title {
  border-left-color: #ff6b6b;
  color: #dc2626;
}

.ai-rec-category-title.match-title {
  border-left-color: #ffa502;
  color: #d97706;
}

.ai-rec-category-title.safe-title {
  border-left-color: #2ed573;
  color: #16a34a;
}

.ai-rec-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.ai-rec-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease;
}

.ai-rec-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.ai-rec-card.reach-card {
  border-left: 3px solid #ff6b6b;
}

.ai-rec-card.match-card {
  border-left: 3px solid #ffa502;
}

.ai-rec-card.safe-card {
  border-left: 3px solid #2ed573;
}

.ai-rec-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.ai-rec-school-name {
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
}

.ai-rec-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-rec-item {
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

.ai-rec-item strong {
  color: #64748b;
  font-weight: 500;
}

.ai-rec-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
