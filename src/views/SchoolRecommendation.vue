<template>
  <div class="school-recommendation-page">
    <div
      v-if="!hasAssessment"
      class="page-empty"
    >
      <div class="empty-state-modern">
        <div class="empty-visual">
          <div class="empty-icon-ring" />
          <span class="empty-icon">📋</span>
        </div>
        <h2 class="empty-title">请先完成背景评估</h2>
        <p class="empty-desc">系统需要您的背景信息才能进行精准推荐</p>
        <button
          class="btn-primary-modern"
          @click="router.push('/assessment')"
        >
          去评估
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <template v-else>
      <Transition
        name="page-fade"
        mode="out-in"
      >
        <div
          v-if="currentStep === 'preference'"
          key="preference"
          class="page-preference"
        >
          <section class="hero-constellation">
            <div class="hero-grid">
              <div class="hero-content">
                <div class="hero-badge">
                  <span class="badge-dot" />
                  AI-Powered
                </div>
                <h1 class="hero-title animate-title">
                  AI 智能选校
                </h1>
                <p class="hero-subtitle animate-subtitle">
                  AI 智能解析背景，为你生成专属留学路线图
                </p>
                <div
                  v-if="assessment"
                  class="hero-tags animate-tags"
                >
                  <span class="hero-tag">{{ assessment.basic?.gpa || 'N/A' }} GPA</span>
                  <span class="hero-tag hero-tag--accent">{{ getUniversityLabel(assessment.basic?.university) }}</span>
                  <span class="hero-tag">{{ assessment.academic?.degree || '本科' }}</span>
                </div>
              </div>
              <div class="hero-visual animate-canvas">
                <ConstellationCanvas
                  :size="380"
                  :active="isStreaming"
                  :dimensions="constellationDimensions"
                />
              </div>
            </div>
            <div class="hero-grid-line" />
          </section>

          <section class="preference-section">
            <div class="preference-container">
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
          </section>
        </div>

        <div
          v-else-if="currentStep === 'recommendation'"
          key="recommendation"
          class="page-results"
        >
          <section class="results-hero">
            <div class="results-container">
              <div class="results-header">
                <div class="results-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  推荐完成
                </div>
                <h1 class="results-title">AI 智能选校结果</h1>
                <p class="results-subtitle">基于您的背景，为您推荐以下院校</p>
              </div>

              <div class="stats-modern">
                <div class="stat-block">
                  <div class="stat-value">
                    <CountUp
                      :end-val="overallMatchScore"
                      suffix="%"
                    />
                  </div>
                  <div class="stat-label">综合匹配度</div>
                  <div class="stat-bar">
                    <div
                      class="stat-bar-fill"
                      :style="{ width: overallMatchScore + '%' }"
                    />
                  </div>
                </div>
                <div class="stat-divider" />
                <div class="stat-block">
                  <div class="stat-value">
                    <CountUp :end-val="coreCount" />
                    <span class="stat-unit">所</span>
                  </div>
                  <div class="stat-label">核心推荐</div>
                </div>
                <div class="stat-divider" />
                <div class="stat-block">
                  <div class="stat-value">
                    <CountUp :end-val="alternativeCount" />
                    <span class="stat-unit">所</span>
                  </div>
                  <div class="stat-label">备选方案</div>
                </div>
              </div>
            </div>
          </section>

          <section class="filter-section">
            <div class="filter-container">
              <div class="filter-tabs-modern">
                <button
                  class="f-tab"
                  :class="{ 'f-tab--active': activeFilter === 'all' }"
                  @click="activeFilter = 'all'"
                >
                  全部
                </button>
                <button
                  class="f-tab"
                  :class="{ 'f-tab--active': activeFilter === 'core' }"
                  @click="activeFilter = 'core'"
                >
                  核心推荐
                </button>
                <button
                  class="f-tab"
                  :class="{ 'f-tab--active': activeFilter === 'alternative' }"
                  @click="activeFilter = 'alternative'"
                >
                  备选方案
                </button>
              </div>
              <div class="sort-modern">
                <span class="sort-label">排序</span>
                <select
                  v-model="sortBy"
                  class="sort-select-modern"
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
          </section>

          <section
            ref="(el) => sectionRefs.push(el)"
            class="results-body"
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
          </section>
        </div>
      </Transition>
    </template>

    <SchoolAnalysisDialog
      v-model="analysisVisible"
      :recommendation="selectedRecommendation"
      :analysis="currentAnalysis"
      :loading="analysisLoading"
      :streaming-content="analysisStreamingContent"
      :is-streaming="isAnalysisStreaming"
      @view-detail="viewSchoolDetail"
    />

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
import ConstellationCanvas from '@/components/school-recommendation/ConstellationCanvas.vue'
import CountUp from '@/components/school-recommendation/CountUp.vue'
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

