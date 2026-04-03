<template>
  <div class="preference-collector">
    <div class="ai-avatar-section">
      <div class="ai-avatar">
        <el-icon :size="40">
          <ChatDotRound />
        </el-icon>
      </div>
      <div class="ai-welcome">
        <h3>AI 选校助手</h3>
        <p class="ai-greeting">你好！我是你的专属选校顾问。</p>
      </div>
    </div>

    <div
      v-if="assessment"
      class="background-summary"
    >
      <p class="summary-text">我已经了解了你的背景：</p>
      <div class="summary-tags">
        <span class="summary-tag tag-primary">GPA: {{ assessment.basic?.gpa || 'N/A' }}</span>
        <span class="summary-tag tag-success">{{ getUniversityLabel(assessment.basic?.university) }}</span>
        <span class="summary-tag tag-warning">均分: {{ assessment.academic?.averageScore || 'N/A' }}</span>
        <span class="summary-tag tag-info">{{ assessment.academic?.degree || '本科' }}</span>
      </div>
    </div>

    <div class="preference-form">
      <p class="form-intro">为了给你最合适的推荐，请告诉我：</p>

      <!-- 问题1 -->
      <div class="form-item">
        <label class="form-label">
          <span class="question-number">①</span>
          你目前最看重什么？<span class="multi-hint">（可多选）</span>
        </label>
        <div class="priority-options">
          <el-check-tag
            v-for="option in priorityOptions"
            :key="option.value"
            :checked="selectedPriorities.includes(option.value)"
            class="priority-tag"
            :class="{ 'is-checked': selectedPriorities.includes(option.value) }"
            @change="togglePriority(option.value)"
          >
            <el-icon :size="14">
              <Trophy v-if="option.icon === 'Trophy'" />
              <Reading v-else-if="option.icon === 'Reading'" />
              <Briefcase v-else-if="option.icon === 'Briefcase'" />
              <MapLocation v-else-if="option.icon === 'MapLocation'" />
              <Money v-else-if="option.icon === 'Money'" />
            </el-icon>
            {{ option.label }}
          </el-check-tag>
        </div>
      </div>

      <!-- 问题2 -->
      <div class="form-item">
        <label class="form-label">
          <span class="question-number">②</span>
          有想避开的国家/地区吗？
        </label>
        <div class="country-options">
          <el-check-tag
            :checked="excludedCountries.length === 0"
            class="country-tag"
            :class="{ 'is-checked': excludedCountries.length === 0 }"
            @change="clearExcludedCountries"
          >无</el-check-tag>
          <el-check-tag
            v-for="country in availableCountries"
            :key="country"
            :checked="excludedCountries.includes(country)"
            class="country-tag"
            :class="{ 'is-checked': excludedCountries.includes(country) }"
            @change="toggleCountry(country)"
          >{{ country }}</el-check-tag>
        </div>
      </div>

      <!-- 问题3 -->
      <div class="form-item">
        <label class="form-label">
          <span class="question-number">③</span>
          还有什么特别的要求吗？<span class="optional-hint">（选填）</span>
        </label>
        <el-input
          v-model="specialRequirements"
          type="textarea"
          :rows="3"
          placeholder="例如：我想去加州的学校、希望学费在3万美元以内、偏好小班教学..."
          class="special-input"
        />
      </div>
    </div>

    <div class="form-actions">
      <button
        class="submit-btn"
        :class="{ 'is-loading': loading }"
        :disabled="loading || selectedPriorities.length === 0"
        @click="submitPreferences"
      >
        <el-icon v-if="!loading" :size="18"><MagicStick /></el-icon>
        <el-icon v-else :size="18" class="spin"><Loading /></el-icon>
        {{ loading ? '生成中...' : '开始智能推荐' }}
      </button>

      <div
        v-if="loading"
        class="progress-indicator"
      >
        <div class="progress-bar-container">
          <div class="progress-bar-track">
            <div
              class="progress-bar-fill"
              :style="{ width: stepProgress + '%' }"
            />
          </div>
        </div>
        <div class="progress-steps">
          <div
            v-for="(stepInfo, index) in visibleSteps"
            :key="stepInfo.step"
            class="progress-step"
            :class="{
              'is-active': currentStep === stepInfo.step,
              'is-completed': getStepIndex(stepInfo.step) < getStepIndex(currentStep)
            }"
          >
            <div class="step-icon">
              <el-icon v-if="getStepIndex(stepInfo.step) < getStepIndex(currentStep)" :size="14"><CircleCheck /></el-icon>
              <el-icon
                v-else-if="currentStep === stepInfo.step"
                class="spin"
                :size="14"
              ><Loading /></el-icon>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ stepInfo.label }}</span>
          </div>
        </div>
        <p class="progress-text">{{ stepLabels[currentStep as RecommendationStep] }}</p>

        <!-- 流式输出显示区域 -->
        <div
          v-if="isStreaming && streamingContent"
          class="streaming-content"
        >
          <!-- 思考过程 -->
          <div
            v-if="hasReasoningContent(streamingContent)"
            class="reasoning-section"
          >
            <div class="streaming-label reasoning-label">
              <el-icon class="streaming-icon spin" :size="13"><Loading /></el-icon>
              AI思考过程
            </div>
            <div class="streaming-text reasoning-text">
              <pre>{{ getReasoningContent(streamingContent) }}</pre>
            </div>
          </div>

          <!-- 正式输出 -->
          <div
            v-if="hasMainContent(streamingContent)"
            class="main-content-section"
            :class="{ 'has-reasoning': hasReasoningContent(streamingContent) }"
          >
            <div class="streaming-label main-label">
              <el-icon :size="13"><Document /></el-icon>
              生成结果
            </div>
            <div class="streaming-text main-text">
              <pre>{{ getMainContent(streamingContent) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChatDotRound, MagicStick, Trophy, Briefcase, MapLocation, Money, Reading, Loading, CircleCheck, Document } from '@element-plus/icons-vue'
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
  { value: 'ranking', label: '学校排名', icon: 'Trophy' },
  { value: 'major', label: '专业实力', icon: 'Reading' },
  { value: 'career', label: '就业前景', icon: 'Briefcase' },
  { value: 'location', label: '地理位置', icon: 'MapLocation' },
  { value: 'cost', label: '学费预算', icon: 'Money' }
]

