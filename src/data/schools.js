// 院校数据统一导出
// 供选校推荐、院校数据库、院校详情等页面使用

export const schoolsData = [
  {
    id: 1,
    name: '哈佛大学',
    country: '美国',
    major: 'Computer Science',
    ranking: 'QS #1',
    match: 95,
    deadline: '2025-01-01',
    tuition: '$50,000',
    acceptanceRate: '4%',
    requirements: ['GPA 3.9+', 'GRE 330+', 'Research experience', 'Strong recommendations'],
    website: 'https://harvard.edu',
    description: '世界顶尖研究型大学，拥有卓越的学术资源和悠久的历史传统。',
    type: '私立大学',
    students: '约31,000人',
    image: ''
  },
  {
    id: 2,
    name: '斯坦福大学',
    country: '美国',
    major: 'AI',
    ranking: 'QS #2',
    match: 88,
    deadline: '2025-01-02',
    tuition: '$52,000',
    acceptanceRate: '4.5%',
    requirements: ['GPA 3.8+', 'Strong research background', 'Innovation focus'],
    website: 'https://stanford.edu',
    description: '位于硅谷中心，以创新和技术领先全球。',
    type: '私立大学',
    students: '约17,000人',
    image: ''
  },
  {
    id: 3,
    name: '麻省理工学院',
    country: '美国',
    major: 'CS',
    ranking: 'QS #3',
    match: 92,
    deadline: '2025-01-03',
    tuition: '$53,000',
    acceptanceRate: '3.9%',
    requirements: ['GPA 3.95+', 'Olympiad medals preferred', 'Mathematical excellence'],
    website: 'https://mit.edu',
    description: '世界著名的理工科大学，在科学和技术领域处于领导地位。',
    type: '私立大学',
    students: '约11,000人',
    image: ''
  },
  {
    id: 4,
    name: '牛津大学',
    country: '英国',
    major: 'CS',
    ranking: 'QS #4',
    match: 85,
    deadline: '2025-01-15',
    tuition: '£35,000',
    acceptanceRate: '18%',
    requirements: ['First Class Degree', 'Strong references', 'Academic excellence'],
    website: 'https://ox.ac.uk',
    description: '英语世界最古老的大学，享有卓越的学术声誉。',
    type: '公立大学',
    students: '约24,000人',
    image: ''
  },
  {
    id: 5,
    name: '剑桥大学',
    country: '英国',
    major: 'CS',
    ranking: 'QS #5',
    match: 82,
    deadline: '2025-01-20',
    tuition: '£34,000',
    acceptanceRate: '19%',
    requirements: ['2:1 Degree minimum', 'Strong academic background'],
    website: 'https://cam.ac.uk',
    description: '世界顶尖的研究型大学，培养了大量诺贝尔奖得主。',
    type: '公立大学',
    students: '约23,000人',
    image: ''
  },
  {
    id: 6,
    name: '清华大学',
    country: '中国',
    major: 'CS',
    ranking: 'QS #25',
    match: 75,
    deadline: '2025-03-01',
    tuition: '¥30,000',
    acceptanceRate: '15%',
    requirements: ['GPA 3.5+', 'Strong academic performance'],
    website: 'https://tsinghua.edu.cn',
    description: '中国顶尖的综合性研究型大学，工程和计算机科学领域领先。',
    type: '公立大学',
    students: '约50,000人',
    image: ''
  },
  {
    id: 7,
    name: '昆士兰大学',
    country: '澳大利亚',
    major: 'CS',
    ranking: 'QS #50',
    match: 65,
    deadline: '2025-02-15',
    tuition: 'AUD 40,000',
    acceptanceRate: '30%',
    requirements: ['GPA 3.0+', 'English proficiency'],
    website: 'https://uq.edu.au',
    description: '澳大利亚八校联盟成员，科研实力雄厚。',
    type: '公立大学',
    students: '约53,000人',
    image: ''
  }
]

// 根据ID获取院校
export function getSchoolById(id) {
  return schoolsData.find(s => s.id === parseInt(id)) || null
}

// 获取所有院校
export function getAllSchools() {
  return schoolsData
}

// 根据国家筛选院校
export function getSchoolsByCountry(country) {
  return schoolsData.filter(s => s.country === country)
}

// 根据匹配度获取推荐分类
export function getRecommendedSchools(assessmentData = null) {
  // 如果没有评估数据，返回默认推荐（按匹配度）
  if (!assessmentData) {
    return {
      reach: schoolsData.filter(s => s.match >= 85),
      match: schoolsData.filter(s => s.match >= 70 && s.match < 85),
      safe: schoolsData.filter(s => s.match < 70)
    }
  }

  // TODO: 基于真实评估数据进行个性化推荐
  // 这里简单返回默认分类
  return getRecommendedSchools()
}
