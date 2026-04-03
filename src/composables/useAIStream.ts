import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { sendMessageToAI, AIError } from '@/utils/ai-api'
import { useGlobalAIState, type AIStreamState, type ActiveStreamInfo } from './useGlobalAIState'

export interface UseAIStreamOptions {
  taskId: string
  enableThinking?: boolean
  collapseReasoningOnContent?: boolean
  autoRestore?: boolean
  autoRetry?: boolean
  priority?: number
  autoScroll?: boolean
  scrollContainer?: () => HTMLElement | null
  onComplete?: (content: string, reasoning: string) => void
  onError?: (error: string) => void
  onStream?: (content: string, reasoning: string) => void
  onStateChange?: (state: AIStreamState) => void
  onQueueChange?: (position: number) => void
}

export interface AIStreamResult {
  state: ReturnType<typeof computed<AIStreamState>>
  content: ReturnType<typeof computed<string>>
  reasoning: ReturnType<typeof computed<string>>
  error: ReturnType<typeof computed<string | null>>
  showReasoning: ReturnType<typeof computed<boolean>>
  isStreaming: ReturnType<typeof computed<boolean>>
  isThinking: ReturnType<typeof computed<boolean>>
  isConnecting: ReturnType<typeof computed<boolean>>
  isQueued: ReturnType<typeof computed<boolean>>
  isCompleted: ReturnType<typeof computed<boolean>>
  hasError: ReturnType<typeof computed<boolean>>
  hasContent: ReturnType<typeof computed<boolean>>
  hasReasoning: ReturnType<typeof computed<boolean>>
  isLoading: ReturnType<typeof computed<boolean>>
  waitingPhase: ReturnType<typeof computed<'connecting' | 'processing' | 'ready'>>
  queuePosition: ReturnType<typeof computed<number>>
  canRetry: ReturnType<typeof computed<boolean>>
  retryCount: ReturnType<typeof computed<number>>
  userScrolledUp: ReturnType<typeof ref<boolean>>
  generate: (messages: unknown[], options?: unknown) => Promise<string>
  generateWithProvider: (providerId: string, messages: unknown[], options?: unknown) => Promise<string>
  stop: () => void
  reset: () => void
  retry: () => Promise<string>
  toggleReasoning: () => void
  restore: () => boolean
  setShowReasoning: (show: boolean) => void
  scrollToBottom: (force?: boolean) => void
  handleUserScroll: () => void
}

