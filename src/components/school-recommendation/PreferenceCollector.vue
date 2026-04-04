<template>
  <div class="pref-modern">
    <div
      ref="headerEl"
      class="pref-header reveal-up"
    >
      <div class="pref-avatar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div>
        <h3 class="pref-greeting">AI 选校助手</h3>
        <p class="pref-desc">你好！我是你的专属选校顾问。</p>
      </div>
    </div>

    <div
      v-if="assessment"
      ref="summaryEl"
      class="pref-summary reveal-up"
    >
      <span class="summary-label">已了解你的背景</span>
      <div class="summary-chips">
        <span class="chip chip--solid">{{ assessment.basic?.gpa || 'N/A' }} GPA</span>
        <span class="chip chip--accent">{{ getUniversityLabel(assessment.basic?.university) }}</span>
        <span class="chip">{{ assessment.academic?.averageScore || 'N/A' }} 均分</span>
        <span class="chip">{{ assessment.academic?.degree || '本科' }}</span>
      </div>
    </div>

    <div class="pref-form">
      <p ref="introEl" class="form-intro reveal-up">为了给你最合适的推荐，请告诉我：</p>

      <div
        ref="card1El"
        class="step-card reveal-up"
        :class="{ 'step-card--focus': currentFocus === 1 }"
      >
        <div class="step-indicator">
          <div class="step-num">1</div>
          <div class="step-line" />
        </div>
        <div class="step-body">
          <label class="step-label">
            你目前最看重什么？
            <span class="label-hint">可多选</span>
          </label>
          <div class="option-grid">
            <button
              v-for="opt in priorityOptions"
              :key="opt.value"
              class="option-pill"
              :class="{ 'option-pill--active': selectedPriorities.includes(opt.value) }"
              @click="togglePriority(opt.value)"
            >
              <span class="pill-icon">{{ getIcon(opt.icon) }}</span>
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <div
        ref="card2El"
        class="step-card reveal-up"
        :class="{ 'step-card--focus': currentFocus === 2 }"
      >
        <div class="step-indicator">
          <div class="step-num">2</div>
          <div class="step-line" />
        </div>
        <div class="step-body">
          <label class="step-label">
            有想避开的国家/地区吗？
          </label>
          <div class="country-grid">
            <button
              :class="['country-pill', { 'country-pill--active': excludedCountries.length === 0 }]"
              @click="clearExcludedCountries"
            >
              无限制
            </button>
            <button
              v-for="c in availableCountries"
              :key="c"
              :class="['country-pill', { 'country-pill--active': excludedCountries.includes(c) }]"
              @click="toggleCountry(c)"
            >
              {{ c }}
            </button>
          </div>
        </div>
      </div>

      <div
        ref="card3El"
        class="step-card reveal-up"
        :class="{ 'step-card--focus': currentFocus === 3 }"
      >
        <div class="step-indicator">
          <div class="step-num">3</div>
        </div>
        <div class="step-body">
          <label class="step-label">
            还有什么特别的要求？
            <span class="label-hint label-hint--muted">选填</span>
          </label>
          <el-input
            v-model="specialRequirements"
            type="textarea"
            :rows="3"
            placeholder="例如：我想去加州的学校、希望学费在3万美元以内..."
            class="modern-textarea"
            @focus="currentFocus = 3"
            @blur="currentFocus = -1"
          />
        </div>
      </div>
    </div>

    <div
      ref="actionsEl"
      class="pref-actions reveal-up"
    >
      <button
        class="submit-main"
        :class="{ 'submit-main--loading': loading, 'submit-main--ready': !loading && selectedPriorities.length > 0 }"
        :disabled="loading || selectedPriorities.length === 0"
        @click="submitPreferences"
      >
        <span v-if="!loading" class="submit-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </span>
        <span v-else class="spin-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </span>
        {{ loading ? '生成中...' : '开始智能推荐' }}
      </button>

      <div
        v-if="loading"
        class="progress-panel"
      >
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: stepProgress + '%' }"
          />
        </div>
        <div class="steps-row">
          <div
            v-for="(si, idx) in visibleSteps"
            :key="si.step"
            class="step-dot-item"
            :class="{
              'step-dot-item--active': currentStep === si.step,
              'step-dot-item--done': getStepIndex(si.step) < getStepIndex(currentStep)
            }"
          >
            <div class="dot-circle">
              <svg
                v-if="getStepIndex(si.step) < getStepIndex(currentStep)"
                width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              ><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span class="dot-label">{{ si.label }}</span>
          </div>
        </div>
        <p class="progress-msg">{{ stepLabels[currentStep as RecommendationStep] }}</p>

        <div
          v-if="isStreaming && streamingContent"
          class="stream-panel"
        >
          <div
            v-if="hasReasoningContent(streamingContent)"
            class="stream-block"
          >
            <div class="stream-head stream-head--think">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon-mini"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              AI思考过程
            </div>
            <pre class="stream-body stream-body--think">{{ getReasoningContent(streamingContent) }}</pre>
          </div>
          <div
            v-if="hasMainContent(streamingContent)"
            class="stream-block"
            :class="{ 'stream-block--bordered': hasReasoningContent(streamingContent) }"
          >
            <div class="stream-head stream-head--result">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              生成结果
            </div>
            <pre class="stream-body">{{ getMainContent(streamingContent) }}</pre>
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
.pref-modern {
  max-width: 680px;
  margin: 0 auto;
}

/* ====== Header ====== */
.pref-header {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
}

.pref-avatar {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-xl);
  background: var(--color-solid);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.pref-greeting {
  margin: 0 0 2px 0;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  letter-spacing: -0.3px;
}

