<template>
  <div class="pref-container">
    <div class="pref-noise" />
    
    <div class="pref-inner">
      <header class="pref-header">
        <div class="header-accent-line" />
        <div class="header-meta">
          <span class="meta-label">STEP</span>
          <span class="meta-num">01</span>
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
        class="profile-strip"
      >
        <div class="strip-label">
          Your Profile
        </div>
        <div class="strip-items">
          <div class="strip-item strip-item--highlight">
            <span class="item-val">{{ assessment.basic?.gpa || 'N/A' }}</span>
            <span class="item-key">GPA</span>
          </div>
          <div class="strip-divider" />
          <div class="strip-item strip-item--warm">
            <span class="item-val">{{ getUniversityLabel(assessment.basic?.university) }}</span>
          </div>
          <div class="strip-divider" />
          <div class="strip-item">
            <span class="item-val">{{ assessment.academic?.averageScore || 'N/A' }}</span>
            <span class="item-key">均分</span>
          </div>
          <div class="strip-divider" />
          <div class="strip-item">
            <span class="item-val">{{ assessment.academic?.degree || '本科' }}</span>
          </div>
        </div>
      </div>

      <div class="form-flow">
        <section class="flow-section">
          <div class="section-index">
            <span class="index-num">01</span>
            <span class="index-line" />
          </div>
          <div class="section-body">
            <h2 class="section-question">
              你最看重<br>
              <span class="q-accent">什么？</span>
            </h2>
            <p class="section-hint">
              可多选
            </p>
            <div class="priority-grid">
              <button
                v-for="opt in priorityOptions"
                :key="opt.value"
                class="priority-card"
                :class="{ 'priority-card--active': selectedPriorities.includes(opt.value) }"
                @click="togglePriority(opt.value)"
              >
                <span class="card-icon">{{ getIcon(opt.icon) }}</span>
                <span class="card-label">{{ opt.label }}</span>
                <span class="card-check">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  ><polyline points="20 6 9 17 4 12" /></svg>
                </span>
              </button>
            </div>
          </div>
        </section>

        <section class="flow-section">
          <div class="section-index">
            <span class="index-num">02</span>
            <span class="index-line" />
          </div>
          <div class="section-body">
            <h2 class="section-question">
              有没有想<br>
              <span class="q-accent">排除的地区？</span>
            </h2>
            <p class="section-hint">
              点击排除
            </p>
            <div class="region-grid">
              <button
                class="region-chip region-chip--clear"
                :class="{ 'region-chip--active': excludedCountries.length === 0 }"
                @click="clearExcludedCountries"
              >
                <span class="chip-icon">🌍</span>
                <span class="chip-text">不限制</span>
              </button>
              <button
                v-for="c in availableCountries"
                :key="c"
                class="region-chip"
                :class="{ 'region-chip--excluded': excludedCountries.includes(c) }"
                @click="toggleCountry(c)"
              >
                <span class="chip-text">{{ c }}</span>
                <span class="chip-x">×</span>
              </button>
            </div>
          </div>
        </section>

        <section class="flow-section flow-section--last">
          <div class="section-index">
            <span class="index-num">03</span>
            <span class="index-line" />
          </div>
          <div class="section-body">
            <h2 class="section-question">
              还有其他<br>
              <span class="q-accent">要求吗？</span>
            </h2>
            <p class="section-hint">
              选填 · 越详细越好
            </p>
            <div class="input-wrapper">
              <textarea
                v-model="specialRequirements"
                class="custom-textarea"
                placeholder="例如：偏好加州的学校、预算每年30万以内..."
                rows="3"
              />
              <div class="textarea-counter">
                {{ specialRequirements.length }} / 500
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="action-zone">
        <button
          class="generate-btn"
          :class="{
            'generate-btn--loading': loading,
            'generate-btn--ready': !loading && selectedPriorities.length > 0
          }"
          :disabled="loading || selectedPriorities.length === 0"
          @click="submitPreferences"
        >
          <span class="btn-bg" />
          <span class="btn-content">
            <template v-if="!loading">
              <span class="btn-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
              </span>
              <span class="btn-text">生成推荐方案</span>
            </template>
            <template v-else>
              <span class="btn-spinner">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="spinner-svg"
                ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              </span>
              <span class="btn-text">AI 生成中...</span>
            </template>
          </span>
          <span class="btn-glow" />
        </button>

        <Transition name="progress-fade">
          <div
            v-if="loading"
            class="progress-panel"
          >
            <div class="progress-header">
              <span class="progress-title">AI 处理中</span>
              <span class="progress-percent">{{ stepProgress }}%</span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: stepProgress + '%' }"
              />
            </div>
            <div class="progress-steps">
              <div
                v-for="(si, idx) in visibleSteps"
                :key="si.step"
                class="p-step"
                :class="{
                  'p-step--active': currentStep === si.step,
                  'p-step--done': getStepIndex(si.step) < getStepIndex(currentStep)
                }"
              >
                <div class="p-step-dot">
                  <svg
                    v-if="getStepIndex(si.step) < getStepIndex(currentStep)"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  ><polyline points="20 6 9 17 4 12" /></svg>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <span class="p-step-label">{{ si.label }}</span>
              </div>
            </div>
            <p class="progress-msg">
              {{ stepLabels[currentStep as RecommendationStep] }}
            </p>

            <Transition name="stream-fade">
              <div
                v-if="isStreaming && streamingContent"
                class="stream-container"
              >
                <div
                  v-if="hasReasoningContent(streamingContent)"
                  class="stream-block stream-block--think"
                >
                  <div class="stream-header">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      class="spin-mini"
                    ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    <span>AI 推理过程</span>
                  </div>
                  <pre class="stream-content stream-content--think">{{ getReasoningContent(streamingContent) }}</pre>
                </div>
                <div
                  v-if="hasMainContent(streamingContent)"
                  class="stream-block stream-block--result"
                >
                  <div class="stream-header">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    <span>生成结果</span>
                  </div>
                  <pre class="stream-content">{{ getMainContent(streamingContent) }}</pre>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { stepLabels } from '@/composables/useAIRecommendation'
