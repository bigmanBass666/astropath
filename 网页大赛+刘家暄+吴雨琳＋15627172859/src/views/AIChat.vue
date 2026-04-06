<template>
  <div class="ai-chat-page">
    <div
      class="sidebar"
      :class="{ 'is-collapsed': sidebarCollapsed }"
    >
      <div class="sidebar-top">
        <el-tooltip
          :content="sidebarCollapsed ? '展开侧栏' : '收起侧栏'"
          placement="bottom"
          :show-after="300"
        >
          <button
            class="sidebar-toggle"
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
            class="new-chat-icon-btn"
            @click="startNewChat"
          >
            <el-icon :size="18">
              <Plus />
            </el-icon>
          </button>
        </el-tooltip>
        <template v-if="!sidebarCollapsed">
          <button
            class="new-chat-btn"
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
        class="sidebar-content"
      >
        <div
          v-if="todayConversations.length > 0"
          class="conversation-section"
        >
          <div class="section-label">
            今天
          </div>
          <button
            v-for="conv in todayConversations"
            :key="conv.id"
            class="conv-item"
            :class="{ 'is-active': currentConversationId === conv.id }"
            @click="loadConversation(conv)"
          >
            <span class="conv-text">{{ conv.title || '新对话' }}</span>
          </button>
        </div>

        <div
          v-if="olderConversations.length > 0"
          class="conversation-section"
        >
          <div class="section-label">
            更早
          </div>
          <button
            v-for="conv in olderConversations"
            :key="conv.id"
            class="conv-item"
            :class="{ 'is-active': currentConversationId === conv.id }"
            @click="loadConversation(conv)"
          >
            <span class="conv-text">{{ conv.title || '新对话' }}</span>
          </button>
        </div>

        <div
          v-if="filteredConversations.length === 0 && searchQuery"
          class="empty-hint"
        >
          未找到匹配
        </div>
      </div>

      <div class="sidebar-bottom">
        <template v-if="!sidebarCollapsed">
          <div class="agent-section">
            <div class="section-label">
              智能体
            </div>
            <div class="agent-list">
              <button
                v-for="agent in agents"
                :key="agent.id"
                class="agent-row"
                :class="{ 'is-active': currentAgentId === agent.id }"
                @click="selectAgent(agent.id)"
              >
                <span
                  class="agent-dot"
                  :style="{ background: agent.color }"
                />
                <span class="agent-label">{{ agent.name }}</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="main-chat">
      <div class="chat-header">
        <div class="header-left">
          <div class="header-agent-info">
            <div
              class="header-icon"
              :style="{ background: currentAgent?.color }"
            >
              <el-icon :size="16">
                <component :is="currentAgent?.icon" />
              </el-icon>
            </div>
            <div class="header-text">
              <span class="header-name">{{ currentAgent?.name }}</span>
              <span class="header-role">{{ currentAgent?.role }}</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <el-tooltip
            content="返回"
            placement="bottom"
            :show-after="300"
          >
            <button
              class="header-back-btn"
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
            <button class="model-selector">
              <span class="model-name">{{ currentProviderName }}</span>
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
                  <div class="model-option">
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
          <button
            v-else
            class="config-btn"
            @click="router.push('/ai-config')"
          >
            <el-icon :size="14">
              <Setting />
            </el-icon><span>配置模型</span>
          </button>
        </div>
      </div>

      <div
        ref="messagesContainer"
        class="chat-messages"
        @scroll="handleUserScroll"
      >
        <div
          v-if="messages.length === 0 && currentAgent"
          class="welcome-screen"
        >
          <div class="welcome-content">
            <div
              class="welcome-icon"
              :style="{ background: currentAgent?.color }"
            >
              <el-icon :size="24">
                <component :is="currentAgent?.icon" />
              </el-icon>
            </div>
            <h2 class="welcome-title">
              {{ currentAgent.name }}
            </h2>
            <p class="welcome-subtitle">
              {{ currentAgent.role }}
            </p>
            <p class="welcome-desc">
              {{ currentAgent.welcome }}
            </p>
            <div class="quick-prompts">
              <div class="prompts-list">
                <button
                  v-for="(prompt, idx) in currentAgent.quickPrompts"
                  :key="idx"
                  class="prompt-chip"
                  @click="useQuickPrompt(prompt)"
                >
                  {{ prompt }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <template v-else>
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-wrapper"
            :class="{ 'is-user': msg.role === 'user' }"
          >
            <div class="message">
              <div
                class="message-avatar"
                :style="{ background: msg.role === 'user' ? 'var(--color-solid)' : currentAgent?.color }"
              >
                <el-icon :size="14">
                  <User v-if="msg.role === 'user'" /><component
                    :is="currentAgent?.icon"
                    v-else
                  />
                </el-icon>
              </div>
              <div class="message-content">
                <div
                  v-if="msg.reasoning"
                  class="reasoning-block"
                  :class="{ 'is-thinking': msg.isThinking && !msg.content }"
                >
                  <div
                    class="reasoning-header"
                    @click="msg.showReasoning = !msg.showReasoning"
                  >
                    <el-icon :size="12">
                      <Cpu />
                    </el-icon>
                    <span>{{ msg.isThinking && !msg.content ? '正在思考...' : '思考过程' }}</span>
                    <span
                      v-if="msg.isThinking && !msg.content"
                      class="thinking-badge"
                    >进行中</span>
                    <el-icon
                      :size="10"
                      class="reasoning-toggle"
                      :class="{ 'is-expanded': msg.showReasoning }"
                    >
                      <ArrowDown />
                    </el-icon>
                  </div>
                  <div
                    v-show="msg.showReasoning"
                    class="reasoning-body"
                  >
                    {{ msg.reasoning }}
                  </div>
                </div>

                <div class="message-text">
                  <div
                    v-if="isGenerating && msg.role === 'assistant' && isLastMessage(msg) && !msg.content && !msg.reasoning"
                    class="waiting-dots"
                  >
                    <span class="dot" /><span class="dot" /><span class="dot" />
                    <span class="waiting-label">{{ waitingText }}</span>
                  </div>
                  <template v-else>
                    <span v-html="renderMarkdown(msg.content)" />
                    <span
                      v-if="isGenerating && msg.role === 'assistant' && isLastMessage(msg)"
                      class="typing-cursor"
                    />
                  </template>
                </div>

                <div
                  v-if="msg.content && !isGenerating"
                  class="message-actions"
                >
                  <el-tooltip
                    content="复制"
                    placement="top"
                    :show-after="300"
                  >
                    <button
                      class="action-btn"
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
                        class="action-btn"
                        :class="{ 'is-active': msg.feedback === 'good' }"
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
                        class="action-btn"
                        :class="{ 'is-active': msg.feedback === 'bad' }"
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
                      class="action-btn regenerate-btn"
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
          class="queue-notice"
        >
          <el-icon :size="14">
            <Clock />
          </el-icon>
          <span>请求排队中，前方还有 {{ queuePosition }} 个任务...</span>
        </div>

        <div
          v-if="lastError"
          class="error-banner"
        >
          <div class="error-content">
            <el-icon
              :size="16"
              class="error-icon"
            >
              <WarningFilled />
            </el-icon>
            <div class="error-info">
              <span class="error-title">{{ lastError.title }}</span>
              <span class="error-desc">{{ lastError.message }}</span>
            </div>
          </div>
          <div class="error-actions">
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

      <div class="input-section">
        <div class="input-container">
          <textarea
            v-model="inputMessage"
            class="chat-textarea"
            placeholder="输入您的问题，按 Enter 发送..."
            :disabled="isLoading"
            rows="1"
            @input="autoResize"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <div class="input-toolbar">
            <div class="toolbar-left">
              <button
                class="toolbar-btn"
                :class="{ 'is-active': enableThinking }"
                :disabled="isLoading"
                @click="toggleThinking"
              >
                <el-icon :size="14">
                  <Cpu />
                </el-icon><span>深度思考</span>
              </button>
            </div>
            <div class="toolbar-right">
              <button
                v-if="!isLoading"
                class="send-btn"
                :class="{ 'is-active': inputMessage.trim() }"
                :disabled="!inputMessage.trim()"
                @click="sendMessage"
              >
                <el-icon :size="16">
                  <Promotion />
                </el-icon>
              </button>
              <button
                v-else-if="stopButtonVisible"
                class="send-btn is-stop"
                @click="stopGeneration"
              >
                <el-icon :size="16">
                  <VideoPause />
                </el-icon>
              </button>
            </div>
          </div>
        </div>
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
  Cpu, ArrowDown, Check, Setting, Plus,
  School, DocumentCopy, OfficeBuilding, Stamp,
  Select, RefreshRight, Expand, Fold
} from '@element-plus/icons-vue'
import { buildSystemPrompt } from '@/utils/ai-api'
import { useAIStream } from '@/composables/useAIStream'
import { useActiveStream } from '@/composables/useActiveStream'
import { renderMarkdown } from '@/utils/markdown'

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
const messages = ref([])
const currentConversationId = ref(null)
const lastError = ref(null)
const userData = ref(null)
const enableThinking = ref(false)
const searchQuery = ref('')
const CHAT_STATE_KEY = 'ai_chat_current_state'
const currentStream = ref(null)
let isRestoringState = false
let isFreshEntry = true

