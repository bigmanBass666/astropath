<template>
  <div class="ai-chat-page">
    <div
      class="sidebar"
      :class="{ 'is-collapsed': sidebarCollapsed }"
    >
      <div class="sidebar-header">
        <button
          class="sidebar-toggle-btn"
          title="返回"
          @click="goBack"
        >
          <el-icon :size="20">
            <ArrowLeft />
          </el-icon>
        </button>
      </div>
      <div class="agent-list">
        <el-tooltip
          v-for="agent in agents"
          :key="agent.id"
          :content="agent.name"
          placement="right"
          :show-after="100"
        >
          <div
            class="agent-item"
            :class="{ 'is-active': currentAgentId === agent.id }"
            @click="selectAgent(agent.id)"
          >
            <div
              class="agent-icon"
              :style="{
                background: currentAgentId === agent.id ? agent.color : agent.bgColor,
                color: currentAgentId === agent.id ? '#ffffff' : agent.color
              }"
            >
              <el-icon :size="20">
                <component :is="agent.icon" />
              </el-icon>
            </div>
          </div>
        </el-tooltip>
      </div>
    </div>

    <div class="main-chat">
      <div class="chat-header">
        <div class="header-left">
          <div class="header-agent-info">
            <div
              class="header-icon"
              :style="{ background: currentAgent?.gradient }"
            >
              <el-icon :size="18">
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
          <el-button
            size="small"
            type="primary"
            :icon="Plus"
            @click="startNewChat"
          >
            新对话
          </el-button>
          <el-button
            size="small"
            text
            :icon="Clock"
            @click="openHistory"
          >
            历史
          </el-button>
        </div>
      </div>

      <div
        ref="messagesContainer"
        class="chat-messages"
        @scroll="handleUserScroll"
      >
        <div
          v-if="messages.length === 0 && currentAgent"
          class="welcome-fullscreen"
        >
          <div class="welcome-content">
            <div class="welcome-header">
              <h2 class="welcome-title-large">
                {{ currentAgent.name }}
              </h2>
              <p class="welcome-role-large">
                {{ currentAgent.role }}
              </p>
            </div>
            <div class="welcome-desc">
              <p>{{ currentAgent.welcome }}</p>
            </div>
            <div class="quick-actions-section">
              <p class="quick-actions-title">
                您可以问我：
              </p>
              <div class="quick-actions-large">
                <div
                  v-for="(prompt, idx) in currentAgent.quickPrompts"
                  :key="idx"
                  class="quick-prompt-card"
                  @click="useQuickPrompt(prompt)"
                >
                  <span class="prompt-text">{{ prompt }}</span>
                  <el-icon class="prompt-arrow">
                    <ArrowRight />
                  </el-icon>
                </div>
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
                :style="{ background: msg.role === 'user' ? 'var(--color-solid)' : currentAgent?.gradient }"
              >
                <el-icon :size="16">
                  <User v-if="msg.role === 'user'" />
                  <component
                    :is="currentAgent?.icon"
                    v-else
                  />
                </el-icon>
              </div>
              <div class="message-content">
                <!-- 思考过程 - 使用骨架结构，自定义样式 -->
                <div
                  v-if="msg.reasoning"
                  class="message-reasoning"
                  :class="{ 'is-thinking': msg.isThinking && !msg.content }"
                >
                  <div
                    class="reasoning-header"
                    @click="msg.showReasoning = !msg.showReasoning"
                  >
                    <el-icon :size="14">
                      <Cpu />
                    </el-icon>
                    <span>{{ msg.isThinking && !msg.content ? '正在思考...' : '思考过程' }}</span>
                    <el-tag
                      v-if="msg.isThinking && !msg.content"
                      size="small"
                      type="warning"
                      class="thinking-tag"
                    >
                      进行中
                    </el-tag>
                    <el-icon
                      :size="12"
                      class="reasoning-arrow"
                      :class="{ 'is-expanded': msg.showReasoning }"
                    >
                      <ArrowDown />
                    </el-icon>
                  </div>
                  <div
                    v-show="msg.showReasoning"
                    class="reasoning-content"
                  >
                    {{ msg.reasoning }}
                  </div>
                </div>
                
                <!-- 正式内容 -->
                <div class="message-text">
                  <!-- 等待状态：渐进式指示器 -->
                  <div
                    v-if="isGenerating && msg.role === 'assistant' && isLastMessage(msg) && !msg.content && !msg.reasoning"
                    class="waiting-indicator"
                  >
                    <div class="waiting-dots">
                      <span class="dot" />
                      <span class="dot" />
                      <span class="dot" />
                    </div>
                    <span class="waiting-text">{{ waitingText }}</span>
                  </div>
                  <!-- 实际内容 -->
                  <template v-else>
                    <span v-html="renderMarkdown(msg.content)" />
                    <span
                      v-if="isGenerating && msg.role === 'assistant' && isLastMessage(msg)"
                      class="typing-cursor"
                    />
                  </template>
                </div>
                <!-- 消息操作栏 -->
                <div
                  v-if="msg.content && !isGenerating"
                  class="message-actions"
                >
                  <button
                    v-if="msgActionsConfig.copy"
                    class="action-btn"
                    title="复制"
                    @click="copyMessage(msg)"
                  >
                    <el-icon :size="13">
                      <DocumentCopy />
                    </el-icon>
                  </button>
                  <template v-if="msg.role === 'assistant'">
                    <template v-if="msgActionsConfig.feedback">
                    <button
                      class="action-btn"
                      :class="{ 'is-active': msg.feedback === 'good' }"
                      title="有帮助"
                      @click="setFeedback(msg, 'good')"
                    >
                      <el-icon :size="13">
                        <Select />
                      </el-icon>
                    </button>
                    <button
                      class="action-btn"
                      :class="{ 'is-active': msg.feedback === 'bad' }"
                      title="无帮助"
                      @click="setFeedback(msg, 'bad')"
                    >
                      <el-icon :size="13" style="transform: scaleY(-1)">
                        <Select />
                      </el-icon>
                    </button>
                    </template>
                    <button
                      v-if="msgActionsConfig.regenerate && isLastMessage(msg) && !isGenerating"
                      class="action-btn action-regenerate"
                      title="重新生成"
                      @click="regenerateLastResponse()"
                    >
                      <el-icon :size="13">
                        <RefreshRight />
                      </el-icon>
                      <span>重新生成</span>
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
          <el-icon class="queue-icon">
            <Clock />
          </el-icon>
          <span>请求排队中，前方还有 {{ queuePosition }} 个任务...</span>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="lastError"
          class="error-banner"
        >
          <div class="error-content">
            <el-icon
              class="error-icon"
              :size="18"
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
        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <textarea
              v-model="inputMessage"
              class="chat-textarea"
              placeholder="输入您的问题，按 Enter 发送..."
              :disabled="isLoading"
              rows="1"
              @input="autoResize"
              @keydown.enter.exact.prevent="sendMessage"
            />
          </div>
          
          <div class="chat-input-toolbar">
            <div class="toolbar-left">
              <button 
                class="toolbar-btn"
                :class="{ 'is-active': enableThinking, 'is-disabled': isLoading }"
                :disabled="isLoading"
                @click="toggleThinking"
              >
                <el-icon :size="14">
                  <Cpu />
                </el-icon>
                <span>深度思考</span>
              </button>
              
              <el-dropdown
                v-if="providers.length > 0"
                trigger="click"
                @command="(cmd) => selectedProvider = cmd"
              >
                <button class="toolbar-btn">
                  <el-icon :size="14">
                    <Cpu />
                  </el-icon>
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
                        <span class="option-name">{{ p.name }}</span>
                        <el-icon
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
                class="toolbar-btn"
                @click="router.push('/ai-config')"
              >
                <el-icon :size="14">
                  <Setting />
                </el-icon>
                <span>配置模型</span>
              </button>
            </div>
            
            <div class="toolbar-right">
              <button
                v-if="!isLoading"
                class="send-button"
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
                class="send-button is-stop"
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

    <el-drawer
      v-model="historyVisible"
      title="历史对话"
      size="380px"
      class="history-drawer"
    >
      <div class="history-list">
        <div
          v-if="conversations.length === 0"
          class="empty-history"
        >
          <el-icon
            :size="48"
            class="empty-icon"
          >
            <ChatDotRound />
          </el-icon>
          <p>暂无历史对话</p>
        </div>
        <template v-else>
          <div
            v-for="(group, date) in groupedConversations"
            :key="date"
            class="history-group"
          >
            <div class="history-date">
              {{ date }}
            </div>
            <div
              v-for="conv in group"
              :key="conv.createdAt"
              class="history-item"
              @click="loadConversation(conv)"
            >
              <div class="history-icon">
                <el-icon><ChatLineRound /></el-icon>
              </div>
              <div class="history-info">
                <div class="history-title">
                  {{ conv.title || '新对话' }}
                </div>
                <div class="history-meta">
                  <span>{{ getAgentName(conv.agentId) }}</span>
                  <span>{{ formatTime(conv.createdAt) }}</span>
                </div>
              </div>
              <el-button
                size="small"
                type="danger"
                text
                :icon="Delete"
                @click.stop="deleteConversation(conv.createdAt)"
              />
            </div>
          </div>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ChatLineRound, User, WarningFilled, Delete, Clock,
  Promotion, VideoPause, ArrowLeft,
  Cpu, ArrowDown, Check, Setting, Plus,
  School, DocumentCopy, OfficeBuilding, Stamp, ArrowRight,
  Select, RefreshRight
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
    id: 'consultant',
    name: '留学顾问',
    role: '整体规划咨询',
    icon: markRaw(School),
    color: '#3b82f6',
    bgColor: '#dbeafe',
    welcome: '您好！我是您的留学顾问。我可以帮您制定整体的留学规划，包括背景提升、时间安排、申请策略等。请告诉我您的留学目标或任何困惑，我会为您提供专业建议。',
    quickPrompts: ['帮我制定留学时间规划', '我的背景能申请什么学校？', '需要准备哪些申请材料？']
  },
  {
    id: 'essay',
    name: '文书导师',
    role: '文书写作指导',
    icon: markRaw(DocumentCopy),
    color: '#f59e0b',
    bgColor: '#fef3c7',
    welcome: '您好！我是您的文书导师。我专注于帮助您撰写高质量的申请文书，包括个人陈述、简历、推荐信等。请告诉我您需要什么样的文书帮助，我会为您提供指导和建议。',
    quickPrompts: ['如何写好个人陈述？', '推荐信应该包含什么？', '帮我修改这段文书']
  },
  {
    id: 'selection',
    name: '选校专家',
    role: '院校选择建议',
    icon: markRaw(OfficeBuilding),
    color: '#10b981',
    bgColor: '#d1fae5',
    welcome: '您好！我是您的选校专家。我拥有丰富的院校数据库，可以根据您的背景和需求，为您推荐合适的学校和专业。请告诉我您的GPA、语言成绩和意向方向，我会为您制定选校策略。',
    quickPrompts: ['根据我的背景推荐学校', '这所学校录取难度如何？', '比较这几所学校的优劣']
  },
  {
    id: 'visa',
    name: '签证助手',
    role: '签证申请指导',
    icon: markRaw(Stamp),
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    welcome: '您好！我是您的签证助手。我熟悉各国签证申请流程，可以为您解答关于签证材料、面签准备、签证政策等方面的问题。请告诉我您的签证需求，我会为您提供详细指导。',
    quickPrompts: ['签证需要准备哪些材料？', '面签常见问题有哪些？', '签证被拒怎么办？']
  }
])

