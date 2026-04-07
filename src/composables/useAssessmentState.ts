import { computed } from 'vue'
import { useStorage, StorageKeys } from './useStorage'

// Assessment form data structure
export interface AssessmentForm {
  basic: {
    name: string
    age: number
    university: string
    gpa: number
    language: string
  }
  academic: {
    degree: string
    majors: string[]
    averageScore: number
    research: Array<{
      name: string
      role: string
      duration: string
      description: string
    }>
  }
  practice: {
    internships: Array<{
      company: string
      position: string
      duration: string
      description: string
    }>
    competitions: Array<{
      name: string
      level: string
      award: string
      year: string
    }>
    volunteers: Array<{
      organization: string
      role: string
      hours: string
      description: string
    }>
  }
}

// Default form values
const defaultForm: AssessmentForm = {
  basic: {
    name: '',
    age: 22,
    university: '',
    gpa: 3.0,
    language: ''
  },
  academic: {
    degree: '本科',
    majors: [],
    averageScore: 85,
    research: []
  },
  practice: {
    internships: [],
    competitions: [],
    volunteers: []
  }
}

// Create a singleton state
const assessmentData = useStorage<AssessmentForm>(StorageKeys.ASSESSMENT_FORM, defaultForm)
const assessmentReport = useStorage<string>(StorageKeys.ASSESSMENT_REPORT, '')
const currentScene = useStorage<number>('assessment_current_scene', 0)

// Computed scores
const academicScore = computed(() => {
  const gpa = assessmentData.data.value.basic.gpa
  return Math.min(gpa / 4 * 5, 5)
})

const languageScore = computed(() => {
  // Default 2.5 if no language data
  return 2.5
})

const researchScore = computed(() => {
  const count = assessmentData.data.value.academic.research.length
  return Math.min(count * 1.5, 5)
})

const practiceScore = computed(() => {
  const internshipCount = assessmentData.data.value.practice.internships.length
  const competitionCount = assessmentData.data.value.practice.competitions.length
  const volunteerCount = assessmentData.data.value.practice.volunteers.length
  return Math.min((internshipCount * 1.2 + competitionCount * 0.5 + volunteerCount * 0.3), 5)
})

const overallScore = computed(() => {
  const scores = [academicScore.value, languageScore.value, researchScore.value, practiceScore.value]
  return scores.reduce((a, b) => a + b, 0) / scores.length
})

// Check if user has completed assessment
const hasAssessmentData = computed(() => {
  const form = assessmentData.data.value
  return !!(form.basic.name && form.basic.university)
})

// Get summary text for AI context
const getAssessmentSummary = () => {
  const form = assessmentData.data.value
  if (!hasAssessmentData.value) {
    return null
  }

  const parts = [
    `姓名：${form.basic.name}`,
    `院校背景：${form.basic.university}`,
    `GPA：${form.basic.gpa}`,
    `目标学位：${form.academic.degree}`,
    `专业方向：${form.academic.majors.join('、') || '未确定'}`,
    `平均分：${form.academic.averageScore}`,
  ]

  if (form.academic.research.length > 0) {
    parts.push(`科研经历：${form.academic.research.length} 项 (${form.academic.research.map(r => r.name).join('、')})`)
  }

  if (form.practice.internships.length > 0) {
    parts.push(`实习经历：${form.practice.internships.length} 段 (${form.practice.internships.map(i => i.company).join('、')})`)
  }

  if (form.practice.competitions.length > 0) {
    parts.push(`竞赛获奖：${form.practice.competitions.length} 项`)
  }

  if (form.practice.volunteers.length > 0) {
    parts.push(`志愿服务：${form.practice.volunteers.length} 段`)
  }

  parts.push(`综合评分：${overallScore.value.toFixed(1)}/5.0`)

  return parts.join('\n')
}

// Update form data
const updateForm = (newForm: Partial<AssessmentForm>) => {
  assessmentData.data.value = {
    ...assessmentData.data.value,
    ...newForm,
    basic: { ...assessmentData.data.value.basic, ...newForm.basic },
    academic: { ...assessmentData.data.value.academic, ...newForm.academic },
    practice: { ...assessmentData.data.value.practice, ...newForm.practice }
  }
}

// Reset form
const resetForm = () => {
  assessmentData.data.value = structuredClone(defaultForm)
  assessmentReport.data.value = ''
  currentScene.data.value = 0
}

// Save current scene
const saveScene = (scene: number) => {
  currentScene.data.value = scene
}

// Save AI report
const saveReport = (report: string) => {
  assessmentReport.data.value = report
}

export function useAssessmentState() {
  return {
    // Data
    form: assessmentData.data,
    report: assessmentReport.data,
    currentScene: currentScene.data,

    // Computed scores
    scores: {
      academic: academicScore,
      language: languageScore,
      research: researchScore,
      practice: practiceScore,
      overall: overallScore
    },

    // Status
    hasData: hasAssessmentData,

    // Methods
    updateForm,
    resetForm,
    saveReport,
    saveScene,
    getAssessmentSummary
  }
}
