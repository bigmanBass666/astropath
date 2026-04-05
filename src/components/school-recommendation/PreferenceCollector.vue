<template>
  <div class="pref-awwwards">
    <div
      ref="headerEl"
      class="pref-header reveal-up"
    >
      <div class="header-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div class="header-text">
        <p class="header-title">AI 选校助手</p>
        <p class="header-sub">你好！我是你的专属选校顾问。</p>
      </div>
    </div>

    <div
      v-if="assessment"
      ref="summaryEl"
      class="pref-summary reveal-up"
    >
      <div class="summary-bar">
        <span class="summary-label">已了解你的背景</span>
      </div>
      <div class="summary-chips">
        <span class="s-chip s-chip--dark">{{ assessment.basic?.gpa || 'N/A' }} GPA</span>
        <span class="s-chip s-chip--warm">{{ getUniversityLabel(assessment.basic?.university) }}</span>
        <span class="s-chip">{{ assessment.academic?.averageScore || 'N/A' }} 均分</span>
        <span class="s-chip">{{ assessment.academic?.degree || '本科' }}</span>
      </div>
    </div>

    <p ref="introEl" class="pref-intro reveal-up">为了给你最合适的推荐，请告诉我：</p>

    <div
      ref="card1El"
      class="step-card reveal-up"
      :class="{ 'step-card--active': currentFocus === 1 }"
    >
      <div class="step-num-badge">01</div>
      <div class="step-content">
        <label class="step-q">
          你目前最看重什么？
          <span class="q-hint">可多选</span>
        </label>
        <div class="option-grid">
          <button
            v-for="opt in priorityOptions"
            :key="opt.value"
            class="opt-btn"
            :class="{ 'opt-btn--on': selectedPriorities.includes(opt.value) }"
            @click="togglePriority(opt.value)"
          >
            <span class="opt-icon">{{ getIcon(opt.icon) }}</span>
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <div
      ref="card2El"
      class="step-card reveal-up"
      :class="{ 'step-card--active': currentFocus === 2 }"
    >
      <div class="step-num-badge">02</div>
      <div class="step-content">
        <label class="step-q">有想避开的国家/地区吗？</label>
        <div class="country-grid">
          <button
            :class="['c-btn', { 'c-btn--on': excludedCountries.length === 0 }]"
            @click="clearExcludedCountries"
          >无限制</button>
          <button
            v-for="c in availableCountries"
            :key="c"
            :class="['c-btn', { 'c-btn--on': excludedCountries.includes(c) }]"
            @click="toggleCountry(c)"
          >{{ c }}</button>
        </div>
      </div>
    </div>

    <div
      ref="card3El"
      class="step-card reveal-up"
    >
      <div class="step-num-badge">03</div>
      <div class="step-content">
        <label class="step-q">
          还有什么特别的要求？
          <span class="q-hint q-hint--muted">选填</span>
        </label>
        <el-input
          v-model="specialRequirements"
          type="textarea"
          :rows="3"
          placeholder="例如：我想去加州的学校、希望学费在3万美元以内..."
          class="aww-textarea"
        />
      </div>
    </div>

    <div
      ref="actionsEl"
      class="pref-actions reveal-up"
    >
      <button
        class="submit-btn"
        :class="{
          'submit-btn--loading': loading,
          'submit-btn--ready': !loading && selectedPriorities.length > 0
        }"
        :disabled="loading || selectedPriorities.length === 0"
        @click="submitPreferences"
      >
        <span v-if="!loading" class="sb-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </span>
        <span v-else class="sb-spin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-svg"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </span>
        {{ loading ? '生成中...' : '开始智能推荐' }}
      </button>

      <div
        v-if="loading"
        class="progress-box"
      >
        <div class="prog-track">
          <div
            class="prog-fill"
            :style="{ width: stepProgress + '%' }"
          />
        </div>
        <div class="steps-dots">
          <div
            v-for="(si, idx) in visibleSteps"
            :key="si.step"
            class="sd-item"
            :class="{
              'sd-item--live': currentStep === si.step,
              'sd-item--done': getStepIndex(si.step) < getStepIndex(currentStep)
            }"
          >
            <div class="sd-circle">
              <svg
                v-if="getStepIndex(si.step) < getStepIndex(currentStep)"
                width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              ><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span class="sd-label">{{ si.label }}</span>
          </div>
        </div>
        <p class="prog-msg">{{ stepLabels[currentStep as RecommendationStep] }}</p>

        <div
          v-if="isStreaming && streamingContent"
          class="stream-box"
        >
          <div
            v-if="hasReasoningContent(streamingContent)"
            class="stream-block"
          >
            <div class="stream-tag stream-tag--think">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-svg-mini"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              AI思考过程
            </div>
            <pre class="stream-text stream-text--think">{{ getReasoningContent(streamingContent) }}</pre>
          </div>
          <div
            v-if="hasMainContent(streamingContent)"
            class="stream-block"
            :class="{ 'stream-block--split': hasReasoningContent(streamingContent) }"
          >
            <div class="stream-tag stream-tag--result">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              生成结果
            </div>
            <pre class="stream-text">{{ getMainContent(streamingContent) }}</pre>
          </div>
        </div>
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