const currentAgentId = ref('consultant')
const currentAgent = computed(() => agents.value.find(a => a.id === currentAgentId.value) || agents.value[0])
const sidebarCollapsed = ref(true)
const selectedProvider = ref(null)
const inputMessage = ref('')
const messagesContainer = ref(null)
const messages = ref([])
const historyVisible = ref(false)
const conversations = ref([])
const currentConversationId = ref(null)
const lastError = ref(null)
const userData = ref(null)
const enableThinking = ref(false)

const CHAT_STATE_KEY = 'ai_chat_current_state'

const currentStream = ref(null)
let isRestoringState = false
let isFreshEntry = true

const { scrollToBottom, handleUserScroll: handleStreamScroll } = useAIStream({
  taskId: `chat-${currentAgentId.value}`,
  enableThinking: enableThinking.value,
  autoRestore: false,
  autoScroll: true,
  scrollContainer: () => messagesContainer.value,
  onStateChange: (state) => {
    if (state === 'error') {
      lastError.value = { title: '请求失败', message: '请检查网络连接或重试' }
    }
  },
  onQueueChange: (pos) => {
    console.log('Queue position:', pos)
  }
})

const loadUserData = () => {
  const saved = localStorage.getItem('assessment_form')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      userData.value = data.form || data
    } catch (_e) {
      userData.value = null
    }
  } else {
    const report = localStorage.getItem('assessment_report')
    if (report) {
      try {
        const reportData = JSON.parse(report)
        userData.value = {
          basic: reportData.basic || {},
          academic: reportData.academic || {},
          practice: reportData.practice || {}
        }
      } catch (_e) {
        userData.value = null
      }
    }
  }
}

