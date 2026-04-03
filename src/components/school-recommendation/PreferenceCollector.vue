<template>
  <div class="preference-collector">
    <div class="ai-avatar-section">
      <div class="ai-avatar">
        <el-icon :size="48">
          <ChatDotRound />
        </el-icon>
      </div>
      <div class="ai-welcome">
        <h3>🤖 AI选校助手</h3>
        <p class="ai-greeting">
          你好！我是你的专属选校顾问。
        </p>
      </div>
    </div>

    <div
      v-if="assessment"
      class="background-summary"
    >
      <p class="summary-text">
        我已经了解了你的背景：
      </p>
      <div class="summary-tags">
        <el-tag type="primary">
          GPA: {{ assessment.basic?.gpa || 'N/A' }}
        </el-tag>
        <el-tag type="success">
          {{ getUniversityLabel(assessment.basic?.university) }}
        </el-tag>
        <el-tag type="warning">
          均分: {{ assessment.academic?.averageScore || 'N/A' }}
        </el-tag>
        <el-tag type="info">
          {{ assessment.academic?.degree || '本科' }}
        </el-tag>
      </div>
    </div>

    <div class="preference-form">
      <p class="form-intro">
        为了给你最合适的推荐，请告诉我：
      </p>

      <!-- 问题1: 最看重什么 -->
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
            <el-icon :size="16">
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

      <!-- 问题2: 想避开的国家 -->
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
          >
            无
          </el-check-tag>
          <el-check-tag
            v-for="country in availableCountries"
            :key="country"
            :checked="excludedCountries.includes(country)"
            class="country-tag"
            :class="{ 'is-checked': excludedCountries.includes(country) }"
            @change="toggleCountry(country)"
          >
            {{ country }}
          </el-check-tag>
        </div>
      </div>

      <!-- 问题3: 特殊要求 -->
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
      <el-button
        type="primary"
        size="large"
        :loading="loading"
        :disabled="selectedPriorities.length === 0"
        class="submit-btn"
        @click="submitPreferences"
      >
        <el-icon><MagicStick /></el-icon>
        开始智能推荐
      </el-button>
      
      <div
        v-if="loading"
        class="progress-indicator"
      >
        <div class="progress-bar-container">
          <el-progress
            :percentage="stepProgress"
            :stroke-width="8"
            :show-text="false"
            class="progress-bar"
          />
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
              <el-icon v-if="getStepIndex(stepInfo.step) < getStepIndex(currentStep)">
                <CircleCheck />
              </el-icon>
              <el-icon
                v-else-if="currentStep === stepInfo.step"
                class="is-loading"
              >
                <Loading />
              </el-icon>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ stepInfo.label }}</span>
          </div>
        </div>
        <p class="progress-text">
          {{ stepLabels[currentStep as RecommendationStep] }}
        </p>
        
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
              <el-icon class="streaming-icon">
                <Loading />
              </el-icon>
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
              <el-icon><Document /></el-icon>
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

// 检查是否有思考过程内容
const hasReasoningContent = (content: string): boolean => {
  if (!content) return false
  const separatorIndex = content.indexOf('\n\n---\n\n')
  if (separatorIndex === -1) return false
  return separatorIndex > 0
}

// 检查是否有正式输出内容
const hasMainContent = (content: string): boolean => {
  if (!content) return false
  const separatorIndex = content.indexOf('\n\n---\n\n')
  if (separatorIndex === -1) return true // 没有分隔符，全部视为正式内容
  return separatorIndex < content.length - 8 // 分隔符后面还有内容
}

// 获取思考过程内容
const getReasoningContent = (content: string): string => {
  if (!content) return ''
  const separatorIndex = content.indexOf('\n\n---\n\n')
  if (separatorIndex === -1) return ''
  return content.slice(0, separatorIndex).trim()
}

// 获取正式输出内容
const getMainContent = (content: string): string => {
  if (!content) return ''
  const separatorIndex = content.indexOf('\n\n---\n\n')
  if (separatorIndex === -1) return content // 没有分隔符，返回全部
  return content.slice(separatorIndex + 8).trim() // 8是 '\n\n---\n\n' 的长度
}

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
  padding: 30px;
}

.ai-avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e8e8e8;
}

.ai-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--color-solid);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 25px rgba(30, 58, 95, 0.3);
}

.ai-welcome h3 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #1a1a2e;
}

.ai-greeting {
  margin: 0;
  color: #666;
  font-size: 15px;
}

.background-summary {
  background: var(--color-slate-50);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid var(--color-slate-100);
}

.summary-text {
  margin: 0 0 12px 0;
  color: var(--color-slate-700);
  font-weight: 500;
}

.summary-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preference-form {
  margin-bottom: 30px;
}

.form-intro {
  font-size: 16px;
  color: #333;
  margin-bottom: 25px;
  font-weight: 500;
}

.form-item {
  margin-bottom: 28px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 14px;
}

.question-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-solid);
  color: white;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
}

.multi-hint,
.optional-hint {
  font-size: 13px;
  color: #999;
  font-weight: normal;
}

.priority-options,
.country-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.priority-tag,
.country-tag {
  padding: 10px 18px;
  font-size: 14px;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  background: white;
}

.priority-tag:hover,
.country-tag:hover {
  border-color: var(--color-slate-700);
  color: var(--color-slate-700);
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
  border-radius: 10px;
  resize: none;
}

.form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  gap: 20px;
}

.submit-btn {
  padding: 14px 40px;
  font-size: 16px;
  border-radius: 25px;
  background: var(--color-solid);
  border: none;
  box-shadow: 0 8px 25px rgba(30, 58, 95, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(30, 58, 95, 0.4);
}

.submit-btn .el-icon {
  margin-right: 8px;
}

.progress-indicator {
  width: 100%;
  max-width: 500px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.progress-bar-container {
  margin-bottom: 20px;
}

.progress-bar :deep(.el-progress-bar__outer) {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.progress-bar :deep(.el-progress-bar__inner) {
  background: var(--color-solid);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.progress-step.is-active {
  opacity: 1;
}

.progress-step.is-completed {
  opacity: 0.8;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.3s ease;
}

.progress-step.is-active .step-icon {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
}

.progress-step.is-completed .step-icon {
  background: #10b981;
  color: white;
}

.step-icon .is-loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.step-label {
  font-size: 12px;
  color: #64748b;
  text-align: center;
  max-width: 80px;
}

.progress-step.is-active .step-label {
  color: var(--color-slate-700);
  font-weight: 600;
}

.progress-text {
  text-align: center;
  margin: 0;
  font-size: 15px;
  color: var(--color-slate-700);
  font-weight: 500;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 流式输出样式 */
.streaming-content {
  margin-top: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.streaming-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-slate-700);
  font-weight: 500;
  margin-bottom: 12px;
}

.streaming-icon {
  animation: spin 1s linear infinite;
}

.streaming-text {
  max-height: 120px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}

.streaming-text pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-all;
}

.streaming-text::-webkit-scrollbar {
  width: 4px;
}

.streaming-text::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

/* 思考过程样式 */
.reasoning-section {
  margin-bottom: 16px;
}

.reasoning-label {
  color: #8b5cf6;
}

.reasoning-text {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-color: #d8b4fe;
}

.reasoning-text pre {
  color: #6b21a8;
}

/* 正式输出样式 */
.main-content-section {
  margin-top: 16px;
}

.main-content-section.has-reasoning {
  border-top: 1px dashed #cbd5e1;
  padding-top: 16px;
}

.main-label {
  color: #059669;
}

.main-text {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
}

.main-text pre {
  color: #166534;
}
</style>
