import { schoolsData } from '@/data/schoolsData'

export function getSchoolById(id) {
  return schoolsData.find(s => s.id === parseInt(id)) || null
}

export function getAllSchools() {
  return schoolsData
}

export function getSchoolsByCountry(country) {
  return schoolsData.filter(s => s.country === country)
}

function parseLanguageScore(languageStr) {
  if (!languageStr) return { type: null, score: 0 }

  const ieltsMatch = languageStr.match(/雅思\s*(\d+\.?\d*)/i)
  const toeflMatch = languageStr.match(/托福\s*(\d+)/i)
  
  if (ieltsMatch) {
    return { type: 'ielts', score: parseFloat(ieltsMatch[1]) }
  }
  if (toeflMatch) {
    return { type: 'toefl', score: parseInt(toeflMatch[1]) }
  }
  return { type: null, score: 0 }
}

// ============================================================
// 以下匹配算法仅作为AI推荐的补充参考
// 最终推荐决策由AI根据用户背景和学校要求进行智能判断
// ============================================================

function calculateGPAScore(userGPA, schoolCriteria) {
  const { minGPA, preferredGPA, competitiveness } = schoolCriteria
  
  // 如果低于最低要求，根据竞争程度给予较低分数
  if (userGPA < minGPA) {
    const gap = minGPA - userGPA
    // 竞争越激烈，低于要求的惩罚越重
    if (competitiveness === 'extreme') {
      return Math.max(5, 20 - gap * 40)
    } else if (competitiveness === 'very_high') {
      return Math.max(10, 25 - gap * 35)
    } else if (competitiveness === 'high') {
      return Math.max(15, 30 - gap * 30)
    }
    return Math.max(20, 35 - gap * 25)
  }
  
  // 达到最低要求但低于偏好GPA
  if (userGPA < preferredGPA) {
    const range = preferredGPA - minGPA
    const position = userGPA - minGPA
    return 50 + (position / range) * 35
  }
  
  // 达到或超过偏好GPA
  return 100
}

function calculateLanguageScore(userLanguage, schoolCriteria) {
  const userLang = parseLanguageScore(userLanguage)
  const { languageRequirements } = schoolCriteria
  
  if (!userLang.type) {
    return 30  // 未填写语言成绩，给予较低分数
  }
  
  if (userLang.type === 'ielts') {
    const required = languageRequirements.ielts
    if (userLang.score >= required + 0.5) return 100
    if (userLang.score >= required) return 80
    if (userLang.score >= required - 0.5) return 50
    return 20
  }
  
  if (userLang.type === 'toefl') {
    const required = languageRequirements.toefl
    if (userLang.score >= required + 10) return 100
    if (userLang.score >= required) return 80
    if (userLang.score >= required - 10) return 50
    return 20
  }
  
  return 30
}

function calculateUniversityTierScore(userUniversity, schoolCriteria) {
  const { universityTier, competitiveness } = schoolCriteria
  
  // 完全匹配
  if (universityTier.includes(userUniversity)) {
    return 100
  }
  
  // 不匹配时，根据竞争程度和用户院校背景给予分数
  // 竞争激烈的学校对院校背景要求更严格
  if (competitiveness === 'extreme') {
    if (userUniversity === 'regular') return 15
    if (userUniversity === '211') return 50
    return 70
  }
  
  if (competitiveness === 'very_high') {
    if (userUniversity === 'regular') return 25
    if (userUniversity === '211') return 60
    return 75
  }
  
  if (competitiveness === 'high') {
    if (userUniversity === 'regular') return 40
    if (userUniversity === '211') return 70
    return 80
  }
  
  // 竞争程度较低的学校，院校背景影响较小
  if (userUniversity === 'regular') return 60
  if (userUniversity === '211') return 80
  return 85
}

function calculateAverageScoreScore(userAvgScore, schoolCriteria) {
  const { averageScoreMin } = schoolCriteria
  
  if (userAvgScore >= averageScoreMin + 10) return 100
  if (userAvgScore >= averageScoreMin + 5) return 85
  if (userAvgScore >= averageScoreMin) return 70
  if (userAvgScore >= averageScoreMin - 5) return 45
  if (userAvgScore >= averageScoreMin - 10) return 25
  return 10
}

