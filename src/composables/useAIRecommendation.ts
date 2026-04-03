import { computed } from 'vue'
import { sendMessageToAI } from '@/utils/ai-api'
import { schoolsData, getAllSchoolsWithMatch } from '@/utils/recommendationEngine'
import { useGlobalRecommendationState } from './useGlobalRecommendationState'
import type { UserPreference, AIRecommendation, SchoolAnalysis, AIRecommendationResponse, AIAnalysisResponse } from '@/types/recommendation'

type PriorityKey = 'ranking' | 'major' | 'career' | 'location' | 'cost'
type SchoolWithMatch = ReturnType<typeof getAllSchoolsWithMatch>[0]

export type RecommendationStep = 'idle' | 'analyzing' | 'matching' | 'generating' | 'completed' | 'error'

export const stepLabels: Record<RecommendationStep, string> = {
  idle: '准备开始',
  analyzing: '正在分析你的背景信息...',
  matching: '正在匹配适合你的院校...',
  generating: '正在生成推荐理由...',
  completed: '推荐完成！',
  error: '生成失败'
}

export function useAIRecommendation() {
  // 使用全局状态
  const globalState = useGlobalRecommendationState()
  
  // 本地 ref，用于兼容原有代码
  const loading = computed(() => globalState.state.loading)
  const error = computed(() => globalState.state.error)
  const currentStep = computed(() => globalState.state.currentStep)
  const streamingContent = computed(() => globalState.state.streamingContent)
  const isStreaming = computed(() => globalState.state.isStreaming)
  
  const stepProgress = computed(() => globalState.state.stepProgress)

  // 构建推荐Prompt - AI驱动的智能推荐
  const buildRecommendationPrompt = (assessment: any, preference: UserPreference): string => {
    const userProfile = {
      gpa: assessment.basic?.gpa || 3.0,
      university: assessment.basic?.university || 'regular',
      language: assessment.basic?.language || '未填写',
      averageScore: assessment.academic?.averageScore || 75,
      degree: assessment.academic?.degree || '本科',
      majors: assessment.academic?.majors?.join('、') || '未选择',
      researchCount: assessment.academic?.research?.length || 0,
      researchDetails: assessment.academic?.research || [],
      internshipCount: assessment.practice?.internships?.length || 0,
      internshipDetails: assessment.practice?.internships || [],
      competitionCount: assessment.practice?.competitions?.length || 0,
      competitionDetails: assessment.practice?.competitions || []
    }

    const priorityMap: Record<PriorityKey, string> = {
      ranking: '学校排名',
      major: '专业实力',
      career: '就业前景',
      location: '地理位置',
      cost: '学费预算'
    }

    const prioritiesText = preference.priorities.map((p: PriorityKey) => priorityMap[p]).join('、')
    const excludedText = preference.excludedCountries.length > 0 
      ? preference.excludedCountries.join('、') 
      : '无'

    const schoolsList = schoolsData.map((s: any) => ({
      id: s.id,
      name: s.name,
      country: s.country,
      ranking: s.ranking,
      major: s.major,
      tuition: s.tuition,
      acceptanceRate: s.acceptanceRate,
      admissionCriteria: {
        minGPA: s.admissionCriteria.minGPA,
        preferredGPA: s.admissionCriteria.preferredGPA,
        universityTier: s.admissionCriteria.universityTier,
        competitiveness: s.admissionCriteria.competitiveness,
        averageScoreMin: s.admissionCriteria.averageScoreMin,
        researchWeight: s.admissionCriteria.researchWeight
      }
    }))

    return `你是一位资深留学顾问，拥有15年申请指导经验。请基于用户真实背景，进行**客观、严谨**的学校推荐。

【核心原则】
1. 必须客观评估，宁可保守不可乐观
2. 录取概率预估要有依据，参考学校实际录取难度
3. 明确指出差距和风险，不要模糊处理
4. 如果背景较弱，要诚实告知并给出提升建议

【用户背景】
- GPA: ${userProfile.gpa}/4.0
- 院校背景: ${userProfile.university === '985' ? '985院校' : userProfile.university === '211' ? '211院校' : userProfile.university === 'overseas' ? '海外院校' : '普通本科'}
- 专业: ${userProfile.majors}
- 均分: ${userProfile.averageScore}/100
- 语言成绩: ${userProfile.language}
- 科研经历: ${userProfile.researchCount}项 ${userProfile.researchCount > 0 ? JSON.stringify(userProfile.researchDetails.map((r: any) => r.name || r.title)) : ''}
- 实习经历: ${userProfile.internshipCount}项 ${userProfile.internshipCount > 0 ? JSON.stringify(userProfile.internshipDetails.map((i: any) => i.company || i.name)) : ''}
- 竞赛获奖: ${userProfile.competitionCount}项 ${userProfile.competitionCount > 0 ? JSON.stringify(userProfile.competitionDetails.map((c: any) => c.name)) : ''}

【用户偏好】
- 最看重: ${prioritiesText}
- 避开国家/地区: ${excludedText}
- 特殊要求: ${preference.specialRequirements || '无'}

【学校数据库】（含录取标准）
${JSON.stringify(schoolsList, null, 2)}

【推荐规则 - 必须严格遵守】

**冲刺院校 (reach)**: 录取概率 15-35%
- 用户背景明显低于学校要求
- 或院校背景不在学校偏好范围内但其他条件优秀
- 每所必须说明主要差距和风险点
- 建议数量: 1-2所

**匹配院校 (match)**: 录取概率 40-65%
- 用户GPA达到学校minGPA
- 院校背景在学校偏好范围内或接近
- 整体背景与学校要求基本匹配
- 建议数量: 3-4所

**保底院校 (safe)**: 录取概率 75%+
- 用户GPA高于学校minGPA 0.2以上
- 院校背景符合学校偏好
- 整体背景明显优于学校要求
- 建议数量: 2-3所

【严格约束】
1. 如果用户GPA低于学校minGPA，只能作为"冲刺"推荐
2. 如果用户院校背景是"普通本科"，申请竞争程度"extreme"或"very_high"的学校，只能作为"冲刺"
3. 如果用户无科研经历，申请研究型强校（researchWeight > 0.4）需降档推荐
4. 每所推荐学校必须给出录取概率（百分比区间）
5. 每所推荐学校必须指出主要差距（gaps数组）
6. 避开用户明确排除的国家

请输出JSON格式：
{
  "recommendations": [
    {
      "schoolId": 1,
      "ranking": 1,
      "category": "reach" | "match" | "safe",
      "aiReason": "推荐理由（2-3句话，包含匹配分析）",
      "matchScore": 75,
      "admissionProbability": "25-35%",
      "gaps": ["GPA低于偏好要求0.3", "缺少科研经历"],
      "advantages": ["实习经历丰富", "专业对口"]
    }
  ],
  "summary": "整体推荐策略说明（50字以内）",
  "riskWarning": "主要风险提示（如背景较弱需提升的方面）",
  "suggestions": ["提升建议1", "提升建议2"]
}`
  }

  // 构建深度分析Prompt - AI驱动的客观评估
  const buildAnalysisPrompt = (assessment: any, schoolId: number): string => {
    const school = schoolsData.find((s: any) => s.id === schoolId)
    if (!school) throw new Error('School not found')

    const userProfile = {
      gpa: assessment.basic?.gpa || 3.0,
      university: assessment.basic?.university || 'regular',
      language: assessment.basic?.language || '未填写',
      averageScore: assessment.academic?.averageScore || 75,
      majors: assessment.academic?.majors?.join('、') || '未选择',
      researchCount: assessment.academic?.research?.length || 0,
      researchDetails: assessment.academic?.research || [],
      internshipCount: assessment.practice?.internships?.length || 0,
      internshipDetails: assessment.practice?.internships || [],
      competitionCount: assessment.practice?.competitions?.length || 0,
      competitionDetails: assessment.practice?.competitions || []
    }

    const universityTierText = userProfile.university === '985' ? '985院校' : 
                               userProfile.university === '211' ? '211院校' : 
                               userProfile.university === 'overseas' ? '海外院校' : '普通本科'
    
    const competitivenessText = {
      'extreme': '极高（如MIT、斯坦福等顶尖名校）',
      'very_high': '很高（如常春藤、牛剑等）',
      'high': '较高（如QS前50）',
      'moderate': '中等（如QS 50-100）',
      'moderate_low': '中低（如QS 100-200）'
    }[school.admissionCriteria.competitiveness] || school.admissionCriteria.competitiveness

    return `你是一位资深留学顾问，请对用户的申请进行**客观、严谨**的深度分析。

【核心原则】
1. 必须客观评估，宁可保守不可乐观
2. 录取概率要有具体依据，参考学校实际录取难度和录取率
3. 明确指出差距和风险，不要模糊处理
4. 给出切实可行的提升建议

【用户背景】
- GPA: ${userProfile.gpa}/4.0
- 院校背景: ${universityTierText}
- 专业: ${userProfile.majors}
- 均分: ${userProfile.averageScore}/100
- 语言成绩: ${userProfile.language}
- 科研经历: ${userProfile.researchCount}项 ${userProfile.researchCount > 0 ? JSON.stringify(userProfile.researchDetails.map((r: any) => r.name || r.title)) : ''}
- 实习经历: ${userProfile.internshipCount}项 ${userProfile.internshipCount > 0 ? JSON.stringify(userProfile.internshipDetails.map((i: any) => i.company || i.name)) : ''}
- 竞赛获奖: ${userProfile.competitionCount}项 ${userProfile.competitionCount > 0 ? JSON.stringify(userProfile.competitionDetails.map((c: any) => c.name)) : ''}

【学校信息】
- 名称: ${school.name}
- 国家: ${school.country}
- 排名: ${school.ranking}
- 录取率: ${school.acceptanceRate}
- 竞争程度: ${competitivenessText}

【学校录取标准】
- 最低GPA要求: ${school.admissionCriteria.minGPA}
- 偏好GPA: ${school.admissionCriteria.preferredGPA}
- 偏好院校背景: ${school.admissionCriteria.universityTier?.join('、') || '无特殊要求'}
- 均分要求: ${school.admissionCriteria.averageScoreMin || '无特殊要求'}分以上
- 科研权重: ${school.admissionCriteria.researchWeight ? (school.admissionCriteria.researchWeight * 100).toFixed(0) + '%' : '无特殊要求'}

【分析要求】

1. **差距分析**: 必须逐项对比用户背景与学校要求，明确指出差距
2. **录取概率**: 给出具体的百分比区间（如25-35%），并说明依据
3. **风险评估**: 列出主要风险点，不要回避问题
4. **提升建议**: 给出切实可行的改进方案

【概率评估参考标准】
- 75%+ : 保底，用户背景明显优于学校要求
- 50-70% : 匹配，用户背景基本符合学校要求
- 30-50% : 有一定机会，但存在明显短板
- 15-30% : 冲刺，用户背景明显低于学校要求
- 15%以下 : 非常困难，差距过大

请输出JSON格式：
{
  "matchPoints": ["匹配点1（具体说明）", "匹配点2（具体说明）"],
  "gaps": ["差距1（具体说明）", "差距2（具体说明）"],
  "risks": ["风险1（具体说明）", "风险2（具体说明）"],
  "suggestions": ["建议1（具体可行）", "建议2（具体可行）"],
  "admissionProbability": {
    "range": "25-35%",
    "level": "冲刺" | "匹配" | "保底",
    "reasoning": "概率评估依据（参考学校录取率、竞争程度、用户背景差距等）"
  },
  "keyFactors": {
    "strengths": ["优势因素1", "优势因素2"],
    "weaknesses": ["劣势因素1", "劣势因素2"],
    "critical": ["关键影响因素1", "关键影响因素2"]
  },
  "timeline": {
    "urgent": ["紧急需要完成的事项"],
    "shortTerm": ["1-3个月内可完成"],
    "longTerm": ["3个月以上需要持续努力"]
  }
}`
  }

  // 生成推荐列表 - 流式版本
  const generateRecommendations = async (
    assessment: any, 
    preference: UserPreference,
    providerId: string,
    onStream?: (content: string) => void
  ): Promise<{ recommendations: AIRecommendation[], summary: string }> => {
    // 初始化全局状态
    globalState.startRecommendation(assessment, preference, providerId)

    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      globalState.updateStep('matching', 50)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const prompt = buildRecommendationPrompt(assessment, preference)
      
      const messages = [
        { role: 'user' as const, content: prompt }
      ]

      globalState.updateStep('generating', 75)
      
      // 使用流式输出，开启深度思考模式
      const streamGenerator = await sendMessageToAI(providerId, messages, {
        temperature: 0.7,
        stream: true,
        enableThinking: true
      })

      let fullContent = ''
      let reasoningContent = ''
      
      // 处理流式响应
      for await (const chunk of streamGenerator) {
        if (chunk.type === 'reasoning' && chunk.content) {
          // 处理思考过程
          reasoningContent += chunk.content
          // 将思考过程和内容一起显示
          const displayContent = reasoningContent + (fullContent ? '\n\n---\n\n' + fullContent : '')
          globalState.updateStreamingContent(displayContent, true)
          
          // 回调通知UI更新
          if (onStream) {
            onStream(displayContent)
          }
        } else if (chunk.type === 'content' && chunk.content) {
          fullContent += chunk.content
          // 如果有思考过程，一起显示
          const displayContent = reasoningContent 
            ? reasoningContent + '\n\n---\n\n' + fullContent 
            : fullContent
          globalState.updateStreamingContent(displayContent, true)
          
          // 回调通知UI更新
          if (onStream) {
            onStream(displayContent)
          }
        }
      }

      // 最终内容只保留正式输出（不含思考过程）
      globalState.updateStreamingContent(fullContent, false)
      
      // 解析JSON
      const jsonMatch = fullContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                       fullContent.match(/\{[\s\S]*\}/)
      
      let parsed: AIRecommendationResponse
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        parsed = JSON.parse(jsonStr.trim())
      } else {
        throw new Error('无法解析AI响应')
      }

      // 转换为AIRecommendation格式
      const recommendations: AIRecommendation[] = parsed.recommendations.map((rec: any) => {
        const school = schoolsData.find((s: any) => s.id === rec.schoolId)
        return {
          schoolId: rec.schoolId,
          schoolName: school?.name || '未知学校',
          aiReason: rec.aiReason,
          matchScore: rec.matchScore,
          ranking: rec.ranking,
          category: rec.category
        }
      })

      globalState.completeRecommendation(recommendations, parsed.summary)
      
      return {
        recommendations,
        summary: parsed.summary
      }
    } catch (err) {
      console.error('Generate recommendations error:', err)
      const errorMsg = err instanceof Error ? err.message : '生成推荐失败'
      globalState.setError(errorMsg)
      
      // 返回默认推荐（基于匹配度算法）
      return generateFallbackRecommendations(assessment)
    }
  }

  // 生成深度分析 - 流式版本
  const generateAnalysis = async (
    assessment: any,
    schoolId: number,
    providerId: string,
    onStream?: (content: string) => void
  ): Promise<SchoolAnalysis> => {
    // 初始化全局分析状态
    globalState.startAnalysis(schoolId, assessment, providerId)

    try {
      const prompt = buildAnalysisPrompt(assessment, schoolId)
      
      const messages = [
        { role: 'user' as const, content: prompt }
      ]

      // 使用流式输出，开启深度思考模式
      const streamGenerator = await sendMessageToAI(providerId, messages, {
        temperature: 0.7,
        stream: true,
        enableThinking: true
      })

      let fullContent = ''
      let reasoningContent = ''

      // 处理流式响应
      for await (const chunk of streamGenerator) {
        if (chunk.type === 'reasoning' && chunk.content) {
          // 处理思考过程
          reasoningContent += chunk.content
          // 将思考过程和内容一起显示
          const displayContent = reasoningContent + (fullContent ? '\n\n---\n\n' + fullContent : '')
          globalState.updateAnalysisStreamingContent(displayContent, true)
          
          // 回调通知UI更新
          if (onStream) {
            onStream(displayContent)
          }
        } else if (chunk.type === 'content' && chunk.content) {
          fullContent += chunk.content
          // 如果有思考过程，一起显示
          const displayContent = reasoningContent 
            ? reasoningContent + '\n\n---\n\n' + fullContent 
            : fullContent
          globalState.updateAnalysisStreamingContent(displayContent, true)
          
          // 回调通知UI更新
          if (onStream) {
            onStream(displayContent)
          }
        }
      }

      // 最终内容只保留正式输出（不含思考过程）
      globalState.updateAnalysisStreamingContent(fullContent, false)
      
      // 解析JSON
      const jsonMatch = fullContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                       fullContent.match(/\{[\s\S]*\}/)
      
      let parsed: AIAnalysisResponse
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        parsed = JSON.parse(jsonStr.trim())
      } else {
        throw new Error('无法解析AI响应')
      }

      const analysis: SchoolAnalysis = {
        schoolId,
        matchPoints: parsed.matchPoints || [],
        risks: parsed.risks || [],
        suggestions: parsed.suggestions || [],
        admissionProbability: parsed.admissionProbability || '未知'
      }

      globalState.completeAnalysis(analysis)
      return analysis
    } catch (err) {
      console.error('Generate analysis error:', err)
      const errorMsg = err instanceof Error ? err.message : '生成分析失败'
      globalState.setAnalysisError(errorMsg)
      
      // 返回默认分析
      return generateFallbackAnalysis(assessment, schoolId)
    }
  }

  // 默认推荐（当AI调用失败时使用）
  const generateFallbackRecommendations = (assessment: any): { recommendations: AIRecommendation[], summary: string } => {
    const schoolsWithMatch = getAllSchoolsWithMatch(assessment)
    
    const filtered = schoolsWithMatch.filter((s: SchoolWithMatch) => s.match && s.match > 50)
    
    const sorted = filtered.sort((a: SchoolWithMatch, b: SchoolWithMatch) => (b.match || 0) - (a.match || 0)).slice(0, 8)
    
    const recommendations: AIRecommendation[] = sorted.map((school: SchoolWithMatch, index: number) => ({
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
    const school = schoolsData.find((s: any) => s.id === schoolId)
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

  // 分析相关的计算属性
  const analysisLoading = computed(() => globalState.state.schoolAnalysis.loading)
  const analysisStreamingContent = computed(() => globalState.state.schoolAnalysis.streamingContent)
  const isAnalysisStreaming = computed(() => globalState.state.schoolAnalysis.isStreaming)
  const currentAnalysisResult = computed(() => globalState.state.schoolAnalysis.analysis)

  return {
    loading,
    error,
    currentStep,
    stepProgress,
    streamingContent,
    isStreaming,
    generateRecommendations,
    generateAnalysis,
    // 分析相关
    analysisLoading,
    analysisStreamingContent,
    isAnalysisStreaming,
    currentAnalysisResult,
    // 暴露全局状态方法
    globalState
  }
}
