// 用户偏好
export interface UserPreference {
  priorities: ('ranking' | 'major' | 'career' | 'location' | 'cost')[]
  excludedCountries: string[]
  specialRequirements: string
}

// AI推荐结果
export interface AIRecommendation {
  schoolId: number
  schoolName: string
  aiReason: string
  matchScore: number
  ranking: number
  category: 'core' | 'alternative'
}

// 深度分析
export interface SchoolAnalysis {
  schoolId: number
  matchPoints: string[]
  risks: string[]
  suggestions: string[]
  admissionProbability: string
}

// 聊天消息
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// 推荐状态
export type RecommendationStep = 'preference' | 'recommendation' | 'analysis'

// 学校数据（从recommendationEngine导入的类型）
export interface School {
  id: number
  name: string
  country: string
  major: string
  ranking: string
  deadline: string
  tuition: string
  acceptanceRate: string
  requirements: string[]
  website: string
  description: string
  type: string
  students: string
  image: string
  sources: {
    ranking?: { url: string; label: string }
    tuition?: { url: string; label: string }
    acceptance?: { url: string; label: string }
    requirements?: { url: string; label: string }
  }
  admissionCriteria: {
    minGPA: number
    preferredGPA: number
    languageRequirements: { toefl: number; ielts: number }
    universityTier: string[]
    researchWeight: number
    averageScoreMin: number
    acceptanceRateNum: number
    competitiveness: 'extreme' | 'very_high' | 'high' | 'moderate' | 'accessible'
  }
  match?: number
  category?: 'reach' | 'match' | 'safe'
}

// AI推荐响应
export interface AIRecommendationResponse {
  recommendations: {
    schoolId: number
    ranking: number
    category: 'core' | 'alternative'
    aiReason: string
    matchScore: number
  }[]
  summary: string
}

// AI深度分析响应
export interface AIAnalysisResponse {
  matchPoints: string[]
  risks: string[]
  suggestions: string[]
  admissionProbability: string
}
