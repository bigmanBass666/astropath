import { computed } from 'vue'
import { useGlobalAIState, type MessageActionsConfig } from './useGlobalAIState'

export interface UseActiveStreamOptions {
  actions?: Partial<MessageActionsConfig>
  taskId?: string
}

export function useActiveStream(options: UseActiveStreamOptions = {}) {
  const globalState = useGlobalAIState()

  const activeStream = computed(() => globalState.activeStream.value)

  const isOwnTask = computed(() => {
    if (!options.taskId) return true
    return activeStream.value?.taskId === options.taskId
  })

  const isLoading = computed(() => isOwnTask.value ? (activeStream.value?.isLoading ?? false) : false)
  const isGenerating = computed(() => isLoading.value)
  const isQueued = computed(() => isOwnTask.value ? (activeStream.value?.isQueued ?? false) : false)
  const isThinking = computed(() => isOwnTask.value ? (activeStream.value?.isThinking ?? false) : false)
  const isStreaming = computed(() => isOwnTask.value ? (activeStream.value?.isStreaming ?? false) : false)
  const isConnecting = computed(() => isOwnTask.value ? (activeStream.value?.isConnecting ?? false) : false)
  const hasError = computed(() => isOwnTask.value ? (activeStream.value?.hasError ?? false) : false)
  const queuePosition = computed(() => isOwnTask.value ? (activeStream.value?.queuePosition ?? 0) : 0)
  const canRetry = computed(() => isOwnTask.value ? (activeStream.value?.canRetry ?? false) : false)
  const retryCount = computed(() => isOwnTask.value ? (activeStream.value?.retryCount ?? 0) : 0)
  const maxRetries = computed(() => isOwnTask.value ? (activeStream.value?.maxRetries ?? 0) : 0)
  const waitingPhase = computed(() => isOwnTask.value ? (activeStream.value?.waitingPhase ?? 'ready') : 'ready')

  const stopButtonVisible = computed(() => {
    const config = globalState.getConfig().messageActions
    return config.stopButton !== false
  })

  const msgActionsConfig = computed<MessageActionsConfig>(() => {
    const base = globalState.getConfig().messageActions
    return { ...base, ...options.actions }
  })

  const waitingText = computed(() => {
    const phases = globalState.getConfig().waitingState.phases
    if (waitingPhase.value === 'connecting') return phases.connecting.text
    if (waitingPhase.value === 'processing') return phases.processing.text
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