function calculateResearchScore(researchCount, schoolCriteria) {
  const { researchWeight, competitiveness } = schoolCriteria
  
  // 如果学校不看重科研
  if (researchWeight <= 0.1) {
    return 60 + Math.min(researchCount * 10, 40)
  }
  
  // 研究型学校对科研要求更高
  const requiredResearch = competitiveness === 'extreme' ? 3 : 
                          competitiveness === 'very_high' ? 2 : 1
  
  if (researchCount >= requiredResearch + 2) return 100
  if (researchCount >= requiredResearch + 1) return 85
  if (researchCount >= requiredResearch) return 70
  if (researchCount >= requiredResearch - 1) return 40
  return 20
}

function calculatePracticeScore(practiceCount) {
  if (practiceCount >= 5) return 100
  if (practiceCount >= 3) return 75
  if (practiceCount >= 2) return 55
  if (practiceCount >= 1) return 40
  return 25
}

function determineCategory(matchScore, competitiveness, userProfile, school) {
  // 基于匹配分数和竞争程度初步分类
  // 注意：这只是初步参考，AI会根据实际情况调整
  
  const criteria = school.admissionCriteria
  
  // 如果GPA低于最低要求，强制为冲刺
  if (userProfile.gpa < criteria.minGPA) {
    return 'reach'
  }
  
  // 如果院校背景不在偏好列表且竞争激烈，倾向于冲刺
  if ((competitiveness === 'extreme' || competitiveness === 'very_high') &&
      !criteria.universityTier.includes(userProfile.university)) {
    return 'reach'
  }
  
  // 根据匹配分数分类
  if (competitiveness === 'extreme' || competitiveness === 'very_high') {
    if (matchScore >= 80) return 'match'
    if (matchScore >= 60) return 'reach'
    return 'reach'
  }
  
  if (matchScore >= 75) return 'safe'
  if (matchScore >= 55) return 'match'
  return 'reach'
}

export function calculateMatchScore(userProfile, school) {
  const criteria = school.admissionCriteria
  if (!criteria) {
    return {
      match: 50,
      category: 'match',
      breakdown: {
        gpa: 50,
        language: 50,
        university: 50,
        averageScore: 50,
        research: 50,
        practice: 50
      },
      isAIEvaluated: true  // 标记需要AI评估
    }
  }
  
  const gpaScore = calculateGPAScore(userProfile.gpa || 3.0, criteria)
  const languageScore = calculateLanguageScore(userProfile.language || '', criteria)
  const universityScore = calculateUniversityTierScore(userProfile.university || 'regular', criteria)
  const avgScoreScore = calculateAverageScoreScore(userProfile.averageScore || 75, criteria)
  const researchScore = calculateResearchScore(userProfile.researchCount || 0, criteria)
  const practiceScore = calculatePracticeScore(userProfile.practiceCount || 0)
  
  // 权重分配
  const weights = {
    gpa: 0.25,
    language: 0.15,
    university: 0.20,
    averageScore: 0.15,
    research: criteria.researchWeight || 0.15,
    practice: 0.10
  }
  
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  
  const matchScore = Math.round(
    (gpaScore * weights.gpa +
     languageScore * weights.language +
     universityScore * weights.university +
     avgScoreScore * weights.averageScore +
     researchScore * weights.research +
     practiceScore * weights.practice) / totalWeight
  )
  
  const category = determineCategory(matchScore, criteria.competitiveness, userProfile, school)
  
  return {
    match: Math.min(99, Math.max(5, matchScore)),
    category,
    breakdown: {
      gpa: Math.round(gpaScore),
      language: Math.round(languageScore),
      university: Math.round(universityScore),
      averageScore: Math.round(avgScoreScore),
      research: Math.round(researchScore),
      practice: Math.round(practiceScore)
    },
    isAIEvaluated: true  // 标记这只是初步参考，需要AI最终评估
  }
}

