<template>
  <div class="university-database-page">
    <h2 class="page-title">院校数据库</h2>
    
    <el-alert
      title="数据仅供参考演示，实际信息请以院校官网为准"
      type="warning"
      :closable="false"
      show-icon
      class="data-disclaimer"
    />

    <el-tabs v-model="activeTab" class="database-tabs">
      <!-- Tab 1: 院校搜索 -->
      <el-tab-pane label="院校搜索" name="schools">
        <!-- 搜索和筛选 -->
        <el-card class="search-card">
          <div class="search-controls">
            <div class="search-row search-row--filters">
              <el-input v-model="searchKeyword" placeholder="搜索学校名称或专业" clearable class="filter-search-input">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-select v-model="filterCountry" placeholder="国家" clearable class="filter-select filter-select--country">
                <el-option v-for="country in uniqueCountries" :key="country" :label="country" :value="country" />
              </el-select>
              <el-select v-model="filterRankRange" placeholder="排名范围" clearable class="filter-select filter-select--rank">
                <el-option label="Top 10" value="top10" />
                <el-option label="Top 20" value="top20" />
                <el-option label="Top 50" value="top50" />
                <el-option label="Top 100" value="top100" />
              </el-select>
              <el-select v-model="filterMajor" placeholder="专业领域" clearable class="filter-select filter-select--major">
                <el-option v-for="major in uniqueMajors" :key="major" :label="major" :value="major" />
              </el-select>
              <el-select v-model="sortBy" placeholder="排序" clearable class="filter-select filter-select--sort">
                <el-option label="QS排名" value="qs_rank" />
                <el-option label="录取率" value="acceptance_rate" />
                <el-option label="学费" value="tuition" />
              </el-select>
            </div>
            <div class="search-row search-row--actions">
              <el-button type="primary" class="search-btn" @click="search">搜索</el-button>
              <el-button class="reset-btn" @click="resetFilters">重置</el-button>
            </div>
          </div>
        </el-card>

        <!-- 视图切换控件 -->
        <div class="view-toggle">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="card">
              <el-icon><Grid /></el-icon>
              卡片视图
            </el-radio-button>
            <el-radio-button label="list">
              <el-icon><List /></el-icon>
              列表视图
            </el-radio-button>
          </el-radio-group>
        </div>

    <!-- 院校网格 - 卡片视图 -->
    <transition name="fade" mode="out-in">
      <div v-if="filteredSchools.length > 0 && viewMode === 'card'" key="card" class="schools-grid">
      <el-card v-for="school in filteredSchools" :key="school.id" class="school-card"
        shadow="hover" @click="showDetail(school)">
        <div class="card-header">
          <h3>{{ school.name }}</h3>
          <el-tag :type="school.rankType" size="small">{{ school.ranking }}</el-tag>
        </div>
        <div class="country-row">
          <span class="country-name">{{ school.country }}</span>
        </div>
        <p class="major">{{ school.major }}</p>
        <div class="card-stats">
          <div class="stat-item">
            <span class="stat-label">费用范围</span>
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
        </div>
      </el-card>
    </div>

    <!-- 院校列表 - 列表视图 -->
    <div v-else-if="filteredSchools.length > 0 && viewMode === 'list'" key="list" class="schools-list">
      <el-table :data="filteredSchools" stripe style="width: 100%" @row-click="showDetail">
        <el-table-column prop="name" label="院校名称" min-width="180">
          <template #default="scope">
            <div class="list-school-name">
              <span class="name-text">{{ scope.row.name }}</span>
              <el-tag :type="scope.row.rankType" size="small" class="rank-tag">{{ scope.row.ranking }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="country" label="国家/地区" width="100" />
        <el-table-column prop="major" label="热门专业" width="140" />
        <el-table-column prop="tuition" label="学费" width="100" />
        <el-table-column prop="acceptanceRate" label="录取率" width="90">
          <template #default="scope">
            <span :class="{ 'low-rate': parseFloat(scope.row.acceptanceRate) < 20 }">
              {{ scope.row.acceptanceRate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click.stop="addToShortlist(scope.row)">
              {{ shortlisted.includes(scope.row.id) ? '已加入' : '加入清单' }}
            </el-button>
            <el-button size="small" @click.stop="showDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </transition>

    <!-- 院校分页 -->
    <div v-if="totalSchools.length > 0" class="pagination">
      <el-pagination
        v-model:current-page="currentSchoolPage"
        v-model:page-size="schoolPageSize"
        :page-sizes="[8, 12, 24, 48]"
        :total="totalSchools.length"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSchoolSizeChange"
        @current-change="handleSchoolPageChange"
      />
    </div>

    <el-empty v-else description="暂无匹配的院校数据" />

      </el-tab-pane>

      <!-- Tab 2: 专业搜索 -->
      <el-tab-pane label="专业搜索" name="majors">
        <!-- 专业搜索和筛选 -->
        <el-card class="search-card">
          <div class="search-controls">
            <div class="search-row search-row--filters">
              <el-input v-model="majorSearchKeyword" placeholder="搜索专业名称或类别" clearable class="filter-search-input filter-search-input--major">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-select v-model="filterDegreeType" placeholder="学位类型" clearable class="filter-select filter-select--degree">
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
              <el-select v-model="filterCategory" placeholder="专业类别" clearable class="filter-select filter-select--category">
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
          <div v-for="major in filteredMajors" :key="major.id" class="major-card"
            :class="'category-' + getCategoryClass(major.category)"
            @click="goToMajorDetail(major)">
            <div class="major-card-header">
              <div class="major-checkbox" @click.stop>
                <el-checkbox v-model="selectedMajors" :label="major.id">
                  <span class="checkbox-text">对比</span>
                </el-checkbox>
              </div>
              <el-tag :type="getCategoryTagType(major.category)" size="small" class="category-tag">{{ major.category }}</el-tag>
            </div>

            <div class="major-card-body">
              <h3 class="major-name">{{ major.name }}</h3>
              <p class="major-degree">{{ major.degreeType }} · {{ major.duration }}</p>

              <div class="major-salary">
                <span class="salary-label">平均薪资</span>
                <span class="salary-value">{{ major.salaryRange }}</span>
              </div>
            </div>

            <div class="major-card-footer">
              <el-button type="primary" size="small" text @click.stop="goToMajorDetail(major)">
                查看详情 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 专业分页 -->
        <div v-if="totalMajors.length > 0" class="pagination">
          <el-pagination
            v-model:current-page="currentMajorPage"
            v-model:page-size="majorPageSize"
            :page-sizes="[8, 12, 24, 48]"
            :total="totalMajors.length"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @size-change="handleMajorSizeChange"
            @current-change="handleMajorPageChange"
          />
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
        <el-dialog v-model="compareVisible" title="专业对比" width="80%" top="5vh" class="major-compare-dialog">
          <div v-if="majorsToCompare.length > 0" class="compare-container">
            <el-table :data="compareTableData" border style="width: 100%" class="major-compare-table">
              <el-table-column prop="field" label="对比项" min-width="140" fixed>
                <template #default="scope">
                  <strong>{{ scope.row.field }}</strong>
                </template>
              </el-table-column>
              <el-table-column v-for="major in majorsToCompare" :key="major.id" :label="major.name" :prop="'major_' + major.id" min-width="180" show-overflow-tooltip>
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
          <el-descriptions-item label="排名">
            {{ currentSchool.ranking }}
            <sup v-if="currentSchool.sources?.ranking" class="source-sup" @click.stop="openSource(currentSchool.sources.ranking.url)">[{{ currentSchool.sources.ranking.label }}]</sup>
          </el-descriptions-item>
          <el-descriptions-item label="热门专业">{{ currentSchool.major }}</el-descriptions-item>
          <el-descriptions-item label="学费">
            {{ currentSchool.tuition }}
            <sup v-if="currentSchool.sources?.tuition" class="source-sup" @click.stop="openSource(currentSchool.sources.tuition.url)">[{{ currentSchool.sources.tuition.label }}]</sup>
          </el-descriptions-item>
          <el-descriptions-item label="录取率">
            {{ currentSchool.acceptanceRate }}
            <sup v-if="currentSchool.sources?.acceptance" class="source-sup" @click.stop="openSource(currentSchool.sources.acceptance.url)">[{{ currentSchool.sources.acceptance.label }}]</sup>
          </el-descriptions-item>
          <el-descriptions-item label="学校类型">{{ currentSchool.type || '综合大学' }}</el-descriptions-item>
          <el-descriptions-item label="学生人数">{{ currentSchool.students || 'N/A' }}</el-descriptions-item>
        </el-descriptions>

        <div class="description-section">
          <h4>学校简介</h4>
          <p>{{ currentSchool.description || '暂无简介信息' }}</p>
        </div>

        <div class="requirements-section">
          <h4>申请要求
            <sup v-if="currentSchool.sources?.requirements" class="source-sup" @click.stop="openSource(currentSchool.sources.requirements.url)">[{{ currentSchool.sources.requirements.label }}]</sup>
          </h4>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, List, Grid, Calendar, ArrowRight } from '@element-plus/icons-vue'
import { majorsData } from '@/data/majors'
import { schoolsData } from '@/data/schools'

const router = useRouter()
const activeTab = ref('schools')
const searchKeyword = ref('')
const filterCountry = ref('')
const filterRankRange = ref('')
const filterMajor = ref('')
const sortBy = ref('')
const viewMode = ref('card')
const currentSchoolPage = ref(1)
const schoolPageSize = ref(12)
const currentMajorPage = ref(1)
const majorPageSize = ref(12)
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

// 使用共享院校数据，添加 rankType 字段用于显示
const allSchools = ref(schoolsData.map(school => ({
  ...school,
  rankType: getRankType(school.ranking)
})))

function getRankType(ranking) {
  const rankNum = parseInt(ranking.match(/\d+/)?.[0] || '999')
  if (rankNum <= 10) return 'danger'
  if (rankNum <= 20) return 'warning'
  if (rankNum <= 50) return 'success'
  return 'info'
}

// 专业数据（使用共享数据）
const allMajors = ref(majorsData)

// 提取所有唯一的专业用于下拉选项
const uniqueMajors = computed(() => {
  const majors = allSchools.value.map(s => s.major)
  return [...new Set(majors)]
})

// 提取所有唯一的国家用于下拉选项
const uniqueCountries = computed(() => {
  const countries = allSchools.value.map(s => s.country)
  return [...new Set(countries)].sort()
})

// 提取所有唯一的专业类别
const uniqueCategories = computed(() => {
  const categories = allMajors.value.map(m => m.category)
  return [...new Set(categories)]
})

// 专业过滤结果（不分页，用于总数统计和搜索消息）
const totalMajors = computed(() => {
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

// 专业分页结果
const filteredMajors = computed(() => {
  const start = (currentMajorPage.value - 1) * majorPageSize.value
  const end = start + majorPageSize.value
  return totalMajors.value.slice(start, end)
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

// 获取类别CSS类名
const getCategoryClass = (category) => {
  const classMap = {
    '工科': 'engineering',
    '商科': 'business',
    '社科': 'social',
    '理科': 'science',
    '文科': 'arts'
  }
  return classMap[category] || 'default'
}

// 解析排名数字
const getRankNumber = (ranking) => {
  const match = ranking.match(/(\d+)/)
  return match ? parseInt(match[1]) : 999
}

// 院校过滤结果（不分页，用于总数统计和搜索消息）
const totalSchools = computed(() => {
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
  if (sortBy.value) {
    result = [...result].sort((a, b) => {
      switch (sortBy.value) {
        case 'qs_rank':
          return getRankNumber(a.ranking) - getRankNumber(b.ranking)
        case 'acceptance_rate':
          return parseFloat(a.acceptanceRate) - parseFloat(b.acceptanceRate)
        case 'tuition':
          return a.tuition.localeCompare(b.tuition)
        default:
          return 0
      }
    })
  }
  return result
})

// 院校分页结果
const filteredSchools = computed(() => {
  const start = (currentSchoolPage.value - 1) * schoolPageSize.value
  const end = start + schoolPageSize.value
  return totalSchools.value.slice(start, end)
})

const search = () => {
  currentSchoolPage.value = 1
  ElMessage.success(`找到 ${totalSchools.value.length} 所学校`)
}

const resetFilters = () => {
  searchKeyword.value = ''
  filterCountry.value = ''
  filterRankRange.value = ''
  filterMajor.value = ''
  sortBy.value = ''
  currentSchoolPage.value = 1
}

// 专业搜索相关方法
const searchMajors = () => {
  currentMajorPage.value = 1
  ElMessage.success(`找到 ${totalMajors.value.length} 个专业`)
}

const resetMajorFilters = () => {
  majorSearchKeyword.value = ''
  filterDegreeType.value = ''
  filterCategory.value = ''
  currentMajorPage.value = 1
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

const goToMajorDetail = (major) => {
  router.push(`/major-detail/${major.id}`)
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

const openSource = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const handleSchoolSizeChange = (val) => {
  schoolPageSize.value = val
  currentSchoolPage.value = 1
}

const handleSchoolPageChange = (val) => {
  currentSchoolPage.value = val
}

const handleMajorSizeChange = (val) => {
  majorPageSize.value = val
  currentMajorPage.value = 1
}

const handleMajorPageChange = (val) => {
  currentMajorPage.value = val
}

// 切换 tab 时重置分页
watch(activeTab, (newTab) => {
  if (newTab === 'schools') {
    currentSchoolPage.value = 1
  } else {
    currentMajorPage.value = 1
  }
})

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
  padding-bottom: 40px;
}

.data-disclaimer {
  margin-bottom: 16px;
}

/* 视图切换控件 */
.view-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.view-toggle :deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 修复视图切换 radio button 的 active 状态样式 */
.view-toggle :deep(.el-radio-button.is-active .el-radio-button__inner) {
  background-color: #667eea !important;
  border-color: #667eea !important;
  color: #fff !important;
  box-shadow: -1px 0 0 0 #667eea !important;
}

/* 未选中的 radio button 样式 - 白色背景 */
.view-toggle :deep(.el-radio-button:not(.is-active) .el-radio-button__inner) {
  background-color: #fff !important;
  color: #606266 !important;
}

/* 未选中的 radio button hover 状态 */
.view-toggle :deep(.el-radio-button:not(.is-active) .el-radio-button__inner:hover) {
  color: #667eea !important;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 列表视图样式 */
.schools-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.schools-list :deep(.el-table) {
  border-radius: 8px;
}

.schools-list :deep(.el-table__row) {
  cursor: pointer;
}

.schools-list :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

.list-school-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-school-name .name-text {
  font-weight: 500;
  color: #303133;
}

.list-school-name .rank-tag {
  flex-shrink: 0;
}

.low-rate {
  color: #f56c6c;
  font-weight: 500;
}

.search-card {
  margin-bottom: 20px;
}

.search-card :deep(.el-card__body) {
  padding: 16px 20px;
}

/* 响应式筛选控件 */
.filter-search-input {
  flex: 1 1 100%;
  min-width: 0;
  width: 100%;
}

.filter-search-input--major {
  flex: 1 1 100%;
  min-width: 0;
  width: 100%;
}

.filter-search-input :deep(.el-input__wrapper) {
  min-width: 0 !important;
}

.filter-search-input :deep(.el-input__inner) {
  min-width: 0 !important;
}

.filter-select {
  flex: 1 1 auto;
  min-width: 0;
}

/* 覆盖 Element Plus el-select */
.filter-select :deep(.el-select__wrapper) {
  min-width: 0 !important;
}

.filter-select--major,
.filter-select--category {
  flex: 1 1 150px;
  min-width: 0;
}

/* 平板端 (900px): 学位类型和类别下拉框宽度微调 */
@media (max-width: 900px) {
  .filter-select--major,
  .filter-select--category,
  .filter-select--degree {
    flex: 1 1 120px;
    min-width: 0;
    width: auto !important;
  }
}

/* 移动端 (480px): 搜索框全宽，下拉框两行排列 */
@media (max-width: 480px) {
  /* 让 search-controls 扩展到全宽，解除宽度限制 */
  .search-controls {
    width: 100% !important;
    min-width: 0 !important;
  }

  .search-row--filters {
    gap: 10px;
    min-width: 0;
    width: 100%;
    flex: 1 1 100%;
  }

  .filter-search-input {
    flex: 1 1 100% !important;
    max-width: 100%;
    min-width: 0;
    width: 100% !important;
  }

  .filter-search-input :deep(.el-input__wrapper) {
    min-width: 0 !important;
    width: 100% !important;
    flex: 1 !important;
  }

  /* 专业搜索tab的搜索输入框同样全宽 */
  .filter-search-input--major {
    flex: 1 1 100% !important;
    max-width: 100%;
    min-width: 0;
    width: 100% !important;
  }

  .filter-search-input--major :deep(.el-input__wrapper) {
    min-width: 0 !important;
    width: 100% !important;
    flex: 1 !important;
  }

  .filter-select {
    display: flex !important;
    flex: 1 1 calc(50% - 5px);
    min-width: 0;
    width: calc(50% - 5px) !important;
  }

  /* 穿透 Element Plus select wrapper 的 min-width 限制 */
  .filter-select :deep(.el-select__wrapper) {
    min-width: 0 !important;
    width: 100% !important;
    flex: 1 !important;
  }

  .filter-select--country,
  .filter-select--degree {
    display: flex !important;
    flex: 1 1 calc(50% - 5px);
    min-width: 0;
    width: calc(50% - 5px) !important;
  }

  .filter-select--country :deep(.el-select__wrapper),
  .filter-select--degree :deep(.el-select__wrapper) {
    min-width: 0 !important;
    width: 100% !important;
    flex: 1 !important;
  }

  .filter-select--rank {
    display: flex !important;
    flex: 1 1 calc(50% - 5px);
    min-width: 0;
    width: calc(50% - 5px) !important;
  }

  .filter-select--rank :deep(.el-select__wrapper) {
    min-width: 0 !important;
    width: 100% !important;
    flex: 1 !important;
  }

  .filter-select--major,
  .filter-select--category {
    display: flex !important;
    flex: 1 1 calc(50% - 5px);
    min-width: 0;
    width: calc(50% - 5px) !important;
  }

  .filter-select--major :deep(.el-select__wrapper),
  .filter-select--category :deep(.el-select__wrapper) {
    min-width: 0 !important;
    width: 100% !important;
    flex: 1 !important;
  }

  /* 移动端操作按钮 */
  .search-row--actions {
    gap: 12px;
  }
}

/* 两行式搜索布局 */
.search-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 默认不限制宽度，让内容决定宽度 */
  width: auto;
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
  border-radius: 12px;
}

.school-card :deep(.el-card__body) {
  padding: 16px;
}

.school-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
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

.country-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}

.country-name {
  color: #909399;
  font-size: 14px;
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
  padding: 16px 0;
}

/* 移动端分页器响应式 */
@media (max-width: 480px) {
  .pagination :deep(.el-pagination__total) {
    display: none;
  }
  .pagination :deep(.el-pagination__jump) {
    display: none;
  }
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

/* 专业卡片 - 简洁设计 */
.major-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 左侧色条 */
.major-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #909399;
  transition: width 0.3s ease;
}

/* 不同类别的主题色 */
.major-card.category-engineering::before {
  background: #409eff;
}

.major-card.category-business::before {
  background: #67c23a;
}

.major-card.category-social::before {
  background: #e6a23c;
}

.major-card.category-science::before {
  background: #909399;
}

.major-card.category-arts::before {
  background: #f56c6c;
}

.major-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #dcdfe6;
}

.major-card:hover::before {
  width: 6px;
}

/* 卡片头部 */
.major-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.major-checkbox {
  flex-shrink: 0;
}

.major-checkbox :deep(.el-checkbox__label) {
  font-size: 12px;
  color: #909399;
}

.checkbox-text {
  font-size: 12px;
}

.category-tag {
  font-size: 12px;
}

/* 卡片主体 */
.major-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.major-name {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.major-degree {
  margin: 0 0 16px;
  font-size: 13px;
  color: #606266;
}

/* 薪资区域 */
.major-salary {
  margin-top: auto;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.salary-label {
  font-size: 12px;
  color: #909399;
}

.salary-value {
  font-size: 14px;
  font-weight: 600;
  color: #f56c6c;
  line-height: 1.4;
}

/* 卡片底部 */
.major-card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
}

.major-card-footer :deep(.el-button) {
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .major-card {
    padding: 16px;
  }

  .major-name {
    font-size: 16px;
  }

  .major-salary {
    padding: 10px;
  }

  .salary-value {
    font-size: 13px;
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

.source-sup {
  color: #409eff;
  cursor: pointer;
  font-size: 10px;
  margin-left: 2px;
  font-weight: normal;
}

.source-sup:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* 对比操作栏：移动端垂直堆叠 */
.compare-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.compare-info {
  font-size: 14px;
  color: #606266;
}

.compare-info strong {
  color: #667eea;
}

/* 专业对比表格：移动端响应式 */
.major-compare-table :deep(.el-table__cell) {
  overflow: hidden;
}

.major-compare-table :deep(.el-table__body .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 移动端对比表格：允许换行 */
@media (max-width: 480px) {
  .major-compare-table :deep(.el-table__body .cell) {
    white-space: normal !important;
    text-overflow: unset !important;
    overflow: visible !important;
  }

  .major-compare-table :deep(.el-table__cell) {
    overflow: visible !important;
  }

  .compare-bar {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .compare-bar .el-button {
    width: 100%;
  }
}

/* 专业搜索 tab 移动端响应式补充 */
@media (max-width: 480px) {
  /* 筛选区域已在 480px 媒体查询中处理 */
  /* 分页器移动端：隐藏不必要元素 */
  .pagination :deep(.el-pagination__sizes) {
    display: none;
  }
  .pagination :deep(.el-pagination__total) {
    display: none;
  }
  .pagination :deep(.el-pagination__jump) {
    display: none;
  }
  .pagination :deep(.el-pagination__rightwrapper) {
    display: none;
  }
}

/* 对比容器：允许水平滚动 */
.compare-container {
  overflow-x: auto;
}

/* 移动端对话框响应式宽度 */
@media (max-width: 768px) {
  .major-compare-dialog {
    width: 90% !important;
    max-width: 90% !important;
  }
}

@media (max-width: 480px) {
  .major-compare-dialog {
    width: 96% !important;
    max-width: 96% !important;
  }
}

/* 移动端专业对比对话框 */
@media (max-width: 480px) {
  .major-compare-table {
    font-size: 13px;
  }

  .major-compare-table :deep(.el-table__header th) {
    font-size: 11px;
  }

  .major-compare-table :deep(.el-table__body td) {
    padding: 6px 4px;
  }

  .compare-container {
    overflow-x: auto;
  }
}
</style>
