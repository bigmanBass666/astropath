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
    competitiveness: string
  }
  match?: number
  category?: 'reach' | 'match' | 'safe'
}

export interface Major {
  id: number
  name: string
  category: MajorCategory
  degreeType: string
  duration: string
  description: string
  courses: string[]
  career: string
  salaryRange: string
  sources?: Record<string, { url: string; label: string }>
}

export type MajorCategory = '工科' | '商科' | '社科' | '理科' | '文科'

export interface AIProvider {
  id: string
  name: string
  type: 'openai' | 'anthropic' | 'domestic' | 'other'
  baseUrl: string
  apiKey: string
  model: string
}

export interface AssessmentBasicInfo {
  name: string
  age: number
  university: '985' | '211' | 'overseas' | 'regular'
  gpa: number
  language: string
  [key: string]: unknown
}

export interface AssessmentAcademicInfo {
  degree: string
  majors: string[]
  averageScore: number
  research: ResearchItem[]
  [key: string]: unknown
}

export interface ResearchItem {
  name: string
  role: string
  duration: string
  title?: string
}

export interface PracticeInfo {
  internships: InternshipItem[]
  competitions: CompetitionItem[]
  volunteers: VolunteerItem[]
  [key: string]: unknown
}

export interface InternshipItem {
  company: string
  position: string
  name?: string
}

export interface CompetitionItem {
  name: string
  level: string
  award: string
}

export interface VolunteerItem {
  organization: string
  role: string
}

export interface AssessmentForm {
  basic: AssessmentBasicInfo
  academic: AssessmentAcademicInfo
  practice: PracticeInfo
  [key: string]: unknown
}

export interface UserProfile {
  gpa: number
  universityTier: string
  languageScore: string
  majorCount: number
  researchCount: number
  researchDetails: ResearchItem[]
  internshipCount: number
  internshipDetails: InternshipItem[]
  competitionCount: number
  competitionDetails: CompetitionItem[]
}
