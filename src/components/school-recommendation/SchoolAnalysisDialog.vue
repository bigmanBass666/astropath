<template>
  <el-dialog
    v-model="visible"
    title="AI 深度分析"
    width="650px"
    :close-on-click-modal="false"
    class="analysis-dialog"
  >
    <div
      v-if="school && analysis && !analysisLoading"
      class="analysis-content"
    >
      <!-- 学校头部信息 -->
      <div class="school-header">
        <h3 class="school-name">
          {{ school.name }}
        </h3>
        <div class="school-tags">
          <el-tag>{{ school.country }}</el-tag>
          <el-tag type="info">
            {{ school.ranking }}
          </el-tag>
          <el-tag type="success">
            录取率 {{ school.acceptanceRate }}
          </el-tag>
        </div>
      </div>

      <!-- 匹配度评估 -->
      <div class="match-assessment">
        <div class="assessment-header">
          <span class="assessment-label">录取概率评估</span>
          <span
            class="assessment-value"
            :style="{ color: getProbabilityColor(analysis.admissionProbability) }"
          >
            {{ analysis.admissionProbability }}
          </span>
        </div>
      </div>

      <!-- 匹配点 -->
      <div
        v-if="analysis.matchPoints.length > 0"
        class="analysis-section match"
      >
        <div class="section-header">
          <div class="section-icon success">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <span>匹配点</span>
        </div>
        <ul class="analysis-list">
          <li
            v-for="(point, index) in analysis.matchPoints"
            :key="index"
          >
            {{ point }}
          </li>
        </ul>
      </div>

      <!-- 风险提示 -->
      <div
        v-if="analysis.risks.length > 0"
        class="analysis-section risk"
      >
        <div class="section-header">
          <div class="section-icon warning">
            <el-icon><Warning /></el-icon>
          </div>
          <span>风险提示</span>
        </div>
        <ul class="analysis-list warning">
          <li
            v-for="(risk, index) in analysis.risks"
            :key="index"
          >
            {{ risk }}
          </li>
        </ul>
      </div>

      <!-- 申请建议 -->
      <div
        v-if="analysis.suggestions.length > 0"
        class="analysis-section suggestion"
      >
        <div class="section-header">
          <div class="section-icon info">
            <el-icon><InfoFilled /></el-icon>
          </div>
          <span>申请建议</span>
        </div>
        <ul class="analysis-list">
          <li
            v-for="(suggestion, index) in analysis.suggestions"
            :key="index"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>

      <!-- 追问输入 -->
      <div class="follow-up-section">
        <div
          class="input-box"
          :class="{ 'is-focused': isInputFocused }"
        >
          <el-input
            v-model="followUpQuestion"
            placeholder="还有疑问？继续追问AI..."
            class="follow-up-input"
            @keyup.enter="submitFollowUp"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
          >
            <template #append>
              <el-button
                :icon="Position"
                class="send-btn"
                @click="submitFollowUp"
              />
            </template>
          </el-input>
        </div>
      </div>

      <!-- 追问回复 -->
      <div
        v-if="followUpResponse"
        class="follow-up-response"
      >
        <div class="response-header">
          <el-icon><ChatDotRound /></el-icon>
          <span>AI回复</span>
        </div>
        <p class="response-text">
          {{ followUpResponse }}
        </p>
      </div>
    </div>

    <!-- 加载状态 - 包含流式输出 -->
    <div
      v-else-if="analysisLoading || isStreaming"
      class="analysis-loading"
    >
      <!-- 学校头部骨架 -->
      <div class="school-header">
        <h3 class="school-name">
          {{ school?.name || '正在分析...' }}
        </h3>
        <div
          v-if="school"
          class="school-tags"
        >
          <el-tag>{{ school.country }}</el-tag>
          <el-tag type="info">
            {{ school.ranking }}
          </el-tag>
          <el-tag type="success">
            录取率 {{ school.acceptanceRate }}
          </el-tag>
        </div>
      </div>

      <!-- 流式输出显示区域 -->
      <div
        v-if="streamingContent"
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

      <!-- 骨架屏 - 当还没有流式内容时显示 -->
      <div
        v-else
        class="skeleton-loading"
      >
        <div class="skeleton-section">
          <div class="skeleton-section-title" />
          <div class="skeleton-line" />
          <div class="skeleton-line" />
          <div class="skeleton-line short" />
        </div>
        <div class="skeleton-section">
          <div class="skeleton-section-title" />
          <div class="skeleton-line" />
          <div class="skeleton-line" />
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">
        关闭
      </el-button>
      <el-button
        v-if="!analysisLoading && !isStreaming"
        type="primary"
        @click="viewSchoolDetail"
      >
        <el-icon><View /></el-icon>
        查看学校详情
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { CircleCheck, Warning, InfoFilled, Position, ChatDotRound, View, Loading, Document } from '@element-plus/icons-vue'
import { schoolsData } from '@/utils/recommendationEngine'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  recommendation: {
    type: Object,
    default: null
  },
  analysis: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
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

