export const schoolsData = [
  {
    id: 1,
    name: '麻省理工学院',
    country: '美国',
    major: 'Computer Science',
    ranking: 'QS #1',
    match: 95,
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
    }
  },
  {
    id: 2,
    name: '帝国理工学院',
    country: '英国',
    major: 'Engineering',
    ranking: 'QS #2',
    match: 92,
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
    }
  },
  {
    id: 3,
    name: '牛津大学',
    country: '英国',
    major: 'CS',
    ranking: 'QS #3',
    match: 90,
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
    }
  },
  {
    id: 4,
    name: '哈佛大学',
    country: '美国',
    major: 'Computer Science',
    ranking: 'QS #4',
    match: 93,
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
    }
  },
  {
    id: 5,
    name: '剑桥大学',
    country: '英国',
    major: 'CS',
    ranking: 'QS #5',
    match: 88,
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
    }
  },
  {
    id: 6,
    name: '斯坦福大学',
    country: '美国',
    major: 'AI',
    ranking: 'QS #6',
    match: 91,
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
    }
  },
  {
    id: 7,
    name: '苏黎世联邦理工学院',
    country: '瑞士',
    major: 'Engineering',
    ranking: 'QS #7',
    match: 87,
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
    }
  },
  {
    id: 8,
    name: '新加坡国立大学',
    country: '新加坡',
    major: 'CS',
    ranking: 'QS #8',
    match: 85,
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
    }
  },
  {
    id: 9,
    name: '伦敦大学学院',
    country: '英国',
    major: 'CS',
    ranking: 'QS #9',
    match: 83,
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
    }
  },
  {
    id: 10,
    name: '加州理工学院',
    country: '美国',
    major: 'Physics',
    ranking: 'QS #10',
    match: 89,
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
    }
  },
  {
    id: 11,
    name: '宾夕法尼亚大学',
    country: '美国',
    major: 'Business',
    ranking: 'QS #11',
    match: 82,
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
    }
  },
  {
    id: 12,
    name: '加州大学伯克利分校',
    country: '美国',
    major: 'CS',
    ranking: 'QS #12',
    match: 80,
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
    }
  },
  {
    id: 13,
    name: '墨尔本大学',
    country: '澳大利亚',
    major: 'CS',
    ranking: 'QS #13',
    match: 75,
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
    }
  },
  {
    id: 14,
    name: '北京大学',
    country: '中国',
    major: 'CS',
    ranking: 'QS #14',
    match: 78,
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
    }
  },
  {
    id: 15,
    name: '康奈尔大学',
    country: '美国',
    major: 'Engineering',
    ranking: 'QS #15',
    match: 77,
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
    }
  },
  {
    id: 16,
    name: '香港大学',
    country: '中国香港',
    major: 'Medicine',
    ranking: 'QS #17',
    match: 76,
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
    }
  },
  {
    id: 17,
    name: '清华大学',
    country: '中国',
    major: 'CS',
    ranking: 'QS #20',
    match: 79,
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
    }
  },
  {
    id: 18,
    name: '多伦多大学',
    country: '加拿大',
    major: 'CS',
    ranking: 'QS #29',
    match: 70,
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
    }
  },
  {
    id: 19,
    name: '昆士兰大学',
    country: '澳大利亚',
    major: 'CS',
    ranking: 'QS #40',
    match: 65,
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

export function getRecommendedSchools(assessmentData = null) {
  if (!assessmentData) {
    return {
      reach: schoolsData.filter(s => s.match >= 85),
      match: schoolsData.filter(s => s.match >= 70 && s.match < 85),
      safe: schoolsData.filter(s => s.match < 70)
    }
  }
  return getRecommendedSchools()
}