const { scrollToBottom, handleUserScroll: handleStreamScroll } = useAIStream({
  taskId: `chat-${currentAgentId.value}`,
  enableThinking: enableThinking.value,
  autoRestore: false, autoScroll: true,
  scrollContainer: () => messagesContainer.value,
  onStateChange: (state) => { if (state === 'error') lastError.value = { title: '请求失败', message: '请检查网络连接或重试' } },
  onQueueChange: (pos) => { console.log('Queue position:', pos) }
})

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

const providers = computed(() => { const s = localStorage.getItem('ai_providers'); return s ? JSON.parse(s) : [] })
const currentProviderName = computed(() => { const p = providers.value.find(p => p.id === selectedProvider.value); return p ? p.name : '选择模型' })
const getAgentName = (id) => { const a = agents.value.find(a => a.id === id); return a ? a.name : 'AI助手' }

const loadProviders = () => { const s = localStorage.getItem('ai_providers'); if (s) { const p = JSON.parse(s); if (p.length > 0) selectedProvider.value = p[0].id } }

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
  if (!selectedProvider.value) { ElMessage.warning('请先配置AI提供商'); router.push('/ai-config'); return }

  const userMsg = { id: Date.now(), role: 'user', content: inputMessage.value, timestamp: Date.now() }
  messages.value.push(userMsg); inputMessage.value = ''; clearError(); scrollToBottom(true)

  const aiMsg = { id: Date.now() + 1, role: 'assistant', content: '', reasoning: '', showReasoning: false, isThinking: enableThinking.value, timestamp: Date.now() }
  messages.value.push(aiMsg); const aiIdx = messages.value.length - 1

  try {
    const systemPrompt = buildSystemPrompt(currentAgentId.value, userData.value)
    const apiMessages = [{ role: 'system', content: systemPrompt }, ...messages.value.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({ role: m.role, content: m.content }))]

    const stream = useAIStream({ taskId: `chat-${currentAgentId.value}-${Date.now()}`, enableThinking: enableThinking.value, autoRestore: false, autoScroll: true, scrollContainer: () => messagesContainer.value })
    currentStream.value = stream
    let hasReasoningContent = false

    const pollInterval = setInterval(() => {
      if (stream.content.value) { messages.value[aiIdx].content = stream.content.value; messages.value[aiIdx].isThinking = false }
      if (enableThinking.value && stream.reasoning.value) {
        if (!hasReasoningContent && stream.reasoning.value.length > 50) { hasReasoningContent = true; messages.value[aiIdx].showReasoning = true }
        messages.value[aiIdx].reasoning = stream.reasoning.value
      }
      if (stream.content.value && stream.content.value.length > 100 && hasReasoningContent) messages.value[aiIdx].showReasoning = false
      if (!stream.isStreaming.value && !stream.isThinking.value) clearInterval(pollInterval)
    }, 100)

    try { await stream.generateWithProvider(selectedProvider.value, apiMessages) } finally { clearInterval(pollInterval) }

    if (stream.content.value) messages.value[aiIdx].content = stream.content.value
    if (enableThinking.value && stream.reasoning.value) messages.value[aiIdx].reasoning = stream.reasoning.value
    messages.value[aiIdx].showReasoning = false; messages.value[aiIdx].isThinking = false
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
const handleUserScroll = () => { if (!messagesContainer.value) return; if (currentStream.value) currentStream.value.handleUserScroll(); else handleStreamScroll() }
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
.ai-chat-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 100;
  background: #FFFFFF;
}

