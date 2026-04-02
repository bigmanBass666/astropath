export const schoolsData = [
  {
    id: 1,
    name: '麻省理工学院',
    country: '美国',
    major: 'Computer Science',
    ranking: 'QS #1',
    deadline: '2025-01-01',
    tuition: '$57,590',
    acceptanceRate: '3.9%',
    requirements: ['GPA 3.8+ (录取者平均)', 'TOEFL 100+ / IELTS 7.0+', '科研经历优先', '推荐信3封'],
    website: 'https://mit.edu',
    description: '世界顶尖理工科大学，在科学和技术领域处于领导地位，培养了大量诺贝尔奖得主。',
    type: '私立大学',
    students: '约11,500人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://catalog.mit.edu/mit/graduate-education/costs/', label: 'MIT官网' },
      acceptance: { url: 'https://www.collegetuitioncompare.com/edu/166027/harvard-university/', label: 'College Tuition Compare' },
      requirements: { url: 'https://www.nomadcredit.com/usa-university/massachusetts-institute-of-technology/admissions', label: 'MIT招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.8,
      preferredGPA: 3.9,
      languageRequirements: { toefl: 100, ielts: 7.0 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.4,
      averageScoreMin: 90,
      acceptanceRateNum: 0.039,
      competitiveness: 'extreme'
    }
  },
  {
    id: 2,
    name: '帝国理工学院',
    country: '英国',
    major: 'Engineering',
    ranking: 'QS #2',
    deadline: '2025-01-15',
    tuition: '£40,000',
    acceptanceRate: '15%',
    requirements: ['GPA 3.7+ / 均分85+', 'IELTS 7.0 (单项不低于6.5)', '相关专业背景', '个人陈述'],
    website: 'https://imperial.ac.uk',
    description: '世界顶尖理工科大学，专注于科学、工程、医学和商业领域的研究与教学。',
    type: '公立大学',
    students: '约20,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.imperial.ac.uk/study/fees-and-funding/undergraduate/tuition-fees/', label: '帝国理工官网' },
      acceptance: { url: 'https://collegedunia.com/uk/university/835-imperial-college-london-london/acceptance-rate', label: 'Collegedunia' },
      requirements: { url: 'https://www.imperial.ac.uk/study/apply/postgraduate-doctoral/entry-requirements/', label: '帝国理工招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.5,
      preferredGPA: 3.7,
      languageRequirements: { toefl: 95, ielts: 7.0 },
      universityTier: ['985', '211', 'overseas'],
      researchWeight: 0.3,
      averageScoreMin: 85,
      acceptanceRateNum: 0.15,
      competitiveness: 'very_high'
    }
  },
  {
    id: 3,
    name: '牛津大学',
    country: '英国',
    major: 'CS',
    ranking: 'QS #3',
    deadline: '2025-01-15',
    tuition: '£35,000',
    acceptanceRate: '18%',
    requirements: ['一等荣誉学位 / GPA 3.7+', 'IELTS 7.5 (单项不低于7.0)', '学术推荐信', '可能需要面试'],
    website: 'https://ox.ac.uk',
    description: '英语世界最古老的大学，享有卓越的学术声誉，培养了大量世界领袖和诺贝尔奖得主。',
    type: '公立大学',
    students: '约24,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.ox.ac.uk/node/688', label: '牛津大学官网' },
      acceptance: { url: 'https://oxbridgeapplications.com/blog/tuition-fees-at-oxford-and-cambridge/', label: 'Oxbridge Applications' },
      requirements: { url: 'https://www.ox.ac.uk/admissions/graduate/applying-to-oxford', label: '牛津招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.6,
      preferredGPA: 3.8,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', '211', 'overseas'],
      researchWeight: 0.35,
      averageScoreMin: 85,
      acceptanceRateNum: 0.18,
      competitiveness: 'very_high'
    }
  },
  {
    id: 4,
    name: '哈佛大学',
    country: '美国',
    major: 'Computer Science',
    ranking: 'QS #4',
    deadline: '2025-01-01',
    tuition: '$54,269',
    acceptanceRate: '3.6%',
    requirements: ['GPA 3.8+ (录取者平均)', 'TOEFL 100+ / IELTS 7.5+', '科研经历', '推荐信3封'],
    website: 'https://harvard.edu',
    description: '世界顶尖研究型大学，拥有卓越的学术资源和悠久的历史传统，培养了大量杰出人才。',
    type: '私立大学',
    students: '约31,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.collegetuitioncompare.com/edu/166027/harvard-university/', label: 'College Tuition Compare' },
      acceptance: { url: 'https://www.univstats.com/colleges/harvard-university/admission/', label: 'UnivStats' },
      requirements: { url: 'https://www.collegetuitioncompare.com/edu/166027/harvard-university/', label: '哈佛招生信息' }
    },
    admissionCriteria: {
      minGPA: 3.8,
      preferredGPA: 3.9,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.35,
      averageScoreMin: 90,
      acceptanceRateNum: 0.036,
      competitiveness: 'extreme'
    }
  },
  {
    id: 5,
    name: '剑桥大学',
    country: '英国',
    major: 'CS',
    ranking: 'QS #5',
    deadline: '2025-01-20',
    tuition: '£34,000',
    acceptanceRate: '19%',
    requirements: ['二等一荣誉学位 / GPA 3.5+', 'IELTS 7.5 (单项不低于7.0)', '学术推荐信', '可能需要面试'],
    website: 'https://cam.ac.uk',
    description: '世界顶尖的研究型大学，培养了大量诺贝尔奖得主，在科学研究领域享有盛誉。',
    type: '公立大学',
    students: '约23,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.undergraduate.study.cam.ac.uk/international-students/international-fees-and-costs', label: '剑桥大学官网' },
      acceptance: { url: 'https://oxbridgeapplications.com/blog/tuition-fees-at-oxford-and-cambridge/', label: 'Oxbridge Applications' },
      requirements: { url: 'https://www.graduate.study.cam.ac.uk/application-procedure/entry-requirements', label: '剑桥招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.5,
      preferredGPA: 3.7,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', '211', 'overseas'],
      researchWeight: 0.3,
      averageScoreMin: 85,
      acceptanceRateNum: 0.19,
      competitiveness: 'very_high'
    }
  },
  {
    id: 6,
    name: '斯坦福大学',
    country: '美国',
    major: 'AI',
    ranking: 'QS #6',
    deadline: '2025-01-02',
    tuition: '$61,878',
    acceptanceRate: '3.6%',
    requirements: ['GPA 3.8+ (录取者平均)', 'TOEFL 100+ / IELTS 7.0+', '创新项目经历', '推荐信3封'],
    website: 'https://stanford.edu',
    description: '位于硅谷中心，以创新和技术领先全球，是创业者和科技人才的摇篮。',
    type: '私立大学',
    students: '约17,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://studentservices.stanford.edu/tuition-rates/2024-2025-graduate-and-professional-tuition-rates', label: '斯坦福官网' },
      acceptance: { url: 'https://www.collegetuitioncompare.com/amp/edu/243744/stanford-university/admission', label: 'College Tuition Compare' },
      requirements: { url: 'https://admissions.stanford.edu/apply/', label: '斯坦福招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.7,
      preferredGPA: 3.9,
      languageRequirements: { toefl: 100, ielts: 7.0 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.35,
      averageScoreMin: 88,
      acceptanceRateNum: 0.036,
      competitiveness: 'extreme'
    }
  },
  {
    id: 7,
    name: '苏黎世联邦理工学院',
    country: '瑞士',
    major: 'Engineering',
    ranking: 'QS #7',
    deadline: '2025-03-31',
    tuition: 'CHF 1,500',
    acceptanceRate: '27%',
    requirements: ['GPA 3.7+ / 均分85+ (985/211)', 'IELTS 7.0 / TOEFL 100', '相关专业背景', '德语/英语能力'],
    website: 'https://ethz.ch',
    description: '欧洲顶尖理工科大学，爱因斯坦母校，在工程技术领域享有世界声誉。',
    type: '公立大学',
    students: '约23,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://ethz.ch/en/studies/financial.html', label: 'ETH官网' },
      acceptance: { url: 'https://www.mjliuxue.com/eth-zurich/', label: '名津留学' },
      requirements: { url: 'https://ethz.ch/en/studies/master/application/international-bachelor/prerequisites/', label: 'ETH招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.5,
      preferredGPA: 3.7,
      languageRequirements: { toefl: 100, ielts: 7.0 },
      universityTier: ['985', '211'],
      researchWeight: 0.25,
      averageScoreMin: 85,
      acceptanceRateNum: 0.27,
      competitiveness: 'high'
    }
  },
  {
    id: 8,
    name: '新加坡国立大学',
    country: '新加坡',
    major: 'CS',
    ranking: 'QS #8',
    deadline: '2025-02-28',
    tuition: 'SGD 32,850',
    acceptanceRate: '8%',
    requirements: ['GPA 3.5+ (985/211) / 3.7+ (双非)', 'IELTS 6.5+ / TOEFL 85+', '相关专业背景', '个人陈述'],
    website: 'https://nus.edu.sg',
    description: '亚洲顶尖学府，在工程、计算机和商业领域享有盛誉，国际化程度高。',
    type: '公立大学',
    students: '约40,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.nus.edu.sg/registrar/docs/default-source/administrative-policies-procedures/ugtuitioncurrent.pdf', label: 'NUS官网' },
      acceptance: { url: 'https://collegedunia.com/singapore/university/767-national-university-of-singapore-singapore/acceptance-rate', label: 'Collegedunia' },
      requirements: { url: 'https://qiantum.xdf.cn/news/lanzhou_7700432.shtml', label: '新东方前途出国' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.5,
      languageRequirements: { toefl: 85, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 80,
      acceptanceRateNum: 0.08,
      competitiveness: 'high'
    }
  },
  {
    id: 9,
    name: '伦敦大学学院',
    country: '英国',
    major: 'CS',
    ranking: 'QS #9',
    deadline: '2025-01-26',
    tuition: '£32,000',
    acceptanceRate: '16%',
    requirements: ['GPA 3.3+ / 均分80+', 'IELTS 7.0 (单项不低于6.5)', '相关专业背景', '个人陈述'],
    website: 'https://ucl.ac.uk',
    description: '伦敦大学联盟旗舰校，研究实力雄厚，在多个学科领域位居世界前列。',
    type: '公立大学',
    students: '约45,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'http://www.ucl.ac.uk/students/fees-and-funding/pay-your-fees/fee-schedules/2024-2025/undergraduate-fees-2024-2025', label: 'UCL官网' },
      acceptance: { url: 'https://collegedunia.com/uk/university/846-university-college-london-london/acceptance-rate', label: 'Collegedunia' },
      requirements: { url: 'https://www.ucl.ac.uk/prospective-students/graduate/apply-international-student', label: 'UCL招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.2,
      preferredGPA: 3.5,
      languageRequirements: { toefl: 92, ielts: 7.0 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 80,
      acceptanceRateNum: 0.16,
      competitiveness: 'high'
    }
  },
  {
    id: 10,
    name: '加州理工学院',
    country: '美国',
    major: 'Physics',
    ranking: 'QS #10',
    deadline: '2025-01-01',
    tuition: '$60,864',
    acceptanceRate: '2.6%',
    requirements: ['GPA 3.9+ (录取者接近满分)', 'TOEFL 100+ / IELTS 7.5+', '科研经历必需', '推荐信3封'],
    website: 'https://caltech.edu',
    description: '世界顶尖理工科学院，专注于前沿科学研究，师生比例极低。',
    type: '私立大学',
    students: '约2,400人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.collegetuitioncompare.com/amp/edu/110404/california-institute-of-technology/', label: 'College Tuition Compare' },
      acceptance: { url: 'https://www.collegetuitioncompare.com/amp/edu/110404/california-institute-of-technology/admission/', label: 'College Tuition Compare' },
      requirements: { url: 'https://www.collegeadvisor.com/how-to-get-into/how-to-get-into-caltech-guide/', label: 'College Advisor' }
    },
    admissionCriteria: {
      minGPA: 3.8,
      preferredGPA: 4.0,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.5,
      averageScoreMin: 92,
      acceptanceRateNum: 0.026,
      competitiveness: 'extreme'
    }
  },
  {
    id: 11,
    name: '宾夕法尼亚大学',
    country: '美国',
    major: 'Business',
    ranking: 'QS #11',
    deadline: '2025-01-05',
    tuition: '$60,000',
    acceptanceRate: '5%',
    requirements: ['GPA 3.7+ (录取者平均)', 'GMAT 700+ / GRE 320+', 'TOEFL 100+ / IELTS 7.5+', '领导力经历'],
    website: 'https://upenn.edu',
    description: '常春藤盟校之一，沃顿商学院享誉全球，在商业和法学领域领先。',
    type: '私立大学',
    students: '约28,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.sofi.com/university-of-pennsylvania-tuition-fees/', label: 'SoFi' },
      acceptance: { url: 'https://www.upenn.edu/about/facts', label: 'UPenn官网' },
      requirements: { url: 'https://admissions.upenn.edu/how-to-apply', label: 'UPenn招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.5,
      preferredGPA: 3.7,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', '211', 'overseas'],
      researchWeight: 0.25,
      averageScoreMin: 85,
      acceptanceRateNum: 0.05,
      competitiveness: 'very_high'
    }
  },
  {
    id: 12,
    name: '加州大学伯克利分校',
    country: '美国',
    major: 'CS',
    ranking: 'QS #12',
    deadline: '2025-01-15',
    tuition: '$44,115',
    acceptanceRate: '11%',
    requirements: ['GPA 3.4+ (最低要求)', 'TOEFL 90+ / IELTS 7.0+', '竞争激烈建议GPA 3.7+', '课外活动'],
    website: 'https://berkeley.edu',
    description: '美国顶尖公立大学，在计算机科学、工程和商学领域享有盛誉。',
    type: '公立大学',
    students: '约45,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://admissions.berkeley.edu/cost', label: 'UC Berkeley官网' },
      acceptance: { url: 'https://www.clastify.com/blog/acceptance-rates/uc-berkeley', label: 'Clastify' },
      requirements: { url: 'https://admissions.berkeley.edu/apply-to-berkeley/freshmen/', label: 'UC Berkeley招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 90, ielts: 7.0 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 80,
      acceptanceRateNum: 0.11,
      competitiveness: 'high'
    }
  },
  {
    id: 13,
    name: '墨尔本大学',
    country: '澳大利亚',
    major: 'CS',
    ranking: 'QS #13',
    deadline: '2025-02-15',
    tuition: 'AUD 42,000',
    acceptanceRate: '70%',
    requirements: ['GPA 3.0+ / 均分75+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://unimelb.edu.au',
    description: '澳大利亚顶尖学府，八大名校之首，在科研和教学方面享有国际声誉。',
    type: '公立大学',
    students: '约52,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://scholarships.unimelb.edu.au/', label: '墨尔本大学官网' },
      acceptance: { url: 'https://reedeep.com/university-of-melbourne-acceptance-rate/', label: 'Reedeep' },
      requirements: { url: 'https://study.unimelb.edu.au/how-to-apply', label: '墨尔本大学招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.8,
      preferredGPA: 3.2,
      languageRequirements: { toefl: 79, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.1,
      averageScoreMin: 75,
      acceptanceRateNum: 0.70,
      competitiveness: 'moderate'
    }
  },
  {
    id: 14,
    name: '北京大学',
    country: '中国',
    major: 'CS',
    ranking: 'QS #14',
    deadline: '2025-03-01',
    tuition: '¥25,000',
    acceptanceRate: '15%',
    requirements: ['GPA 3.5+ / 均分85+', 'HSK 6级 (中文项目)', 'TOEFL 100+ (英文项目)', '面试'],
    website: 'https://pku.edu.cn',
    description: '中国顶尖综合性大学，历史悠久，在人文、社科和理科领域领先。',
    type: '公立大学',
    students: '约42,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://applyforchina.com/universities/peking-university/', label: 'Apply for China' },
      acceptance: { url: 'https://www.thechinajourney.com/is-peking-university-difficult-to-get-into/', label: 'The China Journey' },
      requirements: { url: 'https://www.thechinajourney.com/is-peking-university-difficult-to-get-into/', label: '北大招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 100, ielts: 7.0 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 82,
      acceptanceRateNum: 0.15,
      competitiveness: 'high'
    }
  },
  {
    id: 15,
    name: '康奈尔大学',
    country: '美国',
    major: 'Engineering',
    ranking: 'QS #15',
    deadline: '2025-01-02',
    tuition: '$62,456',
    acceptanceRate: '7%',
    requirements: ['GPA 3.5+ (热门专业建议3.7+)', 'TOEFL 100+ / IELTS 7.5+', '课外活动', '推荐信2封'],
    website: 'https://cornell.edu',
    description: '常春藤盟校之一，在工程、农业和酒店管理领域享有盛誉。',
    type: '私立大学',
    students: '约25,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://admissions.cornell.edu/apply', label: 'Cornell官网' },
      acceptance: { url: 'https://liuxue.xdf.cn/news/changzhou_7885083.shtml', label: '新东方前途出国' },
      requirements: { url: 'https://admissions.cornell.edu/apply/first-year-applicants/admission-requirements', label: 'Cornell招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.4,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', '211', 'overseas'],
      researchWeight: 0.25,
      averageScoreMin: 82,
      acceptanceRateNum: 0.07,
      competitiveness: 'very_high'
    }
  },
  {
    id: 16,
    name: '香港大学',
    country: '中国香港',
    major: 'Medicine',
    ranking: 'QS #17',
    deadline: '2025-01-15',
    tuition: 'HKD 171,000',
    acceptanceRate: '10%',
    requirements: ['GPA 3.5+ / 均分85+', 'IELTS 6.5+ / TOEFL 93+', '面试 (部分专业)', '个人陈述'],
    website: 'https://hku.hk',
    description: '亚洲顶尖学府，在医学、法学和商学领域享有国际声誉。',
    type: '公立大学',
    students: '约35,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.hku.hk/', label: '港大官网' },
      acceptance: { url: 'https://www.hku.hk/', label: '港大官网' },
      requirements: { url: 'https://admissions.hku.hk/', label: '港大招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.5,
      languageRequirements: { toefl: 93, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 82,
      acceptanceRateNum: 0.10,
      competitiveness: 'high'
    }
  },
  {
    id: 17,
    name: '清华大学',
    country: '中国',
    major: 'CS',
    ranking: 'QS #20',
    deadline: '2025-03-01',
    tuition: '¥30,000',
    acceptanceRate: '15%',
    requirements: ['GPA 3.5+ / 均分85+', 'HSK 5级以上 (中文项目)', 'TOEFL 90+ (英文项目)', '面试'],
    website: 'https://tsinghua.edu.cn',
    description: '中国顶尖的综合性研究型大学，工程和计算机科学领域领先。',
    type: '公立大学',
    students: '约50,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://yocket.com/universities/tsinghua-university-school-of-economics-and-management-4695', label: 'Yocket' },
      acceptance: { url: 'https://smartacademicwriting.com/how-to-get-into-tsinghua-university/', label: 'Smart Academic Writing' },
      requirements: { url: 'https://smartacademicwriting.com/how-to-get-into-tsinghua-university/', label: '清华招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 82,
      acceptanceRateNum: 0.15,
      competitiveness: 'high'
    }
  },
  {
    id: 18,
    name: '多伦多大学',
    country: '加拿大',
    major: 'CS',
    ranking: 'QS #29',
    deadline: '2025-01-15',
    tuition: 'CAD 58,160',
    acceptanceRate: '43%',
    requirements: ['GPA 3.3+ / 均分80+', 'IELTS 6.5 (单项不低于6.0)', '高考成绩 (本科)', '个人陈述'],
    website: 'https://utoronto.ca',
    description: '加拿大顶尖学府，在医学、工程和计算机科学领域享有国际声誉。',
    type: '公立大学',
    students: '约95,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://future.utoronto.ca/undergraduate-admissions/tuition-fees', label: '多伦多大学官网' },
      acceptance: { url: 'https://zollege.in/canada/college/159425-university-of-toronto-toronto/admission', label: 'Zollege' },
      requirements: { url: 'https://future.utoronto.ca/undergraduate-admissions/apply/', label: '多伦多大学招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.3,
      languageRequirements: { toefl: 80, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.15,
      averageScoreMin: 78,
      acceptanceRateNum: 0.43,
      competitiveness: 'moderate'
    }
  },
  {
    id: 19,
    name: '昆士兰大学',
    country: '澳大利亚',
    major: 'CS',
    ranking: 'QS #40',
    deadline: '2025-02-15',
    tuition: 'AUD 44,000',
    acceptanceRate: '40%',
    requirements: ['GPA 3.0+ / 均分75+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://uq.edu.au',
    description: '澳大利亚八校联盟成员，科研实力雄厚，在生命科学领域领先。',
    type: '公立大学',
    students: '约53,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.uq.edu.au/', label: '昆士兰大学官网' },
      acceptance: { url: 'https://www.gradding.com/study-in-australia/universities/the-university-of-queensland/acceptance-rate', label: 'Gradding' },
      requirements: { url: 'https://future-students.uq.edu.au/apply', label: '昆士兰大学招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.8,
      preferredGPA: 3.0,
      languageRequirements: { toefl: 79, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.1,
      averageScoreMin: 75,
      acceptanceRateNum: 0.40,
      competitiveness: 'moderate'
    }
  },
  {
    id: 20,
    name: '新南威尔士大学',
    country: '澳大利亚',
    major: 'Engineering',
    ranking: 'QS #19',
    deadline: '2025-02-28',
    tuition: 'AUD 48,000',
    acceptanceRate: '60%',
    requirements: ['GPA 2.8+ / 均分72+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://unsw.edu.au',
    description: '澳大利亚八校联盟成员，工程和商科领域享有盛誉。',
    type: '公立大学',
    students: '约63,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.unsw.edu.au/', label: 'UNSW官网' },
      acceptance: { url: 'https://www.gradding.com/study-in-australia/universities/university-of-new-south-wales/acceptance-rate', label: 'Gradding' },
      requirements: { url: 'https://www.unsw.edu.au/study-with-us', label: 'UNSW招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.6,
      preferredGPA: 3.0,
      languageRequirements: { toefl: 79, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.1,
      averageScoreMin: 72,
      acceptanceRateNum: 0.60,
      competitiveness: 'accessible'
    }
  },
  {
    id: 21,
    name: '华威大学',
    country: '英国',
    major: 'Business',
    ranking: 'QS #67',
    deadline: '2025-01-15',
    tuition: '£28,000',
    acceptanceRate: '35%',
    requirements: ['GPA 3.0+ / 均分75+', 'IELTS 7.0 (单项不低于6.5)', '相关专业背景', '个人陈述'],
    website: 'https://warwick.ac.uk',
    description: '英国顶尖研究型大学，商学院享誉全球，毕业生就业率极高。',
    type: '公立大学',
    students: '约27,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://warwick.ac.uk/', label: '华威大学官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/university-warwick', label: 'QS' },
      requirements: { url: 'https://warwick.ac.uk/study/', label: '华威招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.8,
      preferredGPA: 3.2,
      languageRequirements: { toefl: 92, ielts: 7.0 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.15,
      averageScoreMin: 75,
      acceptanceRateNum: 0.35,
      competitiveness: 'moderate'
    }
  },
  {
    id: 22,
    name: '曼彻斯特大学',
    country: '英国',
    major: 'CS',
    ranking: 'QS #34',
    deadline: '2025-01-20',
    tuition: '£30,000',
    acceptanceRate: '55%',
    requirements: ['GPA 2.8+ / 均分72+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://manchester.ac.uk',
    description: '英国红砖大学，科研实力雄厚，在工程和科学领域享有盛誉。',
    type: '公立大学',
    students: '约44,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.manchester.ac.uk/', label: '曼大官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/university-manchester', label: 'QS' },
      requirements: { url: 'https://www.manchester.ac.uk/study/', label: '曼大招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.6,
      preferredGPA: 3.0,
      languageRequirements: { toefl: 80, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.12,
      averageScoreMin: 72,
      acceptanceRateNum: 0.55,
      competitiveness: 'accessible'
    }
  },
  {
    id: 23,
    name: '南加州大学',
    country: '美国',
    major: 'CS',
    ranking: 'QS #116',
    deadline: '2025-01-10',
    tuition: '$68,000',
    acceptanceRate: '12%',
    requirements: ['GPA 3.3+ / 均分80+', 'TOEFL 90+ / IELTS 7.0+', '相关专业背景', '个人陈述'],
    website: 'https://usc.edu',
    description: '美国顶尖私立研究型大学，电影、工程和商科领域享有盛誉。',
    type: '私立大学',
    students: '约48,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.usc.edu/', label: 'USC官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/university-southern-california', label: 'QS' },
      requirements: { url: 'https://admission.usc.edu/', label: 'USC招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.2,
      preferredGPA: 3.5,
      languageRequirements: { toefl: 90, ielts: 7.0 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 80,
      acceptanceRateNum: 0.12,
      competitiveness: 'high'
    }
  },
  {
    id: 24,
    name: '格拉斯哥大学',
    country: '英国',
    major: 'CS',
    ranking: 'QS #78',
    deadline: '2025-01-25',
    tuition: '£25,000',
    acceptanceRate: '50%',
    requirements: ['GPA 2.8+ / 均分70+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://gla.ac.uk',
    description: '英国古老名校，亚当斯密商学院享誉全球，培养了大量杰出人才。',
    type: '公立大学',
    students: '约35,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.gla.ac.uk/', label: '格大官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/university-glasgow', label: 'QS' },
      requirements: { url: 'https://www.gla.ac.uk/study/', label: '格大招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.5,
      preferredGPA: 2.8,
      languageRequirements: { toefl: 79, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.1,
      averageScoreMin: 70,
      acceptanceRateNum: 0.50,
      competitiveness: 'accessible'
    }
  },
  {
    id: 25,
    name: '伯明翰大学',
    country: '英国',
    major: 'Engineering',
    ranking: 'QS #80',
    deadline: '2025-01-30',
    tuition: '£26,000',
    acceptanceRate: '52%',
    requirements: ['GPA 2.8+ / 均分70+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://birmingham.ac.uk',
    description: '英国红砖大学，工程和商科领域实力雄厚，毕业生就业率高。',
    type: '公立大学',
    students: '约38,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.birmingham.ac.uk/', label: '伯大官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/university-birmingham', label: 'QS' },
      requirements: { url: 'https://www.birmingham.ac.uk/study/', label: '伯大招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.5,
      preferredGPA: 2.8,
      languageRequirements: { toefl: 79, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.1,
      averageScoreMin: 70,
      acceptanceRateNum: 0.52,
      competitiveness: 'accessible'
    }
  },
  {
    id: 26,
    name: '南洋理工大学',
    country: '新加坡',
    major: 'Engineering',
    ranking: 'QS #15',
    match: 82,
    deadline: '2025-02-28',
    tuition: 'SGD 35,000',
    acceptanceRate: '25%',
    requirements: ['GPA 3.3+ (985/211) / 3.5+ (双非)', 'IELTS 6.5+ / TOEFL 90+', '相关专业背景', '个人陈述'],
    website: 'https://ntu.edu.sg',
    description: '新加坡两所顶尖大学之一，在工程、科学和商业领域享有盛誉，科研实力雄厚。',
    type: '公立大学',
    students: '约33,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.ntu.edu.sg/admissions/graduate/financialmatters/ntupgi', label: 'NTU官网' },
      acceptance: { url: 'https://www.mjliuxue.com/nturx/', label: '名津留学' },
      requirements: { url: 'https://www.ntu.edu.sg/admissions/graduate', label: 'NTU招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.3,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 78,
      acceptanceRateNum: 0.25,
      competitiveness: 'high'
    }
  },
  {
    id: 27,
    name: '悉尼大学',
    country: '澳大利亚',
    major: 'Medicine',
    ranking: 'QS #18',
    match: 78,
    deadline: '2025-02-28',
    tuition: 'AUD 48,000',
    acceptanceRate: '30%',
    requirements: ['GPA 3.0+ / 均分75+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://sydney.edu.au',
    description: '澳大利亚历史最悠久的大学，医学和法学领域领先，毕业生就业率高。',
    type: '公立大学',
    students: '约60,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.sydney.edu.au/study/fees-and-loans/international-student-tuition-fees.html', label: '悉尼大学官网' },
      acceptance: { url: 'https://zollege.in/australia/college/159941-the-university-of-sydney-sydney', label: 'Zollege' },
      requirements: { url: 'https://www.sydney.edu.au/study/how-to-apply.html', label: '悉尼大学招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.8,
      preferredGPA: 3.2,
      languageRequirements: { toefl: 85, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.15,
      averageScoreMin: 75,
      acceptanceRateNum: 0.30,
      competitiveness: 'moderate'
    }
  },
  {
    id: 28,
    name: '芝加哥大学',
    country: '美国',
    major: 'Economics',
    ranking: 'QS #21',
    match: 80,
    deadline: '2025-01-05',
    tuition: '$63,000',
    acceptanceRate: '4.5%',
    requirements: ['GPA 3.7+ (录取者平均)', 'TOEFL 100+ / IELTS 7.0+', '科研经历', '推荐信3封'],
    website: 'https://uchicago.edu',
    description: '美国顶尖研究型大学，经济学和法学领域全球领先，培养了众多诺贝尔奖得主。',
    type: '私立大学',
    students: '约18,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://college.uchicago.edu/admissions/tuition-and-aid', label: '芝加哥大学官网' },
      acceptance: { url: 'https://www.koppelmangroup.com/blog/2026/1/18/uchicago-admissions-statistics-2025', label: 'Koppelman Group' },
      requirements: { url: 'https://college.uchicago.edu/admissions/apply', label: '芝加哥大学招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.5,
      preferredGPA: 3.8,
      languageRequirements: { toefl: 100, ielts: 7.0 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.35,
      averageScoreMin: 85,
      acceptanceRateNum: 0.045,
      competitiveness: 'very_high'
    }
  },
  {
    id: 29,
    name: '普林斯顿大学',
    country: '美国',
    major: 'Physics',
    ranking: 'QS #22',
    match: 85,
    deadline: '2025-01-01',
    tuition: '$59,710',
    acceptanceRate: '4.6%',
    requirements: ['GPA 3.9+ (录取者接近满分)', 'TOEFL 100+ / IELTS 7.5+', '科研经历必需', '推荐信3封'],
    website: 'https://princeton.edu',
    description: '常春藤盟校之一，本科教育全美顶尖，在数学和物理领域享有盛誉。',
    type: '私立大学',
    students: '约8,500人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.sofi.com/princeton-university-tuition-and-fees/', label: 'SoFi' },
      acceptance: { url: 'https://www.univstats.com/colleges/princeton-university/admission/', label: 'UnivStats' },
      requirements: { url: 'https://admission.princeton.edu/apply', label: '普林斯顿招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.8,
      preferredGPA: 3.95,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.4,
      averageScoreMin: 88,
      acceptanceRateNum: 0.046,
      competitiveness: 'extreme'
    }
  },
  {
    id: 30,
    name: '耶鲁大学',
    country: '美国',
    major: 'Law',
    ranking: 'QS #23',
    match: 84,
    deadline: '2025-01-02',
    tuition: '$64,700',
    acceptanceRate: '4.4%',
    requirements: ['GPA 3.8+ (录取者平均)', 'TOEFL 100+ / IELTS 7.5+', '领导力经历', '推荐信3封'],
    website: 'https://yale.edu',
    description: '常春藤盟校之一，法学院全美顶尖，人文社科领域享有盛誉。',
    type: '私立大学',
    students: '约14,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.yale.edu/admissions/tuition-and-costs', label: '耶鲁大学官网' },
      acceptance: { url: 'https://www.yale.edu/yale-factsheet', label: 'Yale Factsheet' },
      requirements: { url: 'https://www.yale.edu/admissions/undergraduate-admissions', label: '耶鲁招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.7,
      preferredGPA: 3.85,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.3,
      averageScoreMin: 87,
      acceptanceRateNum: 0.044,
      competitiveness: 'extreme'
    }
  },
  {
    id: 31,
    name: '巴黎文理研究大学',
    country: '法国',
    major: 'Mathematics',
    ranking: 'QS #24',
    match: 75,
    deadline: '2025-03-15',
    tuition: '€377',
    acceptanceRate: '15%',
    requirements: ['GPA 3.3+ / 均分80+', '法语B2+ / 英语雅思6.5+', '相关专业背景', '动机信'],
    website: 'https://psl.eu',
    description: '法国顶尖研究型大学，数学和物理领域全球领先，培养了众多菲尔兹奖得主。',
    type: '公立大学',
    students: '约17,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://psl.eu/en/education/masters', label: 'PSL官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/universite-psl', label: 'QS' },
      requirements: { url: 'https://psl.eu/en/admissions', label: 'PSL招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.4,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.25,
      averageScoreMin: 80,
      acceptanceRateNum: 0.15,
      competitiveness: 'high'
    }
  },
  {
    id: 32,
    name: '洛桑联邦理工学院',
    country: '瑞士',
    major: 'Engineering',
    ranking: 'QS #26',
    match: 78,
    deadline: '2025-03-31',
    tuition: 'CHF 1,560',
    acceptanceRate: '23%',
    requirements: ['GPA 3.5+ / 均分82+ (985/211)', 'IELTS 6.5 / TOEFL 90', '相关专业背景', '法语/英语能力'],
    website: 'https://epfl.ch',
    description: '瑞士两所联邦理工学院之一，工程和计算机科学领域享有盛誉，国际化程度高。',
    type: '公立大学',
    students: '约11,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.epfl.ch/education/studies/en/rules-and-procedures/study-taxes/tuition-fee-other-fees/', label: 'EPFL官网' },
      acceptance: { url: 'https://www.mjliuxue.com/epfl-admission/', label: '名津留学' },
      requirements: { url: 'https://www.epfl.ch/education/master/programs/', label: 'EPFL招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 82,
      acceptanceRateNum: 0.23,
      competitiveness: 'high'
    }
  },
  {
    id: 33,
    name: '爱丁堡大学',
    country: '英国',
    major: 'AI',
    ranking: 'QS #27',
    match: 76,
    deadline: '2025-01-15',
    tuition: '£28,000',
    acceptanceRate: '38%',
    requirements: ['GPA 3.2+ / 均分80+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://ed.ac.uk',
    description: '苏格兰顶尖学府，人工智能和信息学领域全球领先，历史悠久。',
    type: '公立大学',
    students: '约45,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.ed.ac.uk/student-funding/tuition-fees', label: '爱丁堡大学官网' },
      acceptance: { url: 'https://stubard.com/blog/admission/university-of-edinburgh-acceptance-rate/', label: 'Stubard' },
      requirements: { url: 'https://www.ed.ac.uk/studying/international', label: '爱丁堡招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.3,
      languageRequirements: { toefl: 92, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.18,
      averageScoreMin: 78,
      acceptanceRateNum: 0.38,
      competitiveness: 'moderate'
    }
  },
  {
    id: 34,
    name: '慕尼黑工业大学',
    country: '德国',
    major: 'Engineering',
    ranking: 'QS #28',
    match: 74,
    deadline: '2025-03-31',
    tuition: '€3,000',
    acceptanceRate: '35%',
    requirements: ['GPA 3.0+ / 均分80+', '德语C1 / 英语雅思6.5+', '相关专业背景', '动机信'],
    website: 'https://tum.de',
    description: '德国顶尖理工大学，工程和自然科学领域享有盛誉，免学费政策吸引全球学生。',
    type: '公立大学',
    students: '约50,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.tum.de/en/studies/fees', label: 'TUM官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/technical-university-munich', label: 'QS' },
      requirements: { url: 'https://www.tum.de/en/studies/application', label: 'TUM招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.8,
      preferredGPA: 3.2,
      languageRequirements: { toefl: 88, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 78,
      acceptanceRateNum: 0.35,
      competitiveness: 'moderate'
    }
  },
  {
    id: 35,
    name: '麦吉尔大学',
    country: '加拿大',
    major: 'Medicine',
    ranking: 'QS #29',
    match: 73,
    deadline: '2025-01-15',
    tuition: 'CAD 45,000',
    acceptanceRate: '38%',
    requirements: ['GPA 3.3+ / 均分80+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://mcgill.ca',
    description: '加拿大顶尖学府，医学和法学领域享有盛誉，被誉为加拿大的哈佛。',
    type: '公立大学',
    students: '约40,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.mcgill.ca/student-accounts/tuition-fees', label: '麦吉尔大学官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/mcgill-university', label: 'QS' },
      requirements: { url: 'https://www.mcgill.ca/undergraduate-admissions', label: '麦吉尔招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.3,
      languageRequirements: { toefl: 86, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.18,
      averageScoreMin: 78,
      acceptanceRateNum: 0.38,
      competitiveness: 'moderate'
    }
  },
  {
    id: 36,
    name: '澳洲国立大学',
    country: '澳大利亚',
    major: 'Politics',
    ranking: 'QS #30',
    match: 72,
    deadline: '2025-02-15',
    tuition: 'AUD 45,000',
    acceptanceRate: '35%',
    requirements: ['GPA 3.0+ / 均分75+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://anu.edu.au',
    description: '澳大利亚唯一国立大学，政治学和亚太研究领域全球领先，位于首都堪培拉。',
    type: '公立大学',
    students: '约25,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.anu.edu.au/study/apply/international-students', label: 'ANU官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/australian-national-university', label: 'QS' },
      requirements: { url: 'https://www.anu.edu.au/study/apply', label: 'ANU招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.8,
      preferredGPA: 3.2,
      languageRequirements: { toefl: 80, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.15,
      averageScoreMin: 75,
      acceptanceRateNum: 0.35,
      competitiveness: 'moderate'
    }
  },
  {
    id: 37,
    name: '首尔大学',
    country: '韩国',
    major: 'Engineering',
    ranking: 'QS #31',
    match: 71,
    deadline: '2025-03-01',
    tuition: 'KRW 6,000,000',
    acceptanceRate: '15%',
    requirements: ['GPA 3.3+ / 均分85+', 'TOPIK 4级 / 英语雅思6.5+', '相关专业背景', '面试'],
    website: 'https://snu.ac.kr',
    description: '韩国顶尖学府，工程和自然科学领域领先，是韩国SKY大学之首。',
    type: '公立大学',
    students: '约28,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://en.snu.ac.kr/', label: '首尔大学官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/seoul-national-university', label: 'QS' },
      requirements: { url: 'https://en.snu.ac.kr/admissions', label: '首尔大学招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.4,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 82,
      acceptanceRateNum: 0.15,
      competitiveness: 'high'
    }
  },
  {
    id: 38,
    name: '约翰霍普金斯大学',
    country: '美国',
    major: 'Medicine',
    ranking: 'QS #32',
    match: 79,
    deadline: '2025-01-05',
    tuition: '$62,000',
    acceptanceRate: '7%',
    requirements: ['GPA 3.7+ (录取者平均)', 'TOEFL 100+ / IELTS 7.0+', '科研经历', '推荐信3封'],
    website: 'https://jhu.edu',
    description: '美国顶尖研究型大学，医学和公共卫生领域全球第一，科研实力雄厚。',
    type: '私立大学',
    students: '约27,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.jhu.edu/admissions/tuition/', label: 'JHU官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/johns-hopkins-university', label: 'QS' },
      requirements: { url: 'https://apply.jhu.edu/', label: 'JHU招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.5,
      preferredGPA: 3.75,
      languageRequirements: { toefl: 100, ielts: 7.0 },
      universityTier: ['985', '211', 'overseas'],
      researchWeight: 0.35,
      averageScoreMin: 85,
      acceptanceRateNum: 0.07,
      competitiveness: 'very_high'
    }
  },
  {
    id: 39,
    name: '东京大学',
    country: '日本',
    major: 'Engineering',
    ranking: 'QS #32',
    match: 73,
    deadline: '2025-01-31',
    tuition: '¥535,800',
    acceptanceRate: '23%',
    requirements: ['GPA 3.3+ / 均分85+', '日语N1 / 英语托福90+', '相关专业背景', '研究计划书'],
    website: 'https://u-tokyo.ac.jp',
    description: '日本最高学府，工程和自然科学领域亚洲领先，培养了众多诺贝尔奖得主。',
    type: '国立大学',
    students: '约28,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.u-tokyo.ac.jp/en/prospective-students/tuition_fees.html', label: '东大官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/university-tokyo', label: 'QS' },
      requirements: { url: 'https://www.u-tokyo.ac.jp/en/prospective-students/graduate_course.html', label: '东大招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.2,
      preferredGPA: 3.5,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.25,
      averageScoreMin: 82,
      acceptanceRateNum: 0.23,
      competitiveness: 'high'
    }
  },
  {
    id: 40,
    name: '哥伦比亚大学',
    country: '美国',
    major: 'Journalism',
    ranking: 'QS #34',
    match: 78,
    deadline: '2025-01-01',
    tuition: '$65,000',
    acceptanceRate: '4%',
    requirements: ['GPA 3.7+ (录取者平均)', 'TOEFL 100+ / IELTS 7.5+', '科研经历', '推荐信3封'],
    website: 'https://columbia.edu',
    description: '常春藤盟校之一，位于纽约市，新闻学和商学院享誉全球，地理位置优越。',
    type: '私立大学',
    students: '约33,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.college.columbia.edu/financial-aid/cost-attendance', label: '哥大官网' },
      acceptance: { url: 'https://www.univstats.com/colleges/columbia-university-in-the-city-of-new-york/admission/', label: 'UnivStats' },
      requirements: { url: 'https://undergrad.admissions.columbia.edu/apply', label: '哥大招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.6,
      preferredGPA: 3.8,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.3,
      averageScoreMin: 85,
      acceptanceRateNum: 0.04,
      competitiveness: 'extreme'
    }
  },
  {
    id: 41,
    name: '香港中文大学',
    country: '中国香港',
    major: 'Business',
    ranking: 'QS #36',
    match: 72,
    deadline: '2025-01-15',
    tuition: 'HKD 145,000',
    acceptanceRate: '20%',
    requirements: ['GPA 3.2+ / 均分80+', 'IELTS 6.5+ / TOEFL 79+', '相关专业背景', '面试'],
    website: 'https://cuhk.edu.hk',
    description: '香港顶尖学府之一，商科和工程领域享有盛誉，书院制教育独具特色。',
    type: '公立大学',
    students: '约20,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://admission.cuhk.edu.hk/', label: '港中文官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/chinese-university-hong-kong', label: 'QS' },
      requirements: { url: 'https://admission.cuhk.edu.hk/', label: '港中文招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.3,
      languageRequirements: { toefl: 79, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.15,
      averageScoreMin: 78,
      acceptanceRateNum: 0.20,
      competitiveness: 'high'
    }
  },
  {
    id: 42,
    name: '蒙纳士大学',
    country: '澳大利亚',
    major: 'Pharmacy',
    ranking: 'QS #37',
    match: 70,
    deadline: '2025-02-28',
    tuition: 'AUD 46,000',
    acceptanceRate: '40%',
    requirements: ['GPA 2.8+ / 均分75+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://monash.edu',
    description: '澳大利亚八校联盟成员，药学和工程领域领先，在马来西亚和南非设有分校。',
    type: '公立大学',
    students: '约78,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.monash.edu/study/fees-scholarships', label: '蒙纳士官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/monash-university', label: 'QS' },
      requirements: { url: 'https://www.monash.edu/study/how-to-apply', label: '蒙纳士招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.6,
      preferredGPA: 3.0,
      languageRequirements: { toefl: 79, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.12,
      averageScoreMin: 75,
      acceptanceRateNum: 0.40,
      competitiveness: 'accessible'
    }
  },
  {
    id: 43,
    name: '不列颠哥伦比亚大学',
    country: '加拿大',
    major: 'Environmental Science',
    ranking: 'QS #38',
    match: 71,
    deadline: '2025-01-15',
    tuition: 'CAD 42,000',
    acceptanceRate: '45%',
    requirements: ['GPA 3.2+ / 均分78+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '个人陈述'],
    website: 'https://ubc.ca',
    description: '加拿大顶尖研究型大学，环境科学和林业领域全球领先，位于温哥华。',
    type: '公立大学',
    students: '约72,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://you.ubc.ca/finances/tuition/', label: 'UBC官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/university-british-columbia', label: 'QS' },
      requirements: { url: 'https://you.ubc.ca/applying-ubc/', label: 'UBC招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.2,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.15,
      averageScoreMin: 76,
      acceptanceRateNum: 0.45,
      competitiveness: 'moderate'
    }
  },
  {
    id: 44,
    name: '复旦大学',
    country: '中国',
    major: 'Economics',
    ranking: 'QS #39',
    match: 74,
    deadline: '2025-03-01',
    tuition: '¥30,000',
    acceptanceRate: '18%',
    requirements: ['GPA 3.4+ / 均分85+', 'HSK 5级 (中文项目)', 'TOEFL 90+ (英文项目)', '面试'],
    website: 'https://fudan.edu.cn',
    description: '中国顶尖综合性大学，经济学和新闻传播学领域领先，位于上海。',
    type: '公立大学',
    students: '约30,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://iso.fudan.edu.cn/', label: '复旦官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/fudan-university', label: 'QS' },
      requirements: { url: 'https://iso.fudan.edu.cn/', label: '复旦招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.2,
      preferredGPA: 3.5,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.18,
      averageScoreMin: 82,
      acceptanceRateNum: 0.18,
      competitiveness: 'high'
    }
  },
  {
    id: 45,
    name: '伦敦国王学院',
    country: '英国',
    major: 'Law',
    ranking: 'QS #40',
    match: 71,
    deadline: '2025-01-26',
    tuition: '£31,000',
    acceptanceRate: '32%',
    requirements: ['GPA 3.2+ / 均分80+', 'IELTS 7.0 (单项不低于6.5)', '相关专业背景', '个人陈述'],
    website: 'https://kcl.ac.uk',
    description: '伦敦大学创始学院之一，法学和医学领域享有盛誉，人文社科实力雄厚。',
    type: '公立大学',
    students: '约33,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.kcl.ac.uk/study/fees-and-funding', label: 'KCL官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/kings-college-london', label: 'QS' },
      requirements: { url: 'https://www.kcl.ac.uk/study/postgraduate', label: 'KCL招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.3,
      languageRequirements: { toefl: 100, ielts: 7.0 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.15,
      averageScoreMin: 78,
      acceptanceRateNum: 0.32,
      competitiveness: 'moderate'
    }
  },
  {
    id: 46,
    name: '加州大学洛杉矶分校',
    country: '美国',
    major: 'Film',
    ranking: 'QS #42',
    match: 76,
    deadline: '2025-01-15',
    tuition: '$43,000',
    acceptanceRate: '9%',
    requirements: ['GPA 3.5+ (竞争激烈)', 'TOEFL 83+ / IELTS 7.0+', '作品集 (艺术专业)', '个人陈述'],
    website: 'https://ucla.edu',
    description: '美国顶尖公立大学，电影、医学和工程领域享有盛誉，位于洛杉矶。',
    type: '公立大学',
    students: '约46,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://admission.ucla.edu/tuition-and-cost', label: 'UCLA官网' },
      acceptance: { url: 'https://www.ugeducation.ucla.edu/wp-content/uploads/2025/01/UndergradProfile2024-2025_FINAL.pdf', label: 'UCLA数据' },
      requirements: { url: 'https://admission.ucla.edu/apply', label: 'UCLA招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 83, ielts: 7.0 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 82,
      acceptanceRateNum: 0.09,
      competitiveness: 'very_high'
    }
  },
  {
    id: 47,
    name: '纽约大学',
    country: '美国',
    major: 'Business',
    ranking: 'QS #43',
    match: 75,
    deadline: '2025-01-05',
    tuition: '$60,000',
    acceptanceRate: '9%',
    requirements: ['GPA 3.5+ (录取者平均)', 'TOEFL 100+ / IELTS 7.5+', '课外活动', '推荐信2封'],
    website: 'https://nyu.edu',
    description: '位于纽约市曼哈顿，商学院和艺术学院享誉全球，国际化程度极高。',
    type: '私立大学',
    students: '约51,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.nyu.edu/admissions/undergraduate-admissions/costs-and-aid.html', label: 'NYU官网' },
      acceptance: { url: 'https://www.clastify.com/blog/acceptance-rates/nyu/historical', label: 'Clastify' },
      requirements: { url: 'https://www.nyu.edu/admissions/undergraduate-admissions.html', label: 'NYU招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.4,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.18,
      averageScoreMin: 82,
      acceptanceRateNum: 0.09,
      competitiveness: 'high'
    }
  },
  {
    id: 48,
    name: '密歇根大学',
    country: '美国',
    major: 'Engineering',
    ranking: 'QS #44',
    match: 74,
    deadline: '2025-02-01',
    tuition: '$57,000',
    acceptanceRate: '18%',
    requirements: ['GPA 3.5+ (竞争激烈)', 'TOEFL 88+ / IELTS 6.5+', '相关专业背景', '个人陈述'],
    website: 'https://umich.edu',
    description: '美国顶尖公立大学，工程、商科和医学领域享有盛誉，科研实力雄厚。',
    type: '公立大学',
    students: '约48,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://admissions.umich.edu/cost-aid', label: '密歇根大学官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/university-michigan', label: 'QS' },
      requirements: { url: 'https://admissions.umich.edu/apply', label: '密歇根招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 88, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 82,
      acceptanceRateNum: 0.18,
      competitiveness: 'high'
    }
  },
  {
    id: 49,
    name: '上海交通大学',
    country: '中国',
    major: 'Engineering',
    ranking: 'QS #45',
    match: 73,
    deadline: '2025-03-01',
    tuition: '¥32,000',
    acceptanceRate: '20%',
    requirements: ['GPA 3.3+ / 均分85+', 'HSK 5级 (中文项目)', 'TOEFL 90+ (英文项目)', '面试'],
    website: 'https://sjtu.edu.cn',
    description: '中国顶尖理工科大学，工程和医学领域领先，位于上海。',
    type: '公立大学',
    students: '约42,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://isc.sjtu.edu.cn/', label: '上海交大官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/shanghai-jiao-tong-university', label: 'QS' },
      requirements: { url: 'https://isc.sjtu.edu.cn/', label: '上海交大招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.2,
      preferredGPA: 3.5,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 82,
      acceptanceRateNum: 0.20,
      competitiveness: 'high'
    }
  },
  {
    id: 50,
    name: '香港科技大学',
    country: '中国香港',
    major: 'Engineering',
    ranking: 'QS #47',
    match: 72,
    deadline: '2025-01-15',
    tuition: 'HKD 155,000',
    acceptanceRate: '25%',
    requirements: ['GPA 3.2+ / 均分82+', 'IELTS 6.5+ / TOEFL 80+', '相关专业背景', '面试'],
    website: 'https://ust.hk',
    description: '香港顶尖理工科大学，工程和商科领域享有盛誉，科研实力雄厚。',
    type: '公立大学',
    students: '约16,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://join.ust.hk/', label: '港科大官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/hong-kong-university-science-technology', label: 'QS' },
      requirements: { url: 'https://join.ust.hk/', label: '港科大招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.3,
      languageRequirements: { toefl: 80, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.18,
      averageScoreMin: 80,
      acceptanceRateNum: 0.25,
      competitiveness: 'high'
    }
  },
  {
    id: 51,
    name: '浙江大学',
    country: '中国',
    major: 'Agriculture',
    ranking: 'QS #47',
    match: 72,
    deadline: '2025-03-01',
    tuition: '¥28,000',
    acceptanceRate: '22%',
    requirements: ['GPA 3.2+ / 均分82+', 'HSK 5级 (中文项目)', 'TOEFL 90+ (英文项目)', '面试'],
    website: 'https://zju.edu.cn',
    description: '中国顶尖综合性大学，农业和工程领域领先，位于杭州。',
    type: '公立大学',
    students: '约54,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'http://iczu.zju.edu.cn/', label: '浙大官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/zhejiang-university', label: 'QS' },
      requirements: { url: 'http://iczu.zju.edu.cn/', label: '浙大招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.4,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.18,
      averageScoreMin: 80,
      acceptanceRateNum: 0.22,
      competitiveness: 'high'
    }
  },
  {
    id: 52,
    name: '代尔夫特理工大学',
    country: '荷兰',
    major: 'Architecture',
    ranking: 'QS #49',
    match: 70,
    deadline: '2025-01-15',
    tuition: '€19,000',
    acceptanceRate: '40%',
    requirements: ['GPA 3.0+ / 均分80+', 'IELTS 6.5 (单项不低于6.0)', '相关专业背景', '作品集 (建筑专业)'],
    website: 'https://tudelft.nl',
    description: '荷兰顶尖理工大学，建筑和工程领域享有盛誉，欧洲领先的理工院校。',
    type: '公立大学',
    students: '约26,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.tudelft.nl/en/education/admission-and-application', label: '代尔夫特官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/delft-university-technology', label: 'QS' },
      requirements: { url: 'https://www.tudelft.nl/en/education/admission-and-application', label: '代尔夫特招生要求' }
    },
    admissionCriteria: {
      minGPA: 2.8,
      preferredGPA: 3.2,
      languageRequirements: { toefl: 90, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.15,
      averageScoreMin: 78,
      acceptanceRateNum: 0.40,
      competitiveness: 'moderate'
    }
  },
  {
    id: 53,
    name: '京都大学',
    country: '日本',
    major: 'Chemistry',
    ranking: 'QS #50',
    match: 71,
    deadline: '2025-01-31',
    tuition: '¥535,800',
    acceptanceRate: '25%',
    requirements: ['GPA 3.2+ / 均分82+', '日语N2+ / 英语托福85+', '相关专业背景', '研究计划书'],
    website: 'https://kyoto-u.ac.jp',
    description: '日本顶尖研究型大学，化学和医学领域享有盛誉，培养了众多诺贝尔奖得主。',
    type: '国立大学',
    students: '约22,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.kyoto-u.ac.jp/en/international/students/admissions', label: '京大官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/kyoto-university', label: 'QS' },
      requirements: { url: 'https://www.kyoto-u.ac.jp/en/international/students/admissions', label: '京大招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.0,
      preferredGPA: 3.3,
      languageRequirements: { toefl: 85, ielts: 6.5 },
      universityTier: ['985', '211', 'regular', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 80,
      acceptanceRateNum: 0.25,
      competitiveness: 'high'
    }
  },
  {
    id: 54,
    name: '西北大学',
    country: '美国',
    major: 'Journalism',
    ranking: 'QS #50',
    match: 77,
    deadline: '2025-01-01',
    tuition: '$63,000',
    acceptanceRate: '7%',
    requirements: ['GPA 3.7+ (录取者平均)', 'TOEFL 100+ / IELTS 7.5+', '科研经历', '推荐信3封'],
    website: 'https://northwestern.edu',
    description: '美国顶尖私立研究型大学，新闻学和商学院全美顶尖，位于芝加哥附近。',
    type: '私立大学',
    students: '约22,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.northwestern.edu/admissions/undergraduate/cost-aid/', label: '西北大学官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/northwestern-university', label: 'QS' },
      requirements: { url: 'https://www.northwestern.edu/admissions/undergraduate/', label: '西北大学招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.5,
      preferredGPA: 3.75,
      languageRequirements: { toefl: 100, ielts: 7.5 },
      universityTier: ['985', 'overseas'],
      researchWeight: 0.25,
      averageScoreMin: 85,
      acceptanceRateNum: 0.07,
      competitiveness: 'very_high'
    }
  },
  {
    id: 55,
    name: '伦敦政治经济学院',
    country: '英国',
    major: 'Economics',
    ranking: 'QS #50',
    match: 75,
    deadline: '2025-01-15',
    tuition: '£26,000',
    acceptanceRate: '9%',
    requirements: ['GPA 3.5+ / 均分85+', 'IELTS 7.0 (单项不低于7.0)', '相关专业背景', '个人陈述'],
    website: 'https://lse.ac.uk',
    description: '全球顶尖社会科学院校，经济学、政治学和社会学领域享有盛誉。',
    type: '公立大学',
    students: '约12,000人',
    image: '',
    sources: {
      ranking: { url: 'https://www.qs.com/insights/articles/rankings-released-qs-world-university-rankings-2025/', label: 'QS 2025排名' },
      tuition: { url: 'https://www.lse.ac.uk/study-at-lse/fees-and-funding', label: 'LSE官网' },
      acceptance: { url: 'https://www.topuniversities.com/universities/london-school-economics-political-science', label: 'QS' },
      requirements: { url: 'https://www.lse.ac.uk/study-at-lse/graduate', label: 'LSE招生要求' }
    },
    admissionCriteria: {
      minGPA: 3.3,
      preferredGPA: 3.6,
      languageRequirements: { toefl: 100, ielts: 7.0 },
      universityTier: ['985', '211', 'overseas'],
      researchWeight: 0.2,
      averageScoreMin: 85,
      acceptanceRateNum: 0.09,
      competitiveness: 'very_high'
    }
  }
]

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

