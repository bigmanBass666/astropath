import { reactive, readonly, ref, computed } from 'vue'

export type AIStreamState = 'idle' | 'queued' | 'connecting' | 'thinking' | 'streaming' | 'completed' | 'error'

export type WaitingPhase = 'connecting' | 'processing' | 'ready'

export interface WaitingStateConfig {
  phases: {
    connecting: { text: string; delay: number }
    processing: { text: string; delay: number }
  }
  showDots: boolean
  showSkeleton: boolean
}

export interface EmptyUserGuidanceConfig {
  enabled: boolean
  prompt: string
  collectFields: string[]
}

export interface MessageActionsConfig {
  copy: boolean
  regenerate: boolean
  feedback: boolean
  stopButton: boolean
}

export interface ActiveStreamInfo {
  taskId: string
  isLoading: boolean
  isQueued: boolean
  isThinking: boolean
  isStreaming: boolean
  isConnecting: boolean
  hasError: boolean
  queuePosition: number
  canRetry: boolean
  retryCount: number
  maxRetries: number
  waitingPhase: 'connecting' | 'processing' | 'ready'
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIStreamOptions {
  temperature?: number
  stream?: boolean
  enableThinking?: boolean
  maxTokens?: number
  [key: string]: unknown
}

export interface AIStreamTask {
  id: string
  state: AIStreamState
  content: string
  reasoning: string
  error: string | null
  showReasoning: boolean
  timestamp: number
  providerId: string | null
  messages: ChatMessage[]
  options: AIStreamOptions
  retryCount: number
  maxRetries: number
  priority: number
  queuePosition: number
}

export interface AIConfig {
  defaultEnableThinking: boolean
  defaultTemperature: number
  defaultMaxTokens: number
  maxConcurrent: number
  retryAttempts: number
  retryDelay: number
  timeout: number
  waitingState: WaitingStateConfig
  emptyUserGuidance: EmptyUserGuidanceConfig
  messageActions: MessageActionsConfig
}

interface GlobalAIState {
  tasks: Record<string, AIStreamTask>
  queue: string[]
  activeCount: number
  config: AIConfig
}

const activeStreamRef = ref<ActiveStreamInfo | null>(null)
const streamActionsMap = new Map<string, { stop: () => void; retry: () => Promise<string> }>()

const DEFAULT_CONFIG: AIConfig = {
  defaultEnableThinking: true,
  defaultTemperature: 0.7,
  defaultMaxTokens: 128000,
  maxConcurrent: 3,
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 90000,
  waitingState: {
    phases: {
      connecting: { text: '正在连接...', delay: 800 },
      processing: { text: 'AI 正在分析...', delay: 0 }
    },
    showDots: true,
    showSkeleton: true
  },
  emptyUserGuidance: {
    enabled: true,
    prompt: `【⚠️ 重要：用户尚未填写背景信息】

用户还没有在系统中填写个人背景信息（GPA、院校、语言成绩等），所以你目前无法提供个性化的选校建议或评估。

【你应该这样做】
1. 友好地告知用户你目前还没有他们的背景信息
2. 引导用户先去「留学评估」页面填写基本信息（这是系统功能，填写后你会自动获得数据）
3. 如果用户想直接聊，可以在对话中主动收集关键信息：GPA、本科院校（985/211/双非）、语言成绩（雅思/托福）、意向国家和专业
4. 不要说"我无法查看您的简历"这类话——你本来就没有这个能力，这会让用户困惑
5. 保持友好、专业的语气，像一个真正的顾问在接待新客户`,
    collectFields: ['GPA', '本科院校', '语言成绩', '意向国家', '意向专业']
  },
  messageActions: {
    copy: true,
    regenerate: true,
    feedback: false,
    stopButton: true
  }
}

const globalState = reactive<GlobalAIState>({
  tasks: {},
  queue: [],
  activeCount: 0,
  config: { ...DEFAULT_CONFIG }
})

const STATE_KEY = 'ai_stream_state_v2'
const CONFIG_KEY = 'ai_config_v2'

let saveDebounceTimer: ReturnType<typeof setTimeout> | null = null
let isStreamingActive = false
const MAX_COMPLETED_TASKS = 10

function scheduleSave(immediate = false) {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer)
  if (immediate || !isStreamingActive) {
    saveStateToStorage()
  } else {
    saveDebounceTimer = setTimeout(() => {
      saveStateToStorage()
      saveDebounceTimer = null
    }, 500)
  }
}

