<template>
  <div class="ac-page">
    <div class="ac-noise" />

    <div
      class="ac-sidebar"
      :class="{ 'ac-sidebar--collapsed': sidebarCollapsed }"
    >
      <div class="ac-sidebar__top">
        <el-tooltip
          :content="sidebarCollapsed ? '展开侧栏' : '收起侧栏'"
          placement="bottom"
          :show-after="300"
        >
          <button
            class="ac-sidebar__toggle"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <el-icon :size="18">
              <component :is="sidebarCollapsed ? Expand : Fold" />
            </el-icon>
          </button>
        </el-tooltip>
        <el-tooltip
          content="新对话"
          placement="bottom"
          :show-after="300"
        >
          <button
            class="ac-sidebar__icon-btn"
            @click="startNewChat"
          >
            <el-icon :size="18">
              <Plus />
            </el-icon>
          </button>
        </el-tooltip>
        <template v-if="!sidebarCollapsed">
          <button
            class="ac-sidebar__new-btn"
            @click="startNewChat"
          >
            <el-icon :size="16">
              <Plus />
            </el-icon>
            <span>新对话</span>
          </button>
        </template>
      </div>

      <div
        v-show="!sidebarCollapsed"
        class="ac-sidebar__body"
      >
        <div
          v-if="todayConversations.length > 0"
          class="ac-conv-group"
        >
          <span class="ac-conv-group__label">今天</span>
          <button
            v-for="conv in todayConversations"
            :key="conv.id"
            class="ac-conv-item"
            :class="{ 'ac-conv-item--active': currentConversationId === conv.id }"
            @click="loadConversation(conv)"
          >
            <span class="ac-conv-item__text">{{ conv.title || '新对话' }}</span>
          </button>
        </div>

        <div
          v-if="olderConversations.length > 0"
          class="ac-conv-group"
        >
          <span class="ac-conv-group__label">更早</span>
          <button
            v-for="conv in olderConversations"
            :key="conv.id"
            class="ac-conv-item"
            :class="{ 'ac-conv-item--active': currentConversationId === conv.id }"
            @click="loadConversation(conv)"
          >
            <span class="ac-conv-item__text">{{ conv.title || '新对话' }}</span>
          </button>
        </div>

        <div
          v-if="filteredConversations.length === 0 && searchQuery"
          class="ac-conv-empty"
        >
          未找到匹配
        </div>
      </div>

      <div class="ac-sidebar__footer">
        <template v-if="!sidebarCollapsed">
          <div class="ac-agent-group">
            <span class="ac-agent-group__label">智能体</span>
            <div class="ac-agent-list">
              <button
                v-for="agent in agents"
                :key="agent.id"
                class="ac-agent-row"
                :class="{ 'ac-agent-row--active': currentAgentId === agent.id }"
                @click="selectAgent(agent.id)"
              >
                <span
                  class="ac-agent-row__dot"
                  :style="{ background: agent.color }"
                />
                <span class="ac-agent-row__name">{{ agent.name }}</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="ac-main">
      <div class="ac-header">
        <div class="ac-header__left">
          <div class="ac-header__agent">
            <div
              class="ac-header__badge"
              :style="{ background: currentAgent?.color }"
            >
              <el-icon :size="16">
                <component :is="currentAgent?.icon" />
              </el-icon>
            </div>
            <div class="ac-header__info">
              <span class="ac-header__name">{{ currentAgent?.name }}</span>
              <span class="ac-header__role">{{ currentAgent?.role }}</span>
            </div>
          </div>
        </div>
        <div class="ac-header__actions">
          <el-tooltip
            content="返回"
            placement="bottom"
            :show-after="300"
          >
            <button
              class="ac-header__back"
              @click="goBack"
            >
              <el-icon :size="16">
                <ArrowLeft />
              </el-icon>
            </button>
          </el-tooltip>
          <el-dropdown
            v-if="providers.length > 0"
            trigger="click"
            @command="(cmd) => selectedProvider = cmd"
          >
            <button class="ac-model-picker">
              <span class="ac-model-picker__name">{{ currentProviderName }}</span>
              <el-icon :size="12">
                <ArrowDown />
              </el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="p in providers"
                  :key="p.id"
                  :command="p.id"
                  :class="{ 'is-active': selectedProvider === p.id }"
                >
                  <div class="ac-model-opt">
                    <span>{{ p.name }}</span><el-icon
                      v-if="selectedProvider === p.id"
                      :size="12"
                    >
                      <Check />
                    </el-icon>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <div
        ref="messagesContainer"
        class="ac-messages"
        @scroll="handleUserScroll"
      >
        <div
          v-if="messages.length === 0 && currentAgent"
          class="ac-welcome"
        >
          <div class="ac-welcome__inner">
            <div
              class="ac-welcome__orb"
              :style="{ background: currentAgent?.color }"
            >
              <el-icon :size="28">
                <component :is="currentAgent?.icon" />
              </el-icon>
            </div>
            <h2 class="ac-welcome__title">
              <span
                v-for="(word, i) in welcomeWords"
                :key="i"
                class="ac-welcome__word"
                :style="{ '--wi': i }"
              >
                <span class="ac-welcome__word-in">{{ word }}</span>
              </span>
            </h2>
            <p class="ac-welcome__role">
              {{ currentAgent.role }}
            </p>
            <p class="ac-welcome__desc">
              {{ currentAgent.welcome }}
            </p>
            <div class="ac-welcome__prompts">
              <button
                v-for="(prompt, idx) in currentAgent.quickPrompts"
                :key="idx"
                class="ac-prompt-chip"
                :style="{ '--delay': idx * 0.08 + 's' }"
                @click="useQuickPrompt(prompt)"
              >
                {{ prompt }}
              </button>
            </div>
          </div>
        </div>

        <template v-else>
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="ac-msg"
            :class="{ 'ac-msg--user': msg.role === 'user' }"
          >
            <div class="ac-msg__bubble">
              <div
                class="ac-msg__avatar"
                :style="{ background: msg.role === 'user' ? 'var(--color-solid)' : currentAgent?.color }"
              >
                <el-icon :size="14">
                  <User v-if="msg.role === 'user'" /><component
                    :is="currentAgent?.icon"
                    v-else
                  />
                </el-icon>
              </div>
              <div class="ac-msg__body">
                <div
                  v-if="msg.reasoning"
                  class="ac-reasoning"
                  :class="{ 'ac-reasoning--thinking': msg.isThinking && !msg.content }"
                >
                  <div
                    class="ac-reasoning__head"
                    @click="msg.showReasoning = !msg.showReasoning"
                  >
                    <el-icon :size="12">
                      <Cpu />
                    </el-icon>
                    <span>{{ msg.isThinking && !msg.content ? '正在思考...' : '思考过程' }}</span>
                    <span
                      v-if="msg.isThinking && !msg.content"
                      class="ac-reasoning__badge"
                    >进行中</span>
                    <el-icon
                      :size="10"
                      class="ac-reasoning__chevron"
                      :class="{ 'ac-reasoning__chevron--open': msg.showReasoning }"
                    >
                      <ArrowDown />
                    </el-icon>
                  </div>
                  <div
                    v-show="msg.showReasoning"
                    class="ac-reasoning__text"
                  >
                    {{ msg.reasoning }}
                  </div>
                </div>

                <div class="ac-msg__text">
                  <div
                    v-if="isGenerating && msg.role === 'assistant' && isLastMessage(msg) && !msg.content && !msg.reasoning"
                    class="ac-typing"
                  >
                    <span class="ac-typing__dot" /><span class="ac-typing__dot" /><span class="ac-typing__dot" />
                    <span class="ac-typing__label">{{ waitingText }}</span>
                  </div>
                  <template v-else>
                    <span v-html="renderMarkdown(msg.content)" />
                    <span
                      v-if="isGenerating && msg.role === 'assistant' && isLastMessage(msg)"
                      class="ac-cursor"
                    />
                  </template>
                </div>

                <div
                  v-if="msg.content && !isGenerating"
                  class="ac-msg__tools"
                >
                  <el-tooltip
                    content="复制"
                    placement="top"
                    :show-after="300"
                  >
                    <button
                      class="ac-tool-btn"
                      @click="copyMessage(msg)"
                    >
                      <el-icon :size="12">
                        <DocumentCopy />
                      </el-icon>
                    </button>
                  </el-tooltip>
                  <template v-if="msg.role === 'assistant'">
                    <el-tooltip
                      content="有帮助"
                      placement="top"
                      :show-after="300"
                    >
                      <button
                        class="ac-tool-btn"
                        :class="{ 'ac-tool-btn--on': msg.feedback === 'good' }"
                        @click="setFeedback(msg, 'good')"
                      >
                        <el-icon :size="12">
                          <Select />
                        </el-icon>
                      </button>
                    </el-tooltip>
                    <el-tooltip
                      content="无帮助"
                      placement="top"
                      :show-after="300"
                    >
                      <button
                        class="ac-tool-btn"
                        :class="{ 'ac-tool-btn--on': msg.feedback === 'bad' }"
                        @click="setFeedback(msg, 'bad')"
                      >
                        <el-icon
                          :size="12"
                          style="transform: scaleY(-1)"
                        >
                          <Select />
                        </el-icon>
                      </button>
                    </el-tooltip>
                    <button
                      v-if="isLastMessage(msg)"
                      class="ac-tool-btn ac-tool-btn--regen"
                      @click="regenerateLastResponse()"
                    >
                      <el-icon :size="12">
                        <RefreshRight />
                      </el-icon><span>重新生成</span>
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div
          v-if="isQueued"
          class="ac-queue"
        >
          <el-icon :size="14">
            <Clock />
          </el-icon>
          <span>请求排队中，前方还有 {{ queuePosition }} 个任务...</span>
        </div>

        <div
          v-if="lastError"
          class="ac-error"
        >
          <div class="ac-error__main">
            <el-icon
              :size="16"
              class="ac-error__icon"
            >
              <WarningFilled />
            </el-icon>
            <div class="ac-error__info">
              <span class="ac-error__title">{{ lastError.title }}</span>
              <span class="ac-error__desc">{{ lastError.message }}</span>
            </div>
          </div>
          <div class="ac-error__actions">
            <el-button
              v-if="canRetry"
              type="primary"
              size="small"
              @click="handleRetry"
            >
              重试 ({{ retryCount }}/{{ maxRetries }})
            </el-button>
            <el-button
              size="small"
              text
              @click="clearError"
            >
              忽略
            </el-button>
          </div>
        </div>
      </div>

      <div class="ac-input-zone">
        <div
          class="ac-input-box"
          :class="{ 'ac-input-box--focus': inputFocused }"
        >
          <textarea
            ref="textareaRef"
            v-model="inputMessage"
            class="ac-input"
            placeholder="输入您的问题，按 Enter 发送..."
            :disabled="isLoading"
            rows="1"
            aria-label="AI对话输入框"
            @input="autoResize"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <div class="ac-input-bar">
            <div class="ac-input-bar__left">
              <button
                class="ac-toggle-btn"
                :class="{ 'ac-toggle-btn--on': enableThinking }"
                :disabled="isLoading"
                @click="toggleThinking"
              >
                <el-icon :size="14">
                  <Cpu />
                </el-icon><span>深度思考</span>
              </button>
            </div>
            <div class="ac-input-bar__right">
              <button
                v-if="!isLoading"
                class="ac-send-btn"
                :class="{ 'ac-send-btn--ready': inputMessage.trim() }"
                :disabled="!inputMessage.trim()"
                @click="sendMessage"
              >
                <el-icon :size="16">
                  <Promotion />
                </el-icon>
              </button>
              <button
                v-else-if="stopButtonVisible"
                class="ac-send-btn ac-send-btn--stop"
                @click="stopGeneration"
              >
                <el-icon :size="16">
                  <VideoPause />
                </el-icon>
              </button>
            </div>
          </div>
        </div>
        <p class="ac-input-hint">
          AI 生成内容仅供参考，重要决策请结合多方信息
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, User, WarningFilled, Clock,
  Promotion, VideoPause, Search,
  Cpu, ArrowDown, Check, Plus,
  School, DocumentCopy, OfficeBuilding, Stamp,
  Select, RefreshRight, Expand, Fold
} from '@element-plus/icons-vue'
import { buildSystemPrompt } from '@/utils/ai-api'
import { useAIStream } from '@/composables/useAIStream'
import { useActiveStream } from '@/composables/useActiveStream'
import { renderMarkdown } from '@/utils/markdown'
import { DEFAULT_PROVIDER } from '@/composables/useAIConfig'