function calculateGPAScore(userGPA, schoolCriteria) {
  const { minGPA, preferredGPA } = schoolCriteria
  
  if (userGPA >= preferredGPA) {
    return 100
  } else if (userGPA >= minGPA) {
    const range = preferredGPA - minGPA
    const position = userGPA - minGPA
    return 70 + (position / range) * 30
  } else {
    const gap = minGPA - userGPA
    if (gap <= 0.3) {
      return 50 - gap * 30
    } else if (gap <= 0.5) {
      return 35 - (gap - 0.3) * 50
    } else {
      return Math.max(5, 25 - (gap - 0.5) * 20)
    }
  }
}

function calculateLanguageScore(userLanguage, schoolCriteria) {
  const userLang = parseLanguageScore(userLanguage)
  const { languageRequirements } = schoolCriteria
  
  if (!userLang.type) {
    return 40
  }
  
  if (userLang.type === 'ielts') {
    const required = languageRequirements.ielts
    if (userLang.score >= required + 0.5) return 100
    if (userLang.score >= required) return 85
    if (userLang.score >= required - 0.5) return 60
    if (userLang.score >= required - 1.0) return 40
    return 20
  }
  
  if (userLang.type === 'toefl') {
    const required = languageRequirements.toefl
    if (userLang.score >= required + 10) return 100
    if (userLang.score >= required) return 85
    if (userLang.score >= required - 10) return 60
    if (userLang.score >= required - 20) return 40
    return 20
  }
  
  return 40
}

