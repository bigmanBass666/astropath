<template>
  <div class="ai-stream-display">
    <slot
      name="queue"
      :is-queued="isQueued"
      :queue-position="queuePosition"
    >
      <div
        v-if="isQueued"
        class="ai-stream-queue"
      >
        <span class="ai-stream-queue-text">排队中，前方还有 {{ queuePosition }} 个任务...</span>
      </div>
    </slot>

    <slot
      name="reasoning"
      :reasoning="reasoning"
      :show-reasoning="showReasoning"
      :is-thinking="isThinking"
      :has-content="hasContent"
      :toggle="toggleReasoning"
    >
      <div
        v-if="hasReasoning && showReasoning"
        class="ai-stream-reasoning"
        :class="{ 'ai-stream-reasoning--thinking': isThinking && !hasContent }"
      >
        <div
          class="ai-stream-reasoning-header"
          @click="toggleReasoning"
        >
          <span class="ai-stream-reasoning-title">
            {{ isThinking && !hasContent ? '正在思考...' : '思考过程' }}
          </span>
          <span class="ai-stream-reasoning-toggle">{{ isReasoningExpanded ? '收起' : '展开' }}</span>
        </div>
        <div
          v-show="isReasoningExpanded"
          class="ai-stream-reasoning-content"
        >
          {{ reasoning }}
        </div>
      </div>
    </slot>

    <slot
      name="content"
      :content="content"
      :is-streaming="isStreaming"
      :rendered-content="renderedContent"
    >
      <div
        v-if="hasContent"
        class="ai-stream-content"
      >
        <div
          class="ai-stream-content-text"
          v-html="renderedContent"
        />
        <span
          v-if="isStreaming"
          class="ai-stream-cursor"
        />
      </div>
    </slot>

    <slot
      name="error"
      :error="error"
      :can-retry="canRetry"
      :retry-count="retryCount"
      :max-retries="maxRetries"
      :retry="retry"
    >
      <div
        v-if="hasError"
        class="ai-stream-error"
      >
        <span class="ai-stream-error-text">{{ error }}</span>
        <button
          v-if="canRetry"
          class="ai-stream-retry-btn"
          @click="retry"
        >
          重试 ({{ retryCount }}/{{ maxRetries }})
        </button>
      </div>
    </slot>

    <slot
      name="placeholder"
      :is-thinking="isThinking"
    >
      <div
        v-if="isThinking && !hasReasoning && !hasContent"
        class="ai-stream-placeholder"
      >
        <span class="ai-stream-placeholder-text">AI 正在思考...</span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  reasoning: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  isStreaming: {
    type: Boolean,
    default: false
  },
  isThinking: {
    type: Boolean,
    default: false
  },
  isQueued: {
    type: Boolean,
    default: false
  },
  showReasoning: {
    type: Boolean,
    default: true
  },
  queuePosition: {
    type: Number,
    default: 0
  },
  canRetry: {
    type: Boolean,
    default: false
  },
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  defaultExpanded: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle-reasoning', 'retry'])

const isReasoningExpanded = ref(props.defaultExpanded)

const hasContent = computed(() => props.content.length > 0)
const hasReasoning = computed(() => props.reasoning.length > 0)
const hasError = computed(() => props.error && props.error.length > 0)

const renderedContent = computed(() => {
  if (!props.content) return ''
  try {
    return marked.parse(props.content, {
      breaks: true,
      gfm: true
    })
  } catch (e) {
    return props.content
  }
})

const toggleReasoning = () => {
  isReasoningExpanded.value = !isReasoningExpanded.value
  emit('toggle-reasoning')
}

const retry = () => {
  emit('retry')
}
</script>

<style>
/*
 * AI Stream Display - 骨架样式
 * 
 * 这是一个无样式的骨架组件，只提供结构。
 * 调用方应该通过以下方式自定义样式：
 * 
 * 1. CSS 变量覆盖（推荐）：
 *    --ai-stream-reasoning-bg
 *    --ai-stream-reasoning-color
 *    --ai-stream-content-bg
 *    --ai-stream-content-color
 *    --ai-stream-error-bg
 *    --ai-stream-error-color
 *    --ai-stream-cursor-color
 * 
 * 2. 深度选择器：
 *    :deep(.ai-stream-reasoning) { ... }
 * 
 * 3. Slots 完全自定义：
 *    <template #reasoning="{ reasoning, showReasoning }">
 *      <div class="my-custom-reasoning">...</div>
 *    </template>
 */

.ai-stream-display {
  width: 100%;
}

.ai-stream-queue,
.ai-stream-reasoning,
.ai-stream-content,
.ai-stream-error,
.ai-stream-placeholder {
  margin-bottom: 12px;
}

.ai-stream-reasoning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.ai-stream-reasoning-content {
  white-space: pre-wrap;
  word-break: break-all;
}

.ai-stream-content-text {
  line-height: 1.7;
}

.ai-stream-content-text :deep(p) {
  margin: 0 0 12px 0;
}

.ai-stream-content-text :deep(p:last-child) {
  margin-bottom: 0;
}

.ai-stream-content-text :deep(h1),
.ai-stream-content-text :deep(h2),
.ai-stream-content-text :deep(h3),
.ai-stream-content-text :deep(h4),
.ai-stream-content-text :deep(h5),
.ai-stream-content-text :deep(h6) {
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.ai-stream-content-text :deep(ul),
.ai-stream-content-text :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.ai-stream-content-text :deep(li) {
  margin-bottom: 4px;
}

.ai-stream-content-text :deep(code) {
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
}

.ai-stream-content-text :deep(pre) {
  padding: 12px 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.ai-stream-content-text :deep(pre code) {
  padding: 0;
}

.ai-stream-content-text :deep(blockquote) {
  border-left: 3px solid;
  padding-left: 12px;
  margin: 12px 0;
  font-style: italic;
}

.ai-stream-content-text :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.ai-stream-content-text :deep(th),
.ai-stream-content-text :deep(td) {
  border: 1px solid;
  padding: 8px 12px;
  text-align: left;
}

.ai-stream-content-text :deep(th) {
  font-weight: 600;
}

.ai-stream-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  margin-left: 2px;
  vertical-align: middle;
  animation: ai-stream-blink 1s infinite;
}

@keyframes ai-stream-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.ai-stream-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ai-stream-retry-btn {
  cursor: pointer;
}
</style>
