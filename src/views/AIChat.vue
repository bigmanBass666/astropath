<template>
  <div class="ai-chat-page">
    <div class="sidebar" :class="{ 'is-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <template v-if="!sidebarCollapsed">
          <div class="sidebar-brand">
            <el-icon :size="20"><ChatDotRound /></el-icon>
            <span>AI 助手</span>
          </div>
        </template>
        <button class="sidebar-toggle-btn" @click="toggleSidebar" :title="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'">
          <el-icon :size="18">
            <ArrowLeft v-if="!sidebarCollapsed" />
            <ArrowRight v-else />
          </el-icon>
        </button>
      </div>
      <div class="agent-list">
        <div
          v-for="agent in agents"
          :key="agent.id"
          class="agent-item"
          :class="{ 'is-active': currentAgentId === agent.id }"
          @click="selectAgent(agent.id)"
          :title="sidebarCollapsed ? agent.name : ''"
        >
          <div class="agent-icon" :style="{ background: agent.gradient }">
            <el-icon :size="20"><component :is="agent.icon" /></el-icon>
          </div>
          <div class="agent-info" v-if="!sidebarCollapsed">
            <span class="agent-name">{{ agent.name }}</span>
            <span class="agent-role">{{ agent.role }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="main-chat">
      <div class="chat-header">
        <div class="header-left">
          <div class="header-agent-info">
            <div class="header-icon" :style="{ background: currentAgent?.gradient }">
              <el-icon :size="18"><component :is="currentAgent?.icon" /></el-icon>
            </div>
            <div class="header-text">
              <span class="header-name">{{ currentAgent?.name }}</span>
              <span class="header-role">{{ currentAgent?.role }}</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <el-button size="small" text :icon="Plus" @click="startNewChat">新对话</el-button>
          <el-button size="small" text :icon="Clock" @click="openHistory">历史记录</el-button>
          <el-button size="small" text :icon="ArrowLeft" @click="goBack">返回</el-button>
        </div>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div v-if="messages.length === 0 && currentAgent" class="welcome-fullscreen">
          <div class="welcome-content">
            <div class="welcome-icon-large" :style="{ background: currentAgent.gradient }">
              <el-icon :size="48"><component :is="currentAgent.icon" /></el-icon>
            </div>
            <h2 class="welcome-title-large">{{ currentAgent.name }}</h2>
            <p class="welcome-role-large">{{ currentAgent.role }}</p>
            <div class="welcome-desc">
              <p>{{ currentAgent.welcome }}</p>
            </div>
            <div class="quick-actions-large">
              <el-button
                v-for="(prompt, idx) in currentAgent.quickPrompts"
                :key="idx"
                type="primary"
                plain
                class="quick-prompt-large"
                @click="useQuickPrompt(prompt)"
              >
                {{ prompt }}
              </el-button>
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
              <div class="message-avatar" :style="{ background: msg.role === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : currentAgent?.gradient }">
                <el-icon :size="16">
                  <User v-if="msg.role === 'user'" />
                  <component :is="currentAgent?.icon" v-else />
                </el-icon>
              </div>
              <div class="message-content">
                <div class="message-text">
                  <span v-html="renderMessage(msg.content)"></span>
                  <span v-if="isGenerating && msg.role === 'assistant' && isLastMessage(msg)" class="typing-cursor"></span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isGenerating && !hasStreamingMessage" class="message-wrapper">
            <div class="message">
              <div class="message-avatar" :style="{ background: currentAgent?.gradient }">
                <el-icon :size="16"><component :is="currentAgent?.icon" /></el-icon>
              </div>
              <div class="message-content">
                <div class="message-text">
                  <span v-html="renderMessage(streamingContent || '')"></span>
                  <span class="typing-cursor"></span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div v-if="lastError" class="error-banner">
          <div class="error-content">
            <el-icon class="error-icon" :size="18"><WarningFilled /></el-icon>
            <div class="error-info">
              <span class="error-title">{{ getErrorTitle(lastError.type) }}</span>
              <span class="error-desc">{{ lastError.message }}</span>
            </div>
          </div>
          <div class="error-actions">
            <el-button type="primary" size="small" @click="retryLastMessage">重试</el-button>
            <el-button size="small" text @click="clearError">忽略</el-button>
          </div>
        </div>
      </div>

      <div class="input-section">
        <div class="input-box">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="2"
            placeholder="输入您的问题，按 Enter 发送..."
            @keydown.enter.exact.prevent="sendMessage"
            :disabled="isGenerating"
            resize="none"
            class="message-input"
          />
          <div class="input-actions">
            <el-dropdown
              v-if="providers.length > 0"
              trigger="click"
              class="model-dropdown"
              @command="(cmd) => selectedProvider = cmd"
            >
              <div class="model-selector">
                <el-icon :size="14"><Cpu /></el-icon>
                <span class="model-name">{{ currentProviderName }}</span>
                <el-icon :size="12"><ArrowDown /></el-icon>
              </div>
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
                      <el-icon v-if="selectedProvider === p.id" :size="12"><Check /></el-icon>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              v-else
              size="small"
              class="config-model-btn"
              @click="$router.push('/ai-config')"
            >
              <el-icon :size="14"><Setting /></el-icon>
              配置模型
            </el-button>
            <el-button
              v-if="!isGenerating"
              type="primary"
              class="send-btn"
              @click="sendMessage"
              :disabled="!inputMessage.trim()"
            >
              <el-icon :size="18"><Promotion /></el-icon>
            </el-button>
            <el-button
              v-else
              type="danger"
              class="send-btn"
              @click="stopGeneration"
            >
              <el-icon :size="18"><VideoPause /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-drawer v-model="historyVisible" title="历史对话" size="380px" class="history-drawer">
      <div class="history-list">
        <div v-if="conversations.length === 0" class="empty-history">
          <el-icon :size="48" class="empty-icon"><ChatDotRound /></el-icon>
          <p>暂无历史对话</p>
        </div>
        <template v-else>
          <div
            v-for="(group, date) in groupedConversations"
            :key="date"
            class="history-group"
          >
            <div class="history-date">{{ date }}</div>
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
                <div class="history-title">{{ conv.title || '新对话' }}</div>
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
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ChatLineRound, User, WarningFilled, Delete, Clock,
  Download, Promotion, VideoPause, ChatDotRound,
  School, Document, Files, Ticket, ArrowLeft, ArrowRight,
  Cpu, ArrowDown, Check, Setting, Plus
} from '@element-plus/icons-vue'
import { marked } from 'marked'
import { sendMessageToAI, buildSystemPrompt, AIError } from '@/utils/ai-api'