function calculateUniversityTierScore(userUniversity, schoolCriteria) {
  const { universityTier, competitiveness } = schoolCriteria
  
  if (universityTier.includes(userUniversity)) {
    return 100
  }
  
  const tierScores = {
    '985': { '985': 100, '211': 85, 'overseas': 90, 'regular': 70 },
    '211': { '985': 100, '211': 100, 'overseas': 95, 'regular': 75 },
    'overseas': { '985': 95, '211': 90, 'overseas': 100, 'regular': 70 },
    'regular': { '985': 100, '211': 100, 'overseas': 100, 'regular': 100 }
  }
  
  const baseScore = tierScores[userUniversity]?.[userUniversity] || 60
  
  if (competitiveness === 'extreme' && userUniversity === 'regular') {
    return Math.max(10, baseScore - 40)
  }
  if (competitiveness === 'very_high' && userUniversity === 'regular') {
    return Math.max(25, baseScore - 25)
  }
  
  return baseScore
}

function calculateAverageScoreScore(userAvgScore, schoolCriteria) {
  const { averageScoreMin } = schoolCriteria
  
  if (userAvgScore >= averageScoreMin + 10) return 100
  if (userAvgScore >= averageScoreMin + 5) return 90
  if (userAvgScore >= averageScoreMin) return 75
  if (userAvgScore >= averageScoreMin - 5) return 55
  if (userAvgScore >= averageScoreMin - 10) return 35
  return 15
}