import type { RecommendationStep } from '@/composables/useAIRecommendation'
import { hasReasoningContent, hasMainContent, getReasoningContent, getMainContent } from '@/utils/streamParser'

defineProps({
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

const emit = defineEmits(['submit'])

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
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  document.querySelectorAll('.flow-section').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<style scoped>
/* ====== Container ====== */
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
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 40px 120px;
}

/* ====== Header ====== */
.pref-header {
  position: relative;
  margin-bottom: 60px;
  padding-bottom: 40px;
}

.header-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: #D97706;
}

.header-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 24px;
  padding-top: 40px;
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
  margin: 0 0 16px 0;
  line-height: 0.95;
}

.title-line {
  display: block;
}

.title-line--sub {
  font-size: clamp(18px, 2.5vw, 24px);
  font-weight: 400;
  color: #94A3B8;
  letter-spacing: -0.5px;
}

.title-line--main {
  font-size: clamp(42px, 7vw, 72px);
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -3px;
}

.header-desc {
  font-size: 15px;
  color: #64748B;
  margin: 0;
  line-height: 1.7;
  max-width: 400px;
}

/* ====== Profile Strip ====== */
.profile-strip {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 28px;
  background: #FFFFFF;
  border: 1px solid #F1F5F9;
  border-radius: 16px;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;
}

.profile-strip::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #D97706, transparent);
}

.strip-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #94A3B8;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.strip-items {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.strip-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.strip-item--highlight {
  background: #0F172A;
  padding: 8px 16px;
  border-radius: 8px;
}

.strip-item--highlight .item-val {
  color: #fff;
  font-size: 18px;
}

.strip-item--highlight .item-key {
  color: rgba(255,255,255,0.5);
}

