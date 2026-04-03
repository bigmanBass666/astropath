<template>
  <div class="school-recommendation-page">
    <!-- 未完成背景评估提示 -->
    <div
      v-if="!hasAssessment"
      class="page-root"
    >
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h2 class="empty-state-title">请先完成背景评估</h2>
        <p class="empty-state-desc">系统需要您的背景信息才能进行精准推荐</p>
        <button
          class="primary-button"
          @click="router.push('/assessment')"
        >
          去评估
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Step 1: 偏好收集（表单页布局） -->
      <div
        v-if="currentStep === 'preference'"
        class="page-root"
      >
        <div class="preference-hero">
          <h1 class="hero-title">AI 智能选校</h1>
          <p class="hero-subtitle">AI 智能解析背景，为你生成专属留学路线图</p>
        </div>
        <div class="form-comfortable">
          <PreferenceCollector
            :assessment="assessment"
            :loading="loading"
            :current-step="recommendationStep"
            :step-progress="recommendationProgress"
            :streaming-content="streamingContent"
            :is-streaming="isStreaming"
            @submit="handlePreferenceSubmit"
          />
        </div>
      </div>

      <!-- Step 2: 推荐结果（数据展示页布局 §12.3） -->
      <template v-if="currentStep === 'recommendation'">
        <!-- Data Hero -->
        <section
          ref="(el) => sectionRefs.push(el)"
          class="data-hero fade-in-up"
        >
          <div class="content-wide">
            <h1 class="hero-title">AI 智能选校结果</h1>
            <p class="hero-subtitle">基于您的背景，为您推荐以下院校</p>

            <!-- 统计卡片 -->
            <div class="stats-row">
              <div class="stat-card-mini">
                <div class="value">{{ overallMatchScore }}%</div>
                <div class="label">综合匹配度</div>
              </div>
              <div class="stat-card-mini">
                <div class="value">{{ coreCount }} 所</div>
                <div class="label">核心推荐</div>
              </div>
              <div class="stat-card-mini">
                <div class="value">{{ alternativeCount }} 所</div>
                <div class="label">备选方案</div>
              </div>
            </div>

            <!-- 竞争力雷达图区域 -->
            <div class="radar-section">
              <canvas
                ref="radarCanvas"
                class="radar-canvas"
              />
            </div>
          </div>
        </section>

        <!-- 筛选工具栏 -->
        <div class="content-wide">
          <div class="filter-bar">
            <div class="filter-tabs">
              <button
                class="filter-tab"
                :class="{ 'is-active': activeFilter === 'all' }"
                @click="activeFilter = 'all'"
              >
                全部
              </button>
              <button
                class="filter-tab"
                :class="{ 'is-active': activeFilter === 'core' }"
                @click="activeFilter = 'core'"
              >
                核心推荐
              </button>
              <button
                class="filter-tab"
                :class="{ 'is-active': activeFilter === 'alternative' }"
                @click="activeFilter = 'alternative'"
              >
                备选方案
              </button>
            </div>
            <div class="filter-actions">
              <div class="sort-control">
                <span class="sort-label">排序:</span>
                <select
                  v-model="sortBy"
                  class="sort-select"
                >
                  <option value="match-desc">
                    匹配度 ↓
                  </option>
                  <option value="match-asc">
                    匹配度 ↑
                  </option>
                  <option value="ranking">
                    排名
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 结果列表区 -->
        <div
          ref="(el) => sectionRefs.push(el)"
          class="data-full fade-in-up"
        >
          <RecommendationList
            :recommendations="filteredAndSortedRecommendations"
            :favorites="favorites"
            :summary="summary"
            @toggle-favorite="toggleFavorite"
            @view-detail="viewSchoolDetail"
            @show-analysis="showAnalysis"
            @reset="resetToPreference"
            @compare="openCompareDialog"
            @adjust="handleAdjustRequest"
          />
        </div>
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

    <!-- 对话框 -->
    <el-dialog
      v-model="compareVisible"
      title="学校对比"
      width="80%"
      class="compare-dialog"
    >
      <div class="table-container">
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
              <button
                class="ghost-btn danger"
                @click="removeFavorite(row.id)"
              >
                取消收藏
              </button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PreferenceCollector from '@/components/school-recommendation/PreferenceCollector.vue'
import RecommendationList from '@/components/school-recommendation/RecommendationList.vue'
import SchoolAnalysisDialog from '@/components/school-recommendation/SchoolAnalysisDialog.vue'
import { useAIRecommendation } from '@/composables/useAIRecommendation'
import { useAIConfig } from '@/composables/useAIConfig'
import { useActiveStream } from '@/composables/useActiveStream'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { schoolsData } from '@/utils/recommendationEngine'