.sidebar {
  width: 200px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: #F9FAFB;
  transition: width 0.2s ease, opacity 0.15s ease;
  overflow: hidden;
}
.sidebar.is-collapsed {
  width: 60px;
}
.sidebar-top {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.sidebar.is-collapsed .sidebar-top {
  padding: 8px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.sidebar-toggle {
  width: 32px; height: 32px;
  border: none; border-radius: 8px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.sidebar-toggle:hover { background: #e5e7eb; color: #374151; }
.new-chat-btn {
  flex: 1;
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px;
  border: 1px solid #e5e7eb; border-radius: 8px;
  background: #FFFFFF;
  color: #374151;
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}
.new-chat-btn:hover { background: #f3f4f6; border-color: #d1d5db; }
.new-chat-icon-btn {
  width: 32px; height: 32px;
  border: none; border-radius: 8px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.new-chat-icon-btn:hover { background: #e5e7eb; color: #374151; }
.sidebar:not(.is-collapsed) .new-chat-icon-btn { display: none; }

.sidebar-content {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 0 8px;
  opacity: 1; transition: opacity 0.15s ease;
}
.sidebar.is-collapsed .sidebar-content { opacity: 0; pointer-events: none; }

.conversation-section { margin-bottom: 16px; }
.section-label {
  padding: 16px 12px 6px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
}

.conv-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 12px;
  border: none; border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.12s ease;
  margin-bottom: 1px;
}
.conv-item .conv-text {
  display: block;
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
.conv-item:hover { background: #e5e7eb; }
.conv-item.is-active { background: #e5e7eb; }
.conv-item.is-active .conv-text { color: #1f2937; font-weight: 600; }

.empty-hint {
  padding: 24px 12px;
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
}

.sidebar-bottom {
  flex-shrink: 0;
  padding: 8px;
  border-top: 1px solid #f3f4f6;
}
.agent-section { margin-bottom: 8px; }
.agent-list { display: flex; flex-direction: column; gap: 1px; }
.agent-row {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 8px 10px;
  border: none; border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.12s ease;
}
.agent-row:hover { background: #e5e7eb; }
.agent-row.is-active { background: #FFFFFF; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.agent-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.agent-label {
  font-size: 13px; font-weight: 500; color: #374151;
}
.agent-row.is-active .agent-label { color: #1f2937; font-weight: 600; }

.main-chat { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 32px;
  flex-shrink: 0;
  min-height: 56px;
}

.header-left { display: flex; align-items: center; gap: 10px; }
.header-back-btn {
  width: 32px; height: 32px;
  border: none; border-radius: 8px;
  background: transparent; color: #6b7280;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.12s ease;
}
.header-back-btn:hover { background: #f3f4f6; color: #374151; }
.header-agent-info { display: flex; align-items: center; gap: 10px; }

.header-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-text { display: flex; flex-direction: column; }
.header-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}
.header-role { font-size: 11px; color: #9ca3af; }

.header-actions { display: flex; align-items: center; }

.model-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: transparent;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}
.model-selector:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}
.model-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.model-option { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 140px; }

.config-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: transparent;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.config-btn:hover { border-color: #d1d5db; color: #374151; }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 40px 60px;
}

.welcome-screen {
  min-height: calc(100% - 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
}

.welcome-content {
  text-align: center;
  max-width: 640px;
  width: 100%;
  animation: welcomeIn 0.5s ease both;
}

@keyframes welcomeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 24px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
  letter-spacing: -0.3px;
}

.welcome-subtitle {
  font-size: 14px;
  color: #D97706;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.welcome-desc {
  font-size: 15px;
  line-height: 1.7;
  color: #6b7280;
  margin: 0 0 36px 0;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.quick-prompts { text-align: center; }

.prompts-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.prompt-chip {
  padding: 10px 18px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  animation: chipIn 0.4s ease both;
}
.prompt-chip:nth-child(1) { animation-delay: 0.05s; }
.prompt-chip:nth-child(2) { animation-delay: 0.1s; }
.prompt-chip:nth-child(3) { animation-delay: 0.15s; }

@keyframes chipIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.prompt-chip:hover {
  border-color: #374151;
  color: #374151;
  background: #f9fafb;
}

.message-wrapper {
  margin-bottom: 32px;
  display: flex;
  justify-content: flex-start;
  animation: msgIn 0.3s ease both;
}

@keyframes msgIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-wrapper.is-user { justify-content: flex-end; }

.message { display: flex; gap: 10px; max-width: 78%; }
.message-wrapper.is-user .message { flex-direction: row-reverse; }

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  margin-top: 2px;
}

.message-content {
  background: #F7F7F8;
  border-radius: 12px;
  padding: 14px 18px;
}

.message-wrapper.is-user .message-content {
  background: #374151;
  color: white;
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.message-text {
  font-size: 15.5px;
  line-height: 1.75;
  color: #1f2937;
}
.message-wrapper.is-user .message-text { color: #f9fafb; }

.message-text :deep(p) { margin: 0 0 14px 0; }
.message-text :deep(p:last-child) { margin-bottom: 0; }
.message-text :deep(ul), .message-text :deep(ol) { margin: 14px 0; padding-left: 22px; }
.message-text :deep(li) { margin-bottom: 5px; }
.message-text :deep(code) {
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-family-mono);
  font-size: 13px;
}
.message-wrapper.is-user .message-text :deep(code) {
  background: rgba(255, 255, 255, 0.12);
}

.reasoning-block {
  margin-bottom: 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-left: 3px solid #D97706;
  border-radius: 8px;
  overflow: hidden;
}

.reasoning-block.is-thinking {
  border-left-color: #6b7280;
  background: #f9fafb;
}

.reasoning-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #D97706;
  user-select: none;
  transition: background 0.12s ease;
}
.reasoning-block.is-thinking .reasoning-header { color: #6b7280; }
.reasoning-header:hover { background: rgba(0, 0, 0, 0.02); }

.thinking-badge {
  padding: 2px 8px;
  background: #6b7280;
  color: white;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.reasoning-toggle {
  margin-left: auto;
  transition: transform 0.2s ease;
}
.reasoning-toggle.is-expanded { transform: rotate(180deg); }

.reasoning-body {
  padding: 0 14px 12px;
  font-size: 12px;
  line-height: 1.7;
  color: #6b7280;
  white-space: pre-wrap;
  border-top: 1px solid #e5e7eb;
  margin-top: 0;
  padding-top: 10px;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background: #374151;
  margin-left: 2px;
  animation: blink 1s infinite;
  vertical-align: middle;
}

.waiting-dots { display: flex; align-items: center; gap: 6px; padding: 2px 0; }
.waiting-dots .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #9ca3af;
  opacity: 0.4;
  animation: dotBounce 1.4s ease-in-out infinite;
}
.waiting-dots .dot:nth-child(1) { animation-delay: 0s; }
.waiting-dots .dot:nth-child(2) { animation-delay: 0.16s; }
.waiting-dots .dot:nth-child(3) { animation-delay: 0.32s; }
.waiting-label { font-size: 12px; color: #9ca3af; margin-left: 4px; }

@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.message-content:hover .message-actions { opacity: 1; }
.message-wrapper.is-user .message-actions {
  justify-content: flex-end;
  border-top-color: rgba(255, 255, 255, 0.1);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.12s ease;
}
.action-btn:hover { background: #e5e7eb; color: #6b7280; }
.message-wrapper.is-user .action-btn:hover { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); }
.action-btn.is-active { color: #374151; background: #f3f4f6; }
.message-wrapper.is-user .action-btn.is-active { color: white; background: rgba(255, 255, 255, 0.12); }

.regenerate-btn {
  margin-left: 8px;
  padding-left: 10px;
  border-left: 1px solid #e5e7eb;
  font-weight: 500;
}

.queue-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #d97706;
}

.error-banner {
  background: #fef2f2;
  border-top: 1px solid #fecaca;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.error-content { display: flex; align-items: center; gap: 10px; flex: 1; }
.error-icon { color: #dc2626; flex-shrink: 0; }
.error-info { display: flex; flex-direction: column; gap: 2px; }
.error-title { font-size: 13px; font-weight: 600; color: #dc2626; }
.error-desc { font-size: 12px; color: #6b7280; }
.error-actions { display: flex; gap: 8px; flex-shrink: 0; }

.input-section {
  padding: 16px 32px 24px;
}

.input-container {
  background: #FFFFFF;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.input-container:focus-within {
  border-color: #d1d5db;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.chat-textarea {
  width: 100%;
  min-height: 24px;
  max-height: 200px;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.6;
  color: #1f2937;
  background: transparent;
  font-family: var(--font-family-base);
  padding: 14px 18px;
}
.chat-textarea::placeholder { color: #9ca3af; }
.chat-textarea:disabled { opacity: 0.6; cursor: not-allowed; }

.input-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
}

.toolbar-left { display: flex; align-items: center; gap: 4px; }
.toolbar-right { display: flex; align-items: center; }

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.12s ease;
}
.toolbar-btn:hover:not(:disabled) { background: #f3f4f6; color: #374151; }
.toolbar-btn.is-active { background: #f3f4f6; color: #374151; }
.toolbar-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
  transition: all 0.15s ease;
}

.send-btn.is-active {
  background: #374151;
  color: white;
  cursor: pointer;
}

.send-btn.is-active:hover {
  background: #1f2937;
  transform: translateY(-1px);
}

.send-btn.is-stop { background: #dc2626; color: white; cursor: pointer; }
.send-btn.is-stop:hover { background: #b91c1c; }

@media (max-width: 768px) {
  .sidebar { display: none; }
  .chat-messages { padding: 24px 20px; }
  .input-section { padding: 12px 16px 16px; }
  .message { max-width: 92%; }
  .welcome-title { font-size: 22px; }
  .welcome-icon { width: 44px; height: 44px; }
  .prompts-list { flex-direction: column; align-items: stretch; }
  .chat-header { padding: 14px 20px; }
  .input-section { padding: 12px 20px 20px; }
}
</style>
