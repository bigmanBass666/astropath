<template>
  <aside
    class="ai-companion"
    :class="{ collapsed: !open }"
  >
    <div class="ai-header">
      <div
        v-show="open"
        class="ai-header-left"
      >
        <div class="ai-avatar">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M9 2a3.5 3.5 0 013.5 3.5c0 1.6-1.05 2.95-2.5 3.41V9a4.5 4.5 0 01-4.5 4.5H4m5-11.5A3.5 3.5 0 005.5 5.5C5.5 7.1 6.55 8.45 8 8.91V9A4.5 4.5 0 0013 13.5h1"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
            />
            <circle
              cx="5.5"
              cy="15"
              r="1.5"
              fill="currentColor"
            />
            <circle
              cx="12.5"
              cy="15"
              r="1.5"
              fill="currentColor"
            />
          </svg>
        </div>
        <span class="ai-title">AI 写作伴侣</span>
      </div>
      <button
        class="ai-collapse-btn"
        type="button"
        @click.stop.prevent="$emit('toggle')"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          :style="{ transform: open ? '' : 'rotate(180deg)', transition: 'transform 0.3s ease' }"
        >
          <path
            d="M9 2L5 6l4 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <div
      v-show="open"
      class="ai-body"
    >
      <!-- Welcome message -->
      <div
        v-if="messages.length === 0"
        class="ai-welcome"
      >
        <p class="welcome-text">
          {{ hasContext ? '我是你的文书写作助手' : '选择文书类型后，我可以帮你从零开始' }}
        </p>
        <p class="welcome-sub">
          {{ hasContext ? '可以帮你润色、扩写、调整语气，或直接生成内容' : '生成初稿 → 润色修改 → 最终定稿，全程辅助你完成高质量文书' }}
        </p>
      </div>

      <!-- Quick Actions -->
      <div
        v-if="messages.length === 0"
        class="quick-actions"
      >
        <button
          v-if="hasContext && messages.length === 0"
          key="draft-btn"
          class="quick-chip primary"
          @click="$emit('generateDraft')"
        >
          ✨ AI 生成初稿
        </button>
        <button
          v-for="action in quickActions"
          :key="action.key"
          class="quick-chip"
          :class="{ disabled: !hasContext }"
          @click="hasContext ? $emit('quickAction', action.key) : null"
        >
          {{ action.label }}
        </button>
      </div>

      <!-- Messages -->
      <div
        ref="messagesRef"
        class="ai-messages"
      >
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="msg-row"
          :class="{ user: msg.role === 'user', assistant: msg.role === 'assistant' }"
        >
          <div
            v-if="msg.role === 'user'"
            class="msg-bubble user-bubble"
          >
            {{ msg.content }}
          </div>
          <div
            v-else
            class="msg-bubble ai-bubble"
          >
            <div
              v-if="msg.content"
              class="msg-content"
              v-html="renderMarkdown(msg.content)"
            />
            <div
              v-if="isLastAssistant(idx)"
              class="msg-actions"
            >
              <button
                class="msg-action accept"
                @click="$emit('accept', msg.content)"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                ><path
                  d="M2 6.5l3 3 6-6"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg>
                采用
              </button>
              <button
                class="msg-action reject"
                @click="$emit('reject')"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                ><path
                  d="M3 3l7 7m0-7L3 10"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                /></svg>
                忽略
              </button>
            </div>
          </div>
        </div>

        <!-- Streaming indicator -->
        <div
          v-if="isGenerating && (!messages.length || messages[messages.length - 1].role !== 'assistant')"
          class="msg-row assistant"
        >
          <div class="msg-bubble ai-bubble streaming">
            <div class="stream-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="ai-input-area">
        <div class="input-wrap">
          <textarea
            ref="inputRef"
            v-model="localPrompt"
            class="ai-input"
            placeholder="输入指令，如：帮我润色第一段..."
            :disabled="isGenerating"
            rows="2"
            @keydown.enter.exact.prevent="handleSend"
            @input="autoResize"
          />
          <button
            class="send-btn"
            :class="{ loading: isGenerating, active: localPrompt.trim() }"
            :disabled="isGenerating || !localPrompt.trim()"
            @click="handleSend"
          >
            <svg
              v-if="!isGenerating"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2 8l10-5v10L2 8z"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linejoin="round"
              />
              <path
                d="M14 8H9"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
              />
            </svg>
            <span
              v-else
              class="spinner"
            />
          </button>
        </div>
        <p class="input-hint">
          Enter 发送 · Shift+Enter 换行
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  open: boolean
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>
  isGenerating: boolean
  hasContext?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  send: [message: string]
  quickAction: [key: string]
  accept: [content: string]
  reject: []
  generateDraft: []
}>()

const inputRef = ref<HTMLTextAreaElement>()
const messagesRef = ref<HTMLDivElement>()
const localPrompt = ref('')

const quickActions = [
  { key: 'polish', label: '润色段落' },
  { key: 'expand', label: '扩写内容' },
  { key: 'grammar', label: '检查语法' },
  { key: 'tone', label: '调整语气' },
  { key: 'translate', label: '翻译英文' },
  { key: 'outline', label: '生成大纲' }
]

function handleSend() {
  const msg = localPrompt.value.trim()
  if (!msg || props.isGenerating) return
  emit('send', msg)
  localPrompt.value = ''
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
    }
  })
}

function autoResize() {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
      inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 120) + 'px'
    }
  })
}

function isLastAssistant(idx: number) {
  return props.messages[idx]?.role === 'assistant' &&
    idx === props.messages.map((m, i) => m.role === 'assistant' ? i : -1).filter(i => i >= 0).pop()
}