.pref-desc {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* ====== Summary ====== */
.pref-summary {
  background: linear-gradient(135deg, var(--color-slate-50) 0%, rgba(248,250,252,0.6) 100%);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-2xl);
  padding: var(--space-5) var(--space-6);
  margin-bottom: var(--space-8);
  position: relative;
  overflow: hidden;
}

.pref-summary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-accent), transparent);
  border-radius: 0 2px 2px 0;
}

.summary-label {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-slate-500);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  display: block;
  margin-bottom: var(--space-3);
}

.summary-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.chip {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: var(--color-slate-100);
  color: var(--color-slate-600);
  letter-spacing: 0.15px;
}

.chip--solid {
  background: var(--color-solid);
  color: white;
}

.chip--accent {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

/* ====== Form ====== */
.pref-form {
  margin-bottom: var(--space-8);
}

.form-intro {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6) 0;
  letter-spacing: -0.15px;
}

/* ====== Step Card ====== */
.step-card {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-6);
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-4);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.step-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-slate-200);
  transition: background 0.35s ease;
  border-radius: 0 2px 2px 0;
}

.step-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 100% 0%, rgba(15,23,42,0.015) 0%, transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.step-card--focus::before {
  background: var(--color-solid);
}

.step-card--focus {
  border-color: rgba(15, 23, 42, 0.12);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
}

.step-card--focus::after {
  opacity: 1;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 2px;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-slate-100);
  color: var(--color-slate-500);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-card--focus .step-num {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
}

.step-line {
  width: 1px;
  flex: 1;
  min-height: 16px;
  background: var(--color-border-light);
  margin-top: var(--space-2);
}

.step-body {
  flex: 1;
  min-width: 0;
}

.step-label {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.label-hint {
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
  padding: 1px 8px;
  border-radius: var(--radius-sm);
}

.label-hint--muted {
  color: var(--color-text-muted);
  background: var(--color-slate-100);
}

/* ====== Option Grid ====== */
.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.option-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: white;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.option-pill:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

.option-pill--active {
  background: var(--color-solid);
  border-color: var(--color-solid);
  color: white;
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
}

.pill-icon {
  font-size: 14px;
  line-height: 1;
}

/* ====== Country Grid ====== */
.country-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.country-pill {
  padding: 6px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: white;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.country-pill:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

.country-pill--active {
  background: var(--color-solid);
  border-color: var(--color-solid);
  color: white;
}

/* ====== Textarea ====== */
.modern-textarea :deep(.el-textarea__inner) {
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-border);
  font-family: var(--font-family-base);
  font-size: var(--text-sm);
  resize: none;
  transition: all 0.25s ease;
}

.modern-textarea :deep(.el-textarea__inner:focus) {
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
}

/* ====== Actions ====== */
.pref-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.submit-main {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: 15px 40px;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 54px;
  letter-spacing: 0.2px;
}

.submit-main:not(:disabled) {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
}

.submit-main:not(:disabled).submit-main--ready:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.22);
}

.submit-main:not(:disabled)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.submit-main:not(:disabled).submit-main--ready:hover::after {
  opacity: 1;
}

.submit-main:disabled {
  background: var(--color-slate-100);
  color: var(--color-text-muted);
  cursor: not-allowed;
  box-shadow: none;
}

.submit-main:active:not(:disabled) {
  transform: scale(0.97);
}

.submit-main--loading {
  background: var(--color-solid);
  color: white;
}

.submit-icon-wrap {
  display: flex;
  align-items: center;
}

.spin-wrapper {
  display: flex;
  align-items: center;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

.spin-icon-mini {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== Progress Panel ====== */
.progress-panel {
  width: 100%;
  max-width: 520px;
  padding: var(--space-6);
  background: var(--color-background-alt);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border-light);
}

.progress-track {
  height: 5px;
  background: var(--color-slate-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-5);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-solid), var(--color-accent));
  border-radius: var(--radius-full);
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.steps-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.step-dot-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  opacity: 0.4;
  transition: opacity 0.25s ease;
}

.step-dot-item--active {
  opacity: 1;
}

.step-dot-item--done {
  opacity: 0.7;
}

.dot-circle {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-full);
  background: var(--color-slate-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: var(--font-bold);
  color: var(--color-slate-500);
  transition: all 0.25s ease;
}

.step-dot-item--active .dot-circle {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
}

.step-dot-item--done .dot-circle {
  background: var(--color-success);
  color: white;
}

.dot-label {
  font-size: 10px;
  color: var(--color-slate-500);
  text-align: center;
  max-width: 56px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-dot-item--active .dot-label {
  color: var(--color-solid);
  font-weight: var(--font-semibold);
}

.progress-msg {
  text-align: center;
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-slate-600);
  font-weight: var(--font-medium);
}

/* ====== Stream Panel ====== */
.stream-panel {
  margin-top: var(--space-4);
}

.stream-block {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.stream-block--bordered {
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: -1px;
}

.stream-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.2px;
}

.stream-head--think {
  color: var(--color-info);
  background: var(--color-info-bg);
}

.stream-head--result {
  color: var(--color-success);
  background: var(--color-success-bg);
}

.stream-body {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-family-mono);
  font-size: var(--text-xs);
  line-height: var(--leading-relaxed);
  color: var(--color-slate-700);
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 120px;
  overflow-y: auto;
  background: var(--color-background-alt);
}

.stream-body::-webkit-scrollbar {
  width: 3px;
}

.stream-body::-webkit-scrollbar-thumb {
  background: var(--color-slate-300);
  border-radius: 2px;
}

.stream-body--think {
  color: var(--color-slate-600);
}
</style>
