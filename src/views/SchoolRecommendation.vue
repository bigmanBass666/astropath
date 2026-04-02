<template>
  <div class="school-recommendation-page" ref="pageRoot">
    <h2 class="page-title">AI智能选校推荐</h2>

    <el-card class="intro-card" v-if="!hasAssessment">
      <el-result icon="info" title="请先完成背景评估" sub-title="系统需要您的背景信息才能进行精准推荐">
        <template #extra>
          <el-button type="primary" @click="$router.push('/assessment')">去评估</el-button>
        </template>
      </el-result>
    </el-card>

    <template v-else>
      <!-- 背景摘要 -->
      <el-card class="summary-card">
        <template #header>
          <span>您的背景摘要</span>
        </template>
        <div class="summary-content">
          <el-tag type="primary">GPA: {{ assessment.basic.gpa }}</el-tag>
          <el-tag type="success">院校: {{ assessment.basic.university }}</el-tag>
          <el-tag type="warning">均分: {{ assessment.academic.averageScore }}</el-tag>
          <el-tag type="info">总分: {{ assessment.scores?.overall?.toFixed(1) || 'N/A' }}</el-tag>
        </div>
      </el-card>

      <!-- 筛选与排序控制 -->
      <el-card class="filter-card">
        <div class="filter-row">
          <el-select v-model="selectedCountry" ref="countryFilter" placeholder="筛选国家" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option v-for="country in availableCountries" :key="country" :label="country" :value="country" />
          </el-select>
          <el-select v-model="selectedMajor" placeholder="筛选专业" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option v-for="major in availableMajors" :key="major" :label="major" :value="major" />
          </el-select>
          <el-select v-model="rankingRange" placeholder="排名范围" clearable style="width: 150px;">
            <el-option v-for="range in rankingRanges" :key="range.value" :label="range.label" :value="range.value" />
          </el-select>
          <el-select v-model="filterFavorites" placeholder="显示收藏" style="width: 120px;">
            <el-option label="全部" :value="false" />
            <el-option label="仅收藏" :value="true" />
          </el-select>
          <el-select v-model="sortBy" ref="sortSelect" placeholder="排序方式" style="width: 150px;">
            <el-option label="默认顺序" value="default" />
            <el-option label="匹配度 (高→低)" value="match-desc" />
            <el-option label="匹配度 (低→高)" value="match-asc" />
            <el-option label="截止日期 (近→远)" value="deadline-asc" />
            <el-option label="截止日期 (远→近)" value="deadline-desc" />
          </el-select>
          <el-button v-if="hasActiveFilters" type="primary" link @click="clearAllFilters" class="clear-filters-btn">
            清除筛选
          </el-button>
          <span class="result-count">共 {{ filteredAndSortedSchools.length }} 所学校</span>
        </div>
      </el-card>

      <!-- 推荐控制 -->
      <el-card class="control-card">
        <div class="control-row">
          <el-button type="primary" @click="startRecommendation" :loading="recommending">
            {{ recommending ? '计算中...' : '开始推荐' }}
          </el-button>
          <el-select v-model="strategy" placeholder="推荐策略" style="width: 180px;">
            <el-option label="全部展示" value="all" />
            <el-option label="冲刺院校" value="reach" />
            <el-option label="匹配院校" value="match" />
            <el-option label="保底院校" value="safe" />
          </el-select>
          <el-button @click="toggleCompare" :disabled="selectedSchools.length === 0">
            对比选中 ({{ selectedSchools.length }})
          </el-button>
          <el-button @click="toggleCompareFavorites" :disabled="favorites.length === 0" type="success" plain>
            对比已收藏 ({{ favorites.length }})
          </el-button>
        </div>
        <!-- 进度条 -->
        <el-progress v-if="recommending" :percentage="progress" :status="progressStatus" style="margin-top: 15px;" />
      </el-card>

      <!-- 推荐列表：三个分类区域 -->
      <div class="schools-container">
        <!-- 冲刺院校 -->
        <el-card class="category-card reach" v-if="reachSchools.length > 0">
          <template #header>
            <div class="category-header">
              <span class="category-title">冲刺院校</span>
              <span class="category-count">{{ reachSchools.length }} 所</span>
            </div>
          </template>
          <div class="schools-grid">
            <div v-for="school in reachSchools" :key="school.id" class="school-card"
              :class="{ 'is-selected': selectedSchools.includes(school.id), 'is-favorite': favorites.includes(school.id) }">
              <div class="school-header" @click="toggleSelect(school.id)">
                <el-checkbox :model-value="selectedSchools.includes(school.id)" @click.stop />
                <span class="school-name" @click="showDetail(school)">{{ school.name }}</span>
                <el-tag type="danger" class="match-badge">匹配度 {{ school.match }}%</el-tag>
              </div>
              <div class="school-info">
                <p><strong>国家：</strong>{{ school.country }}</p>
                <p><strong>专业：</strong>{{ school.major }}</p>
                <p><strong>排名：</strong>{{ school.ranking }}</p>
                <p><strong>截止日期：</strong>{{ school.deadline }}</p>
              </div>
              <div class="school-actions">
                <el-button size="small" type="primary" plain @click="showDetail(school)">查看详情</el-button>
                <el-button size="small" :type="favorites.includes(school.id) ? 'warning' : 'default'"
                  @click="toggleFavorite(school.id)">
                  {{ favorites.includes(school.id) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 匹配院校 -->
        <el-card class="category-card match" v-if="matchSchools.length > 0">
          <template #header>
            <div class="category-header">
              <span class="category-title">匹配院校</span>
              <span class="category-count">{{ matchSchools.length }} 所</span>
            </div>
          </template>
          <div class="schools-grid">
            <div v-for="school in matchSchools" :key="school.id" class="school-card"
              :class="{ 'is-selected': selectedSchools.includes(school.id), 'is-favorite': favorites.includes(school.id) }">
              <div class="school-header" @click="toggleSelect(school.id)">
                <el-checkbox :model-value="selectedSchools.includes(school.id)" @click.stop />
                <span class="school-name" @click="showDetail(school)">{{ school.name }}</span>
                <el-tag type="warning" class="match-badge">匹配度 {{ school.match }}%</el-tag>
              </div>
              <div class="school-info">
                <p><strong>国家：</strong>{{ school.country }}</p>
                <p><strong>专业：</strong>{{ school.major }}</p>
                <p><strong>排名：</strong>{{ school.ranking }}</p>
                <p><strong>截止日期：</strong>{{ school.deadline }}</p>
              </div>
              <div class="school-actions">
                <el-button size="small" type="primary" plain @click="showDetail(school)">查看详情</el-button>
                <el-button size="small" :type="favorites.includes(school.id) ? 'warning' : 'default'"
                  @click="toggleFavorite(school.id)">
                  {{ favorites.includes(school.id) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 保底院校 -->
        <el-card class="category-card safe" v-if="safeSchools.length > 0">
          <template #header>
            <div class="category-header">
              <span class="category-title">保底院校</span>
              <span class="category-count">{{ safeSchools.length }} 所</span>
            </div>
          </template>
          <div class="schools-grid">
            <div v-for="school in safeSchools" :key="school.id" class="school-card"
              :class="{ 'is-selected': selectedSchools.includes(school.id), 'is-favorite': favorites.includes(school.id) }">
              <div class="school-header" @click="toggleSelect(school.id)">
                <el-checkbox :model-value="selectedSchools.includes(school.id)" @click.stop />
                <span class="school-name" @click="showDetail(school)">{{ school.name }}</span>
                <el-tag type="success" class="match-badge">匹配度 {{ school.match }}%</el-tag>
              </div>
              <div class="school-info">
                <p><strong>国家：</strong>{{ school.country }}</p>
                <p><strong>专业：</strong>{{ school.major }}</p>
                <p><strong>排名：</strong>{{ school.ranking }}</p>
                <p><strong>截止日期：</strong>{{ school.deadline }}</p>
              </div>
              <div class="school-actions">
                <el-button size="small" type="primary" plain @click="showDetail(school)">查看详情</el-button>
                <el-button size="small" :type="favorites.includes(school.id) ? 'warning' : 'default'"
                  @click="toggleFavorite(school.id)">
                  {{ favorites.includes(school.id) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 空状态 -->
        <el-empty v-if="schools.length === 0 && !recommending" description="暂无推荐学校">
          <el-button type="primary" size="large" @click="startRecommendation">开始推荐</el-button>
        </el-empty>
      </div>
    </template>


    <!-- 对比对话框 -->
    <el-dialog v-model="compareVisible" title="学校对比" width="80%">
      <div class="compare-header" v-if="compareMode === 'favorites'">
        <el-alert type="info" :closable="false" show-icon>
          正在对比您收藏的学校，可点击右侧操作取消收藏
        </el-alert>
      </div>
      <el-table :data="compareSchools" style="width: 100%" class="compare-table">
        <el-table-column prop="name" label="学校" min-width="140" show-overflow-tooltip />
        <el-table-column prop="country" label="国家" min-width="80" />
        <el-table-column prop="ranking" label="排名" min-width="80" />
        <el-table-column prop="match" label="匹配度" min-width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.match" :color="getScoreColor(row.match)" />
          </template>
        </el-table-column>
        <el-table-column prop="tuition" label="学费" min-width="100" />
        <el-table-column prop="acceptanceRate" label="录取率" min-width="90" />
        <el-table-column label="操作" min-width="110" v-if="compareMode === 'favorites'">
          <template #default="{ row }">
            <el-button size="small" type="danger" plain @click="removeFavoriteAndClose(row.id)">
              取消收藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { schoolsData } from '@/data/schools'

const router = useRouter()

const hasAssessment = ref(false)
const assessment = ref(null)
const schools = ref([])
const recommending = ref(false)
const progress = ref(0)
const progressStatus = ref('')
const favorites = ref([])
const selectedSchools = ref([])
const detailVisible = ref(false)
const compareVisible = ref(false)
const currentSchool = ref(null)
const selectedCountry = ref('')
const selectedMajor = ref('')
const rankingRange = ref('')
const sortBy = ref('default')
const filterFavorites = ref(false)
const compareMode = ref('selected') // 'selected' or 'favorites'
const strategy = ref('all') // 'all', 'reach', 'match', 'safe'

// 使用共享院校数据
const mockSchools = schoolsData

// 计算属性：可用的国家列表
const availableCountries = computed(() => {
  const countries = new Set()
  mockSchools.forEach(s => countries.add(s.country))
  return Array.from(countries).sort()
})

// 计算属性：可用的专业方向列表
const availableMajors = computed(() => {
  const majors = new Set()
  mockSchools.forEach(s => majors.add(s.major))
  return Array.from(majors).sort()
})

// 计算属性：可用的排名范围选项
const rankingRanges = [
  { label: '全部', value: '' },
  { label: 'Top 10', value: 'top10' },
  { label: 'Top 20', value: 'top20' },
  { label: 'Top 50', value: 'top50' },
  { label: 'Top 100', value: 'top100' }
]

// 将排名字符串转换为数字用于比较
const getRankingNumber = (ranking) => {
  const match = ranking.match(/QS #(\d+)/)
  return match ? parseInt(match[1]) : 999
}

// 计算属性：是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return !!(selectedCountry.value || selectedMajor.value || rankingRange.value || filterFavorites.value)
})

// 清除所有筛选条件
const clearAllFilters = () => {
  selectedCountry.value = ''
  selectedMajor.value = ''
  rankingRange.value = ''
  filterFavorites.value = false
  sortBy.value = 'default'
  ElMessage.info('已清除所有筛选条件')
}

// 计算属性：过滤和排序后的学校列表
const filteredAndSortedSchools = computed(() => {
  let result = [...schools.value]

  // 收藏筛选
  if (filterFavorites.value) {
    result = result.filter(s => favorites.value.includes(s.id))
  }

  // 国家筛选
  if (selectedCountry.value) {
    result = result.filter(s => s.country === selectedCountry.value)
  }

  // 专业方向筛选
  if (selectedMajor.value) {
    result = result.filter(s => s.major === selectedMajor.value)
  }

  // 排名范围筛选
  if (rankingRange.value) {
    result = result.filter(s => {
      const rank = getRankingNumber(s.ranking)
      switch (rankingRange.value) {
        case 'top10': return rank <= 10
        case 'top20': return rank <= 20
        case 'top50': return rank <= 50
        case 'top100': return rank <= 100
        default: return true
      }
    })
  }

  // 排序
  switch (sortBy.value) {
    case 'match-desc':
      result.sort((a, b) => b.match - a.match)
      break
    case 'match-asc':
      result.sort((a, b) => a.match - b.match)
      break
    case 'deadline-asc':
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      break
    case 'deadline-desc':
      result.sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
      break
    default:
      // 默认按匹配度降序
      result.sort((a, b) => b.match - a.match)
  }

  return result
})

// 计算属性：三类学校分类
const reachSchools = computed(() => {
  return filteredAndSortedSchools.value.filter(s => s.match >= 85)
})
const matchSchools = computed(() => {
  return filteredAndSortedSchools.value.filter(s => s.match >= 70 && s.match < 85)
})
const safeSchools = computed(() => {
  return filteredAndSortedSchools.value.filter(s => s.match < 70)
})

const getScoreTagType = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

const getScoreColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

const startRecommendation = () => {
  recommending.value = true
  progress.value = 0
  progressStatus.value = ''

  // 模拟进度条动画
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
      if (progress.value > 90) progress.value = 90
    }
  }, 300)

  setTimeout(() => {
    clearInterval(progressInterval)
    progress.value = 100
    progressStatus.value = 'success'

    const filterByStrategy = (list) => {
      switch (strategy.value) {
        case 'reach': return list.filter(s => s.match >= 85)
        case 'safe': return list.filter(s => s.match < 70)
        case 'match': return list.filter(s => s.match >= 70 && s.match < 85)
        default: return list // 'all' returns all schools
      }
    }
    schools.value = filterByStrategy(mockSchools)
    recommending.value = false
    ElMessage.success(`为您推荐了 ${schools.value.length} 所学校`)
  }, 2000)
}

const toggleSelect = (id) => {
  const idx = selectedSchools.value.indexOf(id)
  if (idx > -1) {
    selectedSchools.value.splice(idx, 1)
  } else {
    selectedSchools.value.push(id)
  }
}

const toggleFavorite = (id) => {
  const idx = favorites.value.indexOf(id)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
    ElMessage.success('已取消收藏')
  } else {
    favorites.value.push(id)
    ElMessage.success('已收藏')
  }
  localStorage.setItem('school_favorites', JSON.stringify(favorites.value))
}

const showDetail = (school) => {
  router.push(`/school-detail/${school.id}`)
}

const toggleCompare = () => {
  compareMode.value = 'selected'
  compareSchools.value = mockSchools.filter(s => selectedSchools.value.includes(s.id))
  compareVisible.value = true
}

const toggleCompareFavorites = () => {
  compareMode.value = 'favorites'
  compareSchools.value = mockSchools.filter(s => favorites.value.includes(s.id))
  compareVisible.value = true
}

const removeFavoriteAndClose = (schoolId) => {
  const idx = favorites.value.indexOf(schoolId)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
    localStorage.setItem('school_favorites', JSON.stringify(favorites.value))
    ElMessage.success('已取消收藏')

    // 从对比列表中移除该学校
    compareSchools.value = compareSchools.value.filter(s => s.id !== schoolId)

    // 如果对比列表为空，关闭对话框并返回
    if (compareSchools.value.length === 0) {
      compareVisible.value = false
    }
  }
}