const activeFilter = ref('all')
const sortBy = ref('match-desc')

const constellationDimensions = computed(() => [
  { label: '学术能力', value: assessment.value?.academic?.gpa ? Math.min(100, (parseFloat(assessment.value.academic.gpa) / 4.0) * 100) : 75 },
  { label: '语言成绩', value: 72 },
  { label: '科研经历', value: assessment.value?.practice?.research ? 80 : 55 },
  { label: '实习实践', value: assessment.value?.practice?.internship ? 70 : 50 },
  { label: '综合素质', value: 68 },
  { label: '目标匹配', value: 78 }
])

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

const getUniversityLabel = (university) => {
  const map = {
    '985': '985院校',
    '211': '211院校',
    'overseas': '海外院校',
    'regular': '普通本科'
  }
  return map[university] || university || '未知院校'
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

  const defaultProvider = aiConfig.getDefaultProvider()

  if (!defaultProvider) {
    ElMessage.warning('请先配置AI模型')
    router.push('/ai-config')
    return
  }

  try {
    const result = await generateRecommendations(assessment.value, preference, defaultProvider.id)

    if (result) {
      recommendations.value = result.recommendations
      summary.value = result.summary
      currentStep.value = 'recommendation'

      localStorage.setItem('school_recommendations', JSON.stringify({
        recommendations: result.recommendations,
        summary: result.summary,
        savedAt: new Date().toISOString()
      }))
    }
  } catch (error) {
    console.error('生成推荐失败:', error)
    ElMessage.error('请求过于频繁，请稍后重试')
  }
}

const adjustRecommendation = async (newPreference) => {
  const adjustedPreference = { ...userPreference.value, ...newPreference }

  try {
    await generateRecommendations(assessment.value, adjustedPreference, aiConfig.getDefaultProvider().id)

    ElMessage.success('推荐已更新！')
  } catch (error) {
    console.error('调整推荐失败:', error)
    ElMessage.error('调整推荐失败，请重试')
  }
}

const showAnalysis = async (recommendation) => {
  selectedRecommendation.value = recommendation
  analysisVisible.value = true
  currentAnalysis.value = null

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
/* ====== Page Root ====== */
.school-recommendation-page {
  width: 100%;
  min-height: 100vh;
  background: #FFFFFF;
  position: relative;
  overflow-x: hidden;
}

/* ====== Empty State ====== */
.page-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-10);
}

.empty-state-modern {
  text-align: center;
  max-width: 420px;
}

.empty-visual {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-8);
}

.empty-icon-ring {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid var(--color-border-light);
  animation: ring-pulse 3s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.08); opacity: 1; }
}

.empty-icon {
  font-size: 48px;
  position: relative;
  z-index: 1;
}

.empty-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
  letter-spacing: -0.5px;
}

.empty-desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-8) 0;
  line-height: var(--leading-relaxed);
}

.btn-primary-modern {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 14px 32px;
  background: var(--color-solid);
  color: white;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
}

.btn-primary-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.2);
}

.btn-primary-modern:active {
  transform: scale(0.97);
}

/* ====== Hero Constellation ====== */
.hero-constellation {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  background:
    radial-gradient(ellipse 80% 60% at 70% 40%, rgba(15,23,42,0.02) 0%, transparent 70%),
    radial-gradient(circle at 20% 80%, rgba(217,119,6,0.03) 0%, transparent 50%);
  overflow: hidden;
}

.hero-constellation::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(15,23,42,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent);
}

.hero-grid {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-8);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.hero-content {
  padding-right: var(--space-4);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 14px;
  background: rgba(15, 23, 42, 0.05);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: var(--space-6);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: dot-blink 2s ease-in-out infinite;
}

@keyframes dot-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.hero-title {
  font-size: clamp(40px, 5.5vw, 68px);
  font-weight: 800;
  color: var(--color-solid);
  letter-spacing: -2.5px;
  line-height: 1.08;
  margin: 0 0 var(--space-5) 0;
}

.hero-subtitle {
  font-size: clamp(16px, 1.6vw, 20px);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-8) 0;
  max-width: 420px;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.hero-tag {
  padding: 5px 14px;
  background: var(--color-slate-50);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-slate-600);
  letter-spacing: 0.2px;
}

.hero-tag--accent {
  background: var(--color-accent-subtle);
  border-color: rgba(217, 119, 6, 0.2);
  color: var(--color-accent);
}

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-grid-line {
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-light) 20%, var(--color-border-light) 80%, transparent);
}

.hero-grid-line::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 8px;
  background: radial-gradient(ellipse, rgba(15,23,42,0.08), transparent);
  border-radius: 50%;
}

