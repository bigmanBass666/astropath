import { computed, onMounted, onUnmounted, reactive, ref, watch, type ComputedRef } from 'vue'
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
  state: ComputedRef<AIStreamState>
  content: ComputedRef<string>
  reasoning: ComputedRef<string>
  error: ComputedRef<string | null>
  showReasoning: ComputedRef<boolean>
  isStreaming: ComputedRef<boolean>
  isThinking: ComputedRef<boolean>
  isConnecting: ComputedRef<boolean>
  isQueued: ComputedRef<boolean>
  isCompleted: ComputedRef<boolean>
  hasError: ComputedRef<boolean>
  hasContent: ComputedRef<boolean>
  hasReasoning: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
  waitingPhase: ComputedRef<'connecting' | 'processing' | 'ready'>
  queuePosition: ComputedRef<number>
  canRetry: ComputedRef<boolean>
  retryCount: ComputedRef<number>
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

  const actualEnableThinking = enableThinking ?? globalState.getConfig().defaultEnableThinking

  let abortController: AbortController | null = null
  let lastMessages: unknown[] = []
  let lastProviderId: string | null = null
  let lastOptions: unknown = {}

  const userScrolledUp = ref(false)
  let userScrollLocked = false
  let lastUserScrollTime = 0
  let scrollRafId: number | null = null
  let rafScrollId: number | null = null
  const SCROLL_COOLDOWN = 150
  const IDLE_TIMEOUT = 30000

  const task = computed(() => globalState.getTask(taskId))

  const state = computed<AIStreamState>(() => task.value?.state || 'idle')
  const content = computed<string>(() => task.value?.content || '')
  const reasoning = computed<string>(() => task.value?.reasoning || '')
  const error = computed<string | null>(() => task.value?.error || null)
  const showReasoning = computed<boolean>(() => task.value?.showReasoning ?? true)
  const queuePosition = computed<number>(() => task.value?.queuePosition || 0)
  const retryCount = computed<number>(() => task.value?.retryCount || 0)
  const maxRetries = computed<number>(() => task.value?.maxRetries || globalState.getConfig().retryAttempts)

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
    const runtimeConfig = globalState.getConfig()
    
    const defaultOpts: Record<string, any> = {
      temperature: runtimeConfig.defaultTemperature,
      stream: true,
      enableThinking: actualEnableThinking
    }
    
    if (runtimeConfig.defaultMaxTokens && runtimeConfig.defaultMaxTokens > 0) {
      defaultOpts['maxTokens'] = runtimeConfig.defaultMaxTokens
    }
    
    const finalOptions = {
      ...defaultOpts,
      ...(requestOptions as Record<string, any>),
      requestTimeout: actualEnableThinking ? runtimeConfig.timeout * 2 : runtimeConfig.timeout
    }

    abortController = new AbortController()

    let fullContent = ''
    let fullReasoning = ''

    try {
      globalState.startConnecting(taskId)
      onStateChange?.('connecting')
      globalState.startThinking(taskId)
      onStateChange?.('thinking')

      const stream = await sendMessageToAI(
        providerId,
        messages,
        finalOptions,
        abortController.signal as any
      )

      let idleTimer: ReturnType<typeof setTimeout> | null = null
      const resetIdleTimer = () => {
        if (idleTimer) clearTimeout(idleTimer)
        idleTimer = setTimeout(() => {
          if (abortController) {
            abortController.abort()
            abortController = null
          }
        }, IDLE_TIMEOUT)
      }

      resetIdleTimer()

      for await (const chunk of stream as AsyncIterable<{ type: string; content: any }>) {
        if (!globalState.isTaskActive(taskId)) break

        if (chunk.type === 'reasoning' && chunk.content) {
          fullReasoning += chunk.content
          globalState.appendReasoning(taskId, chunk.content)
          onStream?.(fullContent, fullReasoning)
          scrollToBottom()
          resetIdleTimer()
        } else if (chunk.type === 'content' && chunk.content) {
          if (isThinking.value) {
            globalState.startStreaming(taskId)
            onStateChange?.('streaming')
          }
          fullContent += chunk.content
          globalState.appendContent(taskId, chunk.content, false)
          onStream?.(fullContent, fullReasoning)
          scrollToBottom()
          resetIdleTimer()
        }
      }

      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }

      globalState.completeTask(taskId)
      cleanupWatchers()
      globalState.clearActiveStream()
      globalState._unregisterStreamActions(taskId)
      onStateChange?.('completed')
      onComplete?.(fullContent, fullReasoning)

      return fullContent
    } catch (err) {
      const isAbortError = err instanceof DOMException && err.name === 'AbortError'
        || (err instanceof Error && (
            err.name === 'AbortError'
            || err.message.includes('aborted')
            || err.message.includes('AbortError')
          ))

      if (isAbortError) {
        cleanupWatchers()
        globalState.clearActiveStream()
        globalState._unregisterStreamActions(taskId)
        onStateChange?.('completed')
        onComplete?.(fullContent, fullReasoning)
        return fullContent
      }

      const errorMsg = err instanceof AIError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : '请求失败'
      
      globalState.errorTask(taskId, errorMsg)
      onStateChange?.('error')
      onError?.(errorMsg)

      if (autoRetry && globalState.canRetry(taskId)) {
        const delay = globalState.getConfig().retryDelay * Math.pow(2, retryCount.value)
        await sleep(delay)
        return executeGeneration(providerId, messages, requestOptions)
      }

      throw err
    } finally {
      abortController = null
    }
  }

  const activeWatchers: Array<() => void> = []

  const registerAsActive = () => {
    const info = reactive<ActiveStreamInfo>({
      taskId,
      isLoading: isLoading.value,
      isQueued: isQueued.value,
      isThinking: isThinking.value,
      isStreaming: isStreaming.value,
      isConnecting: isConnecting.value,
      hasError: hasError.value,
      queuePosition: queuePosition.value,
      canRetry: canRetry.value,
      retryCount: retryCount.value,
      maxRetries: maxRetries.value,
      waitingPhase: waitingPhase.value
    })

    const unwatchers = [
      watch(isLoading, v => { info.isLoading = v }),
      watch(isQueued, v => { info.isQueued = v }),
      watch(isThinking, v => { info.isThinking = v }),
      watch(isStreaming, v => { info.isStreaming = v }),
      watch(isConnecting, v => { info.isConnecting = v }),
      watch(hasError, v => { info.hasError = v }),
      watch(queuePosition, v => { info.queuePosition = v }),
      watch(canRetry, v => { info.canRetry = v }),
      watch(retryCount, v => { info.retryCount = v }),
      watch(maxRetries, v => { info.maxRetries = v }),
      watch(waitingPhase, v => { info.waitingPhase = v })
    ]

    activeWatchers.forEach(w => w())
    activeWatchers.length = 0
    activeWatchers.push(...unwatchers)

    globalState.setActiveStream(info)
    globalState._registerStreamActions(taskId, stop, retry)
  }

  const cleanupWatchers = () => {
    activeWatchers.forEach(w => w())
    activeWatchers.length = 0
    if (scrollRafId) { cancelAnimationFrame(scrollRafId); scrollRafId = null }
    if (rafScrollId) { cancelAnimationFrame(rafScrollId); rafScrollId = null }
  }

  const stop = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    cleanupWatchers()
    globalState.clearActiveStream()
    globalState._unregisterStreamActions(taskId)
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

    const existingTask = globalState.getTask(taskId)
    if (existingTask) {
      globalState.updateTask(taskId, { state: 'idle', error: null, retryCount: existingTask.retryCount })
    } else {
      globalState.resetTask(taskId)
    }
    return generateWithProvider(lastProviderId, lastMessages, lastOptions)
  }

  const toggleReasoning = () => {
    const currentShow = task.value?.showReasoning ?? true
    globalState.updateTask(taskId, { showReasoning: !currentShow })
  }

  const setShowReasoning = (show: boolean) => {
    globalState.updateTask(taskId, { showReasoning: show })
  }

  const doScroll = () => {
    const container = scrollContainer?.()
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  const scrollToBottom = (force: boolean = false) => {
    if (!autoScroll) return

    if (force) {
      if (rafScrollId) { cancelAnimationFrame(rafScrollId); rafScrollId = null }
      doScroll()
      return
    }

    if (userScrollLocked) return
    if (Date.now() - lastUserScrollTime < SCROLL_COOLDOWN) return
    if (rafScrollId) return

    rafScrollId = requestAnimationFrame(() => {
      rafScrollId = null
      doScroll()
    })
  }

  const handleUserScroll = () => {
    const container = scrollContainer?.()
    if (!container) return

    lastUserScrollTime = Date.now()

    if (scrollRafId) return
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = null

      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      const isAtBottom = distanceFromBottom < 60

      if (!isAtBottom && distanceFromBottom > 80) {
        userScrollLocked = true
        userScrolledUp.value = true
      } else if (isAtBottom) {
        userScrollLocked = false
        userScrolledUp.value = false
      }
    })
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
  } else {
    reset()
  }

  onUnmounted(() => {
    if (abortController) {
      abortController.abort()
    }
    if (scrollRafId) { cancelAnimationFrame(scrollRafId); scrollRafId = null }
    if (rafScrollId) { cancelAnimationFrame(rafScrollId); rafScrollId = null }
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