const headerEl = ref<HTMLElement | null>(null)
const summaryEl = ref<HTMLElement | null>(null)
const introEl = ref<HTMLElement | null>(null)
const card1El = ref<HTMLElement | null>(null)
const card2El = ref<HTMLElement | null>(null)
const card3El = ref<HTMLElement | null>(null)
const actionsEl = ref<HTMLElement | null>(null)

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
  { value: 'ranking', label: '学校排名', icon: 'Trophy' },
  { value: 'major', label: '专业实力', icon: 'Reading' },
  { value: 'career', label: '就业前景', icon: 'Briefcase' },
  { value: 'location', label: '地理位置', icon: 'MapLocation' },
  { value: 'cost', label: '学费预算', icon: 'Money' }
]

const availableCountries = ['美国', '英国', '澳洲', '加拿大', '新加坡', '中国香港', '日本', '韩国', '欧洲其他']

const selectedPriorities = ref<string[]>([])
const excludedCountries = ref<string[]>([])
const specialRequirements = ref('')
const currentFocus = ref(-1)

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
    '985': '985院校',
    '211': '211院校',
    'overseas': '海外院校',
    'regular': '普通本科'
  }
  return map[university] || university || '未知院校'
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

const revealElements = [
  { el: headerEl, delay: 0 },
  { el: summaryEl, delay: 80 },
  { el: introEl, delay: 140 },
  { el: card1El, delay: 200 },
  { el: card2El, delay: 280 },
  { el: card3El, delay: 360 },
  { el: actionsEl, delay: 440 }
]

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        const staggerDelay = Number(target.dataset.revealDelay || 0)
        setTimeout(() => {
          target.classList.add('is-visible')
        }, staggerDelay)
        observer.unobserve(target)
      }
    })
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  })

  revealElements.forEach(({ el, delay }) => {
    if (el.value) {
      el.value.dataset.revealDelay = String(delay)
      observer.observe(el.value)
    }
  })
})
</script>

<style scoped>
.pref-awwwards {
  max-width: 680px;
  margin: 0 auto;
}

/* ====== Header ====== */
.pref-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 1px solid #F1F5F9;
}

.header-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #0F172A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(15,23,42,0.18);
}

.header-title {
  margin: 0 0 3px 0;
  font-size: 19px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.4px;
}

.header-sub {
  margin: 0;
  font-size: 13px;
  color: #64748B;
}

/* ====== Summary ====== */
.pref-summary {
  background: linear-gradient(135deg, #F8FAFC 0%, rgba(248,250,252,0.5) 100%);
  border: 1px solid #F1F5F9;
  border-radius: 20px;
  padding: 20px 24px;
  margin-bottom: 36px;
  position: relative;
  overflow: hidden;
}

.pref-summary::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #D97706, transparent);
  border-radius: 0 2px 2px 0;
}

.summary-bar {
  margin-bottom: 14px;
}

.summary-label {
  font-size: 10px;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  display: block;
}

.summary-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.s-chip {
  padding: 5px 13px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  background: #F1F5F9;
  color: #64748B;
  letter-spacing: 0.15px;
}

.s-chip--dark {
  background: #0F172A;
  color: #fff;
}

.s-chip--warm {
  background: #FEF3C7;
  color: #B45309;
}

/* ====== Intro ====== */
.pref-intro {
  font-size: 17px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 28px 0;
  letter-spacing: -0.2px;
}

/* ====== Step Card — Awwwards Style ====== */
.step-card {
  display: flex;
  gap: 20px;
  padding: 28px;
  background: #FFFFFF;
  border: 1px solid #F1F5F9;
  border-radius: 20px;
  margin-bottom: 16px;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.35s ease;
  position: relative;
}

.step-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #E2E8F0;
  transition: background 0.35s ease;
  border-radius: 0 2px 2px 0;
}

.step-card:focus-within::before {
  background: #0F172A;
}

.step-card:focus-within {
  border-color: rgba(15,23,42,0.1);
  box-shadow: 0 8px 32px rgba(15,23,42,0.06);
}

.step-num-badge {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #F8FAFC;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.35s ease;
}