const router = useRouter()
const aiConfig = useAIConfig()
const activeStream = useActiveStream({ taskId: 'school-recommendation' })
const { sectionRefs, setupAnimations } = useScrollAnimation()

setupAnimations()

const {
  loading,
  currentStep: recommendationStep,
  stepProgress: recommendationProgress,
  streamingContent,
  isStreaming,
  generateRecommendations,
  generateAnalysis,
  analysisLoading,
  analysisStreamingContent,
  isAnalysisStreaming,
  globalState,
  stopRecommendation,
  retryRecommendation,
  stopAnalysis,
  recStream
} = useAIRecommendation()

const hasAssessment = ref(false)
const assessment = ref(null)
const currentStep = ref('preference')
const recommendations = ref([])
const summary = ref('')
const favorites = ref([])
const userPreference = ref(null)

const radarCanvas = ref(null)

const activeFilter = ref('all')
const sortBy = ref('match-desc')

const restoreGlobalState = () => {
  if (globalState.hasOngoingRecommendation()) {
    currentStep.value = 'preference'
    userPreference.value = globalState.state.preference
    ElMessage.info('正在恢复之前的推荐进度...')
    return true
  }

  if (globalState.state.currentStep === 'completed' && globalState.state.recommendations.length > 0) {
    recommendations.value = globalState.state.recommendations
    summary.value = globalState.state.summary
    userPreference.value = globalState.state.preference
    currentStep.value = 'recommendation'
    return true
  }

  return false
}

const analysisVisible = ref(false)
const selectedRecommendation = ref(null)
const currentAnalysis = ref(null)
const compareVisible = ref(false)

const CATEGORY_MAP = {
  reach: 'core',
  match: 'core',
  safe: 'alternative',
  core: 'core',
  alternative: 'alternative'
}

const displayCategory = (cat) => CATEGORY_MAP[cat] || cat

const coreCount = computed(() => recommendations.value.filter(r => displayCategory(r.category) === 'core').length)
const alternativeCount = computed(() => recommendations.value.filter(r => displayCategory(r.category) === 'alternative').length)
const overallMatchScore = computed(() => {
  if (recommendations.value.length === 0) return 0
  const total = recommendations.value.reduce((sum, r) => sum + r.matchScore, 0)
  return Math.round(total / recommendations.value.length)
})

const filteredAndSortedRecommendations = computed(() => {
  let filtered = recommendations.value
  if (activeFilter.value === 'core') filtered = filtered.filter(r => displayCategory(r.category) === 'core')
  if (activeFilter.value === 'alternative') filtered = filtered.filter(r => displayCategory(r.category) === 'alternative')

  const sorted = [...filtered]
  if (sortBy.value === 'match-desc') sorted.sort((a, b) => b.matchScore - a.matchScore)
  else if (sortBy.value === 'match-asc') sorted.sort((a, b) => a.matchScore - b.matchScore)
  else if (sortBy.value === 'ranking') sorted.sort((a, b) => a.ranking - b.ranking)

  return sorted
})

const compareSchools = computed(() => {
  return schoolsData
    .filter(s => favorites.value.includes(s.id))
    .map(s => ({
      ...s,
      match: recommendations.value.find(r => r.schoolId === s.id)?.matchScore || 50
    }))
})