.strip-item--warm {
  background: #FEF3C7;
  padding: 8px 14px;
  border-radius: 8px;
}

.strip-item--warm .item-val {
  color: #B45309;
}

.item-val {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  font-family: var(--font-family-mono);
  letter-spacing: -0.5px;
}

.item-key {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #94A3B8;
}

.strip-divider {
  width: 1px;
  height: 32px;
  background: #E2E8F0;
}

/* ====== Form Flow ====== */
.form-flow {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.flow-section {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 32px;
  padding: 48px 0;
  border-bottom: 1px solid #F1F5F9;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.flow-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.flow-section--last {
  border-bottom: none;
}

.section-index {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding-top: 8px;
}

.index-num {
  font-size: 11px;
  font-weight: 800;
  font-family: var(--font-family-mono);
  color: #CBD5E1;
  letter-spacing: 1px;
}

.index-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, #E2E8F0, transparent);
}

.section-body {
  flex: 1;
}

.section-question {
  margin: 0 0 8px 0;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: #0F172A;
  line-height: 1.1;
  letter-spacing: -1.5px;
}

.q-accent {
  color: #D97706;
}

.section-hint {
  margin: 0 0 28px 0;
  font-size: 12px;
  font-weight: 600;
  color: #94A3B8;
  letter-spacing: 0.5px;
}

/* ====== Priority Grid ====== */
.priority-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.priority-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 20px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.priority-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(217,119,6,0.08), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.priority-card:hover {
  border-color: #0F172A;
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(15,23,42,0.08);
}

.priority-card:hover::before {
  opacity: 1;
}

.priority-card--active {
  background: #0F172A;
  border-color: #0F172A;
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(15,23,42,0.2);
}

.priority-card--active::before {
  opacity: 0;
}

.card-icon {
  font-size: 28px;
  line-height: 1;
  transition: transform 0.3s ease;
}

.priority-card:hover .card-icon {
  transform: scale(1.15);
}

.card-label {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}

.priority-card--active .card-label {
  color: #fff;
}

.card-check {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  transition: all 0.3s ease;
  transform: scale(0);
}

.priority-card--active .card-check {
  background: #D97706;
  color: #fff;
  transform: scale(1);
}

/* ====== Region Grid ====== */
.region-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.region-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.region-chip:hover {
  border-color: #0F172A;
  color: #0F172A;
}

.region-chip--clear {
  background: #F8FAFC;
}

.region-chip--active {
  background: #0F172A;
  border-color: #0F172A;
  color: #fff;
}

.region-chip--excluded {
  background: #FEF2F2;
  border-color: #FECACA;
  color: #DC2626;
  text-decoration: line-through;
  text-decoration-thickness: 2px;
}

.chip-icon {
  font-size: 14px;
}

.chip-x {
  font-size: 18px;
  font-weight: 300;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.region-chip--excluded .chip-x {
  opacity: 1;
}

/* ====== Custom Textarea ====== */
.input-wrapper {
  position: relative;
}

.custom-textarea {
  width: 100%;
  padding: 20px 24px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 16px;
  font-family: var(--font-family-base);
  font-size: 15px;
  line-height: 1.7;
  color: #334155;
  resize: none;
  transition: all 0.35s ease;
}

.custom-textarea::placeholder {
  color: #CBD5E1;
}

.custom-textarea:focus {
  outline: none;
  border-color: #0F172A;
  box-shadow: 0 0 0 4px rgba(15,23,42,0.05);
}

.textarea-counter {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 10px;
  font-weight: 600;
  color: #CBD5E1;
  font-family: var(--font-family-mono);
}

/* ====== Action Zone ====== */
.action-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-top: 60px;
  padding-top: 60px;
  border-top: 1px solid #F1F5F9;
}

.generate-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 20px 56px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  min-height: 64px;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-bg {
  position: absolute;
  inset: 0;
  background: #0F172A;
  transition: all 0.4s ease;
}