const availableCountries = ['美国', '英国', '澳洲', '加拿大', '新加坡', '中国香港', '日本', '韩国', '欧洲其他']

const selectedPriorities = ref([])
const excludedCountries = ref([])
const specialRequirements = ref('')

const getUniversityLabel = (university) => {
  const map = {
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

const togglePriority = (value) => {
  const index = selectedPriorities.value.indexOf(value)
  if (index > -1) {
    selectedPriorities.value.splice(index, 1)
  } else {
    selectedPriorities.value.push(value)
  }
}

const toggleCountry = (country) => {
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
</script>

<style scoped>
.preference-collector {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-8);
}

/* ====== 头部 ====== */
.ai-avatar-section {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
}

.ai-avatar {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  background: var(--color-solid);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-md);
}

.ai-welcome h3 {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.ai-greeting {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
}

/* ====== 背景摘要 ====== */
.background-summary {
  background: var(--color-slate-50);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  border: 1px solid var(--color-border-light);
}

.summary-text {
  margin: 0 0 var(--space-4) 0;
  color: var(--color-slate-700);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
}

.summary-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.summary-tag {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: 0.25px;
}

.tag-primary { background: var(--color-solid); color: white; }
.tag-success { background: var(--color-success); color: white; }
.tag-warning { background: var(--color-accent); color: white; }
.tag-info { background: var(--color-slate-500); color: white; }

/* ====== 表单区域 ====== */
.preference-form {
  margin-bottom: var(--space-8);
}

.form-intro {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
  font-weight: var(--font-medium);
}

.form-item {
  margin-bottom: var(--space-7);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}

.question-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-solid);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  flex-shrink: 0;
}

