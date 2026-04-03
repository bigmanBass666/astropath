// 专业数据
export const majorsData = [
  {
    id: 101,
    name: '计算机科学 (Computer Science)',
    category: '工科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年',
    description: '培养具备计算机系统设计、软件开发、人工智能等能力的专业人才',
    courses: ['数据结构与算法', '操作系统', '计算机网络', '数据库系统', '编译原理', '机器学习基础'],
    career: '软件工程师、算法工程师、系统架构师、技术总监、产品经理',
    salaryRange: '¥20K-50K/月 (国内) $80K-150K/年 (美国)',
    sources: {
      salary: { url: 'https://www.payscale.com/research/US/Job=Software_Engineer/Salary', label: 'PayScale薪资报告' },
      description: { url: 'https://www.acm.org/education/curricula-recommendations', label: 'ACM课程标准' }
    }
  },
  {
    id: 102,
    name: '人工智能 (Artificial Intelligence)',
    category: '工科',
    degreeType: '硕士/博士',
    duration: '硕士2年/博士4-5年',
    description: '专注于机器学习、深度学习，自然语言处理等AI前沿技术的研究与应用',
    courses: ['机器学习', '深度学习', '自然语言处理', '计算机视觉', '强化学习', '知识图谱'],
    career: 'AI算法工程师、数据科学家、AI研究员、自动驾驶工程师、对话系统设计师',
    salaryRange: '¥25K-60K/月 (国内) $100K-180K/年 (美国)',
    sources: {
      salary: { url: 'https://www.glassdoor.com/Salaries/ai-engineer-salary-SRCH_KO0,11.htm', label: 'Glassdoor薪资数据' },
      description: { url: 'https://ai.stanford.edu/', label: 'Stanford AI Lab' }
    }
  },
  {
    id: 103,
    name: '数据科学 (Data Science)',
    category: '工科',
    degreeType: '硕士/博士',
    duration: '硕士2年/博士4年',
    description: '培养数据挖掘、统计分析、机器学习等复合型数据分析人才',
    courses: ['统计学', 'Python数据分析', '大数据技术', '数据可视化', '商业智能', '隐私保护'],
    career: '数据科学家、数据分析师、商业分析师、数据工程师、风险控制专家',
    salaryRange: '¥18K-45K/月 (国内) $90K-140K/年 (美国)',
    sources: {
      salary: { url: 'https://www.payscale.com/research/US/Job=Data_Scientist/Salary', label: 'PayScale薪资报告' },
      description: { url: 'https://www.datascienceassociation.org/', label: '数据科学协会' }
    }
  },
  {
    id: 104,
    name: '金融工程 (Financial Engineering)',
    category: '商科',
    degreeType: '硕士',
    duration: '1.5-2年',
    description: '结合金融理论、数学建模和编程技术，培养金融产品设计与风险管理人才',
    courses: ['金融衍生品', '量化分析', '风险管理', '固定收益证券', 'C++/Python金融编程', '蒙特卡洛模拟'],
    career: '量化分析师、金融工程师、风险经理、投资策略师、衍生品交易员',
    salaryRange: '¥30K-80K/月 (国内) $120K-200K/年 (美国)',
    sources: {
      salary: { url: 'https://www.glassdoor.com/Salaries/quantitative-analyst-salary-SRCH_KO0,20.htm', label: 'Glassdoor薪资数据' },
      description: { url: 'https://www.iaqf.org/', label: '国际量化金融协会' }
    }
  },
  {
    id: 105,
    name: 'MBA (工商管理硕士)',
    category: '商科',
    degreeType: '硕士',
    duration: '2年',
    description: '培养具有全球视野和综合管理能力的企业高级管理人才',
    courses: ['战略管理', '市场营销', '财务管理', '组织行为学', '领导力发展', '商业伦理'],
    career: '企业高管、咨询顾问、创业创始人，投资银行家、职业经理人',
    salaryRange: '¥40K-100K/月 (国内) $150K-250K/年 (美国)',
    sources: {
      salary: { url: 'https://www.gmac.com/', label: 'GMAC薪资报告' },
      description: { url: 'https://www.aacsb.edu/', label: 'AACSB认证标准' }
    }
  },
  {
    id: 106,
    name: '公共政策 (Public Policy)',
    category: '社科',
    degreeType: '硕士/博士',
    duration: '硕士2年/博士4-6年',
    description: '培养政府、非营利组织和国际机构的政策分析与管理人才',
    courses: ['公共经济学', '政策分析', '政治学理论', '研究方法', '公共管理', 'Ethics in Public Service'],
    career: '政策分析师、政府公务员、NGO项目经理、国际组织官员、公共事务顾问',
    salaryRange: '¥10K-30K/月 (国内) $60K-100K/年 (美国)',
    sources: {
      salary: { url: 'https://www.payscale.com/research/US/Job=Policy_Analyst/Salary', label: 'PayScale薪资报告' },
      description: { url: 'https://www.appam.org/', label: 'APPAM公共政策协会' }
    }
  },
  {
    id: 107,
    name: '生物医学工程 (Biomedical Engineering)',
    category: '工科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士5年',
    description: '结合工程学、生物学和医学，开发医疗设备和生物技术解决方案',
    courses: ['生物力学', '生物材料', '医学影像', '信号处理', '组织工程', '医疗器械设计'],
    career: '医疗设备工程师、研发科学家、临床工程师、医疗器械注册专员、创业',
    salaryRange: '¥15K-35K/月 (国内) $85K-130K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/architecture-and-engineering/biomedical-engineers.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.bmes.org/', label: '生物医学工程学会' }
    }
  },
  {
    id: 108,
    name: '新闻传播 (Journalism & Communication)',
    category: '社科',
    degreeType: '本科/硕士',
    duration: '本科4年/硕士1-2年',
    description: '培养新闻采编、媒体运营、公关传播等领域的专业人才',
    courses: ['新闻采访与写作', '媒体伦理', '传播学理论', '数字媒体技术', '公共关系', '广告策划'],
    career: '记者、编辑、新媒体运营、公关经理、内容策划、媒体分析师',
    salaryRange: '¥8K-25K/月 (国内) $50K-90K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/media-and-communication/journalists.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.spj.org/', label: '职业记者协会' }
    }
  },
  {
    id: 109,
    name: '建筑设计 (Architecture)',
    category: '工科',
    degreeType: '本科/硕士',
    duration: '本科5年/硕士2-3年',
    description: '培养具备建筑设计、城市规划、景观设计等能力的专业人才',
    courses: ['建筑设计', '建筑历史', '结构力学', '建筑物理', 'CAD/BIM技术', '城市规划原理'],
    career: '建筑师、城市规划师、室内设计师、景观设计师、建筑项目经理',
    salaryRange: '¥12K-35K/月 (国内) $70K-120K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/architecture-and-engineering/architects.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.naab.org/', label: 'NAAB认证委员会' }
    }
  },
  {
    id: 110,
    name: '统计学 (Statistics)',
    category: '理科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士4-5年',
    description: '培养具备统计理论、数据分析、概率建模等能力的专业人才，广泛应用于金融、医疗、科技等领域',
    courses: ['概率论', '数理统计', '回归分析', '时间序列分析', '贝叶斯统计', '统计计算'],
    career: '统计师、数据分析师、精算师、市场研究分析师、生物统计师',
    salaryRange: '¥15K-40K/月 (国内) $80K-130K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/math/statisticians.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.amstat.org/', label: '美国统计协会' }
    }
  },
  {
    id: 111,
    name: '心理学 (Psychology)',
    category: '理科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士5-7年',
    description: '研究人类行为与心理过程，培养心理咨询、人力资源、用户体验等领域的专业人才',
    courses: ['普通心理学', '发展心理学', '认知心理学', '社会心理学', '心理测量', '心理咨询技术'],
    career: '心理咨询师、人力资源专家、用户体验研究员、教育心理学家、组织顾问',
    salaryRange: '¥12K-35K/月 (国内) $60K-110K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/life-physical-and-social-science/psychologists.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.apa.org/', label: '美国心理学会' }
    }
  },
  {
    id: 112,
    name: '英语文学 (English Literature)',
    category: '文科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士1-2年/博士4-6年',
    description: '深入研究英语文学经典作品，培养批判性思维、文学分析与跨文化交流能力',
    courses: ['英国文学史', '美国文学', '文学批评理论', '创意写作', '比较文学', '文化研究'],
    career: '编辑、翻译、教师、文化策划、媒体内容创作者、国际组织职员',
    salaryRange: '¥8K-25K/月 (国内) $45K-80K/年 (美国)',
    sources: {
      salary: { url: 'https://www.payscale.com/research/US/Degree=Bachelor_of_Arts_(BA)_in_English_Literature/Salary', label: 'PayScale薪资报告' },
      description: { url: 'https://www.mla.org/', label: '现代语言协会' }
    }
  }
]