const router = useRouter()

const agents = ref([
  {
    id: 'consultant',
    name: '留学顾问',
    role: '整体规划咨询',
    icon: School,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    welcome: '您好！我是您的留学顾问。我可以帮您制定整体的留学规划，包括背景提升、时间安排、申请策略等。请告诉我您的留学目标或任何困惑，我会为您提供专业建议。',
    quickPrompts: ['帮我制定留学时间规划', '我的背景能申请什么学校？', '需要准备哪些申请材料？']
  },
  {
    id: 'essay',
    name: '文书导师',
    role: '文书写作指导',
    icon: Document,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    welcome: '您好！我是您的文书导师。我专注于帮助您撰写高质量的申请文书，包括个人陈述、简历、推荐信等。请告诉我您需要什么样的文书帮助，我会为您提供指导和建议。',
    quickPrompts: ['如何写好个人陈述？', '推荐信应该包含什么？', '帮我修改这段文书']
  },
  {
    id: 'selection',
    name: '选校专家',
    role: '院校选择建议',
    icon: Files,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    welcome: '您好！我是您的选校专家。我拥有丰富的院校数据库，可以根据您的背景和需求，为您推荐合适的学校和专业。请告诉我您的GPA、语言成绩和意向方向，我会为您制定选校策略。',
    quickPrompts: ['根据我的背景推荐学校', '这所学校录取难度如何？', '比较这几所学校的优劣']
  },
  {
    id: 'visa',
    name: '签证助手',
    role: '签证申请指导',
    icon: Ticket,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    welcome: '您好！我是您的签证助手。我熟悉各国签证申请流程，可以为您解答关于签证材料、面签准备、签证政策等方面的问题。请告诉我您的签证需求，我会为您提供详细指导。',
    quickPrompts: ['签证需要准备哪些材料？', '面签常见问题有哪些？', '签证被拒怎么办？']
  }
])

const currentAgentId = ref('consultant')
const currentAgent = computed(() => agents.value.find(a => a.id === currentAgentId.value) || agents.value[0])
const sidebarCollapsed = ref(false)
const hasStreamingMessage = computed(() => messages.value.some(m => m.role === 'assistant' && m.content === ''))
const selectedProvider = ref(null)
const inputMessage = ref('')
const isGenerating = ref(false)
const streamingContent = ref('')
const messagesContainer = ref(null)
const messages = ref([])
const historyVisible = ref(false)
const conversations = ref([])
const currentConversationId = ref(null)
const lastError = ref(null)
const retryMessage = ref(null)

const CHAT_STATE_KEY = 'ai_chat_current_state'

let isRestoringState = false
let isFreshEntry = true

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const goBack = () => {
  router.back()
}