const compareSchools = ref([])

onMounted(() => {
  const saved = localStorage.getItem('assessment_report')
  if (saved) {
    assessment.value = JSON.parse(saved)
    if (assessment.value.basic) {
      hasAssessment.value = true
    }
  }
  const savedFavs = localStorage.getItem('school_favorites')
  if (savedFavs) {
    favorites.value = JSON.parse(savedFavs)
  }

  // 暴露组件实例到window用于测试
  window.schoolRecommendationComponent = {
    get strategy() { return strategy.value },
    set strategy(val) { strategy.value = val },
    get selectedCountry() { return selectedCountry.value },
    set selectedCountry(val) { selectedCountry.value = val },
    get selectedMajor() { return selectedMajor.value },
    set selectedMajor(val) { selectedMajor.value = val },
    get rankingRange() { return rankingRange.value },
    set rankingRange(val) { rankingRange.value = val },
    get filterFavorites() { return filterFavorites.value },
    set filterFavorites(val) { filterFavorites.value = val },
    get sortBy() { return sortBy.value },
    set sortBy(val) { sortBy.value = val },
    get schools() { return schools.value },
    get filteredAndSortedSchools() { return filteredAndSortedSchools.value },
    get favorites() { return favorites.value },
    get selectedSchools() { return selectedSchools.value },
    startRecommendation,
    get mockSchools() { return mockSchools },
    get compareVisible() { return compareVisible.value },
    get compareMode() { return compareMode.value },
    toggleCompare,
    toggleCompareFavorites,
    removeFavoriteAndClose,
    clearAllFilters,
    get hasActiveFilters() { return hasActiveFilters.value },
    get availableMajors() { return availableMajors.value },
    get rankingRanges() { return rankingRanges.value }
  }
})
</script>