function calculateResearchScore(researchCount, schoolCriteria) {
  const { researchWeight, competitiveness } = schoolCriteria
  
  if (researchWeight <= 0.1) {
    return 70 + Math.min(researchCount * 10, 30)
  }
  
  const requiredResearch = competitiveness === 'extreme' ? 3 : 
                          competitiveness === 'very_high' ? 2 : 1
  
  if (researchCount >= requiredResearch + 2) return 100
  if (researchCount >= requiredResearch + 1) return 90
  if (researchCount >= requiredResearch) return 75
  if (researchCount >= requiredResearch - 1) return 50
  return 30
}

function calculatePracticeScore(practiceCount) {
  if (practiceCount >= 5) return 100
  if (practiceCount >= 3) return 80
  if (practiceCount >= 2) return 65
  if (practiceCount >= 1) return 50
  return 35
}

function determineCategory(matchScore, competitiveness) {
  if (competitiveness === 'extreme' || competitiveness === 'very_high') {
    if (matchScore >= 85) return 'reach'
    if (matchScore >= 65) return 'match'
    return 'safe'
  }
  
  if (matchScore >= 80) return 'reach'
  if (matchScore >= 55) return 'match'
  return 'safe'
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
      }
    }
  }
  
  const gpaScore = calculateGPAScore(userProfile.gpa || 3.0, criteria)
  const languageScore = calculateLanguageScore(userProfile.language || '', criteria)
  const universityScore = calculateUniversityTierScore(userProfile.university || 'regular', criteria)
  const avgScoreScore = calculateAverageScoreScore(userProfile.averageScore || 75, criteria)
  const researchScore = calculateResearchScore(userProfile.researchCount || 0, criteria)
  const practiceScore = calculatePracticeScore(userProfile.practiceCount || 0)
  
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
  
  const category = determineCategory(matchScore, criteria.competitiveness)
  
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
    }
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

export function getAllSchoolsWithMatch(assessmentData = null) {
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
- 录取概率要客观评估，不要过度乐观或悲观`
}