.multi-hint,
.optional-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: var(--font-normal);
}

.priority-options,
.country-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.priority-tag,
.country-tag {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
}

.priority-tag:hover,
.country-tag:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

.priority-tag.is-checked,
.country-tag.is-checked {
  background: var(--color-solid);
  border-color: transparent;
  color: white;
}

.priority-tag .el-icon {
  margin-right: 6px;
  vertical-align: middle;
}

.special-input :deep(.el-textarea__inner) {
  border-radius: var(--radius-lg);
  resize: none;
  border-color: var(--color-border);
  font-family: var(--font-family-base);
}

.special-input :deep(.el-textarea__inner:focus) {
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

/* ====== 操作区 ====== */
.form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--space-4);
  gap: var(--space-6);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-10);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-lg);
  border: none;
  min-height: 48px;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-solid);
  color: white;
  box-shadow: var(--shadow-md);
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== 进度指示器 ====== */
.progress-indicator {
  width: 100%;
  max-width: 520px;
  padding: var(--space-6);
  background: var(--color-background-alt);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
}

.progress-bar-container {
  margin-bottom: var(--space-5);
}

.progress-bar-track {
  height: 8px;
  background: var(--color-slate-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-solid);
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  opacity: 0.45;
  transition: all var(--transition-fast);
}

.progress-step.is-active {
  opacity: 1;
}

.progress-step.is-completed {
  opacity: 0.75;
}

.step-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-slate-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-slate-500);
  transition: all var(--transition-fast);
}

.progress-step.is-active .step-icon {
  background: var(--color-solid);
  color: white;
  box-shadow: var(--shadow-sm);
}

.progress-step.is-completed .step-icon {
  background: var(--color-success);
  color: white;
}

.step-label {
  font-size: var(--text-xs);
  color: var(--color-slate-500);
  text-align: center;
  max-width: 72px;
  line-height: var(--leading-normal);
}

.progress-step.is-active .step-label {
  color: var(--color-solid);
  font-weight: var(--font-semibold);
}

.progress-text {
  text-align: center;
  margin: 0;
  font-size: var(--text-base);
  color: var(--color-slate-700);
  font-weight: var(--font-medium);
}

/* ====== 流式输出样式 ====== */
.streaming-content {
  margin-top: var(--space-5);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.streaming-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-3);
  color: var(--color-slate-600);
}

.streaming-icon {
  color: var(--color-slate-500);
}

.streaming-text {
  max-height: 140px;
  overflow-y: auto;
  background: var(--color-background-alt);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
}

.streaming-text pre {
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: var(--text-xs);
  line-height: var(--leading-relaxed);
  color: var(--color-slate-700);
  white-space: pre-wrap;
  word-break: break-all;
}

.streaming-text::-webkit-scrollbar {
  width: 4px;
}

.streaming-text::-webkit-scrollbar-thumb {
  background: var(--color-slate-300);
  border-radius: 2px;
}

/* 思考过程 — 用 info 色系区分 */
.reasoning-section {
  margin-bottom: var(--space-4);
}

.reasoning-label {
  color: var(--color-info);
}

.reasoning-text {
  border-color: var(--color-info-light);
}

.reasoning-text pre {
  color: var(--color-slate-700);
}

/* 正式输出 — 用 success 色系区分 */
.main-content-section {
  margin-top: 0;
}

.main-content-section.has-reasoning {
  border-top: 1px dashed var(--color-border-light);
  padding-top: var(--space-4);
  margin-top: var(--space-4);
}

.main-label {
  color: var(--color-success);
}

.main-text {
  border-color: var(--color-success-light);
}

.main-text pre {
  color: var(--color-slate-800);
}
</style>
