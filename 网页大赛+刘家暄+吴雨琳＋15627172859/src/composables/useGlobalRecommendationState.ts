import { reactive, readonly } from 'vue'
import type { AIRecommendation, SchoolAnalysis, UserPreference } from '@/types/recommendation'

export type RecommendationStep = 'idle' | 'analyzing' | 'matching' | 'generating' | 'completed' | 'error'
export type AnalysisStep = 'idle' | 'analyzing' | 'completed' | 'error'

export interface UserAssessment {
  basic?: {
    gpa?: number
    university?: string
    language?: string
    [key: string]: unknown
  }
  academic?: {
    averageScore?: number
    degree?: string
    majors?: string[]
    research?: unknown[]
    [key: string]: unknown
  }
  practice?: {
    internships?: unknown[]
    competitions?: unknown[]
    volunteers?: unknown[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface SchoolAnalysisState {
  loading: boolean
  currentStep: AnalysisStep
  streamingContent: string
  isStreaming: boolean
  error: string | null
  schoolId: number | null
  assessment: UserAssessment | null
  providerId: string | null
  analysis: SchoolAnalysis | null
  timestamp: number
}

interface GlobalRecommendationState {
  loading: boolean
  currentStep: RecommendationStep
  stepProgress: number
  streamingContent: string
  isStreaming: boolean
  error: string | null
  assessment: UserAssessment | null
  preference: UserPreference | null
  providerId: string | null
  recommendations: AIRecommendation[]
  summary: string
  timestamp: number
  schoolAnalysis: SchoolAnalysisState
}

const globalState = reactive<GlobalRecommendationState>({
  loading: false,
  currentStep: 'idle',
  stepProgress: 0,
  streamingContent: '',
  isStreaming: false,
  error: null,
  assessment: null,
  preference: null,
  providerId: null,
  recommendations: [],
  summary: '',
  timestamp: 0,
  // 单个学校分析状态
  schoolAnalysis: {
    loading: false,
    currentStep: 'idle',
    streamingContent: '',
    isStreaming: false,
    error: null,
    schoolId: null,
    assessment: null,
    providerId: null,
    analysis: null,
    timestamp: 0
  }
})

const STATE_EXPIRY_MS = 5 * 60 * 1000 // 5分钟过期

export function useGlobalRecommendationState() {
  // 检查状态是否有效（未过期）
  const isStateValid = (): boolean => {
    if (!globalState.timestamp) return false
    return Date.now() - globalState.timestamp < STATE_EXPIRY_MS
  }

  // 检查是否有进行中的推荐
  const hasOngoingRecommendation = (): boolean => {
    return globalState.loading && isStateValid()
  }

  // 开始新的推荐
  const startRecommendation = (assessment: UserAssessment, preference: UserPreference, providerId: string) => {
    globalState.loading = true
    globalState.currentStep = 'analyzing'
    globalState.stepProgress = 0
    globalState.streamingContent = ''
    globalState.isStreaming = false
    globalState.error = null
    globalState.assessment = assessment
    globalState.preference = preference
    globalState.providerId = providerId
    globalState.recommendations = []
    globalState.summary = ''
    globalState.timestamp = Date.now()
  }

  // 更新步骤
  const updateStep = (step: RecommendationStep, progress: number) => {
    globalState.currentStep = step
    globalState.stepProgress = progress
    globalState.timestamp = Date.now() // 更新时间戳
  }

  // 更新流式内容
  const updateStreamingContent = (content: string, isStreaming: boolean = true) => {
    globalState.streamingContent = content
    globalState.isStreaming = isStreaming
    globalState.timestamp = Date.now()
  }

  // 完成推荐
  const completeRecommendation = (recommendations: AIRecommendation[], summary: string) => {
    globalState.loading = false
    globalState.currentStep = 'completed'
    globalState.stepProgress = 100
    globalState.isStreaming = false
    globalState.recommendations = recommendations
    globalState.summary = summary
    globalState.timestamp = Date.now()
  }

  // 标记错误
  const setError = (error: string) => {
    globalState.loading = false
    globalState.currentStep = 'error'
    globalState.error = error
    globalState.isStreaming = false
    globalState.timestamp = Date.now()
  }

  // 重置状态
  const resetState = () => {
    globalState.loading = false
    globalState.currentStep = 'idle'
    globalState.stepProgress = 0
    globalState.streamingContent = ''
    globalState.isStreaming = false
    globalState.error = null
    globalState.assessment = null
    globalState.preference = null
    globalState.providerId = null
    globalState.recommendations = []
    globalState.summary = ''
    globalState.timestamp = 0
    // 重置分析状态
    resetAnalysisState()
  }

  // ===== 单个学校分析状态管理 =====

  // 检查分析状态是否有效
  const isAnalysisStateValid = (schoolId?: number): boolean => {
    if (!globalState.schoolAnalysis.timestamp) return false
    if (schoolId !== undefined && globalState.schoolAnalysis.schoolId !== schoolId) return false
    return Date.now() - globalState.schoolAnalysis.timestamp < STATE_EXPIRY_MS
  }

  // 检查是否有进行中的分析
  const hasOngoingAnalysis = (): boolean => {
    return globalState.schoolAnalysis.loading && isAnalysisStateValid()
  }

  // 获取进行中分析的schoolId
  const getOngoingAnalysisSchoolId = (): number | null => {
    if (hasOngoingAnalysis()) {
      return globalState.schoolAnalysis.schoolId
    }
    return null
  }

  // 开始新的分析
  const startAnalysis = (schoolId: number, assessment: UserAssessment, providerId: string) => {
    globalState.schoolAnalysis.loading = true
    globalState.schoolAnalysis.currentStep = 'analyzing'
    globalState.schoolAnalysis.streamingContent = ''
    globalState.schoolAnalysis.isStreaming = false
    globalState.schoolAnalysis.error = null
    globalState.schoolAnalysis.schoolId = schoolId
    globalState.schoolAnalysis.assessment = assessment
    globalState.schoolAnalysis.providerId = providerId
    globalState.schoolAnalysis.analysis = null
    globalState.schoolAnalysis.timestamp = Date.now()
  }

  // 更新分析流式内容
  const updateAnalysisStreamingContent = (content: string, isStreaming: boolean = true) => {
    globalState.schoolAnalysis.streamingContent = content
    globalState.schoolAnalysis.isStreaming = isStreaming
    globalState.schoolAnalysis.timestamp = Date.now()
  }

  // 完成分析
  const completeAnalysis = (analysis: SchoolAnalysis) => {
    globalState.schoolAnalysis.loading = false
    globalState.schoolAnalysis.currentStep = 'completed'
    globalState.schoolAnalysis.isStreaming = false
    globalState.schoolAnalysis.analysis = analysis
    globalState.schoolAnalysis.timestamp = Date.now()
  }

  // 标记分析错误
  const setAnalysisError = (error: string) => {
    globalState.schoolAnalysis.loading = false
    globalState.schoolAnalysis.currentStep = 'error'
    globalState.schoolAnalysis.error = error
    globalState.schoolAnalysis.isStreaming = false
    globalState.schoolAnalysis.timestamp = Date.now()
  }

  // 重置分析状态
  const resetAnalysisState = () => {
    globalState.schoolAnalysis.loading = false
    globalState.schoolAnalysis.currentStep = 'idle'
    globalState.schoolAnalysis.streamingContent = ''
    globalState.schoolAnalysis.isStreaming = false
    globalState.schoolAnalysis.error = null
    globalState.schoolAnalysis.schoolId = null
    globalState.schoolAnalysis.assessment = null
    globalState.schoolAnalysis.providerId = null
    globalState.schoolAnalysis.analysis = null
    globalState.schoolAnalysis.timestamp = 0
  }

  // 获取当前状态（只读）
  const getState = () => readonly(globalState)

  return {
    state: readonly(globalState),
    isStateValid,
    hasOngoingRecommendation,
    startRecommendation,
    updateStep,
    updateStreamingContent,
    completeRecommendation,
    setError,
    resetState,
    getState,
    // 分析状态管理
    isAnalysisStateValid,
    hasOngoingAnalysis,
    getOngoingAnalysisSchoolId,
    startAnalysis,
    updateAnalysisStreamingContent,
    completeAnalysis,
    setAnalysisError,
    resetAnalysisState
  }
}
