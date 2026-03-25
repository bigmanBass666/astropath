<template>
  <div class="ai-chat-page">
    <h2 class="page-title">AI智能对话</h2>

    <div class="chat-container">
      <!-- 智能体列表 -->
      <div class="agent-list">
        <div class="agent-header">
          <h3>智能体</h3>
        </div>
        <div v-for="agent in agents" :key="agent.id"
          class="agent-item"
          :class="{ 'is-active': currentAgentId === agent.id }"
          @click="selectAgent(agent.id)">
          <div class="agent-avatar">
            <el-icon :size="24"><ChatLineRound /></el-icon>
          </div>
          <div class="agent-info">
            <span class="agent-name">{{ agent.name }}</span>
            <span class="agent-role">{{ agent.role }}</span>
          </div>
        </div>
      </div>

      <!-- 对话区域 -->
      <div class="chat-area">
        <!-- 移动端智能体选择器 -->
        <div class="mobile-agent-selector">
          <el-select v-model="currentAgentId" placeholder="选择智能体" size="default">
            <el-option v-for="agent in agents" :key="agent.id" :label="agent.name" :value="agent.id">
              <div class="agent-option">
                <el-icon><ChatLineRound /></el-icon>
                <span>{{ agent.name }}</span>
                <span class="agent-option-role">{{ agent.role }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="chat-messages" ref="messagesContainer">
          <div v-if="messages.length === 0 && currentAgent" class="empty-chat">
            <div class="welcome-message">
              <div class="welcome-avatar">
                <el-icon :size="48"><ChatLineRound /></el-icon>
              </div>
              <h3>{{ currentAgent.name }}</h3>
              <p class="welcome-role">{{ currentAgent.role }}</p>
              <div class="welcome-text">{{ currentAgent.welcome }}</div>
            </div>
          </div>
          <div v-for="msg in messages" :key="msg.id" class="message"
            :class="{ 'is-user': msg.role === 'user', 'is-assistant': msg.role === 'assistant' }">
            <div class="message-avatar">
              <el-icon v-if="msg.role === 'user'"><User /></el-icon>
              <el-icon v-else><ChatLineRound /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="sender-name">{{ getSenderName(msg) }}</span>
                <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div class="message-text" v-html="renderMessage(msg.content)"></div>
            </div>
          </div>
          <div v-if="isGenerating && messages[messages.length - 1]?.role === 'assistant'" class="message is-assistant">
            <div class="message-avatar">
              <el-icon><ChatLineRound /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-text" v-html="renderMessage(streamingContent || '')"></div>
              <span class="cursor-blink">|</span>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <div v-if="lastError" class="error-banner">
            <div class="error-content">
              <el-icon class="error-icon"><WarningFilled /></el-icon>
              <div class="error-message">
                <span class="error-title">{{ getErrorTitle(lastError.type) }}</span>
                <span class="error-text">{{ lastError.message }}</span>
              </div>
            </div>
            <div class="error-actions">
              <el-button size="small" type="primary" @click="retryLastMessage">重试</el-button>
              <el-button size="small" @click="clearError">忽略</el-button>
            </div>
          </div>
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="输入您的问题..."
            @keydown.enter.exact.prevent="sendMessage"
            :disabled="isGenerating"
          />
          <div class="input-actions">
            <el-select v-model="selectedProvider" placeholder="选择AI提供商" style="width: 150px;">
              <el-option v-for="p in providers" :key="p.id" :label="p.name" :value="p.id" />
            </el-select>
            <el-button type="primary" @click="sendMessage" :loading="isGenerating" v-if="!isGenerating">
              发送
            </el-button>
            <el-button type="danger" @click="stopGeneration" v-else>
              停止生成
            </el-button>
            <el-button @click="clearChat" :disabled="isGenerating">清空对话</el-button>
            <el-button @click="openHistory" :disabled="isGenerating">查看历史</el-button>
            <el-button @click="exportConversation" :disabled="messages.length === 0">导出对话</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史对话侧边栏 -->
    <el-drawer v-model="historyVisible" title="历史对话" size="400px">
      <div class="history-list">
        <div v-for="(group, date) in groupedConversations" :key="date" class="history-group">
          <div class="history-date">{{ date }}</div>
          <div v-for="(conv, idx) in group" :key="conv.createdAt"
            class="history-item"
            @click="loadConversation(conv)">
            <div class="history-title">{{ conv.title || '新对话' }}</div>
            <div class="history-time">{{ formatTime(conv.createdAt) }}</div>
            <el-button size="small" type="danger" text @click.stop="deleteConversation(conv.createdAt)">删除</el-button>
          </div>
        </div>
        <div v-if="conversations.length === 0" class="empty-history">
          暂无历史对话记录
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatLineRound, User, WarningFilled } from '@element-plus/icons-vue'
import { marked } from 'marked'
import { sendMessageToAI, buildSystemPrompt, AIError } from '@/utils/ai-api'