<style scoped>
.school-recommendation-page {
  max-width: 1200px;
  margin: 0 auto;
}

.summary-card, .control-card {
  margin-bottom: 20px;
}

.summary-content {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-card, .control-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
.clear-filters-btn {  margin-left: 8px;}
  flex-wrap: wrap;
}

.result-count {
  margin-left: auto;
  color: #909399;
  font-size: 14px;
}

.control-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.school-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.school-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.school-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.school-card:hover::before {
  opacity: 1;
}

.school-card.is-selected {
  border-color: #667eea;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.25);
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.school-card.is-selected::before {
  opacity: 1;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.school-card.is-favorite {
  border-color: #f0c239;
  box-shadow: 0 8px 30px rgba(240, 194, 57, 0.2);
  background: linear-gradient(135deg, #fffdf5 0%, #ffffff 100%);
}

.school-card.is-favorite::before {
  opacity: 1;
  background: linear-gradient(90deg, #f0c239 0%, #ff9f43 100%);
}

.school-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.school-name {
  font-weight: 700;
  font-size: 17px;
  cursor: pointer;
  flex: 1;
  color: #1a1a2e;
  line-height: 1.3;
  transition: color 0.2s ease;
}

.school-name:hover {
  color: #667eea;
}

.match-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.school-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.school-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.school-info-label {
  color: #8c8c8c;
  font-weight: 500;
  min-width: 60px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.school-info-value {
  color: #333;
  font-weight: 500;
}

.school-info p {
  margin: 0;
  color: #555;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.school-info p strong {
  color: #8c8c8c;
  font-weight: 500;
  min-width: 60px;
  display: inline-block;
}

.school-actions {
  margin-top: 18px;
  display: flex;
  gap: 10px;
}

.school-actions .el-button {
  flex: 1;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.school-actions .el-button:hover {
  transform: translateY(-2px);
}

.compare-header {
  margin-bottom: 15px;
}

.school-detail .requirement-section {
  margin-top: 20px;
}

.official-link {
  margin-top: 15px;
}

/* 对比表格：操作按钮不换行 */
.compare-table :deep(.el-table__body .el-button) {
  flex-shrink: 0;
  white-space: nowrap;
}

/* 分类卡片样式 */
.category-card {
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
}

.category-card :deep(.el-card__header) {
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e8e8e8;
}

.category-card.reach :deep(.el-card__header) {
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
}

.category-card.match :deep(.el-card__header) {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
}

.category-card.safe :deep(.el-card__header) {
  background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-title::before {
  content: '';
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.category-card.reach .category-title::before {
  background: linear-gradient(180deg, #ff6b6b 0%, #ee5a6f 100%);
}

.category-card.match .category-title::before {
  background: linear-gradient(180deg, #ffa502 0%, #ff7f50 100%);
}

.category-card.safe .category-title::before {
  background: linear-gradient(180deg, #2ed573 0%, #1dd1a1 100%);
}

.category-count {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 20px;
}
</style>
