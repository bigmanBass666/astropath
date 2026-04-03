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
import { hasReasoningContent, hasMainContent, getReasoningContent, getMainContent } from '@/utils/streamParser'

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
  background: var(--color-slate-50);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-bottom: var(--space-5);
  text-align: center;
  border: 1px solid var(--color-border-light);
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

.section-icon.success { background: var(--color-success); color: white; }
.section-icon.warning { background: var(--color-warning); color: white; }
.section-icon.info { background: var(--color-info); color: white; }

.analysis-list {
  margin: 0;
  padding-left: var(--space-6);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.analysis-list li { margin-bottom: var(--space-2); }

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
  border-color: var(--color-solid);
  box-shadow: var(--shadow-md), 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.follow-up-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-full);
  box-shadow: none;
  background: transparent;
}

.follow-up-input :deep(.el-input-group__append) {
  border-radius: var(--radius-full);
  background: var(--color-solid);
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
  transform: translateY(-1px);
}

.follow-up-response {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: var(--color-slate-50);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--color-solid);
}

.response-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  color: var(--color-slate-600);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.response-text {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}

/* ====== 加载状态 ====== */
.analysis-loading {
  min-height: 300px;
}

/* ====== 流式输出样式 ====== */
.streaming-content {
  margin-top: var(--space-4);
}

.streaming-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-3);
}

.stream-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.streaming-text {
  max-height: 200px;
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
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--color-slate-700);
}

.streaming-text::-webkit-scrollbar { width: 4px; }
.streaming-text::-webkit-scrollbar-thumb { background: var(--color-slate-300); border-radius: 2px; }

/* 思考过程 — 用 info 色系区分 */
.reasoning-section { margin-bottom: var(--space-4); }

.reasoning-label { color: var(--color-info); }

.reasoning-text {
  background: var(--color-info-bg);
  border-color: var(--color-info-light);
}

/* 正式输出 — 用 success 色系区分 */
.main-content-section { margin-top: 0; }

.main-content-section.has-reasoning {
  border-top: 1px dashed var(--color-border-light);
  padding-top: var(--space-4);
  margin-top: var(--space-4);
}

.main-label { color: var(--color-success); }

.main-text {
  background: var(--color-success-bg);
  border-color: var(--color-success-light);
}

/* ====== 骨架屏 (无动画，静态占位) ====== */
.skeleton-loading { padding: var(--space-4); }

.skeleton-section {
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  background: var(--color-background-alt);
  border: 1px solid var(--color-border-light);
}

.skeleton-section-title {
  height: 20px;
  width: 80px;
  margin-bottom: var(--space-3);
  background: var(--color-slate-200);
  border-radius: var(--radius-sm);
}

.skeleton-line {
  height: 14px;
  background: var(--color-slate-200);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
}

.skeleton-line.short { width: 60%; }
</style>