const saveCurrentState = () => {
  if (isRestoringState) return
  const state = {
    messages: messages.value,
    currentAgentId: currentAgentId.value,
    isGenerating: isGenerating.value,
    streamingContent: streamingContent.value,
    currentConversationId: currentConversationId.value
  }
  console.log('[AIChat] Saving state:', state)
  sessionStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state))
}

const loadCurrentState = () => {
  const saved = sessionStorage.getItem(CHAT_STATE_KEY)
  console.log('[AIChat] Loading state from sessionStorage:', saved)
  if (saved) {
    try {
      const state = JSON.parse(saved)
      console.log('[AIChat] Parsed state:', state)
      if (state.messages && state.messages.length > 0) {
        isRestoringState = true
        currentAgentId.value = state.currentAgentId || 'consultant'
        currentConversationId.value = state.currentConversationId || null
        messages.value = state.messages
        console.log('[AIChat] Restored messages:', messages.value.length, 'agentId:', currentAgentId.value)
        if (state.isGenerating) {
          isGenerating.value = false
          streamingContent.value = ''
          const lastMsg = messages.value[messages.value.length - 1]
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content === '') {
            messages.value.pop()
          }
        }
        isRestoringState = false
      }
    } catch (e) {
      console.error('Failed to load chat state:', e)
      isRestoringState = false
    }
  }
}

const clearCurrentState = () => {
  sessionStorage.removeItem(CHAT_STATE_KEY)
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

const useQuickPrompt = (prompt) => {
  inputMessage.value = prompt
  sendMessage()
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
    timestamp: new Date().getTime()
  }
  messages.value.push(userMsg)
  const currentMessage = inputMessage.value
  inputMessage.value = ''

  isGenerating.value = true
  streamingContent.value = ''
  clearError()
  await nextTick(() => scrollToBottom())

  try {
    const systemPrompt = buildSystemPrompt(currentAgentId.value)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.value.filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
    ]

    const aiMsgId = Date.now() + 1
    const aiMsg = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().getTime()
    }
    messages.value.push(aiMsg)

    const stream = await sendMessageToAI(selectedProvider.value, apiMessages, {
      temperature: 0.7,
      maxTokens: 1000,
      stream: true
    })

    console.log('[AIChat] Got stream, starting to read...')
    let chunkCount = 0
    for await (const chunk of stream) {
      chunkCount++
      console.log('[AIChat] Chunk', chunkCount, chunk)
      if (!isGenerating.value) break
      if (chunk.type === 'content') {
        streamingContent.value += chunk.content
        aiMsg.content = streamingContent.value
        await nextTick(() => scrollToBottom())
        await new Promise(resolve => setTimeout(resolve, 20))
      }
    }
    console.log('[AIChat] Stream finished, total chunks:', chunkCount)

    streamingContent.value = ''
    saveCurrentState()
  } catch (error) {
    if (error instanceof AIError) {
      lastError.value = {
        type: error.type,
        message: error.message,
        canRetry: true
      }
      retryMessage.value = currentMessage

      ElMessage.error({
        message: getErrorTitle(error.type),
        duration: 5000
      })
    } else {
      lastError.value = {
        type: 'unknown',
        message: error.message,
        canRetry: true
      }
      retryMessage.value = currentMessage
      ElMessage.error(`请求失败: ${error.message}`)
    }

    const errorMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `抱歉，请求失败：${getErrorTitle(lastError.value.type)} - ${lastError.value.message}。您可以点击下方「重试」按钮重新发送，或检查配置后重试。`,
      timestamp: new Date().getTime()
    }
    messages.value.push(errorMsg)
  } finally {
    isGenerating.value = false
    streamingContent.value = ''
    await nextTick(() => scrollToBottom())
  }
}

const renderMessage = (content) => {
  if (!content) return ''
  try {
    return marked(content)
  } catch (e) {
    console.error('[AIChat] Failed to render message:', e)
    return content
  }
}

const getSenderName = (msg) => {
  if (msg.role === 'user') return '您'
  return currentAgent.value?.name || 'AI助手'
}

