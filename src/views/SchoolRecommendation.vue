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
          <p class="empty-numeral">01</p>
          <h2 class="empty-title">请先完成背景评估</h2>
          <p class="empty-desc">系统需要您的背景信息才能进行精准推荐</p>
          <button
            class="btn-cta"
            @click="router.push('/assessment')"
          >
            <span class="btn-text">去评估</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-arrow"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

                <div class="hero-scroll-hint">
                  <div class="scroll-line" />
                  <span class="scroll-text">向下滚动开始</span>
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
          <section class="results-hero">
            <div class="results-hero-bg">
              <div class="results-orb results-orb--1" />
              <div class="results-orb results-orb--2" />
            </div>

            <div class="results-hero-content">
              <div class="results-badge-row">
                <span class="badge-icon">✓</span>
                <span class="badge-text">推荐完成</span>
              </div>

              <h2 class="results-main-title">
                <span class="r-title-line">AI 智能选校</span>
                <span class="r-title-line r-title-line--sub">结果报告</span>
              </h2>

              <p class="results-sub">基于您的背景，为您推荐以下院校</p>

              <div class="stats-showcase">
                <div class="stat-item stat-item--hero">
                  <div class="stat-number-wrap">
                    <CountUp
                      :end-val="overallMatchScore"
                      suffix="%"
                    />
                  </div>
                  <div class="stat-track">
                    <div
                      class="stat-track-fill"
                      :style="{ width: overallMatchScore + '%' }"
                    />
                  </div>
                  <span class="stat-name">综合匹配度</span>
                </div>

                <div class="stat-vline" />

                <div class="stat-item">
                  <div class="stat-number-wrap">
                    <CountUp :end-val="coreCount" />
                    <span class="stat-suffix-small">所</span>
                  </div>
                  <span class="stat-name">核心推荐</span>
                </div>

                <div class="stat-vline" />

                <div class="stat-item">
                  <div class="stat-number-wrap">
                    <CountUp :end-val="alternativeCount" />
                    <span class="stat-suffix-small">所</span>
                  </div>
                  <span class="stat-name">备选方案</span>
                </div>
              </div>
            </div>
          </section>

          <section class="filter-bar">
            <div class="filter-inner">
              <div class="filter-group">
                <button
                  class="f-btn"
                  :class="{ 'f-btn--on': activeFilter === 'all' }"
                  @click="activeFilter = 'all'"
                >全部</button>
                <button
                  class="f-btn"
                  :class="{ 'f-btn--on': activeFilter === 'core' }"
                  @click="activeFilter = 'core'"
                >核心推荐</button>
                <button
                  class="f-btn"
                  :class="{ 'f-btn--on': activeFilter === 'alternative' }"
                  @click="activeFilter = 'alternative'"
                >备选方案</button>
              </div>
              <div class="sort-wrap">
                <span class="sort-lbl">排序</span>
                <select
                  v-model="sortBy"
                  class="sort-select"
                >
                  <option value="match-desc">匹配度 ↓</option>
                  <option value="match-asc">匹配度 ↑</option>
                  <option value="ranking">排名</option>
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
  min-height: 100vh;
  display: flex;
  align-items: center;
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
  margin: 0 auto;
  padding: var(--space-20) var(--space-10);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: var(--space-16);
  align-items: center;
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

/* ====== Scroll Hint ====== */
.hero-scroll-hint {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-12);
  animation: fadeUp 0.8s ease both;
  animation-delay: 0.9s;
}

.scroll-line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, #CBD5E1, transparent);
}

.scroll-text {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #CBD5E1;
  font-weight: 600;
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
  padding: var(--space-20) var(--space-8) var(--space-28);
  background:
    radial-gradient(ellipse 80% 50% at 50% -5%, rgba(15,23,42,0.015), transparent),
    linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%);
}

.pref-section-inner {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* ====== RESULTS HERO — Light Theme ====== */
.results-hero {
  position: relative;
  overflow: hidden;
  background: #FFFFFF;
  padding: var(--space-24) var(--space-8);
  border-bottom: 1px solid #F1F5F9;
}

.results-hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.results-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.results-orb--1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -100px;
  background: rgba(217,119,6,0.06);
}

.results-orb--2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: 10%;
  background: rgba(15,23,42,0.03);
}

.results-hero-content {
  position: relative;
  z-index: 2;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.results-badge-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-radius: 100px;
  background: #ECFDF5;
  border: 1px solid rgba(5,150,105,0.15);
  margin-bottom: var(--space-8);
}

.badge-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  font-size: 12px;
  font-weight: 700;
}

.badge-text {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #059669;
}

.results-main-title {
  margin: 0 0 var(--space-5) 0;
  line-height: 1.05;
}

.r-title-line {
  display: block;
}

.r-title-line:first-child {
  font-size: clamp(36px, 5.5vw, 64px);
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -2.5px;
}

.r-title-line--sub {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 700;
  color: #D97706;
  letter-spacing: -1.5px;
}

.results-sub {
  font-size: 16px;
  color: #64748B;
  margin: 0 0 var(--space-12) 0;
  letter-spacing: 0.3px;
}

/* ====== Stats Showcase — Light ====== */
.stats-showcase {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  background: #F8FAFC;
  border: 1px solid #F1F5F9;
  border-radius: 24px;
  padding: var(--space-8) var(--space-10);
  max-width: 680px;
  margin: 0 auto;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 0 var(--space-6);
  position: relative;
}

.stat-item--hero {
  flex: 1.4;
}

.stat-number-wrap {
  font-size: clamp(36px, 4vw, 52px);
  font-weight: 900;
  color: #0F172A;
  font-family: var(--font-family-mono);
  letter-spacing: -3px;
  line-height: 1;
  margin-bottom: var(--space-3);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.stat-suffix-small {
  font-size: 16px;
  font-weight: 600;
  color: #94A3B8;
  font-family: var(--font-family-base);
  letter-spacing: 0;
}

.stat-track {
  width: 80px;
  height: 3px;
  background: #E2E8F0;
  border-radius: 100px;
  margin: 0 auto var(--space-3);
  overflow: hidden;
}

.stat-track-fill {
  height: 100%;
  background: linear-gradient(90deg, #D97706, #FBBF24);
  border-radius: 100px;
  transition: width 2s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-name {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #94A3B8;
}

.stat-vline {
  width: 1px;
  background: #E2E8F0;
  align-self: stretch;
}

/* ====== Filter Bar ====== */
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250,250,249,0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(15,23,42,0.05);
}

.filter-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-group {
  display: flex;
  gap: 4px;
  background: #F1F5F9;
  padding: 4px;
  border-radius: 12px;
}

.f-btn {
  padding: 8px 22px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  background: transparent;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.2px;
}

.f-btn:hover {
  color: #334155;
}

.f-btn--on {
  background: #FFFFFF;
  color: #0F172A;
  box-shadow: 0 2px 8px rgba(15,23,42,0.08);
}

.sort-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sort-lbl {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.sort-select {
  padding: 8px 32px 8px 14px;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  font-size: 13px;
  color: #334155;
  background: #FFF url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  transition: border-color 0.25s;
}

.sort-select:focus {
  border-color: #0F172A;
  box-shadow: 0 0 0 3px rgba(15,23,42,0.06);
}

/* ====== Results Body ====== */
.results-body {
  max-width: 1300px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-8) var(--space-24);
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
