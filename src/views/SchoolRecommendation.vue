<template>
  <div class="school-recommendation-page">
    <div class="noise-overlay" />
    <div
      v-if="!hasAssessment"
      class="page-empty"
    >
      <div class="empty-state-awwwards">
        <div class="empty-marquee">
          <span class="marquee-text">ASSESSMENT REQUIRED</span>
          <span class="marquee-sep">✦</span>
          <span class="marquee-text">ASSESSMENT REQUIRED</span>
          <span class="marquee-sep">✦</span>
          <span class="marquee-text">ASSESSMENT REQUIRED</span>
        </div>
        <div class="empty-content">
          <p class="empty-numeral">
            01
          </p>
          <h2 class="empty-title">
            请先完成背景评估
          </h2>
          <p class="empty-desc">
            系统需要您的背景信息才能进行精准推荐
          </p>
          <button
            class="btn-cta"
            @click="router.push('/assessment')"
          >
            <span class="btn-text">去评估</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="btn-arrow"
            ><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>

    <template v-else>
      <Transition
        name="page-transition"
        mode="out-in"
      >
        <div
          v-if="currentStep === 'preference'"
          key="preference"
          class="page-preference"
        >
          <section class="hero-section">
            <div class="hero-bg-grid" />
            <div class="hero-glow hero-glow--1" />
            <div class="hero-glow hero-glow--2" />
            
            <div class="hero-container">
              <div class="hero-left">
                <div class="hero-label-wrap">
                  <span class="label-dot" />
                  <span class="label-text">AI-Powered Engine</span>
                </div>

                <h1 class="hero-title">
                  <span class="title-line title-line--1"><span class="title-word">AI</span></span>
                  <span class="title-line title-line--2"><span class="title-word">智能选校</span></span>
                </h1>

                <p class="hero-desc">
                  AI 智能解析背景，为你生成专属留学路线图
                </p>

                <div
                  v-if="assessment"
                  class="hero-data-row"
                >
                  <div class="data-chip data-chip--primary">
                    <span class="chip-value">{{ assessment.basic?.gpa || 'N/A' }}</span>
                    <span class="chip-key">GPA</span>
                  </div>
                  <div class="data-divider" />
                  <div class="data-chip data-chip--accent">
                    <span class="chip-value">{{ getUniversityLabel(assessment.basic?.university) }}</span>
                  </div>
                  <div class="data-divider" />
                  <div class="data-chip">
                    <span class="chip-value">{{ assessment.academic?.degree || '本科' }}</span>
                  </div>
                </div>
              </div>

              <div class="hero-right">
                <div class="canvas-frame">
                  <ConstellationCanvas
                    :size="420"
                    :active="isStreaming"
                    :dimensions="constellationDimensions"
                  />
                  <div class="canvas-border" />
                </div>
              </div>
            </div>

            <div class="hero-bottom-line">
              <div class="line-fill" />
            </div>
          </section>

          <section class="preference-section">
            <div class="pref-section-inner">
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
          <section
            ref="resultsHeroRef"
            class="results-hero"
          >
            <div class="res-bg-numeral">
              RESULTS
            </div>
            <div class="res-glow res-glow--1" />
            <div class="res-glow res-glow--2" />
            <div class="res-grid-pattern" />

            <div class="res-hero-inner">
              <div class="res-left">
                <div class="res-badge">
                  <span class="res-badge__dot" />
                  <span class="res-badge__text">RECOMMENDATION COMPLETE</span>
                </div>

                <h2 class="res-title">
                  <span class="res-title__main">AI 智能选校</span>
                  <span class="res-title__sub">结果报告</span>
                </h2>

                <p class="res-desc">
                  基于您的背景与偏好，AI 已从 {{ SCHOOL_COUNT_DISPLAY }} 所院校中筛选出最优匹配
                </p>
              </div>

              <div class="res-stats-panel">
                <div class="rsp-main">
                  <div class="rsp-gauge">
                    <svg
                      class="rsp-ring"
                      viewBox="0 0 120 120"
                    >
                      <circle
                        class="rsp-ring__bg"
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke-width="8"
                      />
                      <circle
                        class="rsp-ring__fill"
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke-width="8"
                        :stroke-dasharray="327"
                        :stroke-dashoffset="327 - (327 * overallMatchScore / 100)"
                        stroke-linecap="round"
                      />
                    </svg>
                    <div class="rsp-gauge__center">
                      <CountUp
                        :end-val="overallMatchScore"
                        suffix="%"
                      />
                    </div>
                  </div>
                  <span class="rsp-label">综合匹配度</span>
                </div>

                <div class="rsp-divider" />

                <div class="rsp-side">
                  <div class="rsp-stat">
                    <span class="rsp-stat__val"><CountUp :end-val="coreCount" /></span>
                    <span class="rsp-stat__suffix">所</span>
                    <span class="rsp-stat__key">核心推荐</span>
                  </div>
                  <div class="rsp-stat">
                    <span class="rsp-stat__val"><CountUp :end-val="alternativeCount" /></span>
                    <span class="rsp-stat__suffix">所</span>
                    <span class="rsp-stat__key">备选方案</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="res-bottom-line">
              <div class="res-bl-fill" />
            </div>
          </section>

          <!-- ====== TRANSITION ZONE ====== -->
          <section class="transition-zone">
            <div class="tz-inner">
              <div class="tz-stat">
                <span class="tz-num">{{ coreCount }}</span>
                <span class="tz-label">所核心推荐</span>
              </div>
              <div class="tz-divider" />
              <div class="tz-context">
                <span class="tz-highlight">{{ assessment?.academic?.major || 'CS' }}</span>
                <span class="tz-text">背景 · GPA {{ assessment?.academic?.gpa || '3.8' }}</span>
              </div>
              <div class="tz-divider" />
              <div class="tz-summary">
                <span class="tz-text">基于</span>
                <span class="tz-highlight">{{ SCHOOL_COUNT_DISPLAY }}</span>
                <span class="tz-text">所院校库匹配</span>
              </div>
            </div>
          </section>

          <section class="filter-fusion">
            <div class="ff-inner">
              <div class="ff-chips">
                <button
                  class="ff-pill"
                  :class="{ 'ff-pill--on': activeFilter === 'all' }"
                  @click="activeFilter = 'all'"
                >
                  全部
                </button>
                <button
                  class="ff-pill"
                  :class="{ 'ff-pill--on': activeFilter === 'core' }"
                  @click="activeFilter = 'core'"
                >
                  核心推荐
                </button>
                <button
                  class="ff-pill"
                  :class="{ 'ff-pill--on': activeFilter === 'alternative' }"
                  @click="activeFilter = 'alternative'"
                >
                  备选方案
                </button>
              </div>

              <div
                class="ff-sort"
                @click="sortOpen = !sortOpen"
              >
                <span class="ff-sort__lbl">排序</span>
                <span class="ff-sort__cur">{{ sortLabel }}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="ff-sort__arrow"
                  :class="{ 'ff-sort__arrow--open': sortOpen }"
                ><polyline points="6 9 12 15 18 9" /></svg>

                <Transition name="ff-drop">
                  <div
                    v-if="sortOpen"
                    class="ff-dropdown"
                  >
                    <button
                      class="ff-opt"
                      :class="{ 'ff-opt--on': sortBy === 'match-desc' }"
                      @click.stop="sortBy = 'match-desc'; sortOpen = false"
                    >
                      匹配度 ↓
                    </button>
                    <button
                      class="ff-opt"
                      :class="{ 'ff-opt--on': sortBy === 'match-asc' }"
                      @click.stop="sortBy = 'match-asc'; sortOpen = false"
                    >
                      匹配度 ↑
                    </button>
                    <button
                      class="ff-opt"
                      :class="{ 'ff-opt--on': sortBy === 'ranking' }"
                      @click.stop="sortBy = 'ranking'; sortOpen = false"
                    >
                      排名
                    </button>
                  </div>
                </Transition>
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
import { useAssessmentState } from '@/composables/useAssessmentState'
import { schoolsData } from '@/utils/recommendationEngine'
import { SCHOOL_COUNT_DISPLAY } from '@/data/schoolsData'

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