function setStreamingActive(active: boolean) {
  isStreamingActive = active
}

function loadStateFromStorage() {
  if (activeStreamRef.value) {
    const taskId = activeStreamRef.value.taskId
    const task = globalState.tasks[taskId]
    if (!task || (task.state !== 'thinking' && task.state !== 'streaming' && task.state !== 'connecting' && task.state !== 'queued')) {
      streamActionsMap.delete(taskId)
      activeStreamRef.value = null
    }
  }
  try {
    const saved = localStorage.getItem(STATE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.tasks) {
        Object.keys(parsed.tasks).forEach(taskId => {
          const task = parsed.tasks[taskId]
          if (task.state === 'thinking' || task.state === 'streaming' || task.state === 'connecting' || task.state === 'queued') {
            task.state = 'idle'
            task.error = '任务中断，请重试'
          }
          task.retryCount = task.retryCount || 0
          task.maxRetries = task.maxRetries || globalState.config.retryAttempts
          task.priority = task.priority || 0
          task.queuePosition = 0
          globalState.tasks[taskId] = task
        })
      }
    }

    const configSaved = localStorage.getItem(CONFIG_KEY)
    if (configSaved) {
      const configParsed = JSON.parse(configSaved)
      globalState.config = {
        ...DEFAULT_CONFIG,
        ...configParsed,
        messageActions: { ...DEFAULT_CONFIG.messageActions, ...(configParsed?.messageActions ?? {}) },
        waitingState: { ...DEFAULT_CONFIG.waitingState, ...(configParsed?.waitingState ?? {}) },
        emptyUserGuidance: { ...DEFAULT_CONFIG.emptyUserGuidance, ...(configParsed?.emptyUserGuidance ?? {}) }
      }
    }
  } catch (e) {
    console.error('[GlobalAIState] Failed to load state:', e)
  }
}

const TERMINAL_STATES = new Set(['completed', 'error', 'idle'])

function saveStateToStorage() {
  try {
    const terminalTasks: Record<string, AIStreamTask> = {}
    for (const [id, task] of Object.entries(globalState.tasks)) {
      if (TERMINAL_STATES.has(task.state)) {
        terminalTasks[id] = task
      }
    }
    const stateToSave = {
      tasks: terminalTasks,
      queue: []
    }
    localStorage.setItem(STATE_KEY, JSON.stringify(stateToSave))
    localStorage.setItem(CONFIG_KEY, JSON.stringify(globalState.config))
  } catch (e) {
    console.error('[GlobalAIState] Failed to save state:', e)
  }
}

loadStateFromStorage()