const goBack = () => {
  router.back()
}

const saveCurrentState = () => {
  if (isRestoringState) return
  const state = {
    messages: messages.value,
    currentAgentId: currentAgentId.value,
    currentConversationId: currentConversationId.value,
    savedAt: Date.now()
  }
  localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state))
}

const loadCurrentState = () => {
  const saved = localStorage.getItem(CHAT_STATE_KEY)
  if (saved) {
    try {
      const state = JSON.parse(saved)
      if (state.messages && state.messages.length > 0) {
        isRestoringState = true
        currentAgentId.value = state.currentAgentId || 'consultant'
        currentConversationId.value = state.currentConversationId || null
        messages.value = state.messages
        isRestoringState = false
        nextTick(() => scrollToBottom(true))
      }
    } catch (_e) {
      isRestoringState = false
    }
  }
}

const clearCurrentState = () => {
  localStorage.removeItem(CHAT_STATE_KEY)
}

const groupedConversations = computed(() => {
  const groups = {}
  conversations.value.forEach(conv => {
    const date = new Date(conv.createdAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(conv)
  })
  return groups
})

const providers = computed(() => {
  const saved = localStorage.getItem('ai_providers')
  return saved ? JSON.parse(saved) : []
})

const currentProviderName = computed(() => {
  const provider = providers.value.find(p => p.id === selectedProvider.value)
  return provider ? provider.name : '选择模型'
})

const getAgentName = (agentId) => {
  const agent = agents.value.find(a => a.id === agentId)
  return agent ? agent.name : 'AI助手'
}

const loadProviders = () => {
  const saved = localStorage.getItem('ai_providers')
  if (saved) {
    const parsed = JSON.parse(saved)
    if (parsed.length > 0) {
      selectedProvider.value = parsed[0].id
    }
  }
}

const selectAgent = (agentId) => {
  if (currentAgentId.value === agentId) return

  if (messages.value.length > 0) {
    saveConversation()
  }

  currentAgentId.value = agentId

  if (isFreshEntry) {
    messages.value = []
    currentConversationId.value = null
    clearCurrentState()
    return
  }

  const lastConv = conversations.value
    .filter(c => c.agentId === agentId)
    .sort((a, b) => b.createdAt - a.createdAt)[0]

  if (lastConv && lastConv.messages && lastConv.messages.length > 0) {
    messages.value = JSON.parse(JSON.stringify(lastConv.messages))
    currentConversationId.value = lastConv.id
    saveCurrentState()
  } else {
    messages.value = []
    currentConversationId.value = null
    clearCurrentState()
  }
}

const toggleThinking = () => {
  enableThinking.value = !enableThinking.value
}

const useQuickPrompt = (prompt) => {
  inputMessage.value = prompt
  sendMessage()
}

const autoResize = (e) => {
  const textarea = e.target
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
}

const sendMessage = async () => {
  isFreshEntry = false
  
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入消息')
    return
  }

  if (!selectedProvider.value) {
    ElMessage.warning('请先配置AI提供商')
    router.push('/ai-config')
    return
  }

  const userMsg = {
    id: Date.now(),
    role: 'user',
    content: inputMessage.value,
    timestamp: Date.now()
  }
  messages.value.push(userMsg)
  inputMessage.value = ''

  clearError()
  scrollToBottom(true)
  
  const aiMsg = {
    id: Date.now() + 1,
    role: 'assistant',
    content: '',
    reasoning: '',
    showReasoning: false,
    isThinking: enableThinking.value,
    timestamp: Date.now()
  }
  messages.value.push(aiMsg)
  const aiMsgIndex = messages.value.length - 1

  try {
    const systemPrompt = buildSystemPrompt(currentAgentId.value, userData.value)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.value
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
    ]

    // 创建新的 stream 实例
    const stream = useAIStream({
      taskId: `chat-${currentAgentId.value}-${Date.now()}`,
      enableThinking: enableThinking.value,
      autoRestore: false,
      autoScroll: true,
      scrollContainer: () => messagesContainer.value
    })
    currentStream.value = stream

    let hasReasoningContent = false

    const pollInterval = setInterval(() => {
      if (stream.content.value) {
        messages.value[aiMsgIndex].content = stream.content.value
        messages.value[aiMsgIndex].isThinking = false
      }
      if (enableThinking.value && stream.reasoning.value) {
        if (!hasReasoningContent && stream.reasoning.value.length > 50) {
          hasReasoningContent = true
          messages.value[aiMsgIndex].showReasoning = true
        }
        messages.value[aiMsgIndex].reasoning = stream.reasoning.value
      }
      if (stream.content.value && stream.content.value.length > 100 && hasReasoningContent) {
        messages.value[aiMsgIndex].showReasoning = false
      }
      
      if (!stream.isStreaming.value && !stream.isThinking.value) {
        clearInterval(pollInterval)
      }
    }, 100)

    try {
      await stream.generateWithProvider(selectedProvider.value, apiMessages)
    } finally {
      clearInterval(pollInterval)
    }

    // 最终更新
    if (stream.content.value) {
      messages.value[aiMsgIndex].content = stream.content.value
    }
    if (enableThinking.value && stream.reasoning.value) {
      messages.value[aiMsgIndex].reasoning = stream.reasoning.value
    }
    messages.value[aiMsgIndex].showReasoning = false
    messages.value[aiMsgIndex].isThinking = false
    
    saveCurrentState()
  } catch (error) {
    lastError.value = {
      title: '请求失败',
      message: error.message || '请检查网络连接或重试'
    }
    messages.value[aiMsgIndex].content = `抱歉，请求失败：${error.message}。您可以点击下方「重试」按钮重新发送。`
  } finally {
    currentStream.value = null
    saveCurrentState()
    nextTick(() => scrollToBottom())
  }
}