const router = useRouter()

// 智能体定义
const agents = ref([
  { id: 'consultant', name: '留学顾问', role: '整体规划咨询', welcome: '您好！我是您的留学顾问。我可以帮您制定整体的留学规划，包括背景提升、时间安排、申请策略等。请告诉我您的留学目标或任何困惑，我会为您提供专业建议。' },
  { id: 'essay', name: '文书导师', role: '文书写作指导', welcome: '您好！我是您的文书导师。我专注于帮助您撰写高质量的申请文书，包括个人陈述、简历、推荐信等。请告诉我您需要什么样的文书帮助，我会为您提供指导和建议。' },
  { id: 'selection', name: '选校专家', role: '院校选择建议', welcome: '您好！我是您的选校专家。我拥有丰富的院校数据库，可以根据您的背景和需求，为您推荐合适的学校和专业。请告诉我您的GPA、语言成绩和意向方向，我会为您制定选校策略。' },
  { id: 'visa', name: '签证助手', role: '签证申请指导', welcome: '您好！我是您的签证助手。我熟悉各国签证申请流程，可以为您解答关于签证材料、面签准备、签证政策等方面的问题。请告诉我您的签证需求，我会为您提供详细指导。' }
])

const currentAgentId = ref('consultant')
const currentAgent = computed(() => agents.value.find(a => a.id === currentAgentId.value))
const selectedProvider = ref(null)
const inputMessage = ref('')
const isGenerating = ref(false)
const streamingContent = ref('') // 流式响应内容
const messagesContainer = ref(null)
const messages = ref([])
const historyVisible = ref(false)
const conversations = ref([])
const currentConversationId = ref(null) // 当前会话ID
const lastError = ref(null) // 最后错误状态
const retryMessage = ref(null) // 待重试的消息

// 按日期分组的历史会话
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

// 加载保存的提供商
const providers = computed(() => {
  const saved = localStorage.getItem('ai_providers')
  return saved ? JSON.parse(saved) : []
})

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
  currentAgentId.value = agentId
  // 清空当前会话消息，显示对应欢迎语
  messages.value = []
  ElMessage.success(`已切换到 ${currentAgent.value.name}`)
}