const getScoreColor = (score) => {
  if (score >= 80) return 'var(--color-success)'
  if (score >= 60) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

const drawRadarChart = () => {
  const canvas = radarCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.parentElement.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const cx = w / 2
  const cy = h / 2
  const radius = Math.min(w, h) / 2 - 40

  const dimensions = [
    { label: '学术能力', value: assessment.value?.academic?.gpa ? Math.min(100, (parseFloat(assessment.value.academic.gpa) / 4.0) * 100) : 75 },
    { label: '语言成绩', value: 72 },
    { label: '科研经历', value: assessment.value?.practice?.research ? 80 : 55 },
    { label: '实习实践', value: assessment.value?.practice?.internship ? 70 : 50 },
    { label: '综合素质', value: 68 },
    { label: '目标匹配', value: overallMatchScore.value }
  ]

  const n = dimensions.length
  const angleStep = (Math.PI * 2) / n

  ctx.clearRect(0, 0, w, h)

  for (let level = 5; level >= 1; level--) {
    const r = (radius * level) / 5
    ctx.beginPath()
    for (let i = 0; i <= n; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = level === 5 ? 'var(--color-border)' : 'var(--color-border-light)'
    ctx.lineWidth = 1
    ctx.stroke()
    if (level % 2 === 1) {
      ctx.fillStyle = level === 5 ? 'var(--color-surface-muted)' : 'transparent'
      ctx.fill()
    }
  }

  for (let i = 0; i < n; i++) {
    const angle = i * angleStep - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
    ctx.strokeStyle = 'var(--color-border-light)'
    ctx.lineWidth = 1
    ctx.stroke()

    const labelRadius = radius + 20
    const lx = cx + Math.cos(angle) * labelRadius
    const ly = cy + Math.sin(angle) * labelRadius
    ctx.fillStyle = 'var(--color-text-secondary)'
    ctx.font = '12px var(--font-family-base)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(dimensions[i].label, lx, ly)
  }

  ctx.beginPath()
  for (let i = 0; i <= n; i++) {
    const idx = i % n
    const angle = idx * angleStep - Math.PI / 2
    const val = dimensions[idx].value / 100
    const x = cx + Math.cos(angle) * radius * val
    const y = cy + Math.sin(angle) * radius * val
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(15, 23, 42, 0.08)'
  ctx.fill()
  ctx.strokeStyle = 'var(--color-solid)'
  ctx.lineWidth = 2
  ctx.stroke()

  for (let i = 0; i < n; i++) {
    const angle = i * angleStep - Math.PI / 2
    const val = dimensions[i].value / 100
    const x = cx + Math.cos(angle) * radius * val
    const y = cy + Math.sin(angle) * radius * val
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = 'var(--color-solid)'
    ctx.fill()
  }
}

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

const handlePreferenceSubmit = async (preference) => {
  userPreference.value = preference

  // ★ 使用 useAIConfig 获取 Provider，替代手动读 localStorage
  const defaultProvider = aiConfig.getDefaultProvider()

  if (!defaultProvider) {
    ElMessage.warning('请先配置AI模型')
    router.push('/ai-config')
    return
  }

  const result = await generateRecommendations(assessment.value, preference, defaultProvider.id)

  if (result) {
    recommendations.value = result.recommendations
    summary.value = result.summary
    currentStep.value = 'recommendation'

    localStorage.setItem('school_recommendations', JSON.stringify({
      recommendations: result.recommendations,
      summary: result.summary,
      preference: preference,
      timestamp: Date.now(),
      assessmentHash: generateAssessmentHash(assessment.value)
    }))

    await nextTick()
    drawRadarChart()

    ElMessage.success('推荐生成完成！')
  }
}

const showAnalysis = async (recommendation) => {
  selectedRecommendation.value = recommendation
  analysisVisible.value = true
  currentAnalysis.value = null

  // ★ 使用 useAIConfig 获取 Provider
  const defaultProvider = aiConfig.getDefaultProvider()
  if (!defaultProvider) return

  const ongoingSchoolId = globalState.getOngoingAnalysisSchoolId()
  if (ongoingSchoolId === recommendation.schoolId) {
    ElMessage.info('正在恢复之前的分析进度...')
    return
  }

  if (globalState.isAnalysisStateValid(recommendation.schoolId) && globalState.state.schoolAnalysis.analysis) {
    currentAnalysis.value = globalState.state.schoolAnalysis.analysis
    return
  }

  const analysis = await generateAnalysis(
    assessment.value,
    recommendation.schoolId,
    defaultProvider.id,
    (streamContent) => {
      console.log('Analysis streaming:', streamContent.substring(0, 100) + '...')
    }
  )
  currentAnalysis.value = analysis
}

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

const viewSchoolDetail = (schoolId) => {
  router.push(`/school-detail/${schoolId}?from=recommendation`)
}

const resetToPreference = () => {
  currentStep.value = 'preference'
  recommendations.value = []
  summary.value = ''
}

const openCompareDialog = () => {
  if (favorites.value.length < 2) {
    ElMessage.warning('请至少收藏2所学校后再对比')
    return
  }
  compareVisible.value = true
}

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

const checkAssessment = () => {
  const savedAssessment = localStorage.getItem('assessment_report')
  if (savedAssessment) {
    try {
      const parsed = JSON.parse(savedAssessment)
      assessment.value = parsed
      if (parsed.basic && (parsed.basic.name || parsed.basic.university)) {
        hasAssessment.value = true
      } else {
        hasAssessment.value = false
      }
    } catch (e) {
      console.error('解析评估数据失败:', e)
      hasAssessment.value = false
    }
  } else {
    hasAssessment.value = false
  }
}

watch(() => globalState.state.schoolAnalysis, (newState) => {
  if (newState.currentStep === 'completed' && newState.analysis && selectedRecommendation.value) {
    if (newState.schoolId === selectedRecommendation.value.schoolId) {
      currentAnalysis.value = newState.analysis
    }
  }
}, { deep: true })

watch(currentStep, async (val) => {
  if (val === 'recommendation') {
    await nextTick()
    drawRadarChart()
  }
})

onMounted(() => {
  checkAssessment()

  const savedFavorites = localStorage.getItem('school_favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }

  const restored = restoreGlobalState()

  if (!restored) {
    const savedRecommendations = localStorage.getItem('school_recommendations')
    if (savedRecommendations) {
      const data = JSON.parse(savedRecommendations)
      if (data.recommendations && data.recommendations.length > 0) {
        const isWithin24Hours = Date.now() - data.timestamp < 24 * 60 * 60 * 1000
        const currentHash = generateAssessmentHash(assessment.value)
        const isAssessmentUnchanged = !currentHash || data.assessmentHash === currentHash

        if (isWithin24Hours && isAssessmentUnchanged) {
          recommendations.value = data.recommendations
          summary.value = data.summary
          userPreference.value = data.preference
          currentStep.value = 'recommendation'
          nextTick(() => drawRadarChart())
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
/* ====== 页面根容器 ====== */
.school-recommendation-page {
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
}

.page-root {
  width: 100%;
  padding: 0 var(--space-10);
  box-sizing: border-box;
}

/* ====== 容器体系 ====== */
.content-wide {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.data-full {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.form-comfortable {
  max-width: 960px;
  margin: 0 auto;
}

/* ====== 偏好收集 Hero ====== */
.preference-hero {
  text-align: center;
  padding: var(--space-16) var(--space-10);
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  letter-spacing: -1px;
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-4) 0;
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-normal);
}

/* ====== Data Hero (§12.3 数据展示页模板) ====== */
.data-hero {
  background: var(--color-background-alt);
  padding: var(--space-20) var(--space-10);
  border-bottom: 1px solid var(--color-border-light);
}

.data-hero .hero-title {
  text-align: center;
  margin-bottom: var(--space-3);
}

.data-hero .hero-subtitle {
  text-align: center;
  margin-bottom: var(--space-12);
}

/* 统计卡片 (§11.4) */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stat-card-mini {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  text-align: center;
}

.stat-card-mini .value {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  letter-spacing: -1px;
  line-height: 1;
}

.stat-card-mini .label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}

/* 雷达图区域 */
.radar-section {
  display: flex;
  justify-content: center;
  padding: var(--space-6) 0;
}

.radar-canvas {
  width: 360px;
  height: 280px;
}

/* ====== 筛选工具栏 ====== */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: var(--space-8);
}

.filter-tabs {
  display: flex;
  gap: var(--space-2);
}

.filter-tab {
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-tab:hover {
  color: var(--color-text-primary);
  background: var(--color-slate-100);
}

.filter-tab.is-active {
  background: var(--color-solid);
  color: white;
  border-color: var(--color-solid);
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.sort-control {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sort-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.sort-select {
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background: var(--color-surface);
  cursor: pointer;
  outline: none;
  transition: border-color var(--transition-fast);
}

.sort-select:focus {
  border-color: var(--color-solid);
}

/* ====== 空状态 ====== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-20) var(--space-8);
  text-align: center;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: var(--space-6);
}

.empty-state-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.empty-state-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-6) 0;
  max-width: 400px;
}

/* ====== 按钮 ====== */
.primary-button {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  padding: 10px 24px;
  border-radius: var(--radius-lg);
  border: none;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.primary-button:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.ghost-btn {
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: 6px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ghost-btn.danger {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.ghost-btn.danger:hover {
  background: var(--color-danger-bg);
}

/* ====== 表格容器 ====== */
.table-container {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.compare-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-3);
}

/* ====== 滚动动画 ====== */
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ====== 响应式 ====== */
@media (max-width: 768px) {
  .page-root {
    padding: 0 var(--space-5);
  }

  .data-hero {
    padding: var(--space-12) var(--space-5);
  }

  .stats-row {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .filter-bar {
    flex-direction: column;
    gap: var(--space-4);
    align-items: flex-start;
  }

  .radar-canvas {
    width: 280px;
    height: 220px;
  }
}
</style>