const router = useRouter()
const {
  isLoading, isGenerating, isQueued, isThinking, isStreaming,
  hasError, queuePosition, canRetry, retryCount, maxRetries,
  waitingPhase, stopButtonVisible, msgActionsConfig, waitingText,
  stopGeneration: stopActiveGeneration, handleRetry: retryActiveStream
} = useActiveStream({ actions: { feedback: false } })

const agents = ref([
  {
    id: 'consultant', name: '留学顾问', role: '整体规划咨询',
    icon: markRaw(School),
    color: 'var(--color-solid)', bgColor: 'var(--color-slate-100)',
    welcome: '您好！我是您的留学顾问。我可以帮您制定整体的留学规划，包括背景提升、时间安排、申请策略等。请告诉我您的留学目标或任何困惑，我会为您提供专业建议。',
    quickPrompts: ['帮我制定留学时间规划', '我的背景能申请什么学校？', '需要准备哪些申请材料？']
  },
  {
    id: 'essay', name: '文书导师', role: '文书写作指导',
    icon: markRaw(DocumentCopy),
    color: 'var(--color-accent)', bgColor: 'var(--color-accent-subtle)',
    welcome: '您好！我是您的文书导师。我专注于帮助您撰写高质量的申请文书，包括个人陈述、简历、推荐信等。请告诉我您需要什么样的文书帮助，我会为您提供指导和建议。',
    quickPrompts: ['如何写好个人陈述？', '推荐信应该包含什么？', '帮我修改这段文书']
  },
  {
    id: 'selection', name: '选校专家', role: '院校选择建议',
    icon: markRaw(OfficeBuilding),
    color: 'var(--color-success)', bgColor: 'var(--color-success-bg)',
    welcome: '您好！我是您的选校专家。我拥有丰富的院校数据库，可以根据您的背景和需求，为您推荐合适的学校和专业。',
    quickPrompts: ['根据我的背景推荐学校', '这所学校录取难度如何？', '比较这几所学校的优劣']
  },
  {
    id: 'visa', name: '签证助手', role: '签证申请指导',
    icon: markRaw(Stamp),
    color: 'var(--color-info)', bgColor: 'var(--color-info-bg)',
    welcome: '您好！我是您的签证助手。我熟悉各国签证申请流程，可以为您解答关于签证材料、面签准备等方面的问题。',
    quickPrompts: ['签证需要准备哪些材料？', '面签常见问题有哪些？', '签证被拒怎么办？']
  }
])