export function getRecommendedSchools(assessmentData = null) {
  if (!assessmentData || !assessmentData.basic) {
    return {
      reach: schoolsData.filter(s => s.admissionCriteria?.competitiveness === 'extreme' || 
                                     s.admissionCriteria?.competitiveness === 'very_high').slice(0, 3),
      match: schoolsData.filter(s => s.admissionCriteria?.competitiveness === 'high').slice(0, 5),
      safe: schoolsData.filter(s => s.admissionCriteria?.competitiveness === 'moderate' || 
                                    s.admissionCriteria?.competitiveness === 'accessible').slice(0, 5)
    }
  }
  
  const userProfile = {
    gpa: assessmentData.basic.gpa,
    language: assessmentData.basic.language,
    university: assessmentData.basic.university,
    averageScore: assessmentData.academic?.averageScore || 75,
    researchCount: assessmentData.academic?.research?.length || 0,
    practiceCount: (assessmentData.practice?.internships?.length || 0) + 
                   (assessmentData.practice?.competitions?.length || 0) + 
                   (assessmentData.practice?.volunteers?.length || 0)
  }
  
  const schoolsWithMatch = schoolsData.map(school => {
    const result = calculateMatchScore(userProfile, school)
    return {
      ...school,
      match: result.match,
      category: result.category,
      matchBreakdown: result.breakdown
    }
  })
  
  const reach = schoolsWithMatch
    .filter(s => s.category === 'reach')
    .sort((a, b) => b.match - a.match)
    .slice(0, 5)
  
  const match = schoolsWithMatch
    .filter(s => s.category === 'match')
    .sort((a, b) => b.match - a.match)
    .slice(0, 7)
  
  const safe = schoolsWithMatch
    .filter(s => s.category === 'safe')
    .sort((a, b) => b.match - a.match)
    .slice(0, 5)
  
  return { reach, match, safe }
}

export function getAllSchoolsWithMatch(assessmentData) {
  if (!assessmentData || !assessmentData.basic) {
    return schoolsData.map(school => ({
      ...school,
      match: school.match || 50,
      category: 'match'
    }))
  }
  
  const userProfile = {
    gpa: assessmentData.basic.gpa,
    language: assessmentData.basic.language,
    university: assessmentData.basic.university,
    averageScore: assessmentData.academic?.averageScore || 75,
    researchCount: assessmentData.academic?.research?.length || 0,
    practiceCount: (assessmentData.practice?.internships?.length || 0) + 
                   (assessmentData.practice?.competitions?.length || 0) + 
                   (assessmentData.practice?.volunteers?.length || 0)
  }
  
  return schoolsData.map(school => {
    const result = calculateMatchScore(userProfile, school)
    return {
      ...school,
      match: result.match,
      category: result.category,
      matchBreakdown: result.breakdown
    }
  }).sort((a, b) => b.match - a.match)
}

