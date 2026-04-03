import { computed } from 'vue'
import { useGlobalAIState, type MessageActionsConfig } from './useGlobalAIState'

export interface UseActiveStreamOptions {
  actions?: Partial<MessageActionsConfig>
}

export function useActiveStream(options: UseActiveStreamOptions = {}) {
  const globalState = useGlobalAIState()

  const activeStream = computed(() => globalState.activeStream.value)

  const isLoading = computed(() => activeStream.value?.isLoading ?? false)
  const isGenerating = computed(() => isLoading.value)
  const isQueued = computed(() => activeStream.value?.isQueued ?? false)
  const isThinking = computed(() => activeStream.value?.isThinking ?? false)
  const isStreaming = computed(() => activeStream.value?.isStreaming ?? false)
  const isConnecting = computed(() => activeStream.value?.isConnecting ?? false)
  const hasError = computed(() => activeStream.value?.hasError ?? false)
  const queuePosition = computed(() => activeStream.value?.queuePosition ?? 0)
  const canRetry = computed(() => activeStream.value?.canRetry ?? false)
  const retryCount = computed(() => activeStream.value?.retryCount ?? 0)
  const maxRetries = computed(() => activeStream.value?.maxRetries ?? 0)
  const waitingPhase = computed(() => activeStream.value?.waitingPhase ?? 'ready')

  const stopButtonVisible = computed(() => {
    const config = globalState.getConfig().messageActions
    return config.stopButton !== false
  })

  const msgActionsConfig = computed<MessageActionsConfig>(() => {
    const base = globalState.getConfig().messageActions
    return { ...base, ...options.actions }
  })

  const waitingText = computed(() => {
    if (waitingPhase.value === 'connecting') return '正在连接...'
    if (waitingPhase.value === 'processing') return 'AI 正在分析...'
    return ''
  })

  const stopGeneration = () => {
    globalState.stopActiveStream()
  }

  const handleRetry = async () => {
    const stream = activeStream.value
    if (!stream) return
    const actions = globalState.getStreamActions(stream.taskId)
    if (actions) {
      await actions.retry()
    }
  }

  return {
    isLoading,
    isGenerating,
    isQueued,
    isThinking,
    isStreaming,
    isConnecting,
    hasError,
    queuePosition,
    canRetry,
    retryCount,
    maxRetries,
    waitingPhase,
    stopButtonVisible,
    msgActionsConfig,
    waitingText,
    stopGeneration,
    handleRetry,
    activeStream
  }
}