const currentAgentId = ref('consultant')
const sidebarCollapsed = ref(false)
const currentAgent = computed(() => agents.value.find(a => a.id === currentAgentId.value) || agents.value[0])
const selectedProvider = ref(null)
const inputMessage = ref('')
const messagesContainer = ref(null)
const textareaRef = ref(null)
const messages = ref([])
const currentConversationId = ref(null)
const lastError = ref(null)
const userData = ref(null)
const enableThinking = ref(false)
const searchQuery = ref('')
const inputFocused = ref(false)
const CHAT_STATE_KEY = 'ai_chat_current_state'
const currentStream = ref(null)
let isRestoringState = false
let isFreshEntry = true
let userScrollLocked = false
let lastUserScrollTime = 0

const welcomeWords = computed(() => (currentAgent.value?.name || '').split(''))

const scrollToBottom = (force = false) => {
  if (!messagesContainer.value) return
  if (force) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    return
  }
  if (userScrollLocked) return
  if (Date.now() - lastUserScrollTime < 150) return
  requestAnimationFrame(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handleUserScrollInternal = () => {
  if (!messagesContainer.value) return
  lastUserScrollTime = Date.now()
  requestAnimationFrame(() => {
    if (!messagesContainer.value) return
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const isAtBottom = distanceFromBottom < 60
    if (!isAtBottom && distanceFromBottom > 80) {
      userScrollLocked = true
    } else if (isAtBottom) {
      userScrollLocked = false
    }
  })
}

const loadUserData = () => {
  const saved = localStorage.getItem('assessment_form')
  if (saved) { try { const data = JSON.parse(saved); userData.value = data.form || data } catch (_e) { userData.value = null } }
  else {
    const report = localStorage.getItem('assessment_report')
    if (report) { try { const r = JSON.parse(report); userData.value = { basic: r.basic || {}, academic: r.academic || {}, practice: r.practice || {} } } catch (_e) { userData.value = null } }
  }
}

const goBack = () => router.back()

const saveCurrentState = () => {
  if (isRestoringState) return
  localStorage.setItem(CHAT_STATE_KEY, JSON.stringify({ messages: messages.value, currentAgentId: currentAgentId.value, currentConversationId: currentConversationId.value, savedAt: Date.now() }))
}

const loadCurrentState = () => {
  const saved = localStorage.getItem(CHAT_STATE_KEY)
  if (saved) {
    try {
      const state = JSON.parse(saved)
      if (state.messages && state.messages.length > 0) {
        isRestoringState = true; currentAgentId.value = state.currentAgentId || 'consultant'; currentConversationId.value = state.currentConversationId || null; messages.value = state.messages; isRestoringState = false
        nextTick(() => scrollToBottom(true))
      }
    } catch (_e) { isRestoringState = false }
  }
}

const clearCurrentState = () => localStorage.removeItem(CHAT_STATE_KEY)

const conversations = ref([])
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  const q = searchQuery.value.toLowerCase()
  return conversations.value.filter(c => (c.title && c.title.toLowerCase().includes(q)) || getAgentName(c.agentId).toLowerCase().includes(q))
})