const isLastMessage = (msg) => {
  const lastMsg = messages.value[messages.value.length - 1]
  return lastMsg && lastMsg.id === msg.id
}

const copyMessage = async (msg) => {
  try {
    await navigator.clipboard.writeText(msg.content)
    ElMessage.success('已复制到剪贴板')
  } catch (_e) {
    const textarea = document.createElement('textarea')
    textarea.value = msg.content
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制到剪贴板')
  }
}

const setFeedback = (msg, type) => {
  if (msg.feedback === type) {
    msg.feedback = null
  } else {
    msg.feedback = type
    ElMessage.success(type === 'good' ? '感谢您的反馈 👍' : '我们会继续改进 🙏')
  }
  saveCurrentState()
}

let lastUserMessageForRegen = null
const regenerateLastResponse = async () => {
  const assistantMsgs = messages.value.filter(m => m.role === 'assistant')
  if (assistantMsgs.length === 0) return

  const lastAssistantMsg = assistantMsgs[assistantMsgs.length - 1]
  const lastUserMsgIdx = messages.value.findLastIndex(m => m.role === 'user')

  if (lastUserMsgIdx < 0) return

  lastUserMessageForRegen = messages.value[lastUserMsgIdx].content

  messages.value.pop()
  saveCurrentState()

  inputMessage.value = lastUserMessageForRegen
  await sendMessage()
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const handleUserScroll = () => {
  if (!messagesContainer.value) return
  if (currentStream.value) {
    currentStream.value.handleUserScroll()
  } else {
    handleStreamScroll()
  }
}

const clearError = () => {
  lastError.value = null
}

const startNewChat = () => {
  if (messages.value.length > 0) {
    saveConversation()
  }
  messages.value = []
  currentConversationId.value = null
  clearCurrentState()
  ElMessage.success('已开始新对话')
}

const openHistory = () => {
  historyVisible.value = true
}

const stopGeneration = () => {
  if (currentStream.value) {
    currentStream.value.stop()
    currentStream.value = null
  }
  stopActiveGeneration()
  saveCurrentState()
}

const handleRetry = async () => {
  clearError()
  await retryActiveStream()
}

const saveConversation = () => {
  if (messages.value.length > 0) {
    const existingIdx = conversations.value.findIndex(c => c.id === currentConversationId.value)
    const conv = {
      id: currentConversationId.value || Date.now(),
      title: messages.value[0].content.substring(0, 30) + '...',
      createdAt: currentConversationId.value ? getConversationById(currentConversationId.value)?.createdAt || Date.now() : Date.now(),
      agentId: currentAgentId.value,
      messages: JSON.parse(JSON.stringify(messages.value))
    }

    if (existingIdx >= 0) {
      conversations.value[existingIdx] = conv
    } else {
      conversations.value.unshift(conv)
    }

    localStorage.setItem('conversations', JSON.stringify(conversations.value))
  }
}

const getConversationById = (id) => {
  return conversations.value.find(c => c.id === id)
}

const loadConversation = (conv) => {
  messages.value = conv.messages || []
  currentAgentId.value = conv.agentId || 'consultant'
  currentConversationId.value = conv.id || null
  historyVisible.value = false
  saveCurrentState()
}

const deleteConversation = (convId) => {
  if (confirm('删除此对话记录？')) {
    conversations.value = conversations.value.filter(c => c.id !== convId)
    localStorage.setItem('conversations', JSON.stringify(conversations.value))
    if (currentConversationId.value === convId) {
      messages.value = []
      currentConversationId.value = null
    }
  }
}

let saveTimeout = null
const autoSaveConversation = () => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    if (messages.value.length > 0) {
      saveConversation()
    }
  }, 2000)
}