export function useGlobalAIState() {
  const getTask = (taskId: string): AIStreamTask | undefined => {
    return globalState.tasks[taskId]
  }

  const hasTask = (taskId: string): boolean => {
    return !!globalState.tasks[taskId]
  }

  const isTaskActive = (taskId: string): boolean => {
    const task = globalState.tasks[taskId]
    return task?.state === 'thinking' || task?.state === 'streaming' || task?.state === 'queued'
  }

  const canStartTask = (): boolean => {
    return globalState.activeCount < globalState.config.maxConcurrent
  }

  const getQueuePosition = (taskId: string): number => {
    const index = globalState.queue.indexOf(taskId)
    return index >= 0 ? index + 1 : 0
  }

  const initTask = (
    taskId: string,
    initOptions: {
      providerId: string
      messages: ChatMessage[]
      options?: AIStreamOptions
      priority?: number
    }
  ): AIStreamTask => {
    const task: AIStreamTask = {
      id: taskId,
      state: 'idle',
      content: '',
      reasoning: '',
      error: null,
      showReasoning: true,
      timestamp: Date.now(),
      providerId: initOptions.providerId,
      messages: initOptions.messages,
      options: initOptions.options || {},
      retryCount: 0,
      maxRetries: globalState.config.retryAttempts,
      priority: initOptions.priority || 0,
      queuePosition: 0
    }
    globalState.tasks[taskId] = task
    scheduleSave()
    return task
  }

  const updateTask = (taskId: string, updates: Partial<AIStreamTask>) => {
    if (globalState.tasks[taskId]) {
      Object.assign(globalState.tasks[taskId], updates, { timestamp: Date.now() })
      scheduleSave()
    }
  }

  const enqueueTask = (taskId: string): boolean => {
    if (!globalState.tasks[taskId]) return false

    if (canStartTask()) {
      globalState.activeCount++
      return true
    }

    globalState.tasks[taskId].state = 'queued'
    const priority = globalState.tasks[taskId].priority
    
    let insertIndex = globalState.queue.length
    for (let i = 0; i < globalState.queue.length; i++) {
      const queuedTask = globalState.tasks[globalState.queue[i]]
      if (queuedTask && queuedTask.priority < priority) {
        insertIndex = i
        break
      }
    }
    
    globalState.queue.splice(insertIndex, 0, taskId)
    
    globalState.queue.forEach((id, index) => {
      if (globalState.tasks[id]) {
        globalState.tasks[id].queuePosition = index + 1
      }
    })
    
    saveStateToStorage()
    return false
  }

  const dequeueTask = (): string | null => {
    if (globalState.queue.length === 0) return null
    
    const taskId = globalState.queue.shift()!
    if (globalState.tasks[taskId]) {
      globalState.tasks[taskId].queuePosition = 0
    }
    
    globalState.queue.forEach((id, index) => {
      if (globalState.tasks[id]) {
        globalState.tasks[id].queuePosition = index + 1
      }
    })
    
    scheduleSave()
    return taskId
  }

  const releaseSlot = () => {
    if (globalState.activeCount > 0) {
      globalState.activeCount--
    }
    
    const nextTaskId = dequeueTask()
    if (nextTaskId) {
      globalState.activeCount++
      return nextTaskId
    }
    return null
  }

  const resetTask = (taskId: string) => {
    if (globalState.tasks[taskId]) {
      const queueIndex = globalState.queue.indexOf(taskId)
      if (queueIndex >= 0) {
        globalState.queue.splice(queueIndex, 1)
      }
      
      globalState.tasks[taskId] = {
        id: taskId,
        state: 'idle',
        content: '',
        reasoning: '',
        error: null,
        showReasoning: true,
        timestamp: Date.now(),
        providerId: null,
        messages: [],
        options: {},
        retryCount: 0,
        maxRetries: globalState.config.retryAttempts,
        priority: 0,
        queuePosition: 0
      }
      scheduleSave(true)
    }
  }

  const startConnecting = (taskId: string) => {
    updateTask(taskId, { state: 'connecting' })
  }

  const startThinking = (taskId: string) => {
    setStreamingActive(true)
    updateTask(taskId, { state: 'thinking', showReasoning: true })
  }

  const startStreaming = (taskId: string) => {
    updateTask(taskId, { state: 'streaming' })
  }

  const appendReasoning = (taskId: string, content: string) => {
    const task = globalState.tasks[taskId]
    if (task) {
      task.reasoning += content
      task.timestamp = Date.now()
      scheduleSave()
    }
  }

  const appendContent = (taskId: string, content: string, collapseReasoning: boolean = true) => {
    const task = globalState.tasks[taskId]
    if (task) {
      task.content += content
      if (collapseReasoning && task.reasoning) {
        task.showReasoning = false
      }
      task.timestamp = Date.now()
      scheduleSave()
    }
  }

  const cleanupOldTasks = () => {
    const terminalStates = new Set(['completed', 'error'])
    const terminalTaskIds = Object.keys(globalState.tasks).filter(id => 
      terminalStates.has(globalState.tasks[id].state)
    )
    
    if (terminalTaskIds.length > MAX_COMPLETED_TASKS) {
      const toRemove = terminalTaskIds.slice(0, terminalTaskIds.length - MAX_COMPLETED_TASKS)
      toRemove.forEach(id => delete globalState.tasks[id])
    }
  }

  const completeTask = (taskId: string) => {
    setStreamingActive(false)
    updateTask(taskId, { state: 'completed', showReasoning: false })
    cleanupOldTasks()
    scheduleSave(true)
    releaseSlot()
  }

  const errorTask = (taskId: string, error: string) => {
    setStreamingActive(false)
    const task = globalState.tasks[taskId]
    if (task) {
      task.retryCount++
    }
    updateTask(taskId, { state: 'error', error })
    cleanupOldTasks()
    scheduleSave(true)
    releaseSlot()
  }

  const canRetry = (taskId: string): boolean => {
    const task = globalState.tasks[taskId]
    if (!task) return false
    return task.retryCount < task.maxRetries
  }

  const removeTask = (taskId: string) => {
    const queueIndex = globalState.queue.indexOf(taskId)
    if (queueIndex >= 0) {
      globalState.queue.splice(queueIndex, 1)
    }
    delete globalState.tasks[taskId]
    scheduleSave(true)
  }

  const clearAllTasks = () => {
    globalState.tasks = {}
    globalState.queue = []
    globalState.activeCount = 0
    scheduleSave(true)
  }

  const setConfig = (config: Partial<AIConfig>) => {
    Object.assign(globalState.config, config)
    scheduleSave(true)
  }

  const getConfig = (): AIConfig => {
    return { ...globalState.config }
  }

  const setDefaultEnableThinking = (value: boolean) => {
    globalState.config.defaultEnableThinking = value
    scheduleSave(true)
  }

  const getDefaultEnableThinking = (): boolean => {
    return globalState.config.defaultEnableThinking
  }

  const getTaskResult = (taskId: string): { content: string; reasoning: string } | null => {
    const task = globalState.tasks[taskId]
    if (task && task.state === 'completed') {
      return {
        content: task.content,
        reasoning: task.reasoning
      }
    }
    return null
  }

  const getActiveTasks = (): string[] => {
    return Object.keys(globalState.tasks).filter(id => {
      const task = globalState.tasks[id]
      return task && (task.state === 'thinking' || task.state === 'streaming')
    })
  }

  const getQueuedTasks = (): string[] => {
    return [...globalState.queue]
  }

  const setActiveStream = (info: ActiveStreamInfo | null) => {
    activeStreamRef.value = info
  }

  const getActiveStream = (): ActiveStreamInfo | null => {
    return activeStreamRef.value
  }

  const activeStream = computed(() => activeStreamRef.value)

  const stopActiveStream = () => {
    if (activeStreamRef.value) {
      const actions = streamActionsMap.get(activeStreamRef.value.taskId)
      if (actions) actions.stop()
      activeStreamRef.value = null
    }
  }

  const clearActiveStream = () => {
    if (activeStreamRef.value) {
      streamActionsMap.delete(activeStreamRef.value.taskId)
    }
    activeStreamRef.value = null
  }

  const _registerStreamActions = (taskId: string, stop: () => void, retry: () => Promise<string>) => {
    streamActionsMap.set(taskId, { stop, retry })
  }

  const _unregisterStreamActions = (taskId: string) => {
    streamActionsMap.delete(taskId)
  }

  const getStreamActions = (taskId: string) => {
    return streamActionsMap.get(taskId) ?? null
  }

  return {
    state: readonly(globalState),
    tasks: readonly(globalState.tasks),
    queue: readonly(globalState.queue),
    activeCount: computed(() => globalState.activeCount),
    config: computed(() => globalState.config),
    getTask,
    hasTask,
    isTaskActive,
    canStartTask,
    getQueuePosition,
    initTask,
    updateTask,
    enqueueTask,
    dequeueTask,
    releaseSlot,
    startConnecting,
    startThinking,
    startStreaming,
    appendReasoning,
    appendContent,
    completeTask,
    errorTask,
    canRetry,
    resetTask,
    removeTask,
    clearAllTasks,
    setConfig,
    getConfig,
    setDefaultEnableThinking,
    getDefaultEnableThinking,
    getTaskResult,
    getActiveTasks,
    getQueuedTasks,
    setActiveStream,
    getActiveStream,
    activeStream,
    stopActiveStream,
    clearActiveStream,
    _registerStreamActions,
    _unregisterStreamActions,
    getStreamActions,
    setStreamingActive
  }
}
