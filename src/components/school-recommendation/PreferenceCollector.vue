<template>
  <div class="pref-container">
    <div class="pref-noise" />

    <div class="pref-inner">
      <header class="pref-header">
        <div class="header-top-row">
          <div class="header-accent-line" />
          <div class="header-meta">
            <span class="meta-label">STEP</span>
            <span class="meta-num">01</span>
          </div>
        </div>
        <h1 class="header-title">
          <span class="title-line title-line--sub">定制你的</span>
          <span class="title-line title-line--main">选校偏好</span>
        </h1>
        <p class="header-desc">
          AI 智能解析背景，为你生成专属留学路线图
        </p>
      </header>

      <div
        v-if="assessment"
        class="profile-bar"
      >
        <div class="bar-label">
          Your Profile
        </div>
        <div class="bar-items">
          <div class="bar-chip bar-chip--solid">
            <span class="bar-val">{{ assessment.basic?.gpa || 'N/A' }}</span>
            <span class="bar-key">GPA</span>
          </div>
          <div class="bar-sep" />
          <div class="bar-chip bar-chip--warm">
            <span class="bar-val">{{ getUniversityLabel(assessment.basic?.university) }}</span>
          </div>
          <div class="bar-sep" />
          <div class="bar-chip">
            <span class="bar-val">{{ assessment.academic?.averageScore || 'N/A' }}</span>
            <span class="bar-key">均分</span>
          </div>
          <div class="bar-sep" />
          <div class="bar-chip">
            <span class="bar-val">{{ assessment.academic?.degree || '本科' }}</span>
          </div>
        </div>
      </div>

      <div class="wizard-scroll">
        <section
          class="wiz-step wiz-step--01"
          data-step="1"
        >
          <div class="wiz-bg-numeral">
            01
          </div>
          <div class="wiz-glow wiz-glow--amber" />

          <div class="wiz-grid">
            <div class="wiz-left">
              <div class="wiz-step-label">
                <span class="step-label-num">01</span>
                <span class="step-label-line" />
              </div>
              <h2 class="wiz-question">
                你最看重<br>
                <span class="q-accent">什么？</span>
              </h2>
              <p class="wiz-hint">
                可多选，AI 将据此调整推荐权重
              </p>
            </div>

            <div class="wiz-right">
              <div class="priority-deck">
                <button
                  v-for="(opt, idx) in priorityOptions"
                  :key="opt.value"
                  class="pri-card"
                  :class="{ 'pri-card--active': selectedPriorities.includes(opt.value) }"
                  :style="{ '--delay': idx * 0.08 + 's' }"
                  @click="togglePriority(opt.value)"
                >
                  <span class="pri-card__icon">{{ getIcon(opt.icon) }}</span>
                  <span class="pri-card__label">{{ opt.label }}</span>
                  <span class="pri-card__check">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    ><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span class="pri-card__ring" />
                </button>
              </div>
            </div>
          </div>

          <div class="wiz-progress-dock">
            <div class="dock-track">
              <div
                class="dock-fill"
                :style="{ width: stepProgressPercent + '%' }"
              />
            </div>
            <div class="dock-steps">
              <span
                class="dock-dot"
                :class="{ 'dock-dot--done': selectedPriorities.length > 0 }"
              >1</span>
              <span class="dock-dot">2</span>
              <span class="dock-dot">3</span>
            </div>
          </div>
        </section>

        <section
          class="wiz-step wiz-step--02"
          data-step="2"
        >
          <div class="wiz-bg-numeral">
            02
          </div>
          <div class="wiz-glow wiz-glow--slate" />

          <div class="wiz-grid wiz-grid--reverse">
            <div class="wiz-left">
              <div class="wiz-step-label">
                <span class="step-label-num">02</span>
                <span class="step-label-line" />
              </div>
              <h2 class="wiz-question">
                有没有想<br>
                <span class="q-accent">排除的地区？</span>
              </h2>
              <p class="wiz-hint">
                点击标记排除，再次点击取消
              </p>
            </div>

            <div class="wiz-right">
              <div class="region-deck">
                <button
                  class="reg-chip reg-chip--primary"
                  :class="{ 'reg-chip--active': excludedCountries.length === 0 }"
                  @click="clearExcludedCountries"
                >
                  <span class="reg-chip__icon">⊕</span>
                  <span class="reg-chip__text">不限制</span>
                </button>
                <button
                  v-for="c in availableCountries"
                  :key="c"
                  class="reg-chip"
                  :class="{ 'reg-chip--excluded': excludedCountries.includes(c) }"
                  @click="toggleCountry(c)"
                >
                  <span class="reg-chip__text">{{ c }}</span>
                  <span class="reg-chip__x">×</span>
                </button>
              </div>
            </div>
          </div>

          <div class="wiz-progress-dock">
            <div class="dock-track">
              <div
                class="dock-fill"
                :style="{ width: stepProgressPercent + '%' }"
              />
            </div>
            <div class="dock-steps">
              <span class="dock-dot dock-dot--done">1</span>
              <span
                class="dock-dot"
                :class="{ 'dock-dot--done': excludedCountries.length >= 0 }"
              >2</span>
              <span class="dock-dot">3</span>
            </div>
          </div>
        </section>

        <section
          class="wiz-step wiz-step--03"
          data-step="3"
        >
          <div class="wiz-bg-numeral">
            03
          </div>

          <div class="wiz-grid wiz-grid--center">
            <div class="wiz-left wiz-left--narrow">
              <div class="wiz-step-label">
                <span class="step-label-num">03</span>
                <span class="step-label-line" />
              </div>
              <h2 class="wiz-question wiz-question--compact">
                还有其他<br>
                <span class="q-accent">要求吗？</span>
              </h2>
              <p class="wiz-hint">
                选填 · 越详细 AI 推荐越精准
              </p>
            </div>

            <div class="wiz-right wiz-right--full">
              <div class="textarea-stage">
                <textarea
                  v-model="specialRequirements"
                  class="stage-textarea"
                  placeholder="例如：偏好加州的学校、预算每年30万以内、希望有Co-op项目..."
                  rows="4"
                />
                <div class="stage-counter">
                  <span
                    class="counter-val"
                    :class="{ 'counter-val--warn': specialRequirements.length > 400 }"
                  >{{ specialRequirements.length }}</span>
                  <span class="counter-max">/ 500</span>
                </div>
              </div>
            </div>
          </div>

          <div class="wiz-progress-dock">
            <div class="dock-track">
              <div
                class="dock-fill"
                :style="{ width: stepProgressPercent + '%' }"
              />
            </div>
            <div class="dock-steps">
              <span class="dock-dot dock-dot--done">1</span>
              <span class="dock-dot dock-dot--done">2</span>
              <span
                class="dock-dot"
                :class="{ 'dock-dot--done': specialRequirements.length > 0 }"
              >3</span>
            </div>
          </div>
        </section>
      </div>

      <div
        ref="actionAreaRef"
        class="wiz-action"
      >
        <button
          class="gen-btn"
          :class="{
            'gen-btn--loading': loading,
            'gen-btn--ready': !loading && selectedPriorities.length > 0
          }"
          :disabled="loading || selectedPriorities.length === 0"
          @click="submitPreferences"
        >
          <span class="gen-btn__bg" />
          <span class="gen-btn__content">
            <template v-if="!loading">
              <span class="gen-btn__icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
              </span>
              <span class="gen-btn__text">生成推荐方案</span>
            </template>
            <template v-else>
              <span class="gen-btn__spinner">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="spin-svg"
                ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              </span>
              <span class="gen-btn__text">AI 生成中...</span>
            </template>
          </span>
          <span class="gen-btn__glow" />
        </button>

        <Transition name="prog-fade">
          <div
            v-if="loading"
            class="prog-panel"
          >
            <div class="pp-glow" />

            <div class="pp-top">
              <div class="pp-status">
                <span class="pp-pulse">
                  <span class="pp-pulse__dot" />
                  <span class="pp-pulse__ring" />
                </span>
                <span class="pp-label">AI 正在分析</span>
              </div>
              <span class="pp-pct">{{ stepProgress }}%</span>
            </div>

            <div class="pp-track-wrap">
              <div class="pp-track">
                <div
                  class="pp-fill"
                  :style="{ width: stepProgress + '%' }"
                />
              </div>
            </div>

            <div class="pp-steps">
              <div
                v-for="(si) in visibleSteps"
                :key="si.step"
                class="pp-step"
                :class="{
                  'pp-step--active': currentStep === si.step,
                  'pp-step--done': getStepIndex(si.step) < getStepIndex(currentStep)
                }"
              >
                <div class="pp-step__dot">
                  <svg
                    v-if="getStepIndex(si.step) < getStepIndex(currentStep)"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    stroke-width="3"
                  ><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div class="pp-step__body">
                  <span class="pp-step__name">{{ si.label }}</span>
                  <span
                    v-if="currentStep === si.step"
                    class="pp-step__msg"
                  >{{ stepLabels[currentStep as RecommendationStep] }}</span>
                </div>
              </div>
            </div>

            <Transition name="stream-fade">
              <div
                v-if="isStreaming && streamingContent"
                class="pp-stream"
              >
                <div class="pp-stream__head">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D97706"
                    stroke-width="2.5"
                    class="spin-mini"
                  ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                  <span>实时输出</span>
                </div>
                <pre
                  ref="streamBodyRef"
                  class="pp-stream__body"
                >{{ streamingContent }}</pre>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { stepLabels } from '@/composables/useAIRecommendation'
