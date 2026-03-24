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
          <div v-if="isGenerating" class="message is-assistant">
            <div class="message-avatar">
              <el-icon><ChatLineRound /></el-icon>
            </div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
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
            <el-button type="primary" @click="sendMessage" :loading="isGenerating">
              发送
            </el-button>
            <el-button @click="clearChat" :disabled="isGenerating">清空对话</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史对话侧边栏 -->
    <el-drawer v-model="historyVisible" title="历史对话" size="400px">
      <div class="history-list">
        <div v-for="(conv, idx) in conversations" :key="idx"
          class="history-item"
          @click="loadConversation(conv)">
          <div class="history-title">{{ conv.title || '新对话' }}</div>
          <div class="history-time">{{ formatTime(conv.createdAt) }}</div>
          <el-button size="small" type="danger" text @click.stop="deleteConversation(idx)">删除</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatLineRound, User } from '@element-plus/icons-vue'
import { marked } from 'marked'
import { sendMessageToAI, buildSystemPrompt } from '@/utils/ai-api'

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
const messagesContainer = ref(null)
const messages = ref([])
const historyVisible = ref(false)
const conversations = ref([])

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
  inputMessage.value = ''

  isGenerating.value = true
  await nextTick(() => scrollToBottom())

  try {
    // 构建消息历史（包括系统提示）
    const systemPrompt = buildSystemPrompt(currentAgentId.value)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.value.filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
    ]

    const response = await sendMessageToAI(selectedProvider.value, apiMessages, {
      temperature: 0.7,
      maxTokens: 1000
    })

    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response.content || '抱歉，我无法回答这个问题。',
      timestamp: new Date().getTime()
    }
    messages.value.push(aiMsg)
  } catch (error) {
    ElMessage.error(`请求失败: ${error.message}`)
    // 添加错误消息
    const errorMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `抱歉，请求失败：${error.message}。请检查您的API配置。`,
      timestamp: new Date().getTime()
    }
    messages.value.push(errorMsg)
  } finally {
    isGenerating.value = false
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

const clearChat = () => {
  if (confirm('确定清空当前对话？')) {
    messages.value = []
  }
}

const saveConversation = () => {
  if (messages.value.length > 0) {
    const conv = {
      title: messages.value[0].content.substring(0, 30) + '...',
      createdAt: Date.now(),
      agentId: currentAgentId.value,
      messages: [...messages.value]
    }
    conversations.value.unshift(conv)
    localStorage.setItem('conversations', JSON.stringify(conversations.value))
  }
}

const loadConversation = (conv) => {
  messages.value = conv.messages || []
  currentAgentId.value = conv.agentId || 'consultant'
  historyVisible.value = false
}

const deleteConversation = (index) => {
  if (confirm('删除此对话记录？')) {
    conversations.value.splice(index, 1)
    localStorage.setItem('conversations', JSON.stringify(conversations.value))
  }
}

onMounted(() => {
  loadProviders()
  const saved = localStorage.getItem('conversations')
  if (saved) {
    conversations.value = JSON.parse(saved)
  }
  // 保存对话的watch
  watch(messages, () => {
    // 定期自动保存（实际实现可以更精细）
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
  font-size: 24px;
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
  gap: 10px;
  align-items: flex-end;
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
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
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
</style>