const todayConversations = computed(() => {
  const t = new Date(); t.setHours(0, 0, 0, 0)
  return filteredConversations.value.filter(c => { const d = new Date(c.createdAt); d.setHours(0, 0, 0, 0); return d.getTime() === t.getTime() })
})
const olderConversations = computed(() => {
  const t = new Date(); t.setHours(0, 0, 0, 0)
  return filteredConversations.value.filter(c => { const d = new Date(c.createdAt); d.setHours(0, 0, 0, 0); return d.getTime() < t.getTime() })
})

const providers = computed(() => { const s = localStorage.getItem('ai_providers'); return s ? JSON.parse(s) : [DEFAULT_PROVIDER] })
const currentProviderName = computed(() => { const p = providers.value.find(p => p.id === selectedProvider.value); return p ? p.name : '选择模型' })
const getAgentName = (id) => { const a = agents.value.find(a => a.id === id); return a ? a.name : 'AI助手' }

const loadProviders = () => { const s = localStorage.getItem('ai_providers'); if (s) { const p = JSON.parse(s); if (p.length > 0) selectedProvider.value = p[0].id } else { selectedProvider.value = DEFAULT_PROVIDER.id } }

const selectAgent = (id) => {
  if (currentAgentId.value === id) return
  if (messages.value.length > 0) saveConversation()
  currentAgentId.value = id
  if (isFreshEntry) { messages.value = []; currentConversationId.value = null; clearCurrentState(); return }
  const last = conversations.value.filter(c => c.agentId === id).sort((a, b) => b.createdAt - a.createdAt)[0]
  if (last && last.messages && last.messages.length > 0) { messages.value = JSON.parse(JSON.stringify(last.messages)); currentConversationId.value = last.id; saveCurrentState() }
  else { messages.value = []; currentConversationId.value = null; clearCurrentState() }
}

const toggleThinking = () => { enableThinking.value = !enableThinking.value }
const useQuickPrompt = (prompt) => { inputMessage.value = prompt; sendMessage() }
const autoResize = (e) => { const t = e.target; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 200) + 'px' }

const sendMessage = async () => {
  isFreshEntry = false
  if (!inputMessage.value.trim()) { ElMessage.warning('请输入消息'); return }

  const userMsg = { id: Date.now(), role: 'user', content: inputMessage.value, timestamp: Date.now() }
  messages.value.push(userMsg); inputMessage.value = ''; clearError(); scrollToBottom(true)

  const aiMsg = { id: Date.now() + 1, role: 'assistant', content: '', reasoning: '', showReasoning: false, isThinking: enableThinking.value, timestamp: Date.now() }
  messages.value.push(aiMsg); const aiIdx = messages.value.length - 1
  let hasReasoningContent = false

  try {
    const systemPrompt = buildSystemPrompt(currentAgentId.value, userData.value)
    const apiMessages = [{ role: 'system', content: systemPrompt }, ...messages.value.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({ role: m.role, content: m.content }))]

    const stream = useAIStream({
      taskId: `chat-${currentAgentId.value}-${Date.now()}`,
      enableThinking: enableThinking.value,
      autoRestore: false,
      autoScroll: false,
      scrollContainer: () => messagesContainer.value,
      onStream: (content, reasoning) => {
        if (content) { messages.value[aiIdx].content = content; messages.value[aiIdx].isThinking = false }
        if (enableThinking.value && reasoning) {
          if (!hasReasoningContent && reasoning.length > 50) { hasReasoningContent = true; messages.value[aiIdx].showReasoning = true }
          messages.value[aiIdx].reasoning = reasoning
        }
        if (content && content.length > 100 && hasReasoningContent) messages.value[aiIdx].showReasoning = false
        scrollToBottom()
      },
      onComplete: (content, reasoning) => {
        if (content) messages.value[aiIdx].content = content
        if (enableThinking.value && reasoning) messages.value[aiIdx].reasoning = reasoning
        messages.value[aiIdx].showReasoning = false; messages.value[aiIdx].isThinking = false
      },
      onError: (error) => {
        lastError.value = { title: '请求失败', message: error }
      }
    })

    currentStream.value = stream
    await stream.generateWithProvider(selectedProvider.value, apiMessages)
    saveCurrentState()
  } catch (error) {
    lastError.value = { title: '请求失败', message: error.message || '请检查网络连接或重试' }
    messages.value[aiIdx].content = `抱歉，请求失败：${error.message}。`
  } finally { currentStream.value = null; saveCurrentState(); nextTick(() => scrollToBottom()) }
}