export function useAIStream(options: UseAIStreamOptions): AIStreamResult {
  const {
    taskId,
    enableThinking,
    collapseReasoningOnContent = true,
    autoRestore = true,
    autoRetry = false,
    priority = 0,
    autoScroll = true,
    scrollContainer,
    onComplete,
    onError,
    onStream,
    onStateChange,
    onQueueChange
  } = options

  const globalState = useGlobalAIState()
  const config = globalState.getConfig()

  const actualEnableThinking = enableThinking ?? config.defaultEnableThinking

  let abortController: AbortController | null = null
  let lastMessages: unknown[] = []
  let lastProviderId: string | null = null
  let lastOptions: unknown = {}

  const userScrolledUp = ref(false)
  let userScrollLocked = false

  const task = computed(() => globalState.getTask(taskId))

  const state = computed<AIStreamState>(() => task.value?.state || 'idle')
  const content = computed<string>(() => task.value?.content || '')
  const reasoning = computed<string>(() => task.value?.reasoning || '')
  const error = computed<string | null>(() => task.value?.error || null)
  const showReasoning = computed<boolean>(() => task.value?.showReasoning ?? true)
  const queuePosition = computed<number>(() => task.value?.queuePosition || 0)
  const retryCount = computed<number>(() => task.value?.retryCount || 0)
  const maxRetries = computed<number>(() => task.value?.maxRetries || config.retryAttempts)

  const isStreaming = computed(() => state.value === 'streaming')
  const isThinking = computed(() => state.value === 'thinking')
  const isConnecting = computed(() => state.value === 'connecting')
  const isQueued = computed(() => state.value === 'queued')
  const isCompleted = computed(() => state.value === 'completed')
  const hasError = computed(() => state.value === 'error')
  const hasContent = computed(() => content.value.length > 0)
  const hasReasoning = computed(() => reasoning.value.length > 0)
  const isLoading = computed(() => isConnecting.value || isStreaming.value || isThinking.value || isQueued.value)
  const waitingPhase = computed<'connecting' | 'processing' | 'ready'>(() => {
    if (hasContent.value || hasReasoning.value) return 'ready'
    if (isThinking.value || isStreaming.value) return 'processing'
    if (isConnecting.value || isQueued.value) return 'connecting'
    return 'ready'
  })
  const canRetry = computed(() => {
    if (!hasError.value) return false
    return globalState.canRetry(taskId)
  })

  watch(queuePosition, (newPos) => {
    onQueueChange?.(newPos)
  })

  const getDefaultProvider = (): string | null => {
    const providers = JSON.parse(localStorage.getItem('ai_providers') || '[]')
    return providers.length > 0 ? providers[0].id : null
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const generate = async (messages: unknown[], requestOptions?: unknown): Promise<string> => {
    const providerId = getDefaultProvider()
    if (!providerId) {
      const errorMsg = '请先配置AI模型'
      globalState.errorTask(taskId, errorMsg)
      onError?.(errorMsg)
      throw new Error(errorMsg)
    }
    return generateWithProvider(providerId, messages, requestOptions)
  }

  const generateWithProvider = async (
    providerId: string,
    messages: unknown[],
    requestOptions?: unknown
  ): Promise<string> => {
    lastMessages = messages
    lastProviderId = providerId
    lastOptions = requestOptions

    globalState.initTask(taskId, {
      providerId,
      messages: messages as any[],
      options: requestOptions as any,
      priority
    })

    registerAsActive()

    const canStart = globalState.enqueueTask(taskId)
    if (!canStart) {
      onStateChange?.('queued')
      return new Promise((resolve, reject) => {
        const unwatch = watch(state, async (newState) => {
          if (newState === 'thinking' || newState === 'streaming') {
            unwatch()
            try {
              const result = await executeGeneration(providerId, messages, requestOptions)
              resolve(result)
            } catch (err) {
              reject(err)
            }
          } else if (newState === 'error') {
            unwatch()
            reject(new Error(error.value || '任务失败'))
          }
        })
      })
    }

    return executeGeneration(providerId, messages, requestOptions)
  }

  const executeGeneration = async (
    providerId: string,
    messages: unknown[],
    requestOptions?: unknown
  ): Promise<string> => {
    // 默认配置
    const defaultOpts = {
      temperature: config.defaultTemperature,
      stream: true,
      enableThinking: actualEnableThinking
    }
    
    // 如果全局配置了 maxTokens 且大于 0，才传递
    if (config.defaultMaxTokens && config.defaultMaxTokens > 0) {
      defaultOpts['maxTokens'] = config.defaultMaxTokens
    }
    
    const finalOptions = {
      ...defaultOpts,
      ...requestOptions
    }

    abortController = new AbortController()

    try {
      globalState.startConnecting(taskId)
      onStateChange?.('connecting')
      globalState.startThinking(taskId)
      onStateChange?.('thinking')

      const stream = await sendMessageToAI(
        providerId,
        messages,
        finalOptions,
        abortController.signal
      )

      let fullContent = ''
      let fullReasoning = ''

      for await (const chunk of stream) {
        if (!globalState.isTaskActive(taskId)) break

        if (chunk.type === 'reasoning' && chunk.content) {
          fullReasoning += chunk.content
          globalState.appendReasoning(taskId, chunk.content)
          onStream?.(fullContent, fullReasoning)
          scrollToBottom()
        } else if (chunk.type === 'content' && chunk.content) {
          if (isThinking.value) {
            globalState.startStreaming(taskId)
            onStateChange?.('streaming')
          }
          fullContent += chunk.content
          globalState.appendContent(taskId, chunk.content, false)
          onStream?.(fullContent, fullReasoning)
          scrollToBottom()
        }
      }

      globalState.completeTask(taskId)
      globalState.clearActiveStream()
      onStateChange?.('completed')
      onComplete?.(fullContent, fullReasoning)

      return fullContent
    } catch (err) {
      const errorMsg = err instanceof AIError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : '请求失败'
      
      globalState.errorTask(taskId, errorMsg)
      onStateChange?.('error')
      onError?.(errorMsg)

      if (autoRetry && globalState.canRetry(taskId)) {
        const delay = config.retryDelay * Math.pow(2, retryCount.value)
        await sleep(delay)
        return executeGeneration(providerId, messages, requestOptions)
      }

      throw err
    } finally {
      abortController = null
    }
  }

  const registerAsActive = () => {
    const info: ActiveStreamInfo = {
      taskId,
      get isLoading() { return isLoading.value },
      get isQueued() { return isQueued.value },
      get isThinking() { return isThinking.value },
      get isStreaming() { return isStreaming.value },
      get isConnecting() { return isConnecting.value },
      get hasError() { return hasError.value },
      get queuePosition() { return queuePosition.value },
      get canRetry() { return canRetry.value },
      get retryCount() { return retryCount.value },
      get maxRetries() { return maxRetries.value },
      get waitingPhase() { return waitingPhase.value },
      stop,
      retry
    }
    globalState.setActiveStream(info)
  }

  const syncActiveStream = () => {
    registerAsActive()
  }

  const stop = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    globalState.errorTask(taskId, '用户中止')
    globalState.clearActiveStream()
    onStateChange?.('error')
  }

  const reset = () => {
    stop()
    userScrollLocked = false
    globalState.resetTask(taskId)
  }

  const retry = async (): Promise<string> => {
    if (!lastProviderId || !lastMessages.length) {
      throw new Error('没有可重试的任务')
    }

    globalState.resetTask(taskId)
    return generateWithProvider(lastProviderId, lastMessages, lastOptions)
  }

  const toggleReasoning = () => {
    const currentShow = task.value?.showReasoning ?? true
    globalState.updateTask(taskId, { showReasoning: !currentShow })
  }

  const setShowReasoning = (show: boolean) => {
    globalState.updateTask(taskId, { showReasoning: show })
  }

  const scrollToBottom = (force: boolean = false) => {
    if (!autoScroll) return
    if (userScrollLocked && !force) return
    
    const container = scrollContainer?.()
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  const handleUserScroll = () => {
    const container = scrollContainer?.()
    if (!container) return
    
    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const isAtBottom = distanceFromBottom < 150
    
    if (!isAtBottom && distanceFromBottom > 300) {
      userScrollLocked = true
      userScrolledUp.value = true
    } else if (isAtBottom) {
      userScrollLocked = false
      userScrolledUp.value = false
    }
  }

  const restore = (): boolean => {
    const existingTask = globalState.getTask(taskId)
    if (existingTask) {
      if (existingTask.state === 'thinking' || existingTask.state === 'streaming') {
        globalState.errorTask(taskId, '任务中断，请重试')
        return false
      }
      return existingTask.state === 'completed' || existingTask.state === 'error'
    }
    return false
  }

  if (autoRestore) {
    onMounted(() => {
      restore()
    })
  }

  onUnmounted(() => {
    if (abortController) {
      abortController.abort()
    }
  })

  return {
    state,
    content,
    reasoning,
    error,
    showReasoning,
    isStreaming,
    isThinking,
    isConnecting,
    isQueued,
    isCompleted,
    hasError,
    hasContent,
    hasReasoning,
    isLoading,
    waitingPhase,
    queuePosition,
    canRetry,
    retryCount,
    userScrolledUp,
    generate,
    generateWithProvider,
    stop,
    reset,
    retry,
    toggleReasoning,
    restore,
    setShowReasoning,
    scrollToBottom,
    handleUserScroll
  }
}

export function useAIStreamOnce(
  taskId: string,
  options?: Omit<UseAIStreamOptions, 'taskId'>
): AIStreamResult {
  return useAIStream({
    taskId,
    ...options
  })
}