const assessmentState = useAssessmentState()
const hasAssessment = assessmentState.hasData
const assessment = assessmentState.form
const currentStep = ref('preference')
const recommendations = ref([])
const summary = ref('')
const favorites = ref([])
const userPreference = ref(null)

const activeFilter = ref('all')
const sortBy = ref('match-desc')
const sortOpen = ref(false)

const sortLabel = computed(() => {
  const map = { 'match-desc': '匹配度 ↓', 'match-asc': '匹配度 ↑', 'ranking': '排名' }
  return map[sortBy.value] || '匹配度 ↓'
})

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
const resultsHeroRef = ref<HTMLElement | null>(null)

watch(() => currentStep.value, (newVal, oldVal) => {
  if (oldVal === 'analyzing' || oldVal === 'matching' || oldVal === 'generating') {
    if (newVal === 'recommendation' || newVal === 'completed' || newVal === 'idle') {
      nextTick(() => {
        resultsHeroRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }
})

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
  if (!recommendations.value || recommendations.value.length === 0) return 0
  const scores = recommendations.value.map(r => Number(r.matchScore) || 0).filter(s => !isNaN(s))
  if (scores.length === 0) return 0
  const total = scores.reduce((sum, s) => sum + s, 0)
  return Math.round(total / scores.length)
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
        preference: preference,
        assessmentHash: generateAssessmentHash(assessment.value),
        timestamp: Date.now(),
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
        /* analysis streaming progress */
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

watch(() => globalState.state.schoolAnalysis, (newState) => {
  if (newState.currentStep === 'completed' && newState.analysis && selectedRecommendation.value) {
    if (newState.schoolId === selectedRecommendation.value.schoolId) {
      currentAnalysis.value = newState.analysis
    }
  }
}, { deep: true })

onMounted(() => {
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
/* ====== Design Tokens ====== */
.school-recommendation-page {
  width: 100%;
  min-height: 100vh;
  background: #FAFAF9;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ====== Noise Texture ====== */
.noise-overlay {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.028;
  pointer-events: none;
  z-index: 99999;
}

/* ====== Empty State — Awwwards Style ====== */
.page-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-10);
}

.empty-state-awwwards {
  text-align: center;
  max-width: 520px;
}

.empty-marquee {
  overflow: hidden;
  margin-bottom: 80px;
  opacity: 0.08;
  font-size: 13px;
  letter-spacing: 6px;
  font-weight: 700;
  color: #0F172A;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.marquee-sep {
  color: #D97706;
  font-size: 8px;
}

.empty-content {
  position: relative;
}

.empty-numeral {
  font-size: 120px;
  font-weight: 900;
  line-height: 0.85;
  color: #F1F5F9;
  letter-spacing: -8px;
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-family-mono);
  -webkit-text-stroke: 1px rgba(15,23,42,0.06);
}

.empty-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -1.5px;
  line-height: 1.15;
  margin: 0 0 var(--space-4) 0;
  position: relative;
}

.empty-desc {
  font-size: 15px;
  color: #64748B;
  margin: 0 0 var(--space-10) 0;
  line-height: 1.7;
  max-width: 340px;
  margin-left: auto;
  margin-right: auto;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: 16px 40px;
  background: #0F172A;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
}

.btn-cta::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #D97706;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(15,23,42,0.25);
}

.btn-cta:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

.btn-arrow {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-cta:hover .btn-arrow {
  transform: translateX(4px);
}

/* ====== HERO SECTION — Awwwards Level ====== */
.hero-section {
  position: relative;
  height: calc(100dvh - 64px);
  min-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #FFFFFF;
}

.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 65% at 50% 45%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 70% 65% at 50% 45%, black, transparent);
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.hero-glow--1 {
  width: 500px;
  height: 500px;
  top: -10%;
  right: 10%;
  background: rgba(217,119,6,0.06);
}

.hero-glow--2 {
  width: 400px;
  height: 400px;
  bottom: 5%;
  left: -5%;
  background: rgba(15,23,42,0.03);
}

.hero-container {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-8) var(--space-10);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: var(--space-16);
  align-items: center;
  flex: 1;
  box-sizing: border-box;
}