const isLastMessage = (msg) => { const l = messages.value[messages.value.length - 1]; return l && l.id === msg.id }
const copyMessage = async (msg) => {
  try { await navigator.clipboard.writeText(msg.content); ElMessage.success('已复制到剪贴板') }
  catch (_) { const ta = document.createElement('textarea'); ta.value = msg.content; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); ElMessage.success('已复制到剪贴板') }
}
const setFeedback = (msg, type) => {
  if (msg.feedback === type) msg.feedback = null
  else { msg.feedback = type; ElMessage.success(type === 'good' ? '感谢您的反馈' : '我们会继续改进') }
  saveCurrentState()
}
let lastUserMessageForRegen = null
const regenerateLastResponse = async () => {
  const am = messages.value.filter(m => m.role === 'assistant'); if (am.length === 0) return
  const ui = messages.value.findLastIndex(m => m.role === 'user'); if (ui < 0) return
  lastUserMessageForRegen = messages.value[ui].content; messages.value.pop(); saveCurrentState(); inputMessage.value = lastUserMessageForRegen; await sendMessage()
}
const handleUserScroll = () => { if (currentStream.value) currentStream.value.handleUserScroll(); else handleUserScrollInternal() }
const clearError = () => { lastError.value = null }
const startNewChat = () => { if (messages.value.length > 0) saveConversation(); messages.value = []; currentConversationId.value = null; clearCurrentState(); ElMessage.success('已开始新对话') }
const stopGeneration = () => { if (currentStream.value) { currentStream.value.stop(); currentStream.value = null } stopActiveGeneration(); saveCurrentState() }
const handleRetry = async () => { clearError(); await retryActiveStream() }

const saveConversation = () => {
  if (messages.value.length > 0) {
    const ei = conversations.value.findIndex(c => c.id === currentConversationId.value)
    const conv = { id: currentConversationId.value || Date.now(), title: messages.value[0].content.substring(0, 30) + '...', createdAt: currentConversationId.value ? getConversationById(currentConversationId.value)?.createdAt || Date.now() : Date.now(), agentId: currentAgentId.value, messages: JSON.parse(JSON.stringify(messages.value)) }
    if (ei >= 0) conversations.value[ei] = conv; else conversations.value.unshift(conv)
    localStorage.setItem('conversations', JSON.stringify(conversations.value))
  }
}
const getConversationById = (id) => conversations.value.find(c => c.id === id)
const loadConversation = (conv) => { messages.value = conv.messages || []; currentAgentId.value = conv.agentId || 'consultant'; currentConversationId.value = conv.id || null; saveCurrentState() }
const deleteConversation = (cid) => { if (confirm('删除此对话记录？')) { conversations.value = conversations.value.filter(c => c.id !== cid); localStorage.setItem('conversations', JSON.stringify(conversations.value)); if (currentConversationId.value === cid) { messages.value = []; currentConversationId.value = null } } }

let saveTimeout = null
const autoSaveConversation = () => { if (saveTimeout) clearTimeout(saveTimeout); saveTimeout = setTimeout(() => { if (messages.value.length > 0) saveConversation() }, 2000) }

watch(messages, (nv) => { if (isRestoringState) return; if (nv.length > 0) autoSaveConversation(); if (!isGenerating.value) saveCurrentState() }, { deep: true })
watch(currentAgentId, () => saveCurrentState())

onMounted(() => { loadProviders(); loadUserData(); const s = localStorage.getItem('conversations'); if (s) { conversations.value = JSON.parse(s); conversations.value.forEach((c, i) => { if (!c.id) c.id = Date.now() + i }) }; loadCurrentState() })
onUnmounted(() => { saveCurrentState(); if (currentStream.value) currentStream.value.stop(); isFreshEntry = true })
</script>

<style scoped>
/* ============================================
   智途 AstroPath — AI Chat · Awwwards 重构
   设计语言: 思想工坊 / 档案式新极简主义
   色系: Slate(#0F172A) + Amber(#D97706)
   命名: BEM · ac- 前缀
   ============================================ */

:root {
  --ac-ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ac-ease-back-out: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ===== 页面根容器 ===== */
.ac-page {
  display: flex;
  height: calc(100dvh - 64px);
  margin-top: -20px;
  overflow: hidden;
  position: relative;
  background: #FFFFFF;
}

@media (max-width: 1199px) {
  .ac-page {
    height: calc(100dvh - 56px);
    margin-top: -14px;
  }
}

@media (max-width: 767px) {
  .ac-page {
    height: calc(100dvh - 52px);
    margin-top: -10px;
  }
}

/* ===== 全局噪点纹理 ===== */
.ac-noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* ===== SIDEBAR ===== */
.ac-sidebar {
  width: 220px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: #F8FAFC;
  border-right: 1px solid rgba(15, 23, 42, 0.06);
  transition: width 0.4s var(--ac-ease-out-expo), opacity 0.25s ease;
  overflow: hidden;
  position: relative;
}

.ac-sidebar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(15, 23, 42, 0.08), transparent);
}

.ac-sidebar--collapsed {
  width: 64px;
}

.ac-sidebar__top {
  padding: 14px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.04);
}

.ac-sidebar--collapsed .ac-sidebar__top {
  padding: 12px 10px;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.ac-sidebar__toggle {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  background: #FFFFFF;
  color: var(--color-slate-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s var(--ac-ease-back-out);
}

.ac-sidebar__toggle:hover {
  background: var(--color-solid);
  color: #FFFFFF;
  border-color: var(--color-solid);
  transform: rotate(180deg);
}

.ac-sidebar__new-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 8px;
  background: #FFFFFF;
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s var(--ac-ease-out-expo);
  letter-spacing: 0.01em;
}

.ac-sidebar__new-btn:hover {
  border-color: var(--color-solid);
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.08);
}