export function buildRecommendationAnalysisPrompt(assessmentData, recommendedSchools) {
  const userProfile = {
    name: assessmentData.basic.name || '未填写',
    university: assessmentData.basic.university,
    gpa: assessmentData.basic.gpa,
    language: assessmentData.basic.language || '未填写',
    averageScore: assessmentData.academic?.averageScore || 75,
    degree: assessmentData.academic?.degree || '本科',
    majors: assessmentData.academic?.majors?.join('、') || '未选择',
    researchCount: assessmentData.academic?.research?.length || 0,
    internshipCount: assessmentData.practice?.internships?.length || 0,
    competitionCount: assessmentData.practice?.competitions?.length || 0,
    volunteerCount: assessmentData.practice?.volunteers?.length || 0
  }

  const formatSchoolList = (schools, categoryName) => {
    if (schools.length === 0) return `无${categoryName}院校`
    return schools.map(s => 
      `- ${s.name}（${s.country}，QS ${s.ranking.replace('QS #', '#')}，匹配度 ${s.match}%）`
    ).join('\n')
  }

  const reachSchools = recommendedSchools.filter(s => s.category === 'reach').slice(0, 5)
  const matchSchools = recommendedSchools.filter(s => s.category === 'match').slice(0, 5)
  const safeSchools = recommendedSchools.filter(s => s.category === 'safe').slice(0, 5)

  return `你是一位资深的留学选校顾问，拥有丰富的申请经验。请基于以下用户的背景信息和系统推荐的院校列表，生成一份专业、详细、有针对性的选校分析报告。

【重要】请直接输出最终的选校分析报告，不要输出你的思考过程或分析步骤。直接以"# AI 选校深度分析报告"开头。

【重要】在整个报告中，请使用"您"来称呼用户。

## 用户背景信息

**基础信息：**
- 姓名：${userProfile.name}
- 在读院校：${userProfile.university === '985' ? '985院校' : userProfile.university === '211' ? '211院校' : userProfile.university === 'overseas' ? '海外院校' : '普通本科'}
- GPA：${userProfile.gpa.toFixed(1)}/4.0
- 语言成绩：${userProfile.language}
- 均分：${userProfile.averageScore}/100

**学术背景：**
- 学历层次：${userProfile.degree}
- 专业方向：${userProfile.majors}
- 科研经历：${userProfile.researchCount} 项
- 实习经历：${userProfile.internshipCount} 项
- 竞赛获奖：${userProfile.competitionCount} 项
- 志愿服务：${userProfile.volunteerCount} 项

## 系统推荐院校

**冲刺院校（高难度，需要努力争取）：**
${formatSchoolList(reachSchools, '冲刺')}

**匹配院校（与背景较为匹配）：**
${formatSchoolList(matchSchools, '匹配')}

**保底院校（录取把握较大）：**
${formatSchoolList(safeSchools, '保底')}

---

请生成一份详细的选校分析报告，包含以下内容（使用Markdown格式）：

### 1. 背景竞争力总结
用2-3句话概括用户的整体竞争力，指出最突出的优势和需要提升的方面。

### 2. 冲刺院校分析
针对每所冲刺院校：
- 为什么被推荐（匹配点）
- 申请难度评估
- 需要重点准备的材料或提升的方向
- 录取概率预估

### 3. 匹配院校分析
针对每所匹配院校：
- 与背景的契合度分析
- 申请策略建议
- 录取概率预估

### 4. 保底院校分析
针对每所保底院校：
- 为什么适合作为保底
- 申请注意事项
- 录取概率预估

### 5. 整体申请策略建议
- 申请时间规划建议
- 材料准备重点
- 是否需要补充经历（科研/实习等）
- 语言成绩是否需要提升

### 6. 风险提示
- 哪些学校申请风险较高
- 需要特别注意的申请要求
- 备选方案建议

注意：
- 分析要具体、有针对性，避免泛泛而谈
- 建议要切实可行，考虑时间成本
- 录取概率要客观评估，不要过度乐观或悲观

---

## AI推荐院校（JSON格式）

请在报告末尾以如下JSON格式输出您推荐的院校列表。JSON必须完整且可直接解析，schoolName必须与上方院校名称完全一致：

` + "```json" + `
{
  "summary": "整体推荐策略的一句话总结（20字以内）",
  "reach": [
    {
      "schoolName": "学校名称（必须与上方列表中的名称完全一致）",
      "matchScore": 85,
      "reason": "推荐理由：为什么适合冲刺该校",
      "admissionProbability": "概率预估（如：60%，或'概率较低/风险较高'）",
      "gap": "与用户背景的主要差距",
      "strategy": "针对性的申请策略建议"
    }
  ],
  "match": [
    {
      "schoolName": "学校名称",
      "matchScore": 75,
      "reason": "推荐理由：为什么与用户背景匹配",
      "admissionProbability": "概率预估（如：75%）",
      "fit": "契合度分析",
      "strategy": "申请策略建议"
    }
  ],
  "safe": [
    {
      "schoolName": "学校名称",
      "matchScore": 60,
      "reason": "推荐理由：为什么适合保底",
      "admissionProbability": "概率预估（如：90%）",
      "notes": "申请注意事项"
    }
  ]
}
` + "```" + `

【重要】
- reach、match、safe三个分类每个至少推荐1所学校，最多5所
- matchScore为0-100的整数，表示AI评估的匹配度
- 如果某分类没有合适的学校，可为空数组但不能省略
- JSON必须是有效的，不要包含任何注释或额外文本`
}