.generate-btn:not(:disabled):hover .btn-bg {
  background: #1E293B;
}

.btn-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
}

.generate-btn:disabled .btn-content {
  color: #CBD5E1;
}

.generate-btn:disabled .btn-bg {
  background: #F1F5F9;
}

.generate-btn--ready:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(15,23,42,0.25);
}

.btn-glow {
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

.generate-btn--ready:hover .btn-glow {
  opacity: 1;
}

.btn-icon {
  display: flex;
}

.btn-spinner {
  display: flex;
}

.spinner-svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== Progress Panel ====== */
.progress-panel {
  width: 100%;
  max-width: 560px;
  padding: 32px;
  background: #FFFFFF;
  border: 1px solid #F1F5F9;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(15,23,42,0.04);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #64748B;
}

.progress-percent {
  font-size: 14px;
  font-weight: 800;
  font-family: var(--font-family-mono);
  color: #0F172A;
}

.progress-track {
  height: 4px;
  background: #F1F5F9;
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 24px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0F172A, #D97706);
  border-radius: 100px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.p-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.35;
  transition: opacity 0.3s ease;
}

.p-step--active { opacity: 1; }
.p-step--done { opacity: 0.6; }

.p-step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: #94A3B8;
  transition: all 0.3s ease;
}

.p-step--active .p-step-dot {
  background: #0F172A;
  color: #fff;
  box-shadow: 0 4px 12px rgba(15,23,42,0.2);
}

.p-step--done .p-step-dot {
  background: #059669;
  color: #fff;
}

.p-step-label {
  font-size: 10px;
  color: #94A3B8;
  text-align: center;
  max-width: 60px;
  line-height: 1.3;
}

.p-step--active .p-step-label {
  color: #0F172A;
  font-weight: 700;
}

.progress-msg {
  text-align: center;
  margin: 0;
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
}

/* ====== Stream Container ====== */
.stream-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.stream-block {
  border-radius: 12px;
  border: 1px solid #F1F5F9;
  overflow: hidden;
}

.stream-block--think {
  background: #F0F9FF;
  border-color: rgba(2,132,199,0.15);
}

.stream-block--result {
  background: #ECFDF5;
  border-color: rgba(5,150,105,0.15);
}

.stream-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.stream-block--think .stream-header {
  color: #0284C7;
}

.stream-block--result .stream-header {
  color: #059669;
}

.spin-mini {
  animation: spin 1s linear infinite;
}

.stream-content {
  margin: 0;
  padding: 14px 16px;
  font-family: var(--font-family-mono);
  font-size: 11px;
  line-height: 1.75;
  color: #475569;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 120px;
  overflow-y: auto;
  background: rgba(255,255,255,0.5);
}

.stream-content::-webkit-scrollbar { width: 3px; }
.stream-content::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 2px; }

.stream-content--think {
  color: #64748B;
}

/* ====== Transitions ====== */
.progress-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.progress-fade-leave-active {
  transition: all 0.3s ease;
}
.progress-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.progress-fade-leave-to {
  opacity: 0;
}

.stream-fade-enter-active {
  transition: all 0.4s ease;
}
.stream-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* ====== Responsive ====== */
@media (max-width: 768px) {
  .pref-inner {
    padding: 60px 24px 100px;
  }

  .header-title {
    margin-bottom: 12px;
  }

  .title-line--main {
    letter-spacing: -2px;
  }

  .profile-strip {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
  }

  .strip-label {
    writing-mode: horizontal-tb;
    transform: none;
  }

  .strip-items {
    flex-wrap: wrap;
    gap: 12px;
  }

  .strip-divider {
    display: none;
  }

  .flow-section {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 32px 0;
  }

  .section-index {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .index-line {
    width: 40px;
    height: 1px;
  }

  .priority-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .priority-card {
    padding: 20px 16px;
  }

  .generate-btn {
    width: 100%;
    padding: 18px 32px;
  }

  .progress-panel {
    padding: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