.ac-sidebar__icon-btn {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  background: transparent;
  color: var(--color-slate-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s var(--ac-ease-back-out);
}

.ac-sidebar__icon-btn:hover {
  background: rgba(15, 23, 42, 0.06);
  color: var(--color-solid);
}

.ac-sidebar:not(.ac-sidebar--collapsed) .ac-sidebar__icon-btn {
  display: none;
}

/* Sidebar body - conversation list */
.ac-sidebar__body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
  opacity: 1;
  transition: opacity 0.25s ease;
}

.ac-sidebar--collapsed .ac-sidebar__body {
  opacity: 0;
  pointer-events: none;
}

.ac-conv-group {
  margin-bottom: 20px;
}

.ac-conv-group__label {
  display: block;
  padding: 14px 10px 6px;
  font-family: var(--font-family-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-slate-400);
}

.ac-conv-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s var(--ac-ease-out-expo);
  margin-bottom: 2px;
}

.ac-conv-item__text {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-slate-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  letter-spacing: 0.01em;
}

.ac-conv-item:hover {
  background: rgba(15, 23, 42, 0.04);
  border-color: rgba(15, 23, 42, 0.06);
}

.ac-conv-item--active {
  background: rgba(15, 23, 42, 0.05);
  border-color: rgba(15, 23, 42, 0.1);
}

.ac-conv-item--active .ac-conv-item__text {
  color: var(--color-text-primary);
  font-weight: 700;
}

.ac-conv-empty {
  padding: 32px 12px;
  text-align: center;
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-slate-400);
  letter-spacing: 1px;
}

/* Sidebar footer - agent list */
.ac-sidebar__footer {
  flex-shrink: 0;
  padding: 10px 8px 12px;
  border-top: 1px solid rgba(15, 23, 42, 0.04);
}

.ac-agent-group { margin-bottom: 4px; }

.ac-agent-group__label {
  display: block;
  padding: 8px 10px 6px;
  font-family: var(--font-family-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-slate-400);
}

.ac-agent-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ac-agent-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s var(--ac-ease-out-expo);
}

.ac-agent-row:hover {
  background: rgba(15, 23, 42, 0.04);
  border-color: rgba(15, 23, 42, 0.06);
}

.ac-agent-row--active {
  background: #FFFFFF;
  border-color: rgba(15, 23, 42, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.ac-agent-row__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform 0.3s var(--ac-ease-back-out);
}

.ac-agent-row--active .ac-agent-row__dot {
  transform: scale(1.3);
}

.ac-agent-row__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-slate-600);
  letter-spacing: 0.01em;
}

.ac-agent-row--active .ac-agent-row__name {
  color: var(--color-text-primary);
  font-weight: 700;
}

/* ===== MAIN AREA ===== */
.ac-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: #FFFFFF;
}

/* ===== HEADER ===== */
.ac-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 36px;
  flex-shrink: 0;
  min-height: 60px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.85);
  position: relative;
  z-index: 10;
}

.ac-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 36px;
  right: 36px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.06), transparent);
}

.ac-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ac-header__back {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  background: transparent;
  color: var(--color-slate-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s var(--ac-ease-back-out);
}

.ac-header__back:hover {
  background: var(--color-solid);
  color: #FFFFFF;
  border-color: var(--color-solid);
  transform: translateX(-2px);
}

.ac-header__agent {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ac-header__badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s var(--ac-ease-back-out);
}

.ac-header__agent:hover .ac-header__badge {
  transform: scale(1.08) rotate(-3deg);
}

.ac-header__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.ac-header__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.ac-header__role {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-accent);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.ac-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ac-model-picker {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 24px;
  background: transparent;
  color: var(--color-slate-500);
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s var(--ac-ease-out-expo);
  letter-spacing: 0.3px;
}

.ac-model-picker:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  background: rgba(15, 23, 42, 0.03);
}

.ac-model-picker__name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ac-model-opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 140px;
}

/* ===== MESSAGES AREA ===== */
.ac-messages {
  flex: 1;
  overflow-y: auto;
  padding: 40px 60px;
  scroll-behavior: smooth;
}

.ac-messages::-webkit-scrollbar {
  width: 4px;
}

.ac-messages::-webkit-scrollbar-track {
  background: transparent;
}

.ac-messages::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.1);
  border-radius: 4px;
}

.ac-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 23, 42, 0.2);
}

/* ===== WELCOME SCREEN ===== */
.ac-welcome {
  min-height: calc(100% - 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  position: relative;
}

.ac-welcome::before {
  content: '';
  position: absolute;
  inset: 40%;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: acGlowPulse 4s ease-in-out infinite alternate;
}

@keyframes acGlowPulse {
  0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.95); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
}

