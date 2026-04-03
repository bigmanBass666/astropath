import { ref } from 'vue'
import { sendMessageToAI, AIError } from '@/utils/ai-api'
import { schoolsData, getAllSchoolsWithMatch } from '@/utils/recommendationEngine'
import type { UserPreference, AIRecommendation, SchoolAnalysis, AIRecommendationResponse, AIAnalysisResponse } from '@/types/recommendation'

export function useAIRecommendation() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 构建推荐Prompt
  const buildRecommendationPrompt = (assessment: any, preference: UserPreference): string => {
    const userProfile = {
      gpa: assessment.basic?.gpa || 3.0,
      university: assessment.basic?.university || 'regular',
      language: assessment.basic?.language || '未填写',
      averageScore: assessment.academic?.averageScore || 75,
      degree: assessment.academic?.degree || '本科',
      majors: assessment.academic?.majors?.join('、') || '未选择',
      researchCount: assessment.academic?.research?.length || 0,
      internshipCount: assessment.practice?.internships?.length || 0,
      competitionCount: assessment.practice?.competitions?.length || 0
    }

    const priorityMap: Record<string, string> = {
      ranking: '学校排名',
      major: '专业实力',
      career: '就业前景',
      location: '地理位置',
      cost: '学费预算'
    }

    const prioritiesText = preference.priorities.map(p => priorityMap[p]).join('、')
    const excludedText = preference.excludedCountries.length > 0 
      ? preference.excludedCountries.join('、') 
      : '无'

    const schoolsList = schoolsData.map(s => ({
      id: s.id,
      name: s.name,
      country: s.country,
      ranking: s.ranking,
      major: s.major,
      tuition: s.tuition,
      acceptanceRate: s.acceptanceRate,
      competitiveness: s.admissionCriteria.competitiveness
    }))

    return `你是一位资深留学顾问。基于以下信息，为用户推荐最适合的学校：

【用户背景】
- GPA: ${userProfile.gpa}/4.0
- 院校: ${userProfile.university === '985' ? '985院校' : userProfile.university === '211' ? '211院校' : userProfile.university === 'overseas' ? '海外院校' : '普通本科'}
- 专业: ${userProfile.majors}
- 均分: ${userProfile.averageScore}/100
- 语言成绩: ${userProfile.language}
- 科研经历: ${userProfile.researchCount}项
- 实习经历: ${userProfile.internshipCount}项
- 竞赛获奖: ${userProfile.competitionCount}项

【用户偏好】
- 最看重: ${prioritiesText}
- 避开国家/地区: ${excludedText}
- 特殊要求: ${preference.specialRequirements || '无'}

【学校数据库】
${JSON.stringify(schoolsList, null, 2)}

请根据用户背景和偏好，从数据库中选择最适合的学校进行推荐。
要求：
1. 推荐3-5所核心推荐学校（category: "core"）
2. 可推荐2-3所备选方案（category: "alternative"）
3. 按AI认为的最适合程度排序（ranking从1开始）
4. 每所学校附上2-3句话的推荐理由（aiReason）
5. 给出匹配分数（matchScore，0-100）
6. 避开用户明确排除的国家

请输出JSON格式：
{
  "recommendations": [
    {
      "schoolId": 1,
      "ranking": 1,
      "category": "core",
      "aiReason": "推荐理由摘要（2-3句话）",
      "matchScore": 85
    }
  ],
  "summary": "整体推荐策略说明（30字以内）"
}`
  }

  // 构建深度分析Prompt
  const buildAnalysisPrompt = (assessment: any, schoolId: number): string => {
    const school = schoolsData.find(s => s.id === schoolId)
    if (!school) throw new Error('School not found')

    const userProfile = {
      gpa: assessment.basic?.gpa || 3.0,
      university: assessment.basic?.university || 'regular',
      language: assessment.basic?.language || '未填写',
      averageScore: assessment.academic?.averageScore || 75,
      researchCount: assessment.academic?.research?.length || 0,
      internshipCount: assessment.practice?.internships?.length || 0
    }

    return `基于以下用户背景和学校信息，生成详细的选校分析：

【用户背景】
- GPA: ${userProfile.gpa}/4.0
- 院校: ${userProfile.university === '985' ? '985院校' : userProfile.university === '211' ? '211院校' : userProfile.university === 'overseas' ? '海外院校' : '普通本科'}
- 均分: ${userProfile.averageScore}/100
- 语言成绩: ${userProfile.language}
- 科研经历: ${userProfile.researchCount}项
- 实习经历: ${userProfile.internshipCount}项

【学校信息】
- 名称: ${school.name}
- 国家: ${school.country}
- 排名: ${school.ranking}
- 录取率: ${school.acceptanceRate}
- 最低GPA要求: ${school.admissionCriteria.minGPA}
- 偏好GPA: ${school.admissionCriteria.preferredGPA}
- 竞争程度: ${school.admissionCriteria.competitiveness}

请输出JSON格式：
{
  "matchPoints": ["匹配点1", "匹配点2", ...],
  "risks": ["风险1", "风险2", ...],
  "suggestions": ["建议1", "建议2", ...],
  "admissionProbability": "录取概率评估（如：中等偏上、约70%）"
}`
  }

  // 生成推荐列表
  const generateRecommendations = async (
    assessment: any, 
    preference: UserPreference,
    providerId: string
  ): Promise<{ recommendations: AIRecommendation[], summary: string }> => {
    loading.value = true
    error.value = null

    try {
      const prompt = buildRecommendationPrompt(assessment, preference)
      
      const messages = [
        { role: 'user' as const, content: prompt }
      ]

      const response = await sendMessageToAI(providerId, messages, {
        temperature: 0.7,
        stream: false
      })

      const content = response.content
      
      // 解析JSON
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/\{[\s\S]*\}/)
      
      let parsed: AIRecommendationResponse
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        parsed = JSON.parse(jsonStr.trim())
      } else {
        throw new Error('无法解析AI响应')
      }

      // 转换为AIRecommendation格式
      const recommendations: AIRecommendation[] = parsed.recommendations.map(rec => {
        const school = schoolsData.find(s => s.id === rec.schoolId)
        return {
          schoolId: rec.schoolId,
          schoolName: school?.name || '未知学校',
          aiReason: rec.aiReason,
          matchScore: rec.matchScore,
          ranking: rec.ranking,
          category: rec.category
        }
      })

      return {
        recommendations,
        summary: parsed.summary
      }
    } catch (err) {
      console.error('Generate recommendations error:', err)
      error.value = err instanceof Error ? err.message : '生成推荐失败'
      
      // 返回默认推荐（基于匹配度算法）
      return generateFallbackRecommendations(assessment)
    } finally {
      loading.value = false
    }
  }

  // 生成深度分析
  const generateAnalysis = async (
    assessment: any,
    schoolId: number,
    providerId: string
  ): Promise<SchoolAnalysis> => {
    loading.value = true
    error.value = null

    try {
      const prompt = buildAnalysisPrompt(assessment, schoolId)
      
      const messages = [
        { role: 'user' as const, content: prompt }
      ]

      const response = await sendMessageToAI(providerId, messages, {
        temperature: 0.7,
        stream: false
      })

      const content = response.content
      
      // 解析JSON
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/\{[\s\S]*\}/)
      
      let parsed: AIAnalysisResponse
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        parsed = JSON.parse(jsonStr.trim())
      } else {
        throw new Error('无法解析AI响应')
      }

      return {
        schoolId,
        matchPoints: parsed.matchPoints || [],
        risks: parsed.risks || [],
        suggestions: parsed.suggestions || [],
        admissionProbability: parsed.admissionProbability || '未知'
      }
    } catch (err) {
      console.error('Generate analysis error:', err)
      error.value = err instanceof Error ? err.message : '生成分析失败'
      
      // 返回默认分析
      return generateFallbackAnalysis(assessment, schoolId)
    } finally {
      loading.value = false
    }
  }

  // 默认推荐（当AI调用失败时使用）
  const generateFallbackRecommendations = (assessment: any): { recommendations: AIRecommendation[], summary: string } => {
    const schoolsWithMatch = getAllSchoolsWithMatch(assessment)
    
    // 过滤掉被排除的国家
    const filtered = schoolsWithMatch.filter(s => s.match && s.match > 50)
    
    // 排序并选择前8个
    const sorted = filtered.sort((a, b) => (b.match || 0) - (a.match || 0)).slice(0, 8)
    
    const recommendations: AIRecommendation[] = sorted.map((school, index) => ({
      schoolId: school.id,
      schoolName: school.name,
      aiReason: `根据你的背景分析，这所学校与你的匹配度为${school.match}%。${school.category === 'reach' ? '作为冲刺目标' : school.category === 'safe' ? '作为保底选择' : '作为匹配院校'}较为合适。`,
      matchScore: school.match || 50,
      ranking: index + 1,
      category: index < 5 ? 'core' : 'alternative'
    }))

    return {
      recommendations,
      summary: '基于你的背景智能匹配推荐'
    }
  }

  // 默认分析（当AI调用失败时使用）
  const generateFallbackAnalysis = (assessment: any, schoolId: number): SchoolAnalysis => {
    const school = schoolsData.find(s => s.id === schoolId)
    if (!school) {
      return {
        schoolId,
        matchPoints: ['学校信息加载中...'],
        risks: ['请稍后重试'],
        suggestions: ['尝试刷新页面'],
        admissionProbability: '未知'
      }
    }

    const userGPA = assessment.basic?.gpa || 3.0
    const gpaMatch = userGPA >= school.admissionCriteria.minGPA
    
    return {
      schoolId,
      matchPoints: [
        gpaMatch ? `你的GPA ${userGPA} 达到该校最低要求 ${school.admissionCriteria.minGPA}` : '建议提升GPA以增强竞争力',
        `该校${school.major}专业实力较强`,
        `${school.country}的留学环境适合你的发展`
      ],
      risks: [
        `录取率仅${school.acceptanceRate}，竞争激烈`,
        school.admissionCriteria.competitiveness === 'extreme' ? '顶尖名校，申请难度极高' : '需要充分准备申请材料'
      ],
      suggestions: [
        '重点突出你的科研和实践经历',
        '准备高质量的推荐信',
        '精心打磨申请文书',
        '提前准备语言成绩'
      ],
      admissionProbability: school.match && school.match > 80 ? '较高' : 
                           school.match && school.match > 60 ? '中等' : '较低'
    }
  }

  return {
    loading,
    error,
    generateRecommendations,
    generateAnalysis
  }
}