/* ====== Hero Left ====== */
.hero-left {
  padding-right: var(--space-6);
}

.hero-label-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--space-8);
  padding: 8px 18px;
  border-radius: 100px;
  background: #F8FAFC;
  border: 1px solid #F1F5F9;
}

.label-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #D97706;
  animation: pulse-dot 2.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(217,119,6,0.3); }
  50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(217,119,6,0); }
}

.label-text {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #64748B;
}

/* ====== Hero Title — Extreme Typography ====== */
.hero-title {
  margin: 0 0 var(--space-7) 0;
  line-height: 0.92;
}

.title-line {
  display: block;
  overflow: hidden;
}

.title-word {
  display: inline-block;
  animation: titleReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.title-line--1 .title-word {
  font-size: clamp(56px, 9vw, 110px);
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -4px;
  animation-delay: 0.15s;
}

.title-line--2 .title-word {
  font-size: clamp(48px, 7.5vw, 92px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -3px;
  animation-delay: 0.35s;
}

@keyframes titleReveal {
  from { 
    opacity: 0; 
    transform: translateY(100%); 
    filter: blur(12px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
    filter: blur(0); 
  }
}

.hero-desc {
  font-size: 17px;
  color: #64748B;
  line-height: 1.7;
  margin: 0 0 var(--space-10) 0;
  max-width: 400px;
  animation: fadeUp 0.8s ease both;
  animation-delay: 0.55s;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ====== Data Row ====== */
.hero-data-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  animation: fadeUp 0.8s ease both;
  animation-delay: 0.7s;
}

.data-chip {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 16px;
  background: #F8FAFC;
  border: 1px solid #F1F5F9;
  border-radius: 100px;
}

.data-chip--primary {
  background: #0F172A;
  border-color: #0F172A;
}

.data-chip--primary .chip-value {
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  font-family: var(--font-family-mono);
}

.data-chip--primary .chip-key {
  color: rgba(255,255,255,0.6);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.data-chip--accent {
  background: #FEF3C7;
  border-color: rgba(217,119,6,0.2);
}

.data-chip--accent .chip-value {
  color: #B45309;
  font-weight: 700;
  font-size: 13px;
}

.chip-value {
  color: #334155;
  font-weight: 700;
  font-size: 14px;
}

.chip-key {
  color: #94A3B8;
  font-size: 11px;
  font-weight: 600;
}

.data-divider {
  width: 1px;
  height: 20px;
  background: #E2E8F0;
}

/* ====== Hero Right — Canvas ====== */
.hero-right {
  display: flex;
  justify-content: center;
  animation: canvasFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.4s;
}

@keyframes canvasFadeIn {
  from { opacity: 0; transform: scale(0.92) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.canvas-frame {
  position: relative;
  padding: 24px;
  background: linear-gradient(145deg, #FAFAF9, #F8FAFC);
  border-radius: 32px;
  border: 1px solid #F1F5F9;
  box-shadow:
    0 4px 6px -1px rgba(0,0,0,0.02),
    0 20px 60px -15px rgba(15,23,42,0.06);
}

.canvas-border {
  position: absolute;
  inset: 0;
  border-radius: 32px;
  border: 1px solid rgba(217,119,6,0.08);
  pointer-events: none;
}

/* ====== Hero Bottom Line ====== */
.hero-bottom-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: #F1F5F9;
}

.line-fill {
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, transparent, #D97706, transparent);
  opacity: 0.4;
}

/* ====== Preference Section ====== */
.preference-section {
  position: relative;
  padding: var(--space-8) var(--space-6) var(--space-28);
  background:
    radial-gradient(ellipse 80% 50% at 50% -5%, rgba(15,23,42,0.015), transparent),
    linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%);
}

.pref-section-inner {
  position: relative;
  z-index: 1;
}

/* ====== RESULTS HERO — Cinematic Report Cover ====== */
.results-hero {
  position: relative;
  overflow: hidden;
  background: #FFFFFF;
  padding: 80px 60px 64px;
}

.res-bg-numeral {
  position: absolute;
  top: 24px;
  right: 48px;
  font-size: clamp(100px, 14vw, 200px);
  font-weight: 900;
  font-family: var(--font-family-mono);
  color: #F1F5F9;
  line-height: 0.85;
  letter-spacing: -8px;
  -webkit-text-stroke: 1px rgba(15,23,42,0.035);
  pointer-events: none;
  z-index: 0;
  user-select: none;
}

.res-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.res-glow--1 {
  width: 500px;
  height: 500px;
  top: -12%;
  right: -4%;
  background: rgba(217,119,6,0.06);
}

.res-glow--2 {
  width: 350px;
  height: 350px;
  bottom: -5%;
  left: 8%;
  background: rgba(15,23,42,0.03);
}

.res-grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15,23,42,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15,23,42,0.02) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 55% at 50% 45%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 45%, black, transparent);
  pointer-events: none;
  z-index: 0;
}

.res-hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  align-items: center;
}

/* ====== Left Column ====== */
.res-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.res-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-radius: 100px;
  background: #F8FAFC;
  border: 1px solid #F1F5F9;
  width: fit-content;
}