.ac-welcome__inner {
  text-align: center;
  max-width: 640px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.ac-welcome__orb {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  animation: acOrbIn 0.8s var(--ac-ease-out-expo) both;
}

@keyframes acOrbIn {
  from { opacity: 0; transform: scale(0.7) translateY(16px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* 分词标题动画 */
.ac-welcome__title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0 0 8px;
  display: flex;
  justify-content: center;
  gap: 0.12em;
  flex-wrap: wrap;
}

.ac-welcome__word {
  display: inline-block;
  overflow: hidden;
}

.ac-welcome__word-in {
  display: inline-block;
  transform: translateY(110%);
  opacity: 0;
  animation: acWordReveal 0.65s var(--ac-ease-out-expo) both;
  animation-delay: calc(var(--wi) * 0.07s + 0.35s);
}

@keyframes acWordReveal {
  from { transform: translateY(110%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.ac-welcome__role {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0 0 20px;
  opacity: 0;
  animation: acFadeUp 0.6s var(--ac-ease-out-expo) 0.7s both;
}

.ac-welcome__desc {
  font-size: 15px;
  line-height: 1.75;
  color: var(--color-slate-500);
  margin: 0 0 40px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  animation: acFadeUp 0.6s var(--ac-ease-out-expo) 0.85s both;
}

@keyframes acFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Quick prompts */
.ac-welcome__prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  opacity: 0;
  animation: acFadeUp 0.6s var(--ac-ease-out-expo) 1s both;
}

.ac-prompt-chip {
  padding: 11px 20px;
  background: transparent;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 24px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-slate-600);
  cursor: pointer;
  transition: all 0.3s var(--ac-ease-back-out);
  opacity: 0;
  animation: acChipIn 0.5s var(--ac-ease-out-expo) both;
  animation-delay: var(--delay);
  letter-spacing: 0.01em;
}

@keyframes acChipIn {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.ac-prompt-chip:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  background: rgba(15, 23, 42, 0.03);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
}

.ac-prompt-chip:active {
  transform: translateY(0) scale(0.98);
}

/* ===== MESSAGE BUBBLES ===== */
.ac-msg {
  margin-bottom: 28px;
  display: flex;
  justify-content: flex-start;
  opacity: 0;
  animation: acMsgIn 0.45s var(--ac-ease-out-expo) both;
}

@keyframes acMsgIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.ac-msg--user {
  justify-content: flex-end;
}

.ac-msg__bubble {
  display: flex;
  gap: 10px;
  max-width: 76%;
}

.ac-msg--user .ac-msg__bubble {
  flex-direction: row-reverse;
}

.ac-msg__avatar {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  margin-top: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ac-msg__body {
  background: #F8FAFC;
  border-radius: 14px;
  padding: 16px 20px;
  border: 1px solid rgba(15, 23, 42, 0.04);
  transition: background 0.2s ease;
  min-width: 0;
}

.ac-msg--user .ac-msg__body {
  background: var(--color-solid);
  color: #FFFFFF;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.15);
}

.ac-msg__text {
  font-size: 15px;
  line-height: 1.75;
  color: var(--color-text-primary);
  word-break: break-word;
}

.ac-msg--user .ac-msg__text {
  color: #F1F5F9;
}

.ac-msg__text :deep(p) { margin: 0 0 14px 0; }
.ac-msg__text :deep(p:last-child) { margin-bottom: 0; }
.ac-msg__text :deep(ul), .ac-msg__text :deep(ol) { margin: 14px 0; padding-left: 22px; }
.ac-msg__text :deep(li) { margin-bottom: 5px; }
.ac-msg__text :deep(code) {
  background: rgba(15, 23, 42, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-family-mono);
  font-size: 13px;
  border: 1px solid rgba(15, 23, 42, 0.06);
}
.ac-msg--user .ac-msg__text :deep(code) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.08);
  color: #E2E8F0;
}

/* Typing indicator */
.ac-typing {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
}

.ac-typing__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-slate-400);
  opacity: 0.35;
  animation: acDotBounce 1.4s ease-in-out infinite;
}

.ac-typing__dot:nth-child(1) { animation-delay: 0s; }
.ac-typing__dot:nth-child(2) { animation-delay: 0.16s; }
.ac-typing__dot:nth-child(3) { animation-delay: 0.32s; }

.ac-typing__label {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-slate-400);
  margin-left: 4px;
  letter-spacing: 0.5px;
}

@keyframes acDotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
  40% { transform: scale(1); opacity: 1; }
}

/* Typing cursor */
.ac-cursor {
  display: inline-block;
  width: 2px;
  height: 17px;
  background: var(--color-solid);
  margin-left: 2px;
  vertical-align: middle;
  animation: acCursorBlink 1s step-end infinite;
}

@keyframes acCursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Reasoning block */
.ac-reasoning {
  margin-bottom: 12px;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-left: 3px solid var(--color-accent);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.25s var(--ac-ease-out-expo);
}

.ac-reasoning--thinking {
  border-left-color: var(--color-slate-300);
  background: rgba(15, 23, 42, 0.015);
}

.ac-reasoning__head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  cursor: pointer;
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-accent);
  user-select: none;
  transition: background 0.2s ease;
  letter-spacing: 0.3px;
}

.ac-reasoning--thinking .ac-reasoning__head {
  color: var(--color-slate-400);
}

.ac-reasoning__head:hover {
  background: rgba(15, 23, 42, 0.03);
}

.ac-reasoning__badge {
  padding: 2px 8px;
  background: var(--color-slate-500);
  color: white;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  animation: acBadgePulse 1.5s ease-in-out infinite;
}

@keyframes acBadgePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.ac-reasoning__chevron {
  margin-left: auto;
  transition: transform 0.3s var(--ac-ease-out-expo);
}

.ac-reasoning__chevron--open {
  transform: rotate(180deg);
}

.ac-reasoning__text {
  padding: 0 14px 12px;
  font-family: var(--font-family-mono);
  font-size: 11.5px;
  line-height: 1.75;
  color: var(--color-slate-500);
  white-space: pre-wrap;
  border-top: 1px solid rgba(15, 23, 42, 0.05);
  margin-top: 0;
  padding-top: 10px;
}

/* Message action tools */
.ac-msg__tools {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(15, 23, 42, 0.05);
  opacity: 0;
  transition: opacity 0.25s var(--ac-ease-out-expo);
}

