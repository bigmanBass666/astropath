<template>
  <div class="university-database-page">
    <h2 class="page-title">院校数据库</h2>

    <el-tabs v-model="activeTab" class="database-tabs">
      <!-- Tab 1: 院校搜索 -->
      <el-tab-pane label="院校搜索" name="schools">
        <!-- 搜索和筛选 -->
        <el-card class="search-card">
          <div class="search-controls">
            <div class="search-row search-row--filters">
              <el-input v-model="searchKeyword" placeholder="搜索学校名称或专业" clearable style="width: 300px;">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-select v-model="filterCountry" placeholder="国家" clearable style="width: 120px;">
                <el-option label="美国" value="美国" />
                <el-option label="英国" value="英国" />
                <el-option label="中国" value="中国" />
                <el-option label="澳洲" value="澳洲" />
                <el-option label="加拿大" value="加拿大" />
              </el-select>
              <el-select v-model="filterRankRange" placeholder="排名范围" clearable style="width: 120px;">
                <el-option label="Top 10" value="top10" />
                <el-option label="Top 20" value="top20" />
                <el-option label="Top 50" value="top50" />
                <el-option label="Top 100" value="top100" />
              </el-select>
              <el-select v-model="filterMajor" placeholder="专业领域" clearable style="width: 150px;">
                <el-option v-for="major in uniqueMajors" :key="major" :label="major" :value="major" />
              </el-select>
            </div>
            <div class="search-row search-row--actions">
              <el-button type="primary" class="search-btn" @click="search">搜索</el-button>
              <el-button class="reset-btn" @click="resetFilters">重置</el-button>
            </div>
          </div>
        </el-card>

    <!-- 院校网格 -->
    <div v-if="filteredSchools.length > 0" class="schools-grid">
      <el-card v-for="school in filteredSchools" :key="school.id" class="school-card"
        shadow="hover" @click="showDetail(school)">
        <!-- 快速查看按钮（悬停显示） -->
        <div class="quick-view-btn">
          <el-button type="primary" size="small" round @click.stop="showDetail(school)">
            快速查看
          </el-button>
        </div>

        <div class="card-header">
          <h3>{{ school.name }}</h3>
          <el-tag :type="school.rankType" size="small">{{ school.ranking }}</el-tag>
        </div>
        <p class="country">{{ school.country }}</p>
        <p class="major">{{ school.major }}</p>
        <div class="card-stats">
          <div class="stat-item">
            <span class="stat-label">学费</span>
            <span class="stat-value">{{ school.tuition }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">录取率</span>
            <span class="stat-value" :class="{ 'low-rate': parseFloat(school.acceptanceRate) < 20 }">
              {{ school.acceptanceRate }}
            </span>
          </div>
        </div>
        <div class="card-footer">
          <el-button type="primary" size="small" plain @click.stop="addToShortlist(school)">
            {{ shortlisted.includes(school.id) ? '已在清单中' : '加入选校清单' }}
          </el-button>
          <el-button size="small" @click.stop="showDetail(school)">查看详情</el-button>
        </div>
      </el-card>
    </div>

    <el-empty v-else description="暂无匹配的院校数据" />

      </el-tab-pane>

      <!-- Tab 2: 专业搜索 -->
      <el-tab-pane label="专业搜索" name="majors">
        <!-- 专业搜索和筛选 -->
        <el-card class="search-card">
          <div class="search-controls">
            <div class="search-row search-row--filters">
              <el-input v-model="majorSearchKeyword" placeholder="搜索专业名称或类别" clearable style="width: 300px;">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-select v-model="filterDegreeType" placeholder="学位类型" clearable style="width: 120px;">
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
              <el-select v-model="filterCategory" placeholder="专业类别" clearable style="width: 150px;">
                <el-option v-for="cat in uniqueCategories" :key="cat" :label="cat" :value="cat" />
              </el-select>
            </div>
            <div class="search-row search-row--actions">
              <el-button type="primary" class="search-btn" @click="searchMajors">搜索</el-button>
              <el-button class="reset-btn" @click="resetMajorFilters">重置</el-button>
            </div>
          </div>
        </el-card>

        <!-- 专业列表 -->
        <div v-if="filteredMajors.length > 0" class="majors-grid">
          <el-card v-for="major in filteredMajors" :key="major.id" class="major-card"
            shadow="hover">
            <div class="major-checkbox">
              <el-checkbox v-model="selectedMajors" :label="major.id" border>
                {{ major.name }}
              </el-checkbox>
            </div>

            <div class="major-header">
              <h3>{{ major.name }}</h3>
              <el-tag :type="getCategoryTagType(major.category)" size="small">{{ major.category }}</el-tag>
            </div>

            <p class="major-degree">{{ major.degreeType }} | {{ major.duration }}</p>
            <p class="major-description">{{ major.description }}</p>

            <div class="major-courses">
              <h4>核心课程</h4>
              <ul>
                <li v-for="(course, idx) in major.courses.slice(0, 4)" :key="idx">{{ course }}</li>
              </ul>
            </div>

            <div class="major-career">
              <h4>就业方向</h4>
              <p>{{ major.career }}</p>
            </div>

            <div class="major-salary">
              <span class="salary-label">平均薪资</span>
              <span class="salary-value">{{ major.salaryRange }}</span>
            </div>
          </el-card>
        </div>

        <el-empty v-else description="暂无匹配的专业数据" />

        <!-- 对比操作栏 -->
        <div class="compare-bar" v-if="selectedMajors.length > 0">
          <div class="compare-info">
            已选择 <strong>{{ selectedMajors.length }}</strong> 个专业进行对比
          </div>
          <el-button type="primary" @click="showCompare">开始对比</el-button>
          <el-button @click="clearSelection">清空选择</el-button>
        </div>

        <!-- 专业对比对话框 -->
        <el-dialog v-model="compareVisible" title="专业对比" width="80%" top="5vh">
          <div v-if="majorsToCompare.length > 0" class="compare-container">
            <el-table :data="compareTableData" border style="width: 100%">
              <el-table-column prop="field" label="对比项" width="180" fixed>
                <template #default="scope">
                  <strong>{{ scope.row.field }}</strong>
                </template>
              </el-table-column>
              <el-table-column v-for="major in majorsToCompare" :key="major.id" :label="major.name" :prop="'major_' + major.id">
                <template #default="scope">
                  {{ scope.row['major_' + major.id] || '-' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>
      </el-tab-pane>

    </el-tabs>

    <!-- 详情对话框 -->
    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" :title="currentSchool?.name" width="70%">
      <div v-if="currentSchool" class="school-detail">
        <div class="detail-header">
          <img v-if="currentSchool.image" :src="currentSchool.image" class="school-image" />
          <div class="detail-title">
            <h2>{{ currentSchool.name }}</h2>
            <p class="detail-subtitle">{{ currentSchool.country }} | {{ currentSchool.ranking }}</p>
          </div>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="国家">{{ currentSchool.country }}</el-descriptions-item>
          <el-descriptions-item label="排名">{{ currentSchool.ranking }}</el-descriptions-item>
          <el-descriptions-item label="热门专业">{{ currentSchool.major }}</el-descriptions-item>
          <el-descriptions-item label="学费">{{ currentSchool.tuition }}</el-descriptions-item>
          <el-descriptions-item label="申请截止">{{ currentSchool.deadline }}</el-descriptions-item>
          <el-descriptions-item label="录取率">{{ currentSchool.acceptanceRate }}</el-descriptions-item>
          <el-descriptions-item label="学校类型">{{ currentSchool.type || '综合大学' }}</el-descriptions-item>
          <el-descriptions-item label="学生人数">{{ currentSchool.students || 'N/A' }}</el-descriptions-item>
        </el-descriptions>

        <div class="description-section">
          <h4>学校简介</h4>
          <p>{{ currentSchool.description || '暂无简介信息' }}</p>
        </div>

        <div class="requirements-section">
          <h4>申请要求</h4>
          <ul>
            <li v-for="(req, idx) in currentSchool.requirements" :key="idx">{{ req }}</li>
          </ul>
        </div>

        <div class="detail-actions">
          <el-button type="primary" @click="addToShortlist(currentSchool)">
            {{ shortlisted.includes(currentSchool.id) ? '已在清单中' : '加入选校清单' }}
          </el-button>
          <el-button type="success" plain @click="goToApply(currentSchool)">开始申请</el-button>
          <el-button type="info" plain @click="visitWebsite(currentSchool.website)">访问官网</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('schools')
const searchKeyword = ref('')
const filterCountry = ref('')
const filterRankRange = ref('')
const filterMajor = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const detailVisible = ref(false)
const currentSchool = ref(null)
const shortlisted = ref([])

// 专业搜索相关状态
const majorSearchKeyword = ref('')
const filterDegreeType = ref('')
const filterCategory = ref('')
const selectedMajors = ref([])
const compareVisible = ref(false)
const majorsToCompare = ref([])
const compareTableData = ref([])

const allSchools = ref([
  { id: 1, name: 'Harvard University', country: '美国', major: 'Computer Science', ranking: 'QS #1', rankType: 'danger', tuition: '$50K', acceptanceRate: '4%', deadline: 'Jan 1', description: '世界顶尖研究型大学', requirements: ['GPA 3.9+', 'GRE 330+', 'Research papers'], website: 'https://harvard.edu' },
  { id: 2, name: 'Stanford University', country: '美国', major: 'CS/AI', ranking: 'QS #2', rankType: 'danger', tuition: '$52K', acceptanceRate: '4.5%', deadline: 'Jan 2', requirements: ['GPA 3.8+', 'Innovation focus'], website: 'https://stanford.edu' },
  { id: 3, name: 'MIT', country: '美国', major: 'CS', ranking: 'QS #3', rankType: 'danger', tuition: '$53K', acceptanceRate: '3.9%', deadline: 'Jan 3', requirements: ['GPA 3.95+', 'Mathematical olympiad'], website: 'https://mit.edu' },
  { id: 4, name: 'Oxford University', country: '英国', major: 'CS', ranking: 'QS #4', rankType: 'warning', tuition: '£35K', acceptanceRate: '18%', deadline: 'Jan 15', requirements: ['First Class Degree'], website: 'https://ox.ac.uk' },
  { id: 5, name: 'Cambridge University', country: '英国', major: 'CS', ranking: 'QS #5', rankType: 'warning', tuition: '£34K', acceptanceRate: '19%', deadline: 'Jan 20', requirements: ['2:1 Degree minimum'], website: 'https://cam.ac.uk' },
  { id: 6, name: 'Tsinghua University', country: '中国', major: 'CS', ranking: 'QS #25', rankType: 'success', tuition: '¥30K', acceptanceRate: '15%', deadline: 'Mar 1', requirements: ['GPA 3.5+'], website: 'https://tsinghua.edu.cn' },
  { id: 7, name: 'Peking University', country: '中国', major: 'CS', ranking: 'QS #14', rankType: 'success', tuition: '¥25K', acceptanceRate: '20%', deadline: 'Mar 1', requirements: ['GPA 3.3+'], website: 'https://pku.edu.cn' },
  { id: 8, name: 'University of Toronto', country: '加拿大', major: 'CS', ranking: 'QS #21', rankType: 'warning', tuition: 'CAD 50K', acceptanceRate: '43%', deadline: 'Jan 15', requirements: ['GPA 3.3+'], website: 'https://utoronto.ca' },
  { id: 9, name: 'University of Melbourne', country: '澳洲', major: 'CS', ranking: 'QS #13', rankType: 'warning', tuition: 'AUD 42K', acceptanceRate: '70%', deadline: 'Jan 15', requirements: ['GPA 3.0+'], website: 'https://unimelb.edu.au' }
])

// 专业数据模型
const allMajors = ref([
  {
    id: 101,
    name: '计算机科学 (Computer Science)',
    category: '工科',
    degreeType: '本科/硕士/博士',
    duration: '本科4年/硕士2年',
    description: '培养具备计算机系统设计、软件开发、人工智能等能力的专业人才',
    courses: ['数据结构与算法', '操作系统', '计算机网络', '数据库系统', '编译原理', '机器学习基础'],
    career: '软件工程师、算法工程师、系统架构师、技术总监、产品经理',
    salaryRange: '¥20K-50K/月 (国内) $80K-150K/年 (美国)'
  },
  {
    id: 102,
    name: '人工智能 (Artificial Intelligence)',
    category: '工科',
    degreeType: '硕士/博士',
    duration: '硕士2年/博士4-5年',
    description: '专注于机器学习、深度学习、自然语言处理等AI前沿技术的研究与应用',
    courses: ['机器学习', '深度学习', '自然语言处理', '计算机视觉', '强化学习', '知识图谱'],
    career: 'AI算法工程师、数据科学家、AI研究员、自动驾驶工程师、对话系统设计师',
    salaryRange: '¥25K-60K/月 (国内) $100K-180K/年 (美国)'
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
    salaryRange: '¥18K-45K/月 (国内) $90K-140K/年 (美国)'
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
    salaryRange: '¥30K-80K/月 (国内) $120K-200K/年 (美国)'
  },
  {
    id: 105,
    name: 'MBA (工商管理硕士)',
    category: '商科',
    degreeType: '硕士',
    duration: '2年',
    description: '培养具有全球视野和综合管理能力的企业高级管理人才',
    courses: ['战略管理', '市场营销', '财务管理', '组织行为学', '领导力发展', '商业伦理'],
    career: '企业高管、咨询顾问、创业创始人、投资银行家、职业经理人',
    salaryRange: '¥40K-100K/月 (国内) $150K-250K/年 (美国)'
  },
  {
    id: 106,
    name: '公共政策 (Public Policy)',
    category: '社科',
    degreeType: '硕士/博士',
    duration: '硕士2年/博士4-6年',
    description: '培养政府、非营利组织和国际机构的政策分析与管理人才',
    courses: ['公共经济学', '政策分析', '政治学理论', '研究方法', '公共管理', ' Ethics in Public Service'],
    career: '政策分析师、政府公务员、NGO项目经理、国际组织官员、公共事务顾问',
    salaryRange: '¥10K-30K/月 (国内) $60K-100K/年 (美国)'
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
    salaryRange: '¥15K-35K/月 (国内) $85K-130K/年 (美国)'
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
    salaryRange: '¥8K-25K/月 (国内) $50K-90K/年 (美国)'
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
    salaryRange: '¥12K-35K/月 (国内) $70K-120K/年 (美国)'
  }
])

// 提取所有唯一的专业用于下拉选项
const uniqueMajors = computed(() => {
  const majors = allSchools.value.map(s => s.major)
  return [...new Set(majors)]
})

// 提取所有唯一的专业类别
const uniqueCategories = computed(() => {
  const categories = allMajors.value.map(m => m.category)
  return [...new Set(categories)]
})

// 过滤后的专业列表
const filteredMajors = computed(() => {
  let result = allMajors.value
  if (majorSearchKeyword.value) {
    const kw = majorSearchKeyword.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(kw) ||
      m.category.toLowerCase().includes(kw) ||
      m.career.toLowerCase().includes(kw)
    )
  }
  if (filterDegreeType.value) {
    result = result.filter(m => m.degreeType.includes(filterDegreeType.value))
  }
  if (filterCategory.value) {
    result = result.filter(m => m.category === filterCategory.value)
  }
  return result
})

// 获取类别标签类型
const getCategoryTagType = (category) => {
  const types = {
    '工科': 'primary',
    '商科': 'success',
    '社科': 'warning',
    '理科': 'info',
    '文科': 'danger'
  }
  return types[category] || 'info'
}

// 解析排名数字
const getRankNumber = (ranking) => {
  const match = ranking.match(/(\d+)/)
  return match ? parseInt(match[1]) : 999
}

const filteredSchools = computed(() => {
  let result = allSchools.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(s => s.name.toLowerCase().includes(kw) || s.major.toLowerCase().includes(kw))
  }
  if (filterCountry.value) {
    result = result.filter(s => s.country === filterCountry.value)
  }
  if (filterMajor.value) {
    result = result.filter(s => s.major === filterMajor.value)
  }
  if (filterRankRange.value) {
    result = result.filter(s => {
      const rankNum = getRankNumber(s.ranking)
      switch (filterRankRange.value) {
        case 'top10': return rankNum <= 10
        case 'top20': return rankNum <= 20
        case 'top50': return rankNum <= 50
        case 'top100': return rankNum <= 100
        default: return true
      }
    })
  }
  return result
})

const search = () => {
  ElMessage.success(`找到 ${filteredSchools.value.length} 所学校`)
}

const resetFilters = () => {
  searchKeyword.value = ''
  filterCountry.value = ''
  filterRankRange.value = ''
  filterMajor.value = ''
}

// 专业搜索相关方法
const searchMajors = () => {
  ElMessage.success(`找到 ${filteredMajors.value.length} 个专业`)
}

const resetMajorFilters = () => {
  majorSearchKeyword.value = ''
  filterDegreeType.value = ''
  filterCategory.value = ''
}

// 专业对比相关方法
const showCompare = () => {
  majorsToCompare.value = allMajors.value.filter(m => selectedMajors.value.includes(m.id))
  buildCompareTableData()
  compareVisible.value = true
}

const clearSelection = () => {
  selectedMajors.value = []
  ElMessage.info('已清空选择')
}

const buildCompareTableData = () => {
  const majors = majorsToCompare.value
  if (majors.length === 0) return

  const fields = [
    { field: '专业名称', key: 'name' },
    { field: '专业类别', key: 'category' },
    { field: '学位类型', key: 'degreeType' },
    { field: '学制', key: 'duration' },
    { field: '核心课程', key: 'courses', format: (v) => v ? v.slice(0, 4).join('、') : '-' },
    { field: '就业方向', key: 'career', format: (v) => v || '-' },
    { field: '平均薪资', key: 'salaryRange' }
  ]

  compareTableData.value = fields.map(f => {
    const row = { field: f.field }
    majors.forEach(m => {
      let value = m[f.key]
      if (f.format) {
        value = f.format(value)
      }
      row['major_' + m.id] = value
    })
    return row
  })
}

const showDetail = (school) => {
  currentSchool.value = school
  detailVisible.value = true
}

const addToShortlist = (school) => {
  if (shortlisted.value.includes(school.id)) {
    ElMessage.warning('学校已在清单中')
    return
  }
  shortlisted.value.push(school.id)
  localStorage.setItem('school_favorites', JSON.stringify(shortlisted.value))
  ElMessage.success(`已将 ${school.name} 加入选校清单`)
}

const goToApply = (school) => {
  router.push('/materials')
}

const visitWebsite = (url) => {
  if (url) {
    window.open(url, '_blank')
  } else {
    ElMessage.warning('暂无官网链接')
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

onMounted(() => {
  const saved = localStorage.getItem('school_favorites')
  if (saved) {
    shortlisted.value = JSON.parse(saved)
  }

  // 如果有选校清单中的学校，高亮显示
  console.log('University database loaded')
})
</script>

<style scoped>
.university-database-page {
  /* 不设置 max-width，与首页各区域保持一致，填满 app-main 全宽 */
}

.search-card {
  margin-bottom: 20px;
}

.search-card :deep(.el-card__body) {
  padding: 16px 20px;
}

/* 两行式搜索布局 */
.search-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-row--filters {
  justify-content: center;
}

.search-row--actions {
  justify-content: center;
  gap: 16px;
}

/* 搜索/重置按钮样式 */
.search-btn,
.reset-btn {
  min-width: 80px;
  white-space: nowrap;
}

.schools-grid {
  display: grid;
  gap: 20px;
  /* 默认移动端优先：1列 */
  grid-template-columns: 1fr;
}

/* 平板及以上：2列 */
@media (min-width: 480px) {
  .schools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .schools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 大桌面端：4列 */
@media (min-width: 1200px) {
  .schools-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.school-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.school-card :deep(.el-card__body) {
  padding: 16px;
}

.school-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 快速查看按钮 - 悬停显示 */
.quick-view-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 10;
}

.school-card:hover .quick-view-btn {
  opacity: 1;
  transform: translateY(0);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.country {
  color: #909399;
  margin-bottom: 5px;
}

.major {
  color: #667eea;
  font-weight: 500;
  margin-bottom: 15px;
}

.card-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.card-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.major-card {
  /* 使用 flex 布局强制统一卡片高度 */
  display: flex !important;
  flex-direction: column !important;
  height: 360px !important;
  overflow: hidden !important;
}

.major-card :deep(.el-card__body) {
  padding: 16px !important;
  display: flex !important;
  flex-direction: column !important;
  flex: 1 !important;
  height: 100% !important;
  overflow: hidden !important;
}

/* 限制各内容区块高度，确保所有卡片高度一致 */
.major-header {
  flex-shrink: 0;
}

.major-degree {
  flex-shrink: 0;
  margin: 4px 0;
  font-size: 13px;
  color: #606266;
}

.major-description {
  flex-shrink: 0;
  margin: 0 0 8px;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  max-height: 3em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.major-courses {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.major-courses h4 {
  margin: 0 0 4px;
  font-size: 13px;
  color: #303133;
}

.major-courses ul {
  margin: 0;
  padding-left: 16px;
  max-height: 3.6em;
  overflow: hidden;
}

.major-courses li {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
}

.major-career {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.major-career h4 {
  margin: 0 0 4px;
  font-size: 13px;
  color: #303133;
}

.major-career p {
  margin: 0;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
  max-height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.major-salary {
  flex-shrink: 0;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #ebeef5;
}

/* 专业卡片网格布局 */
.majors-grid {
  display: grid;
  gap: 20px;
  /* 默认移动端优先：1列 */
  grid-template-columns: 1fr;
}

/* 平板及以上：2列 */
@media (min-width: 600px) {
  .majors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面端及以上：3列 */
@media (min-width: 1024px) {
  .majors-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.school-detail {
  /* 为对话框内容添加统一内边距，确保内容不紧贴边缘 */
  padding: 20px;
}

.school-detail .detail-header {
  /* header 内容区添加内边距，使图片和标题不紧贴边缘 */
  padding: 16px;
  background: #f8f9fc;
  border-radius: 8px;
  margin-bottom: 20px;
}

.school-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.detail-title {
  margin-left: 16px;
}

.detail-title h2 {
  margin: 0 0 10px;
}

.detail-subtitle {
  color: #909399;
  margin: 0;
}

/* descriptions 卡片添加内边距 */
.school-detail .el-descriptions {
  padding: 16px;
}

/* 描述和需求区域添加内边距和底部分隔 */
.description-section,
.requirements-section {
  padding: 16px;
  margin-top: 16px;
  background: #f8f9fc;
  border-radius: 8px;
}

.description-section h4,
.requirements-section h4 {
  margin-bottom: 10px;
  color: #303133;
}

.requirements-section ul {
  padding-left: 20px;
  list-style: square;
}

.requirements-section li {
  margin-bottom: 8px;
  color: #606266;
}

/* 按钮组居中对齐 */
.detail-actions {
  margin-top: 20px;
  padding: 16px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.low-rate {
  color: #f56c6c;
}
</style>