.res-badge__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #059669;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(5,150,105,0.3); }
  50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(5,150,105,0); }
}

.res-badge__text {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #64748B;
}

.res-title {
  margin: 0;
  line-height: 1.02;
}

.res-title__main {
  display: block;
  font-size: clamp(40px, 5.5vw, 68px);
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -2.5px;
}

.res-title__sub {
  display: block;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 700;
  color: #D97706;
  letter-spacing: -1.5px;
}

.res-desc {
  margin: 0;
  font-size: 16px;
  color: #64748B;
  line-height: 1.7;
  max-width: 380px;
}

/* ====== Stats Panel ====== */
.res-stats-panel {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 36px 40px;
  background: linear-gradient(145deg, #FAFAF9, #F8FAFC);
  border: 1px solid #F1F5F9;
  border-radius: 28px;
  box-shadow:
    0 4px 6px -1px rgba(0,0,0,0.02),
    0 16px 40px -12px rgba(15,23,42,0.04);
}

.rsp-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.rsp-gauge {
  position: relative;
  width: 110px;
  height: 110px;
}

.rsp-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.rsp-ring__bg {
  stroke: #E2E8F0;
}

.rsp-ring__fill {
  stroke: url(#resGradient);
  stroke: #D97706;
  transition: stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.rsp-gauge__center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 900;
  color: #0F172A;
  font-family: var(--font-family-mono);
  letter-spacing: -1.5px;
}

.rsp-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #94A3B8;
}

.rsp-divider {
  width: 1px;
  height: 72px;
  background: linear-gradient(180deg, #E2E8F0, transparent, #E2E8F0);
  flex-shrink: 0;
}

.rsp-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: center;
}

.rsp-stat {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.rsp-stat__val {
  font-size: 30px;
  font-weight: 900;
  color: #0F172A;
  font-family: var(--font-family-mono);
  letter-spacing: -2px;
  line-height: 1;
}

.rsp-stat__suffix {
  font-size: 13px;
  font-weight: 600;
  color: #94A3B8;
}

.rsp-stat__key {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
  letter-spacing: 0.5px;
  margin-left: auto;
}

/* ====== Bottom Line ====== */
.res-bottom-line {
  position: relative;
  height: 1px;
  background: #F1F5F9;
}

.res-bl-fill {
  width: 35%;
  height: 100%;
  background: linear-gradient(90deg, transparent, #D97706, transparent);
  opacity: 0.35;
}

/* ====== FILTER FUSION — Integrated Pills ====== */
.filter-fusion {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248,250,252,0.82);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(15,23,42,0.04);
}

.ff-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.ff-chips {
  display: flex;
  gap: 6px;
  background: #F1F5F9;
  padding: 5px;
  border-radius: 14px;
}

.ff-pill {
  padding: 9px 22px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  background: transparent;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}

.ff-pill:hover {
  color: #334155;
}

.ff-pill--on {
  background: #FFFFFF;
  color: #0F172A;
  box-shadow: 0 2px 8px rgba(15,23,42,0.08);
  font-weight: 700;
}

/* ====== Custom Sort Dropdown ====== */
.ff-sort {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px 9px 12px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.ff-sort:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px rgba(15,23,42,0.05);
}

.ff-sort__lbl {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 600;
}

.ff-sort__cur {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.ff-sort__arrow {
  color: #94A3B8;
  transition: transform 0.25s ease;
}

.ff-sort__arrow--open {
  transform: rotate(180deg);
}

.ff-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  padding: 6px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  box-shadow: 0 12px 36px rgba(15,23,42,0.1);
  z-index: 200;
}

.ff-opt {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.ff-opt:hover {
  background: #F8FAFC;
  color: #0F172A;
}

.ff-opt--on {
  color: #D97706;
  background: #FEF3C7;
}

/* Dropdown Transition */
.ff-drop-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ff-drop-leave-active {
  transition: all 0.15s ease;
}
.ff-drop-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.ff-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* ====== Transition Zone ====== */
.transition-zone {
  background: #F8FAFC;
  border-bottom: 1px solid #F1F5F9;
  padding: 32px 60px;
}

.tz-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.tz-stat {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.tz-num {
  font-size: 56px;
  font-weight: 900;
  font-family: var(--font-family-mono);
  color: #0F172A;
  letter-spacing: -3px;
  line-height: 1;
}

.tz-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
}

.tz-divider {
  width: 1px;
  height: 32px;
  background: #E2E8F0;
}

.tz-context,
.tz-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tz-highlight {
  font-size: 15px;
  font-weight: 700;
  color: #D97706;
  padding: 4px 12px;
  background: rgba(217,119,6,0.08);
  border-radius: 100px;
}

.tz-text {
  font-size: 14px;
  color: #94A3B8;
}

/* ====== Results Body ====== */
.results-body {
  max-width: 1300px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-8) var(--space-24);
  background: #F8FAFC;
}

/* ====== Dialog ====== */
.table-container {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
}

.compare-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: var(--space-3);
}

.ghost-btn {
  background: transparent;
  color: #64748B;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.25s ease;
}

.ghost-btn.danger {
  color: #DC2626;
  border-color: #DC2626;
}

.ghost-btn.danger:hover {
  background: #FEF2F2;
}

/* ====== Page Transition ====== */
.page-transition-enter-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-transition-leave-active {
  transition: all 0.4s cubic-bezier(0.87, 0, 0.13, 1);
}
.page-transition-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  filter: blur(8px);
}
.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ====== Scroll Reveal Animation ====== */
:deep(.reveal-up) {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

:deep(.reveal-up.is-visible) {
  opacity: 1;
  transform: translateY(0);
}

/* ====== Responsive ====== */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: var(--space-12);
    text-align: center;
  }

  .hero-left {
    padding-right: 0;
  }

  .hero-desc {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-data-row {
    justify-content: center;
  }

  .hero-scroll-hint {
    justify-content: center;
  }

  .stats-showcase {
    flex-direction: column;
    gap: var(--space-5);
    padding: var(--space-8);
  }

  .stat-vline {
    width: 60%;
    height: 1px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: var(--space-16) var(--space-5);
  }

  .hero-container {
    padding: var(--space-12) var(--space-5);
  }

  .hero-right {
    order: -1;
  }

  .canvas-frame {
    padding: 16px;
  }

  .results-hero {
    padding: var(--space-16) var(--space-5);
  }

  .filter-inner {
    flex-direction: column;
    gap: var(--space-3);
    align-items: stretch;
  }

  .filter-group {
    justify-content: center;
  }

  .sort-wrap {
    justify-content: center;
  }

  .results-body {
    padding: var(--space-8) var(--space-5) var(--space-16);
  }

  .empty-numeral {
    font-size: 80px;
    top: -40px;
  }
}
</style>