watch(messages, (newVal) => {
  if (isRestoringState) return
  if (newVal.length > 0) {
    autoSaveConversation()
  }
  if (!isGenerating.value) {
    saveCurrentState()
  }
}, { deep: true })

watch(currentAgentId, () => {
  saveCurrentState()
})

onMounted(() => {
  loadProviders()
  loadUserData()
  
  const saved = localStorage.getItem('conversations')
  if (saved) {
    conversations.value = JSON.parse(saved)
    conversations.value.forEach((conv, idx) => {
      if (!conv.id) {
        conv.id = Date.now() + idx
      }
    })
  }

  loadCurrentState()
})

onUnmounted(() => {
  saveCurrentState()
  
  if (currentStream.value) {
    currentStream.value.stop()
  }
  
  isFreshEntry = true
})
</script>

<style scoped>
.ai-chat-page {
  display: flex;
  height: 100vh;
  background: #ffffff;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar {
  width: 72px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
}

.sidebar.is-collapsed {
  width: 72px;
}

.sidebar-header {
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
}

.sidebar-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.sidebar-toggle-btn:hover {
  background: var(--color-slate-50);
  border-color: var(--color-slate-700);
  color: var(--color-slate-700);
}

.agent-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.agent-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.agent-item:hover {
  transform: scale(1.05);
}

