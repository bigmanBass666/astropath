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
  },
  {
    id: 113,
    name: '法学 (Law / LLM)',
    category: '文科',
    degreeType: '本科/硕士(LLM/JD/JD)',
    duration: '本科4年/硕士1-2年(JD 3年)',
    description: '培养具备法律理论、实务操作和国际法视野的专业法律人才，涵盖民商法、国际法、知识产权等方向',
    courses: ['宪法与行政法', '民法总则', '刑法原理', '国际公法', '合同法', ' legal Writing & Research', '公司法', '知识产权法'],
    career: '律师、法官、检察官、企业法务顾问、合规专员、国际组织法律官员、法学教授',
    salaryRange: '¥15K-50K/月 (国内) $70K-180K/年 (美国, 律师行业)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/legal/lawyers.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.americanbar.org/', label: '美国律师协会(ABA)' }
    }
  },
  {
    id: 114,
    name: '电子与电气工程 (Electrical & Electronic Engineering)',
    category: '工科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士4-5年',
    description: '研究电子电路、信号处理、通信系统、嵌入式系统和电力系统的设计与开发，是现代科技的核心支撑学科',
    courses: ['电路分析', '信号与系统', '数字逻辑设计', '电磁场理论', '通信原理', '嵌入式系统', '电力电子技术', '自动控制原理'],
    career: '硬件工程师、芯片设计工程师、通信工程师、电力系统工程师、射频工程师、自动驾驶感知工程师',
    salaryRange: '¥18K-45K/月 (国内) $90K-150K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm', label: '美国劳工统计局' },
      description: { url: 'https://ieee.org/', label: 'IEEE电气电子工程师学会' }
    }
  },
  {
    id: 115,
    name: '会计与金融 (Accounting & Finance)',
    category: '商科',
    degreeType: '本科/硕士',
    duration: '本科4年/硕士1-2年',
    description: '培养具备财务报表分析、投资管理、风险控制和审计能力的金融专业人才，是商科申请最热门方向之一',
    courses: ['财务会计', '管理会计', '公司金融', '投资学', '衍生品定价', '审计学', '税法', '财务报表分析'],
    career: '会计师(CPA)、投行分析师、基金经理、风控经理、CFO、审计师、税务顾问、估值分析师',
    salaryRange: '¥15K-60K/月 (国内) $80K-200K+ (美国, 金融行业)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/business-and-financial/home.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.aicpa.org/', label: '美国注册会计师协会(AICPA)' }
    }
  },
  {
    id: 116,
    name: '教育学 (Education)',
    category: '社科',
    degreeType: '本科/硕士/MEd/EdD',
    duration: '本科4年/硕士1-2年/博士3-5年',
    description: '研究教育理论与实践、课程设计、教育心理学和教学评估，培养各级各类教育机构的专业教育工作者和管理者',
    courses: ['教育心理学', '课程与教学论', '教育研究方法', '教育政策分析', '特殊教育导论', '教育技术学', '教育评估与测量', '多元文化教育'],
    career: '中小学教师、大学讲师、教育咨询师、课程设计师、教育培训产品经理、教育政策研究员、学校管理者',
    salaryRange: '¥8K-30K/月 (国内) $50K-100K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/community-and-social-service/postsecondary-teachers.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.ed.gov/', label: '美国教育部' }
    }
  },
  {
    id: 117,
    name: '机械工程 (Mechanical Engineering)',
    category: '工科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士4-5年',
    description: '研究机械系统设计、热力学、流体力学和制造工艺，广泛应用于汽车、航空航天、机器人和新能源领域',
    courses: ['工程力学', '热力学与传热学', '流体力学', '机械设计', '材料力学', '控制工程基础', 'CAD/CAM技术', '机电一体化'],
    career: '机械设计工程师、汽车工程师、航空航天工程师、机器人工程师、制造业项目经理、产品开发工程师、热能工程师',
    salaryRange: '¥15K-40K/月 (国内) $85K-130K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/architecture-and-engineering/mechanical-engineers.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.asme.org/', label: '美国机械工程师协会(ASME)' }
    }
  },
  {
    id: 118,
    name: '临床医学 (Clinical Medicine)',
    category: '医科',
    degreeType: '本科/MBBS/MD/PhD',
    duration: '本科5-6年/MD 4年(美国)/博士3-5年',
    description: '培养具备疾病诊断、治疗和预防能力的医学专业人才，涵盖内科学、外科学、诊断学和循证医学等核心领域',
    courses: ['系统解剖学', '病理生理学', '内科学', '外科学', '诊断学', '药理学', '循证医学', '医学伦理学'],
    career: '临床医师、外科医生、医学研究员、公共卫生专家、医药代表、医院管理者、医学影像医师',
    salaryRange: '¥12K-50K/月 (国内) $65K-250K+ (美国, 医生行业差异大)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/healthcare/physicians-and-surgeons.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.ama-assn.org/', label: '美国医学会(AMA)' }
    }
  },
  {
    id: 119,
    name: '艺术设计 (Art & Design)',
    category: '艺术',
    degreeType: '本科/BFA/MFA/硕士',
    duration: '本科4年/硕士2-3年(MFA)',
    description: '培养视觉传达、交互设计、产品设计、时尚设计和数字艺术领域的创意人才，强调作品集驱动的教学模式',
    courses: ['色彩理论与构成', '平面设计基础', '用户体验(UX)设计', '三维建模与渲染', '品牌视觉识别', '动态图形设计', '设计思维与方法', '作品集制作'],
    career: 'UI/UX设计师、平面设计师、产品设计师、创意总监、艺术指导、品牌设计师、插画师、设计策略师',
    salaryRange: '¥10K-35K/月 (国内) $55K-120K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/arts-and-design/home.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.aiga.org/', label: '美国专业设计协会(AIGA)' }
    }
  },
  {
    id: 120,
    name: '环境科学 (Environmental Science)',
    category: '理科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士4-5年',
    description: '研究生态系统、气候变化、环境监测和可持续发展，培养解决全球环境问题的跨学科复合型人才',
    courses: ['生态学基础', '环境化学', '气候科学', '环境监测与评估', '可持续发展理论', '地理信息系统(GIS)', '环境影响评价', '资源管理学'],
    career: '环境顾问、ESG分析师、气候研究员、环境工程师、自然资源管理者、可持续发展专员、政府环保部门公务员',
    salaryRange: '¥12K-35K/月 (国内) $60K-110K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/life-physical-and-social-science/environmental-scientists-and-specialists.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.epa.gov/', label: '美国环境保护署(EPA)' }
    }
  },
  {
    id: 121,
    name: '数学 (Mathematics)',
    category: '理科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士4-6年',
    description: '研究代数、分析、几何和拓扑等纯数学分支，同时涵盖应用数学在金融、密码学和数据科学中的实际应用',
    courses: ['数学分析', '高等代数', '常微分方程', '实变函数与泛函分析', '概率论与数理统计', '拓扑学基础', '数值计算方法', '数学建模'],
    career: '数据科学家、精算师、量化分析师、算法工程师、密码学家、运筹优化师、高中/大学数学教师、AI研究员',
    salaryRange: '¥14K-45K/月 (国内) $75K-140K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/math/mathematicians-and-statisticians.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.ams.org/', label: '美国数学会(AMS)' }
    }
  },
  {
    id: 122,
    name: '数字媒体与传媒 (Digital Media & Communication)',
    category: '文科',
    degreeType: '本科/硕士',
    duration: '本科4年/硕士1-2年',
    description: '融合传播学理论与数字技术，培养内容创作、社交媒体运营、数字营销和多媒体叙事能力的新媒体专业人才',
    courses: ['传播学理论', '数字内容创作', '社交媒体策略', '视听语言与剪辑', '数据新闻学', '品牌传播与公关', '用户研究与交互', '新媒体伦理与法规'],
    career: '新媒体运营、内容创作者、数字营销经理、品牌公关、短视频编导、媒介策划师、MCN机构运营、科技媒体记者',
    salaryRange: '¥10K-35K/月 (国内) $55K-105K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/media-and-communication/home.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.rtnda.org/', label: '广播电视新闻协会(RTNDA)' }
    }
  },
  {
    id: 123,
    name: '物理学 (Physics)',
    category: '理科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士5-6年',
    description: '研究物质的基本结构和相互作用规律，涵盖量子力学、相对论、凝聚态物理和高能物理，是自然科学的基础学科',
    courses: ['普通物理学', '量子力学', '电动力学', '热力学与统计物理', '计算物理', '固体物理', '近代物理实验', '广义相对论导论'],
    career: '物理研究员、半导体工程师、光学工程师、数据科学家、量化交易员、高中/大学物理教师、医疗物理师、航天工程师',
    salaryRange: '¥13K-40K/月 (国内) $70K-140K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/life-physical-and-social-science/physicists-and-astronomers.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.aps.org/', label: '美国物理学会(APS)' }
    }
  },
  {
    id: 124,
    name: '化学与化学工程 (Chemistry & Chemical Engineering)',
    category: '理科/工科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年/博士4-5年',
    description: '研究物质组成、结构、性质及其变化规律，涵盖有机化学、无机化学、材料化学和化工过程，广泛应用于制药、能源和新材料领域',
    courses: ['普通化学', '有机化学', '物理化学', '分析化学', '化工原理', '材料化学', '生物化学', '化学实验安全与管理'],
    career: '化学研发工程师、制药研发员、材料科学家、质量管控(QA/QC)工程师、化妆品配方师、专利代理人、高中/大学化学教师',
    salaryRange: '¥13K-38K/月 (国内) $70K-125K/年 (美国)',
    sources: {
      salary: { url: 'https://www.bls.gov/ooh/life-physical-and-social-science/chemists-and-materials-scientists.htm', label: '美国劳工统计局' },
      description: { url: 'https://www.acs.org/', label: '美国化学会(ACS)' }
    }
  }
]