const isLastMessage = (msg) => {
  const lastMsg = messages.value[messages.value.length - 1]
  return lastMsg && lastMsg.id === msg.id
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const getErrorTitle = (errorType) => {
  const titles = {
    network: '网络连接失败',
    auth: '认证失败',
    config: '配置问题',
    unsupported: '不支持的提供商',
    api: '服务请求失败'
  }
  return titles[errorType] || '发生错误'
}

const clearError = () => {
  lastError.value = null
  retryMessage.value = null
}

const retryLastMessage = async () => {
  if (retryMessage.value) {
    const message = retryMessage.value
    clearError()
    inputMessage.value = message
    await sendMessage()
  }
}

const clearChat = () => {
  if (confirm('确定清空当前对话？')) {
    messages.value = []
    streamingContent.value = ''
    clearError()
    currentConversationId.value = null
    clearCurrentState()
  }
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

const exportConversation = () => {
  if (messages.value.length === 0) {
    ElMessage.warning('当前对话为空，无法导出')
    return
  }

  const agentName = currentAgent.value?.name || 'AI对话'
  const dateStr = new Date().toLocaleString('zh-CN')
  let textContent = `=== ${agentName} 对话记录 ===\n`
  textContent += `导出时间: ${dateStr}\n`
  textContent += `对话轮次: ${messages.value.length} 条消息\n`
  textContent += '='.repeat(50) + '\n\n'

  messages.value.forEach(msg => {
    const time = formatTime(msg.timestamp)
    const role = msg.role === 'user' ? '您' : agentName
    textContent += `[${time}] ${role}:\n${msg.content}\n\n`
  })

  const blob = new Blob(['\ufeff' + textContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `对话记录_${agentName}_${new Date().toISOString().slice(0,10)}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success('对话记录已导出')
}

const stopGeneration = () => {
  isGenerating.value = false
  streamingContent.value = ''
}

const saveConversation = () => {
  if (messages.value.length > 0) {
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg) {
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
  clearCurrentState()
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
  width: 200px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
}

.sidebar.is-collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
}

.sidebar.is-collapsed .sidebar-header {
  padding: 12px 10px;
  justify-content: center;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
  font-size: 15px;
  font-weight: 600;
}

.sidebar-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.sidebar-toggle-btn:hover {
  background: #f1f5f9;
  border-color: #667eea;
  color: #667eea;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  white-space: nowrap;
}

.sidebar-subtitle {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
}

.agent-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.agent-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.sidebar.is-collapsed .agent-item {
  justify-content: center;
  padding: 10px 6px;
}

.agent-item:hover {
  background: #f1f5f9;
}

.agent-item.is-active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  position: relative;
}

.agent-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 3px 3px 0;
}

.sidebar.is-collapsed .agent-item.is-active {
  background: transparent;
}

.sidebar.is-collapsed .agent-item.is-active::before {
  height: 32px;
  width: 4px;
}

.sidebar.is-collapsed .agent-item.is-active .agent-icon {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3), 0 4px 12px rgba(102, 126, 234, 0.25);
  transform: scale(1.05);
}

.agent-item .agent-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.agent-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.agent-item .agent-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.agent-item .agent-role {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.welcome-content {
  text-align: center;
  max-width: 700px;
}

.welcome-icon-large {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.welcome-title-large {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.welcome-role-large {
  font-size: 15px;
  color: #6366f1;
  font-weight: 500;
  margin: 0 0 24px 0;
}

.welcome-desc {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px 28px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  max-width: 600px;
}

.welcome-desc p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #475569;
  text-align: center;
}

.quick-actions-large {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.quick-prompt-large {
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  height: auto;
  border-color: #e2e8f0;
  color: #475569;
  transition: all 0.2s ease;
}

.quick-prompt-large:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #f8fafc;
  transform: translateY(-1px);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: #667eea;
  margin-left: 4px;
  animation: blink 1s infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
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
  padding: 16px 32px 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.input-box {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: #ffffff;
  border-radius: 20px;
  padding: 14px 18px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.input-box:focus-within {
  border-color: #667eea;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.15), 0 1px 3px rgba(0, 0, 0, 0.04);
}

.message-input {
  flex: 1;
}

.message-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  resize: none;
  background: transparent;
  border: none;
  box-shadow: none;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.model-dropdown {
  cursor: pointer;
}

.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%);
  border: 1px solid #e0e7ff;
  border-radius: 12px;
  transition: all 0.25s ease;
  min-width: 120px;
}

.model-selector:hover {
  border-color: #c7d2fe;
  background: linear-gradient(135deg, #e8edff 0%, #f0f4ff 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.12);
}

.model-selector .el-icon {
  color: #667eea;
  flex-shrink: 0;
}

.model-name {
  font-size: 13px;
  font-weight: 500;
  color: #4c51bf;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  flex: 1;
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
  color: #667eea;
}

.config-model-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
  border: 1px solid #fcd34d;
  border-radius: 12px;
  color: #d97706;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.config-model-btn:hover {
  background: linear-gradient(135deg, #fde68a 0%, #fef3c7 100%);
  border-color: #fbbf24;
  color: #b45309;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.send-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.45);
  transform: translateY(-1px);
}

.send-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.35);
}

.send-btn:disabled {
  background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
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
  color: #667eea;
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

  .welcome-icon-large {
    width: 80px;
    height: 80px;
    border-radius: 24px;
  }

  .welcome-desc {
    padding: 20px;
  }

  .quick-actions-large {
    flex-direction: column;
  }

  .quick-prompt-large {
    width: 100%;
  }
}
</style>