const sendMessage = async () => {
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
  clearError() // 清除之前的错误
  await nextTick(() => scrollToBottom())

  try {
    // 构建消息历史（包括系统提示）
    const systemPrompt = buildSystemPrompt(currentAgentId.value)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.value.filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
    ]

    // 创建临时的AI消息用于流式更新
    const aiMsgId = Date.now() + 1
    const aiMsg = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().getTime()
    }
    messages.value.push(aiMsg)

    // 使用流式响应
    const stream = await sendMessageToAI(selectedProvider.value, apiMessages, {
      temperature: 0.7,
      maxTokens: 1000,
      stream: true
    })

    // 逐字接收流式内容
    for await (const chunk of stream) {
      if (!isGenerating.value) break // 用户点击停止
      if (chunk.type === 'content') {
        streamingContent.value += chunk.content
        aiMsg.content = streamingContent.value
        await nextTick(() => scrollToBottom())
      }
    }

    streamingContent.value = ''
  } catch (error) {
    // 设置错误状态
    if (error instanceof AIError) {
      lastError.value = {
        type: error.type,
        message: error.message,
        canRetry: true
      }
      retryMessage.value = currentMessage

      // 显示错误消息
      ElMessage.error({
        message: getErrorTitle(error.type),
        description: error.message,
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

    // 添加错误消息到对话
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
  return marked(content)
}

const getSenderName = (msg) => {
  if (msg.role === 'user') return '您'
  return currentAgent.value.name
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

// 错误处理相关
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
    await sendMessageWithRetry(message)
  }
}

const sendMessageWithRetry = async (messageContent) => {
  inputMessage.value = messageContent
  await sendMessage()
}

const clearChat = () => {
  if (confirm('确定清空当前对话？')) {
    messages.value = []
    streamingContent.value = ''
    clearError()
  }
}

const openHistory = () => {
  historyVisible.value = true
}

// 导出对话功能
const exportConversation = () => {
  if (messages.value.length === 0) {
    ElMessage.warning('当前对话为空，无法导出')
    return
  }

  // 生成文本内容
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

  // 创建文本文件下载
  const blob = new Blob(['\ufeff' + textContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `对话记录_${agentName}_${new Date().toISOString().slice(0,10)}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success('对话记录已导出为文本文件')
}

// 停止生成
const stopGeneration = () => {
  isGenerating.value = false
  streamingContent.value = ''
}

const saveConversation = () => {
  if (messages.value.length > 0) {
    // 检查是否已有相同会话（基于最新的消息ID）
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg) {
      // 更新现有会话或创建新会话
      const existingIdx = conversations.value.findIndex(c => c.id === currentConversationId.value)
      const conv = {
        id: currentConversationId.value || Date.now(),
        title: messages.value[0].content.substring(0, 30) + '...',
        createdAt: currentConversationId.value ? getConversationById(currentConversationId.value)?.createdAt || Date.now() : Date.now(),
        agentId: currentAgentId.value,
        messages: JSON.parse(JSON.stringify(messages.value)) // 深拷贝
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
}

const deleteConversation = (convId) => {
  if (confirm('删除此对话记录？')) {
    conversations.value = conversations.value.filter(c => c.id !== convId)
    localStorage.setItem('conversations', JSON.stringify(conversations.value))
    // 如果删除的是当前会话，清空当前对话
    if (currentConversationId.value === convId) {
      messages.value = []
      currentConversationId.value = null
    }
  }
}

// 自动保存对话（防抖）
let saveTimeout = null
const autoSaveConversation = () => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    if (messages.value.length > 0) {
      saveConversation()
    }
  }, 2000) // 2秒后自动保存
}

onMounted(() => {
  loadProviders()
  const saved = localStorage.getItem('conversations')
  if (saved) {
    conversations.value = JSON.parse(saved)
    // 恢复时给每个会话添加id（兼容旧数据）
    conversations.value.forEach((conv, idx) => {
      if (!conv.id) {
        conv.id = Date.now() + idx
      }
    })
  }

  // 监听消息变化，自动保存会话
  watch(messages, () => {
    if (messages.value.length > 0) {
      autoSaveConversation()
    }
  }, { deep: true })
})
</script>

<style scoped>
.ai-chat-page {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  gap: 15px;
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.agent-list {
  width: 200px;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 10px;
  flex-shrink: 0;
}

.agent-header {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 10px;
}

.agent-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 5px;
  transition: all 0.2s;
}

.agent-item:hover {
  background: #e4e7ed;
}

.agent-item.is-active {
  background: #667eea;
  color: white;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agent-item.is-active .agent-avatar {
  background: rgba(255, 255, 255, 0.2);
}

.agent-info {
  display: flex;
  flex-direction: column;
}

.agent-name {
  font-weight: bold;
  font-size: 14px;
}

.agent-role {
  font-size: 11px;
  opacity: 0.8;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 15px;
}

.empty-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.welcome-message {
  text-align: center;
  max-width: 500px;
}

.welcome-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.welcome-message h3 {
  font-size: 20px;
  margin: 0 0 8px 0;
  color: #303133;
}

.welcome-role {
  font-size: 14px;
  color: #909399;
  margin: 0 0 24px 0;
}

.welcome-text {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
  background: #f5f7fa;
  padding: 20px;
  border-radius: 12px;
  text-align: left;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  max-width: 85%;
}

.message.is-user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.is-assistant .message-avatar {
  background: #67c23a;
}

.message-content {
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message.is-user .message-content {
  background: #667eea;
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 15px;
}

.sender-name {
  font-weight: bold;
  font-size: 13px;
}

.message.is-user .sender-name {
  color: #c6d4ff;
}

.message-time {
  font-size: 11px;
  color: #909399;
}

.message.is-user .message-time {
  color: #c6d4ff;
}

.message-text {
  line-height: 1.6;
  font-size: 14px;
}

.message-text .cursor-blink {
  display: inline-block;
  animation: blink 1s infinite;
  color: #667eea;
  font-weight: bold;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.message-text :deep(pre) {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 5px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #909399;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.chat-input-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 错误提示banner */
.error-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fef0f0;
  border: 1px solid #fde2e2;
  border-radius: 8px;
  gap: 15px;
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
}

.error-icon {
  color: #f56c6c;
  font-size: 18px;
  margin-top: 2px;
}

.error-message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-title {
  font-weight: bold;
  color: #f56c6c;
  font-size: 14px;
}

.error-text {
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.chat-input-area .el-input {
  flex: 1;
}

.input-actions {
  display: flex;
  gap: 8px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.history-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.history-date {
  font-size: 12px;
  font-weight: bold;
  color: #909399;
  padding: 8px 12px 4px;
  background: #f5f7fa;
  position: sticky;
  top: 0;
  z-index: 1;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background: #e4e7ed;
}

.history-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 12px;
  color: #909399;
}

.empty-history {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
  font-size: 14px;
}

/* 移动端智能体选择器 - 默认隐藏（桌面端使用侧边栏） */
.mobile-agent-selector {
  display: none;
}

/* ===== 移动端响应式 ===== */

/* 768px 以下：隐藏侧边栏，显示移动端智能体选择器 */
@media (max-width: 768px) {
  .agent-list {
    display: none;
  }

  .chat-container {
    gap: 10px;
  }

  .chat-area {
    width: 100%;
    min-width: 0;
  }

  /* 显示移动端智能体选择器 */
  .mobile-agent-selector {
    display: flex;
    margin-bottom: 10px;
  }

  .mobile-agent-selector .el-select {
    width: 100%;
  }

  .agent-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .agent-option-role {
    color: #909399;
    font-size: 12px;
    margin-left: 4px;
  }

  /* 移动端输入操作按钮换行 */
  .input-actions {
    flex-wrap: wrap;
    gap: 6px;
  }

  .input-actions .el-select {
    flex: 1 1 100%;
    min-width: 0;
  }

  .input-actions .el-button {
    flex-shrink: 0;
  }

  /* 隐藏次要操作按钮，仅保留核心功能 */
  .input-actions .el-button:last-child,
  .input-actions .el-button:nth-last-child(2) {
    display: none;
  }

  .chat-input-area .el-input {
    min-width: 0;
  }

  .chat-messages {
    min-height: 200px;
  }

  .empty-chat {
    padding: 20px 10px;
  }

  .welcome-message {
    padding: 20px 10px;
  }
}

/* 480px 以下：进一步精简按钮 */
@media (max-width: 480px) {
  .input-actions .el-button:not(:first-child):not(:nth-child(2)):not(:nth-child(3)) {
    display: none;
  }
}
</style>