.step-card:focus-within .step-num-badge {
  background: #0F172A;
  color: #fff;
  box-shadow: 0 4px 12px rgba(15,23,42,0.2);
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-q {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;
}

.q-hint {
  font-size: 10px;
  font-weight: 600;
  color: #D97706;
  background: #FEF3C7;
  padding: 2px 8px;
  border-radius: 4px;
}

.q-hint--muted {
  color: #94A3B8;
  background: #F1F5F9;
}

/* ====== Option Grid ====== */
.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.opt-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: 1.5px solid #E2E8F0;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  background: #FFF;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.opt-btn:hover {
  border-color: #0F172A;
  color: #0F172A;
}

.opt-btn--on {
  background: #0F172A;
  border-color: #0F172A;
  color: #fff;
  transform: scale(1.03);
  box-shadow: 0 4px 14px rgba(15,23,42,0.18);
}

.opt-icon {
  font-size: 14px;
  line-height: 1;
}

/* ====== Country Grid ====== */
.country-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.c-btn {
  padding: 8px 16px;
  border: 1.5px solid #E2E8F0;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  background: #FFF;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.c-btn:hover {
  border-color: #0F172A;
  color: #0F172A;
}

.c-btn--on {
  background: #0F172A;
  border-color: #0F172A;
  color: #fff;
}

/* ====== Textarea ====== */
.aww-textarea :deep(.el-textarea__inner) {
  border-radius: 14px;
  border: 1.5px solid #E2E8F0;
  font-family: var(--font-family-base);
  font-size: 14px;
  resize: none;
  transition: all 0.3s ease;
  background: #FAFAF9;
}

.aww-textarea :deep(.el-textarea__inner:focus) {
  border-color: #0F172A;
  box-shadow: 0 0 0 4px rgba(15,23,42,0.05);
  background: #fff;
}

/* ====== Actions ====== */
.pref-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  margin-top: 12px;
}

.submit-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 17px 48px;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 56px;
  letter-spacing: 0.3px;
}

.submit-btn:not(:disabled) {
  background: #0F172A;
  color: white;
  box-shadow: 0 6px 20px rgba(15,23,42,0.2);
}

.submit-btn:not(:disabled).submit-btn--ready:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(15,23,42,0.28);
}

.submit-btn:not(:disabled)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #D97706, transparent);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.submit-btn:not(:disabled).submit-btn--ready:hover::after {
  opacity: 1;
}

.submit-btn:disabled {
  background: #F1F5F9;
  color: #CBD5E1;
  cursor: not-allowed;
  box-shadow: none;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.sb-icon, .sb-spin {
  display: flex;
  align-items: center;
}

.spin-svg {
  animation: spin 1s linear infinite;
}
.spin-svg-mini {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== Progress Box ====== */
.progress-box {
  width: 100%;
  max-width: 520px;
  padding: 28px;
  background: #FAFAF9;
  border-radius: 20px;
  border: 1px solid #F1F5F9;
}

.prog-track {
  height: 4px;
  background: #E2E8F0;
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 22px;
}

.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #0F172A, #D97706);
  border-radius: 100px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.steps-dots {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.sd-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  opacity: 0.35;
  transition: opacity 0.3s ease;
}

.sd-item--live { opacity: 1; }
.sd-item--done { opacity: 0.65; }

.sd-circle {
  width: 28px;
  height: 28px;
  border-radius: 100px;
  background: #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: #94A3B8;
  transition: all 0.3s ease;
}

.sd-item--live .sd-circle {
  background: #0F172A;
  color: #fff;
  box-shadow: 0 3px 10px rgba(15,23,42,0.22);
}

.sd-item--done .sd-circle {
  background: #059669;
  color: #fff;
}

.sd-label {
  font-size: 10px;
  color: #94A3B8;
  text-align: center;
  max-width: 56px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sd-item--live .sd-label {
  color: #0F172A;
  font-weight: 700;
}

.prog-msg {
  text-align: center;
  margin: 0;
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
}

/* ====== Stream Box ====== */
.stream-box {
  margin-top: 18px;
}

.stream-block {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #F1F5F9;
  overflow: hidden;
}

.stream-block--split {
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: -1px;
}

.stream-tag {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.stream-tag--think {
  color: #0284C7;
  background: #F0F9FF;
}

.stream-tag--result {
  color: #059669;
  background: #ECFDF5;
}

.stream-text {
  margin: 0;
  padding: 13px 16px;
  font-family: var(--font-family-mono);
  font-size: 11px;
  line-height: 1.75;
  color: #475569;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 130px;
  overflow-y: auto;
  background: #FAFAF9;
}

.stream-text::-webkit-scrollbar { width: 3px; }
.stream-text::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 2px; }

.stream-text--think {
  color: #64748B;
}
</style>