function renderMarkdown(text: string): string {
  if (!text) return ''
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)/gs, '<ul>$1</ul>')
    .replace(/\n/g, '<br>')
  return html
}

watch(() => props.messages.length, () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
})

watch(() => props.isGenerating, (val) => {
  if (!val) {
    nextTick(() => {
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight
      }
    })
  }
})
</script>

<style scoped>
.ai-companion {
  display: flex;
  flex-direction: column;
  width: 360px;
  min-width: 280px;
  max-width: 420px;
  height: calc(100vh - 48px - 32px);
  background: #FAFBFC;
  border-left: 1px solid var(--color-border-light);
  transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.35s ease;
  overflow: hidden;
}

.ai-companion.collapsed {
  width: 48px;
  min-width: 48px;
}

/* Header */
.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border-light);
  background: white;
  flex-shrink: 0;
  min-height: 56px;
}

.ai-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.ai-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #B45309 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-solid);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.ai-collapse-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: auto;
  color: var(--color-text-muted);
  transition: all 0.15s ease;
  padding: 0;
}

.ai-collapse-btn:hover {
  background: var(--color-slate-100);
  color: var(--color-solid);
}

/* Collapsed State Overrides */
.ai-companion.collapsed .ai-header {
  justify-content: center;
  padding: 14px 8px;
}

.ai-companion.collapsed .ai-collapse-btn {
  margin-left: 0;
}

/* Body */
.ai-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* Welcome */
.ai-welcome {
  padding: 24px 20px 16px;
  text-align: center;
}

.welcome-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-solid);
  margin: 0 0 6px;
}

.welcome-sub {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin: 0;
  line-height: 1.5;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px 16px;
}

.quick-chip {
  padding: 5px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: 100px;
  background: white;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.quick-chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
  transform: translateY(-1px);
}

.quick-chip.primary {
  background: linear-gradient(135deg, var(--color-accent) 0%, #B45309 100%);
  color: white;
  border-color: transparent;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.quick-chip.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.35);
  background: linear-gradient(135deg, var(--color-accent) 0%, #B45309 100%);
}

.quick-chip.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quick-chip.disabled:hover {
  transform: none;
  background: white;
  color: var(--color-text-secondary);
  border-color: var(--color-border-light);
}

/* Messages */
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg-row {
  display: flex;
}

.msg-row.user {
  justify-content: flex-end;
}

.msg-row.assistant {
  justify-content: flex-start;
}

.msg-bubble {
  max-width: 90%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.65;
}

.user-bubble {
  background: var(--color-solid);
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-bubble {
  background: white;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
  border-bottom-left-radius: 4px;
}

.msg-content :deep(h3) {
  font-size: 13px;
  font-weight: 700;
  margin: 8px 0 4px;
  color: var(--color-solid);
}

.msg-content :deep(strong) {
  color: var(--color-solid);
  font-weight: 700;
}

.msg-content :deep(p) {
  margin: 4px 0;
}

.msg-content :deep(ul),
.msg-content :deep(ol) {
  padding-left: 16px;
  margin: 4px 0;
}

.msg-content :deep(li) {
  margin: 2px 0;
}

/* Message Actions */
.msg-actions {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-light);
}

.msg-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.msg-action.accept {
  background: var(--color-success);
  color: white;
}

.msg-action.accept:hover {
  background: #059669;
}

.msg-action.reject {
  background: var(--color-slate-200);
  color: var(--color-text-secondary);
}

.msg-action.reject:hover {
  background: var(--color-slate-300);
}

/* Streaming */
.streaming {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
}

.stream-dots {
  display: flex;
  gap: 4px;
}

.stream-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: dotBounce 1.2s ease-in-out infinite;
}

.stream-dots span:nth-child(2) { animation-delay: 0.15s; }
.stream-dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Input Area */
.ai-input-area {
  padding: 14px 16px 16px;
  background: transparent;
  flex-shrink: 0;
}

.input-wrap {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 10px 12px 10px 16px;
  background: var(--color-slate-50);
  border: 1.5px solid var(--color-border-light);
  border-radius: 16px;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.input-wrap:focus-within {
  border-color: var(--color-accent);
  background: white;
  box-shadow: 0 4px 20px rgba(217, 119, 6, 0.06), 0 0 0 3px rgba(217, 119, 6, 0.04);
}

.ai-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--color-text-primary);
  resize: none;
  outline: none;
  max-height: 100px;
  min-height: 22px;
}

.ai-input::placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}

.send-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: var(--color-slate-200);
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.send-btn.active {
  background: var(--color-accent);
  color: white;
}

.send-btn.active:hover {
  background: #B45309;
  transform: scale(1.04);
}

.send-btn.loading {
  background: var(--color-accent);
  color: white;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.input-hint {
  margin: 6px 0 0;
  font-size: 10px;
  color: var(--color-text-muted);
  text-align: center;
  letter-spacing: 0.3px;
}

@media (max-width: 1024px) {
  .ai-companion {
    position: fixed;
    right: 0;
    top: 48px;
    bottom: 32px;
    width: 100%;
    max-width: none;
    z-index: 80;
    border-left: none;
    border-top: 1px solid var(--color-border-light);
    box-shadow: -4px 0 30px rgba(15, 23, 42, 0.08);
    transform: translateX(0);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ai-companion.collapsed {
    width: 100%;
    transform: translateX(100%);
  }

  .ai-messages {
    max-height: 40vh;
  }
}
</style>