.agent-item .agent-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-agent-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.header-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.header-role {
  font-size: 12px;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background: #ffffff;
}

.welcome-fullscreen {
  min-height: calc(100% - 48px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 40px 40px;
}

.welcome-content {
  text-align: left;
  max-width: 680px;
  width: 100%;
}

.welcome-header {
  margin-bottom: 20px;
}

.welcome-title-large {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.welcome-role-large {
  font-size: 15px;
  color: var(--color-text-secondary);
  font-weight: 500;
  margin: 0;
}

.welcome-desc {
  background: transparent;
  border-radius: 0;
  padding: 0;
  margin-bottom: 32px;
  border: none;
  max-width: 100%;
}

.welcome-desc p {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #475569;
  text-align: left;
}

.quick-actions-section {
  margin-top: 32px;
}

.quick-actions-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quick-actions-large {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-prompt-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-prompt-card:hover {
  border-color: var(--color-slate-700);
  background: var(--color-slate-50);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.08);
}

.prompt-text {
  font-size: 15px;
  font-weight: 500;
  color: #334155;
}

.quick-prompt-card:hover .prompt-text {
  color: var(--color-slate-700);
}

.prompt-arrow {
  color: #94a3b8;
  font-size: 16px;
  transition: all 0.2s ease;
}

.quick-prompt-card:hover .prompt-arrow {
  color: var(--color-slate-700);
  transform: translateX(4px);
}

.message-wrapper {
  margin-bottom: 16px;
}

.message-wrapper.is-user {
  display: flex;
  justify-content: flex-end;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message-wrapper.is-user .message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.message-content {
  background: #f8fafc;
  border-radius: 14px;
  padding: 14px 18px;
  border: 1px solid #e2e8f0;
}

.message-wrapper.is-user .message-content {
  background: var(--color-solid);
  color: white;
  border-color: transparent;
}

.message-text {
  font-size: 15px;
  line-height: 1.75;
  color: #334155;
}

.message-wrapper.is-user .message-text {
  color: white;
}

.message-text :deep(p) {
  margin: 0 0 10px 0;
}

.message-text :deep(p:last-child) {
  margin-bottom: 0;
}

.message-text :deep(ul), .message-text :deep(ol) {
  margin: 10px 0;
  padding-left: 24px;
}

.message-text :deep(li) {
  margin-bottom: 6px;
}

.message-text :deep(code) {
  background: #e2e8f0;
  padding: 3px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
}

.message-wrapper.is-user .message-text :deep(code) {
  background: rgba(255, 255, 255, 0.25);
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: var(--color-slate-700);
  margin-left: 4px;
  animation: blink 1s infinite;
  vertical-align: middle;
}

.waiting-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.waiting-dots {
  display: flex;
  gap: 4px;
}

.waiting-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-slate-700);
  opacity: 0.4;
  animation: dot-bounce 1.4s ease-in-out infinite;
}

.waiting-dots .dot:nth-child(1) { animation-delay: 0s; }
.waiting-dots .dot:nth-child(2) { animation-delay: 0.16s; }
.waiting-dots .dot:nth-child(3) { animation-delay: 0.32s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.waiting-text {
  font-size: 13px;
  color: #94a3b8;
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message-content:hover .message-actions {
  opacity: 1;
}

.message-wrapper.is-user .message-actions {
  justify-content: flex-end;
  border-top-color: rgba(255, 255, 255, 0.15);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #475569;
}

.message-wrapper.is-user .action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.action-btn.is-active {
  color: var(--color-slate-700);
  background: var(--color-slate-50);
}

.message-wrapper.is-user .action-btn.is-active {
  color: white;
  background: rgba(255, 255, 255, 0.25);
}

.action-regenerate {
  margin-left: 4px;
  padding-left: 10px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.queue-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #92400e;
}

.queue-icon {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.error-banner {
  background: #fef0f0;
  border-top: 1px solid #fde2e2;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.error-icon {
  color: #f56c6c;
  flex-shrink: 0;
}

.error-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.error-title {
  font-size: 13px;
  font-weight: 600;
  color: #f56c6c;
}

.error-desc {
  font-size: 12px;
  color: #909399;
}

.error-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.input-section {
  border-top: 1px solid #e2e8f0;
  padding: 16px 20px 20px;
  background: #ffffff;
}

.chat-input-container {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.chat-input-container:focus-within {
  border-color: var(--color-slate-700);
  box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.08);
}

.chat-input-wrapper {
  padding: 14px 16px;
  background: #ffffff;
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
  font-family: inherit;
}

.chat-textarea::placeholder {
  color: #9ca3af;
}

.chat-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chat-input-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.toolbar-btn.is-active {
  background: #dbeafe;
  color: #2563eb;
}

.toolbar-btn.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn.is-disabled:hover {
  background: transparent;
}

.toolbar-btn .model-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.send-button {
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
  transition: all 0.2s ease;
}

.send-button.is-active {
  background: var(--color-slate-700);
  color: white;
  cursor: pointer;
}

.send-button.is-active:hover {
  background: #1e3a5f;
  transform: scale(1.05);
}

.send-button.is-stop {
  background: #ef4444;
  color: white;
  cursor: pointer;
}

.send-button.is-stop:hover {
  background: #dc2626;
}

.model-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 140px;
}

.model-option .option-name {
  font-size: 13px;
  color: #374151;
}

.model-option .el-icon {
  color: var(--color-slate-700);
}

.history-drawer :deep(.el-drawer__header) {
  margin-bottom: 16px;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.history-list {
  padding: 0 16px;
}

.empty-history {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  color: #dcdfe6;
  margin-bottom: 16px;
}

.history-group {
  margin-bottom: 20px;
}

.history-date {
  font-size: 12px;
  font-weight: 600;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding-left: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.history-item:hover {
  background: #f5f7fa;
}

.history-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-slate-700);
  flex-shrink: 0;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.history-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.message-reasoning {
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
  border: 1px solid #fcd34d;
  border-radius: 10px;
  overflow: hidden;
}

.message-reasoning.is-thinking {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-color: #60a5fa;
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: #60a5fa; }
  50% { border-color: #3b82f6; }
}

.thinking-tag {
  margin-left: 8px;
  animation: pulse 1.5s ease-in-out infinite;
}

.reasoning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #d97706;
  user-select: none;
}

.reasoning-header:hover {
  background: rgba(252, 211, 77, 0.2);
}

.reasoning-arrow {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.reasoning-arrow.is-expanded {
  transform: rotate(180deg);
}

.reasoning-content {
  padding: 12px 14px;
  padding-top: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #92400e;
  white-space: pre-wrap;
  border-top: 1px solid rgba(252, 211, 77, 0.5);
  margin-top: 8px;
  padding-top: 12px;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .chat-messages {
    padding: 20px;
  }

  .input-section {
    padding: 16px;
  }

  .message {
    max-width: 90%;
  }

  .welcome-title-large {
    font-size: 28px;
  }

  .quick-actions-large {
    flex-direction: column;
  }
}
</style>