.ac-msg__body:hover .ac-msg__tools {
  opacity: 1;
}

.ac-msg--user .ac-msg__tools {
  justify-content: flex-end;
  border-top-color: rgba(255, 255, 255, 0.1);
}

.ac-tool-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-slate-400);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s var(--ac-ease-back-out);
}

.ac-tool-btn:hover {
  background: rgba(15, 23, 42, 0.06);
  color: var(--color-slate-700);
}

.ac-msg--user .ac-tool-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.ac-tool-btn--on {
  color: var(--color-solid);
  background: rgba(15, 23, 42, 0.06);
}

.ac-msg--user .ac-tool-btn--on {
  color: white;
  background: rgba(255, 255, 255, 0.12);
}

.ac-tool-btn--regen {
  margin-left: 8px;
  padding-left: 10px;
  border-left: 1px solid rgba(15, 23, 42, 0.08);
  font-weight: 600;
  font-size: 11.5px;
}

/* ===== QUEUE NOTICE ===== */
.ac-queue {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: rgba(217, 119, 6, 0.05);
  border: 1px solid rgba(217, 119, 6, 0.15);
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--color-accent);
  font-weight: 500;
  animation: acFadeUp 0.4s var(--ac-ease-out-expo) both;
}

/* ===== ERROR BANNER ===== */
.ac-error {
  background: rgba(220, 38, 38, 0.03);
  border-top: 1px solid rgba(220, 38, 38, 0.12);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  animation: acFadeUp 0.4s var(--ac-ease-out-expo) both;
}

.ac-error__main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.ac-error__icon {
  color: #DC2626;
  flex-shrink: 0;
}

.ac-error__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ac-error__title {
  font-size: 13px;
  font-weight: 700;
  color: #DC2626;
  letter-spacing: 0.01em;
}

.ac-error__desc {
  font-size: 12px;
  color: var(--color-slate-500);
}

.ac-error__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* ===== INPUT ZONE ===== */
.ac-input-zone {
  padding: 16px 36px 24px;
  position: relative;
}

.ac-input-zone::before {
  content: '';
  position: absolute;
  top: 0;
  left: 36px;
  right: 36px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.06), transparent);
}

.ac-input-box {
  background: #FFFFFF;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.35s var(--ac-ease-out-expo);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.03),
    0 4px 16px rgba(0, 0, 0, 0.02);
  position: relative;
}

.ac-input-box::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 15px;
  background: radial-gradient(ellipse at 50% 0%, rgba(217, 119, 6, 0.08) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s var(--ac-ease-out-expo);
  pointer-events: none;
  z-index: 0;
}

.ac-input-box--focus {
  border-color: rgba(15, 23, 42, 0.18);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 8px 32px rgba(0, 0, 0, 0.04);
}

.ac-input-box--focus::before {
  opacity: 1;
}

.ac-input {
  width: 100%;
  min-height: 26px;
  max-height: 200px;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-primary);
  background: transparent;
  font-family: var(--font-family-base);
  padding: 16px 18px;
  position: relative;
  z-index: 1;
}

.ac-input::placeholder {
  color: var(--color-slate-400);
  font-style: italic;
}

.ac-input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Input toolbar */
.ac-input-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 10px;
  position: relative;
  z-index: 1;
}

.ac-input-bar__left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ac-input-bar__right {
  display: flex;
  align-items: center;
}

.ac-toggle-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--color-slate-400);
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s var(--ac-ease-out-expo);
  letter-spacing: 0.2px;
}

.ac-toggle-btn:hover:not(:disabled) {
  background: rgba(15, 23, 42, 0.04);
  color: var(--color-slate-600);
}

.ac-toggle-btn--on {
  background: rgba(217, 119, 6, 0.08);
  color: var(--color-accent);
  border-color: rgba(217, 119, 6, 0.15);
}

.ac-toggle-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Send button */
.ac-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 9px;
  background: var(--color-slate-200);
  color: var(--color-slate-400);
  cursor: not-allowed;
  transition: all 0.3s var(--ac-ease-back-out);
}

.ac-send-btn--ready {
  background: var(--color-solid);
  color: #FFFFFF;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
}

.ac-send-btn--ready:hover {
  background: var(--color-slate-800);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.25);
}

.ac-send-btn--ready:active {
  transform: translateY(0) scale(0.98);
}

.ac-send-btn--stop {
  background: #DC2626;
  color: white;
  cursor: pointer;
  animation: acStopPulse 1.5s ease-in-out infinite;
}

.ac-send-btn--stop:hover {
  background: #B91C1C;
}

@keyframes acStopPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.3); }
  50% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
}

/* Input hint text */
.ac-input-hint {
  text-align: center;
  font-family: var(--font-family-mono);
  font-size: 10px;
  color: var(--color-slate-400);
  letter-spacing: 0.5px;
  margin: 10px 0 0;
  opacity: 0.7;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .ac-sidebar {
    display: none;
  }

  .ac-messages {
    padding: 24px 20px;
  }

  .ac-input-zone {
    padding: 12px 16px 16px;
  }

  .ac-msg__bubble {
    max-width: 94%;
  }

  .ac-header {
    padding: 14px 20px;
  }

  .ac-input-zone::before,
  .ac-header::after {
    left: 16px;
    right: 16px;
  }

  .ac-welcome {
    padding: 48px 20px;
  }

  .ac-welcome__title {
    font-size: clamp(26px, 7vw, 38px);
  }

  .ac-welcome__prompts {
    flex-direction: column;
    align-items: stretch;
  }

  .ac-prompt-chip {
    text-align: center;
  }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .ac-page *,
  .ac-page *::before,
  .ac-page *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