import type { RecommendationStep } from '@/composables/useAIRecommendation'


const emit = defineEmits(['submit'])

const propsWithDefaults = defineProps({
  assessment: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentStep: {
    type: String,
    default: 'idle'
  },
  stepProgress: {
    type: Number,
    default: 0
  },
  streamingContent: {
    type: String,
    default: ''
  },
  isStreaming: {
    type: Boolean,
    default: false
  }
})

const streamBodyRef = ref<HTMLElement | null>(null)
const actionAreaRef = ref<HTMLElement | null>(null)

watch(() => propsWithDefaults.streamingContent, () => {
  nextTick(() => {
    if (streamBodyRef.value) {
      streamBodyRef.value.scrollTop = streamBodyRef.value.scrollHeight
    }
  })
})

watch(() => propsWithDefaults.loading, (val) => {
  if (val) {
    nextTick(() => {
      actionAreaRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
})

const priorityOptions = [
  { value: 'ranking', label: '排名优先', icon: 'Trophy' },
  { value: 'major', label: '专业匹配', icon: 'Reading' },
  { value: 'career', label: '就业前景', icon: 'Briefcase' },
  { value: 'location', label: '地理位置', icon: 'MapLocation' },
  { value: 'cost', label: '费用预算', icon: 'Money' }
]

const availableCountries = ['美国', '英国', '澳洲', '加拿大', '新加坡', '中国香港', '日本', '韩国', '欧洲其他']

const selectedPriorities = ref<string[]>([])
const excludedCountries = ref<string[]>([])
const specialRequirements = ref('')

const getIcon = (icon: string) => {
  const map: Record<string, string> = {
    Trophy: '🏆',
    Reading: '📖',
    Briefcase: '💼',
    MapLocation: '📍',
    Money: '💰'
  }
  return map[icon] || ''
}

const getUniversityLabel = (university: string) => {
  const map: Record<string, string> = {
    '985': '985',
    '211': '211',
    'overseas': 'Overseas',
    'regular': 'Regular'
  }
  return map[university] || university || 'N/A'
}

const stepOrder: RecommendationStep[] = ['idle', 'analyzing', 'matching', 'generating', 'completed', 'error']

const getStepIndex = (step: string): number => {
  return stepOrder.indexOf(step as RecommendationStep)
}

const visibleSteps = computed(() => {
  const steps: RecommendationStep[] = ['analyzing', 'matching', 'generating', 'completed']
  return steps.map(step => ({
    step,
    label: stepLabels[step]
  }))
})

const stepProgressPercent = computed(() => {
  let pct = 0
  if (selectedPriorities.value.length > 0) pct += 33
  if (excludedCountries.value.length >= 0) pct += 33
  if (specialRequirements.value.length > 0) pct += 34
  return Math.min(pct, 100)
})

const togglePriority = (value: string) => {
  const index = selectedPriorities.value.indexOf(value)
  if (index > -1) {
    selectedPriorities.value.splice(index, 1)
  } else {
    selectedPriorities.value.push(value)
  }
}

const toggleCountry = (country: string) => {
  const index = excludedCountries.value.indexOf(country)
  if (index > -1) {
    excludedCountries.value.splice(index, 1)
  } else {
    excludedCountries.value.push(country)
  }
}

const clearExcludedCountries = () => {
  excludedCountries.value = []
}

const submitPreferences = () => {
  if (selectedPriorities.value.length === 0) {
    ElMessage.warning('请至少选择一个最看重的维度')
    return
  }

  emit('submit', {
    priorities: selectedPriorities.value,
    excludedCountries: excludedCountries.value,
    specialRequirements: specialRequirements.value
  })
}

onMounted(() => {
  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  )

  document.querySelectorAll('.wiz-step').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<style scoped>
/* ====== CONTAINER ====== */
.pref-container {
  position: relative;
  width: 100%;
  min-height: 100%;
  background: #FAFAF9;
  overflow: hidden;
}

.pref-noise {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  z-index: 9999;
}

.pref-inner {
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
  padding: 60px 60px 100px;
}

/* ====== HEADER ====== */
.pref-header {
  position: relative;
  margin-bottom: 48px;
  padding-bottom: 36px;
}

.header-top-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
}

.header-accent-line {
  width: 56px;
  height: 3px;
  background: #D97706;
  border-radius: 2px;
  flex-shrink: 0;
}

.header-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.meta-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #94A3B8;
}

.meta-num {
  font-size: 10px;
  font-weight: 800;
  font-family: var(--font-family-mono);
  color: #D97706;
}

.header-title {
  margin: 0 0 14px 0;
  line-height: 0.95;
}

.title-line {
  display: block;
}

.title-line--sub {
  font-size: clamp(18px, 2.2vw, 24px);
  font-weight: 400;
  color: #94A3B8;
  letter-spacing: -0.3px;
}

.title-line--main {
  font-size: clamp(42px, 6.5vw, 72px);
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -2.5px;
}

.header-desc {
  font-size: 15px;
  color: #64748B;
  margin: 0;
  line-height: 1.7;
  max-width: 420px;
}

/* ====== PROFILE BAR ====== */
.profile-bar {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 18px 32px;
  background: #FFFFFF;
  border: 1px solid #F1F5F9;
  border-radius: 16px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.profile-bar::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #D97706, rgba(217,119,6,0.2));
}

.bar-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #94A3B8;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  flex-shrink: 0;
}

.bar-items {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
  flex-wrap: wrap;
}

.bar-chip {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bar-chip--solid {
  background: #0F172A;
  padding: 8px 18px;
  border-radius: 10px;
}

.bar-chip--solid .bar-val {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-family-mono);
}

.bar-chip--solid .bar-key {
  color: rgba(255,255,255,0.45);
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bar-chip--warm {
  background: #FEF3C7;
  padding: 8px 16px;
  border-radius: 10px;
}

.bar-chip--warm .bar-val {
  color: #B45309;
  font-size: 14px;
  font-weight: 700;
}

.bar-val {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  font-family: var(--font-family-mono);
  letter-spacing: -0.3px;
}

.bar-key {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #94A3B8;
}

.bar-sep {
  width: 1px;
  height: 28px;
  background: #E2E8F0;
  flex-shrink: 0;
}

/* ====== WIZARD SCROLL ====== */
.wizard-scroll {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ====== STEP (SCENE) ====== */
.wiz-step {
  position: relative;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 0;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.wiz-step.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.wiz-bg-numeral {
  position: absolute;
  top: 40px;
  right: 60px;
  font-size: clamp(140px, 18vw, 280px);
  font-weight: 900;
  font-family: var(--font-family-mono);
  color: #F1F5F9;
  line-height: 0.85;
  letter-spacing: -12px;
  -webkit-text-stroke: 1px rgba(15,23,42,0.04);
  pointer-events: none;
  z-index: 0;
  user-select: none;
}

.wiz-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.wiz-glow--amber {
  width: 500px;
  height: 500px;
  top: 10%;
  right: -5%;
  background: rgba(217,119,6,0.06);
}

.wiz-glow--slate {
  width: 450px;
  height: 450px;
  bottom: 10%;
  left: -3%;
  background: rgba(15,23,42,0.03);
}

/* ====== GRID LAYOUT ====== */
.wiz-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 80px;
  align-items: center;
}

.wiz-grid--reverse {
  grid-template-columns: 1.2fr 1fr;
}

.wiz-grid--center {
  grid-template-columns: 0.8fr 1.2fr;
  gap: 60px;
}

/* ====== LEFT COLUMN ====== */
.wiz-left {
  position: relative;
}

.wiz-left--narrow {
  max-width: 380px;
}

.wiz-step-label {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
}

.step-label-num {
  font-size: 11px;
  font-weight: 800;
  font-family: var(--font-family-mono);
  color: #CBD5E1;
  letter-spacing: 1.5px;
}

.step-label-line {
  width: 48px;
  height: 1.5px;
  background: linear-gradient(90deg, #E2E8F0, transparent);
}

.wiz-question {
  margin: 0 0 16px 0;
  font-size: clamp(48px, 6.5vw, 88px);
  font-weight: 900;
  color: #0F172A;
  line-height: 1.02;
  letter-spacing: -2.5px;
}

.wiz-question--compact {
  font-size: clamp(38px, 5vw, 64px);
}

.q-accent {
  color: #D97706;
}

.wiz-hint {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #94A3B8;
  letter-spacing: 0.3px;
  max-width: 280px;
}

/* ====== RIGHT COLUMN ====== */
.wiz-right {
  position: relative;
}

.wiz-right--full {
  max-width: 100%;
}

/* ====== PRIORITY DECK (Step 01) ====== */
.priority-deck {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.pri-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 36px 20px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.35s ease,
    box-shadow 0.35s ease,
    background 0.35s ease;
  animation: cardEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay, 0s);
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.pri-card:hover {
  border-color: #0F172A;
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(15,23,42,0.1);
}

.pri-card--active {
  background: #0F172A;
  border-color: #0F172A;
  transform: translateY(-6px);
  box-shadow: 0 22px 55px rgba(15,23,42,0.25);
}

.pri-card__icon {
  font-size: 36px;
  line-height: 1;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pri-card:hover .pri-card__icon {
  transform: scale(1.15) rotate(-5deg);
}

.pri-card__label {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.pri-card--active .pri-card__label {
  color: #fff;
}

.pri-card__check {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(0) rotate(-45deg);
}

.pri-card--active .pri-card__check {
  background: #D97706;
  color: #fff;
  transform: scale(1) rotate(0deg);
}

.pri-card__ring {
  position: absolute;
  inset: -2px;
  border-radius: 22px;
  border: 2px solid transparent;
  background: linear-gradient(135deg, rgba(217,119,6,0.2), transparent) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.pri-card:hover .pri-card__ring {
  opacity: 1;
}

.pri-card--active .pri-card__ring {
  opacity: 0;
}

/* ====== REGION DECK (Step 02) ====== */
.region-deck {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
}

.reg-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 26px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  user-select: none;
}

.reg-chip:hover {
  border-color: #0F172A;
  color: #0F172A;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15,23,42,0.06);
}

.reg-chip--primary {
  background: linear-gradient(135deg, #0F172A, #1E293B);
  border-color: #0F172A;
  color: #fff;
}

.reg-chip--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(15,23,42,0.2);
}

.reg-chip--primary.reg-chip--active {
  background: #0F172A;
  box-shadow: 0 0 0 3px rgba(217,119,6,0.2);
}

.reg-chip--excluded {
  background: #FEF2F2;
  border-color: #FECACA;
  color: #DC2626;
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  transform: scale(0.97);
}

.reg-chip__icon {
  font-size: 16px;
  font-weight: 300;
}

.reg-chip__text {
  white-space: nowrap;
}

.reg-chip__x {
  font-size: 20px;
  font-weight: 200;
  opacity: 0;
  margin-left: 2px;
  transition: opacity 0.2s ease;
  line-height: 1;
}

.reg-chip--excluded .reg-chip__x {
  opacity: 1;
}

/* ====== TEXTAREA STAGE (Step 03) ====== */
.textarea-stage {
  position: relative;
}

.stage-textarea {
  width: 100%;
  padding: 28px 32px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  font-family: var(--font-family-base);
  font-size: 16px;
  line-height: 1.8;
  color: #334155;
  resize: none;
  min-height: 160px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.stage-textarea::placeholder {
  color: #CBD5E1;
}

.stage-textarea:focus {
  outline: none;
  border-color: #0F172A;
  box-shadow: 0 0 0 5px rgba(15,23,42,0.04), 0 16px 40px rgba(15,23,42,0.04);
}

.stage-counter {
  position: absolute;
  bottom: 16px;
  right: 20px;
  display: flex;
  align-items: baseline;
  gap: 3px;
  font-family: var(--font-family-mono);
}

.counter-val {
  font-size: 12px;
  font-weight: 700;
  color: #CBD5E1;
  transition: color 0.3s ease;
}

.counter-val--warn {
  color: #D97706;
}

.counter-max {
  font-size: 11px;
  font-weight: 500;
  color: #E2E8F0;
}

/* ====== PROGRESS DOCK (per step) ====== */
.wiz-progress-dock {
  position: relative;
  z-index: 2;
  margin-top: auto;
  padding-top: 48px;
}

.dock-track {
  width: 100%;
  height: 2px;
  background: #F1F5F9;
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 14px;
}

.dock-fill {
  height: 100%;
  background: linear-gradient(90deg, #0F172A, #D97706);
  border-radius: 100px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.dock-steps {
  display: flex;
  align-items: center;
  gap: 24px;
}

.dock-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  font-family: var(--font-family-mono);
  color: #94A3B8;
  transition: all 0.4s ease;
}

.dock-dot--done {
  background: #0F172A;
  border-color: #0F172A;
  color: #fff;
  box-shadow: 0 4px 12px rgba(15,23,42,0.15);
}

/* ====== ACTION ZONE ====== */
.wiz-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  margin-top: 48px;
  padding-top: 56px;
  border-top: 1px solid #F1F5F9;
}

.gen-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 22px 64px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.6px;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  overflow: hidden;
  min-height: 68px;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gen-btn__bg {
  position: absolute;
  inset: 0;
  background: #0F172A;
  transition: all 0.4s ease;
}

.gen-btn:not(:disabled):hover .gen-btn__bg {
  background: #1E293B;
}

.gen-btn__content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
}

.gen-btn:disabled .gen-btn__content {
  color: #CBD5E1;
}

.gen-btn:disabled .gen-btn__bg {
  background: #F1F5F9;
}

.gen-btn--ready:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 60px rgba(15,23,42,0.28);
}

.gen-btn__glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #D97706, transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.gen-btn--ready:hover .gen-btn__glow {
  opacity: 1;
}

.gen-btn__icon {
  display: flex;
}

.gen-btn__spinner {
  display: flex;
}

.spin-svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== PROGRESS PANEL — Awwwards Style ====== */
.prog-panel {
  position: relative;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 44px 48px 40px;
  background: linear-gradient(145deg, #FFFFFF, #FAFAF9);
  border: 1px solid #F1F5F9;
  border-radius: 28px;
  overflow: hidden;
}

.pp-glow {
  position: absolute;
  top: -60px;
  right: -40px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(217,119,6,0.07), transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}

.pp-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.pp-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pp-pulse {
  position: relative;
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pp-pulse__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D97706;
  z-index: 1;
}

.pp-pulse__ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(217,119,6,0.3);
  animation: pulseRing 2s ease-out infinite;
}

@keyframes pulseRing {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}

.pp-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #94A3B8;
}

.pp-pct {
  font-size: 32px;
  font-weight: 900;
  color: #0F172A;
  font-family: var(--font-family-mono);
  letter-spacing: -2px;
  line-height: 1;
}

.pp-track-wrap {
  margin-bottom: 36px;
  position: relative;
  z-index: 1;
}

.pp-track {
  height: 4px;
  background: #F1F5F9;
  border-radius: 100px;
  overflow: hidden;
}

.pp-fill {
  height: 100%;
  background: linear-gradient(90deg, #D97706, #F59E0B);
  border-radius: 100px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.pp-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #D97706;
  box-shadow: 0 0 12px rgba(217,119,6,0.4);
}

.pp-steps {
  display: grid;
  gap: 0;
  position: relative;
  z-index: 1;
}

.pp-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.35;
}

.pp-step--active {
  opacity: 1;
  background: rgba(15,23,42,0.02);
}

.pp-step--done {
  opacity: 0.55;
}

.pp-step__dot {
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  transition: all 0.4s ease;
}

.pp-step--active .pp-step__dot {
  background: #0F172A;
  box-shadow: 0 4px 14px rgba(15,23,42,0.18);
}

.pp-step--done .pp-step__dot {
  background: #ECFDF5;
}

.pp-step__body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 3px;
  flex: 1;
}

.pp-step__name {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  letter-spacing: 0.2px;
}

.pp-step--active .pp-step__name {
  color: #0F172A;
  font-weight: 800;
}

.pp-step--done .pp-step__name {
  color: #64748B;
}

.pp-step__msg {
  font-size: 12px;
  color: #D97706;
  font-weight: 600;
  line-height: 1.55;
  animation: msgFadeIn 0.5s ease;
}

@keyframes msgFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ====== Stream Output ====== */
.pp-stream {
  margin-top: 24px;
  padding: 20px 22px;
  background: linear-gradient(135deg, #FFFBEB, #FEFCE8);
  border: 1px solid rgba(217,119,6,0.08);
  border-radius: 18px;
  position: relative;
  z-index: 1;
}

.pp-stream__head {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #B45309;
}

.spin-mini {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pp-stream__body {
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: 11px;
  line-height: 1.75;
  color: #78350F;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 140px;
  overflow-y: auto;
  background: rgba(255,255,255,0.55);
  padding: 14px 16px;
  border-radius: 10px;
}

.pp-stream__body::-webkit-scrollbar { width: 3px; }
.pp-stream__body::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.25); border-radius: 2px; }

/* ====== TRANSITIONS ====== */
.prog-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.prog-fade-leave-active {
  transition: all 0.3s ease;
}
.prog-fade-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.prog-fade-leave-to {
  opacity: 0;
}

.stream-fade-enter-active {
  transition: all 0.45s ease;
}
.stream-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

/* ====== RESPONSIVE ====== */
@media (max-width: 1200px) {
  .pref-inner {
    padding: 48px 40px 80px;
  }

  .wiz-grid {
    gap: 52px;
  }

  .wiz-grid--reverse {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }

  .wiz-bg-numeral {
    font-size: clamp(120px, 15vw, 220px);
    right: 40px;
  }

  .wiz-glow--amber {
    width: 380px;
    height: 380px;
  }
}

@media (max-width: 1024px) {
  .wiz-step {
    min-height: auto;
    padding: 56px 0;
  }

  .wiz-grid,
  .wiz-grid--reverse,
  .wiz-grid--center {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .wiz-bg-numeral {
    position: relative;
    top: auto;
    right: auto;
    font-size: clamp(80px, 15vw, 140px);
    margin-bottom: 24px;
    -webkit-text-stroke: 1px rgba(15,23,42,0.06);
  }

  .wiz-glow {
    position: relative;
    width: 100%;
    height: 200px;
    top: auto;
    left: auto;
    right: auto;
    margin-bottom: -100px;
  }

  .wiz-glow--amber {
    background: radial-gradient(ellipse at center, rgba(217,119,6,0.07), transparent 70%);
  }

  .wiz-glow--slate {
    background: radial-gradient(ellipse at center, rgba(15,23,42,0.04), transparent 70%);
  }

  .wiz-question {
    font-size: clamp(38px, 7vw, 60px);
  }

  .priority-deck {
    grid-template-columns: repeat(2, 1fr);
  }

  .priority-deck .pri-card:nth-child(5) {
    margin-left: 0;
  }

  .profile-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 24px;
  }

  .bar-label {
    writing-mode: horizontal-tb;
    transform: none;
  }

  .bar-items {
    flex-wrap: wrap;
    gap: 12px;
  }

  .bar-sep {
    display: none;
  }
}

@media (max-width: 768px) {
  .pref-inner {
    padding: 36px 24px 72px;
  }

  .header-title {
    margin-bottom: 10px;
  }

  .title-line--main {
    letter-spacing: -1.5px;
  }

  .wiz-step {
    padding: 40px 0;
  }

  .wiz-step-label {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .step-label-line {
    width: 36px;
  }

  .wiz-question {
    font-size: clamp(32px, 8vw, 46px);
    letter-spacing: -1.5px;
  }

  .wiz-question--compact {
    font-size: clamp(28px, 7vw, 40px);
  }

  .priority-deck {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .pri-card {
    padding: 24px 16px;
    gap: 10px;
  }

  .pri-card__icon {
    font-size: 28px;
  }

  .region-deck {
    gap: 10px;
  }

  .reg-chip {
    padding: 13px 20px;
    font-size: 13px;
  }

  .stage-textarea {
    padding: 20px 22px;
    font-size: 15px;
    min-height: 130px;
  }

  .gen-btn {
    width: 100%;
    padding: 20px 36px;
  }

  .prog-panel {
    padding: 24px;
  }

  .wiz-bg-numeral {
    font-size: clamp(60px, 18vw, 100px);
  }

  .wiz-progress-dock {
    padding-top: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }

  .wiz-step {
    opacity: 1;
    transform: none;
  }

  .pri-card {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