const emit = defineEmits(['update:modelValue', 'view-detail', 'follow-up'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const followUpQuestion = ref('')
const followUpResponse = ref('')
const isInputFocused = ref(false)

const school = computed(() => {
  if (!props.recommendation) return null
  return schoolsData.find(s => s.id === props.recommendation.schoolId)
})

// 检查是否有思考过程内容
const hasReasoningContent = (content) => {
  if (!content) return false
  const separatorIndex = content.indexOf('\n\n---\n\n')
  if (separatorIndex === -1) return false
  return separatorIndex > 0
}

// 检查是否有正式输出内容
const hasMainContent = (content) => {
  if (!content) return false
  const separatorIndex = content.indexOf('\n\n---\n\n')
  if (separatorIndex === -1) return true
  return separatorIndex < content.length - 8
}

// 获取思考过程内容
const getReasoningContent = (content) => {
  if (!content) return ''
  const separatorIndex = content.indexOf('\n\n---\n\n')
  if (separatorIndex === -1) return ''
  return content.slice(0, separatorIndex).trim()
}

// 获取正式输出内容
const getMainContent = (content) => {
  if (!content) return ''
  const separatorIndex = content.indexOf('\n\n---\n\n')
  if (separatorIndex === -1) return content
  return content.slice(separatorIndex + 8).trim()
}

const getProbabilityColor = (probability) => {
  if (probability.includes('高') || probability.includes('90') || probability.includes('80')) {
    return 'var(--color-success)'
  }
  if (probability.includes('中') || probability.includes('70') || probability.includes('60')) {
    return 'var(--color-warning)'
  }
  return 'var(--color-danger)'
}

const submitFollowUp = () => {
  if (!followUpQuestion.value.trim()) return
  // 模拟AI回复
  followUpResponse.value = `关于"${followUpQuestion.value}"，这是一个很好的问题。基于你的背景和这所学校的要求，我建议你重点关注申请文书的准备，突出你的科研经历和学术潜力。`
  followUpQuestion.value = ''
}

const viewSchoolDetail = () => {
  if (school.value) {
    emit('view-detail', school.value.id)
    visible.value = false
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    followUpQuestion.value = ''
    followUpResponse.value = ''
  }
})
</script>

<style scoped>
.analysis-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-3);
}

.analysis-content {
  max-height: 60vh;
  overflow-y: auto;
}

.school-header {
  text-align: center;
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-5);
}

.school-name {
  margin: 0 0 var(--space-3) 0;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.school-tags {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
}

.match-assessment {
  background: var(--color-primary-50);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-bottom: var(--space-5);
  text-align: center;
  border: 1px solid var(--color-primary-100);
}

.assessment-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-3);
}

.assessment-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.assessment-value {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.analysis-section {
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.analysis-section.match {
  background: var(--color-success-bg);
  border-color: var(--color-success-light);
}

.analysis-section.risk {
  background: var(--color-warning-bg);
  border-color: var(--color-warning-light);
}

.analysis-section.suggestion {
  background: var(--color-info-bg);
  border-color: var(--color-info-light);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.section-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon.success {
  background: var(--color-success);
  color: white;
}

.section-icon.warning {
  background: var(--color-warning);
  color: white;
}

.section-icon.info {
  background: var(--color-info);
  color: white;
}

.analysis-list {
  margin: 0;
  padding-left: var(--space-6);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.analysis-list li {
  margin-bottom: var(--space-2);
}

.analysis-list.warning li {
  color: var(--color-warning-dark);
}

.follow-up-section {
  margin-top: var(--space-6);
  padding-top: var(--space-5);
  border-top: 1px solid var(--color-border);
}

.input-box {
  background: var(--color-surface);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  padding: 4px;
}

.input-box.is-focused {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md), 0 0 0 3px var(--color-primary-100);
}

.follow-up-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-full);
  box-shadow: none;
  background: transparent;
}

.follow-up-input :deep(.el-input-group__append) {
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  border-color: transparent;
  margin-left: var(--space-1);
}

.follow-up-input :deep(.el-input-group__append .el-button) {
  color: white;
  border: none;
  background: transparent;
  transition: transform var(--transition-fast);
}

.follow-up-input :deep(.el-input-group__append .el-button:hover) {
  transform: scale(1.1);
}

.follow-up-response {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: var(--color-primary-50);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--color-primary);
}

.response-header {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.response-text {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}

/* 加载状态样式 */
.analysis-loading {
  min-height: 300px;
}

/* 流式输出样式 */
.streaming-content {
  margin-top: var(--space-4);
}

.streaming-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
}

.streaming-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.streaming-text {
  max-height: 200px;
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

/* 骨架屏样式 */
.skeleton-loading {
  padding: var(--space-4);
}

.skeleton-section {
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  background: var(--color-background);
  border: 1px solid var(--color-border);
}

.skeleton-section-title {
  height: 20px;
  width: 80px;
  margin-bottom: var(--space-3);
  background: linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border) 50%, var(--color-border-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border) 50%, var(--color-border-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
}

.skeleton-line.short {
  width: 60%;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