/* ====== Hero Animations ====== */
.animate-title {
  animation: heroFadeUp 0.8s ease-out both;
  animation-delay: 0.1s;
}

.animate-subtitle {
  animation: heroFadeUp 0.8s ease-out both;
  animation-delay: 0.25s;
}

.animate-tags {
  animation: heroFadeUp 0.8s ease-out both;
  animation-delay: 0.4s;
}

.animate-canvas {
  animation: heroFadeIn 1s ease-out both;
  animation-delay: 0.5s;
}

@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes heroFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* ====== Preference Section (seamless hero continuation) ====== */
.preference-section {
  position: relative;
  padding: var(--space-16) var(--space-8) var(--space-24);
  background:
    radial-gradient(ellipse 60% 40% at 50% -10%, rgba(15,23,42,0.025) 0%, transparent 70%),
    linear-gradient(180deg, rgba(248,250,252,1) 0%, #FFFFFF 40%);
}

.preference-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background:
    linear-gradient(180deg, transparent 0%, rgba(248,250,252,0.5) 100%);
  pointer-events: none;
}

.preference-container {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* ====== Results Hero ====== */
.results-hero {
  background: var(--color-background-alt);
  border-bottom: 1px solid var(--color-border-light);
  position: relative;
  overflow: hidden;
}

.results-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217,119,6,0.04) 0%, transparent 70%);
  pointer-events: none;
}

.results-container {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-8);
}

.results-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.results-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 16px;
  background: rgba(5, 150, 105, 0.08);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-success);
  letter-spacing: 0.3px;
  margin-bottom: var(--space-6);
}

.results-title {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  color: var(--color-solid);
  letter-spacing: -1.5px;
  line-height: 1.15;
  margin: 0 0 var(--space-4) 0;
}

.results-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* ====== Modern Stats ====== */
.stats-modern {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: white;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border-light);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.stat-block {
  flex: 1;
  text-align: center;
  padding: 0 var(--space-6);
  position: relative;
}

.stat-value {
  font-size: var(--text-5xl);
  font-weight: 800;
  color: var(--color-solid);
  font-family: var(--font-family-mono);
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: var(--space-2);
}

.stat-unit {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-base);
  letter-spacing: 0;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.stat-bar {
  width: 60px;
  height: 3px;
  background: var(--color-slate-100);
  border-radius: var(--radius-full);
  margin: var(--space-3) auto 0;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-solid), var(--color-accent));
  border-radius: var(--radius-full);
  transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-divider {
  width: 1px;
  background: var(--color-border-light);
  align-self: stretch;
}

/* ====== Filter Section ====== */
.filter-section {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-light);
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-tabs-modern {
  display: flex;
  gap: var(--space-1);
  background: var(--color-slate-50);
  padding: 4px;
  border-radius: var(--radius-lg);
}

.f-tab {
  padding: 8px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.f-tab:hover {
  color: var(--color-text-primary);
}

.f-tab--active {
  background: white;
  color: var(--color-solid);
  box-shadow: var(--shadow-sm);
}

.sort-modern {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sort-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
}

.sort-select-modern {
  padding: 7px 28px 7px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  transition: border-color 0.2s;
}

.sort-select-modern:focus {
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
}

/* ====== Results Body ====== */
.results-body {
  max-width: 1300px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-8) var(--space-20);
}

/* ====== Dialog ====== */
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

/* ====== Page Transition ====== */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

/* ====== Scroll Reveal Animation (used by children) ====== */
:deep(.reveal-up) {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

:deep(.reveal-up.is-visible) {
  opacity: 1;
  transform: translateY(0);
}

/* ====== Responsive ====== */
@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: var(--space-10);
    text-align: center;
  }

  .hero-content {
    padding-right: 0;
  }

  .hero-subtitle {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-tags {
    justify-content: center;
  }

  .stats-modern {
    flex-direction: column;
    gap: var(--space-4);
  }

  .stat-divider {
    width: 60%;
    height: 1px;
  }
}

@media (max-width: 768px) {
  .hero-constellation {
    min-height: auto;
    padding: var(--space-12) var(--space-5);
  }

  .hero-grid {
    padding: var(--space-10) var(--space-5);
  }

  .hero-visual {
    order: -1;
  }

  .results-container {
    padding: var(--space-10) var(--space-5);
  }

  .filter-container {
    flex-direction: column;
    gap: var(--space-3);
    align-items: stretch;
  }

  .filter-tabs-modern {
    justify-content: center;
  }

  .sort-modern {
    justify-content: center;
  }

  .results-body {
    padding: var(--space-6) var(--space-5) var(--space-12);
  }
}
</style>
