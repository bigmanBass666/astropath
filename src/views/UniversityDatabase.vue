<template>
  <div class="university-database-page">
    <!-- 自定义 Toast 通知 -->
    <Teleport to="body">
      <Transition name="toast-fade">
        <div
          v-if="toast.visible"
          class="toast-notification"
          :class="'toast-' + toast.type"
        >
          <span class="toast-icon">{{ toastIcons[toast.type] }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </Transition>
    </Teleport>

    <!-- Hero 搜索区域 -->
    <section
      ref="heroRef"
      class="db-hero"
      :class="{ 'is-visible': heroVisible }"
    >
      <div class="db-hero-bg" />

      <div class="db-hero-content">
        <h1 class="db-hero-title">院校数据库</h1>
        <p class="db-hero-subtitle">探索全球顶尖院校，找到最适合你的留学目标</p>

        <!-- Hero 搜索框 -->
        <div
          class="db-hero-search"
          @keyup.enter="handleHeroSearch"
        >
          <input
            v-model="heroSearchKeyword"
            type="text"
            class="hero-search-field"
            placeholder="搜索院校名称、专业或国家..."
          >
          <button
            class="hero-search-action"
            @click="handleHeroSearch"
          >搜索</button>
        </div>

        <!-- 热门搜索标签 -->
        <div class="db-hero-tags">
          <span class="tag-label">热门搜索：</span>
          <span
            v-for="tag in hotTags"
            :key="tag"
            class="hot-tag"
            @click="searchByTag(tag)"
          >{{ tag }}</span>
        </div>

        <!-- 数据统计 -->
        <div class="db-hero-stats">
          <div class="hero-stat-item">
            <span class="hero-stat-number">{{ allSchools.length }}+</span>
            <span class="hero-stat-label">院校数据</span>
          </div>
          <div class="hero-stat-divider" />
          <div class="hero-stat-item">
            <span class="hero-stat-number">{{ uniqueCountries.length }}</span>
            <span class="hero-stat-label">覆盖国家</span>
          </div>
          <div class="hero-stat-divider" />
          <div class="hero-stat-item">
            <span class="hero-stat-number">{{ allMajors.length }}</span>
            <span class="hero-stat-label">热门专业</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主内容区域 -->
    <section
      ref="contentRef"
      class="db-content"
      :class="{ 'is-visible': contentVisible }"
    >
      <div class="db-container">
        <!-- Tab 导航 -->
        <el-tabs
          v-model="activeTab"
          class="database-tabs"
        >
          <!-- Tab 1: 院校搜索 -->
          <el-tab-pane
            label="院校搜索"
            name="schools"
          >
            <!-- 极简标签筛选栏 -->
            <div class="filter-chips">
              <div class="filter-chips__row">
                <span class="filter-chips__label">国家</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': !filterCountry }"
                  @click="filterCountry = ''"
                >全部</span>
                <span
                  v-for="country in uniqueCountries.slice(0, 4)"
                  :key="country"
                  class="filter-chip"
                  :class="{ 'is-active': filterCountry === country }"
                  @click="filterCountry = filterCountry === country ? '' : country"
                >{{ country }}</span>
              </div>

              <div class="filter-chips__row">
                <span class="filter-chips__label">排名</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': !filterRankRange }"
                  @click="filterRankRange = ''"
                >全部</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': filterRankRange === 'top10' }"
                  @click="toggleRankFilter('top10')"
                >Top 10</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': filterRankRange === 'top20' }"
                  @click="toggleRankFilter('top20')"
                >Top 30</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': filterRankRange === 'top50' }"
                  @click="toggleRankFilter('top50')"
                >Top 50</span>
              </div>

              <div class="filter-chips__row">
                <span class="filter-chips__label">专业</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': !filterMajor }"
                  @click="filterMajor = ''"
                >全部</span>
                <span
                  v-for="major in uniqueMajors.slice(0, 3)"
                  :key="major"
                  class="filter-chip"
                  :class="{ 'is-active': filterMajor === major }"
                  @click="filterMajor = filterMajor === major ? '' : major"
                >{{ major }}</span>

                <span
                  class="filter-chip filter-chip--sort"
                  :class="{ 'is-active': sortBy === 'qs_rank' }"
                  @click="sortBy = sortBy === 'qs_rank' ? '' : 'qs_rank'"
                >排名 ↓</span>
                <span
                  class="filter-chip filter-chip--sort"
                  :class="{ 'is-active': sortBy === 'acceptance_rate' }"
                  @click="sortBy = sortBy === 'acceptance_rate' ? '' : 'acceptance_rate'"
                >录取率 ↑</span>
              </div>
            </div>

            <!-- 视图切换 -->
            <div class="view-toggle">
              <div class="view-mode-switch">
                <span
                  class="view-mode-btn"
                  :class="{ 'is-active': viewMode === 'card' }"
                  @click="viewMode = 'card'"
                >
                  <el-icon><Grid /></el-icon>
                </span>
                <span
                  class="view-mode-btn"
                  :class="{ 'is-active': viewMode === 'list' }"
                  @click="viewMode = 'list'"
                >
                  <el-icon><List /></el-icon>
                </span>
              </div>
              <span class="result-count">{{ totalSchools.length }} 所院校</span>
            </div>

            <!-- 院校网格 - 卡片视图 -->
            <transition
              name="fade"
              mode="out-in"
            >
              <div
                v-if="filteredSchools.length > 0 && viewMode === 'card'"
                key="card"
                class="schools-grid"
              >
                <div
                  v-for="school in filteredSchools"
                  :key="school.id"
                  class="school-card"
                  @click="showDetail(school)"
                >
                  <div class="school-card__top-bar" />

                  <div class="school-card__body">
                    <div class="school-card__header">
                      <h3 class="school-card__title">{{ school.name }}</h3>
                      <span
                        class="school-card__rank"
                        :class="'rank-' + school.rankType"
                      >
                        {{ school.ranking }}
                      </span>
                    </div>

                    <div class="school-card__meta">
                      <span class="school-card__country">
                        <span class="meta-dot" />{{ school.country }}
                      </span>
                    </div>

                    <p class="school-card__major">
                      <span class="major-icon">📚</span>{{ school.major }}
                    </p>

                    <div class="school-card__stats">
                      <div class="stat-block">
                        <span class="stat-block__label">费用范围</span>
                        <span class="stat-block__value">{{ school.tuition }}</span>
                      </div>
                      <div class="stat-block">
                        <span class="stat-block__label">录取率</span>
                        <span
                          class="stat-block__value"
                          :class="{ 'low-rate': parseFloat(school.acceptanceRate) < 20 }"
                        >{{ school.acceptanceRate }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="school-card__footer">
                    <button
                      class="card-action-btn"
                      :class="{ 'is-added': shortlisted.includes(school.id) }"
                      @click.stop="addToShortlist(school)"
                    >
                      {{ shortlisted.includes(school.id) ? '✓ 已在清单' : '+ 加入清单' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 院校列表 - 列表视图 -->
              <div
                v-else-if="filteredSchools.length > 0 && viewMode === 'list'"
                key="list"
                class="schools-list"
              >
                <el-table
                  :data="filteredSchools"
                  stripe
                  style="width: 100%"
                  @row-click="showDetail"
                >
                  <el-table-column
                    prop="name"
                    label="院校名称"
                    min-width="180"
                  >
                    <template #default="scope">
                      <div class="list-school-name">
                        <span class="name-text">{{ scope.row.name }}</span>
                        <span
                          class="rank-tag"
                          :class="'rank-' + scope.row.rankType"
                        >
                          {{ scope.row.ranking }}
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="country"
                    label="国家/地区"
                    width="100"
                  />
                  <el-table-column
                    prop="major"
                    label="热门专业"
                    width="140"
                  />
                  <el-table-column
                    prop="tuition"
                    label="学费"
                    width="100"
                  />
                  <el-table-column
                    prop="acceptanceRate"
                    label="录取率"
                    width="90"
                  >
                    <template #default="scope">
                      <span :class="{ 'low-rate': parseFloat(scope.row.acceptanceRate) < 20 }">
                        {{ scope.row.acceptanceRate }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="160"
                    fixed="right"
                  >
                    <template #default="scope">
                      <button
                        class="table-action-btn table-action-btn--primary"
                        :class="{ 'is-added': shortlisted.includes(scope.row.id) }"
                        @click.stop="addToShortlist(scope.row)"
                      >
                        {{ shortlisted.includes(scope.row.id) ? '已加入' : '加入清单' }}
                      </button>
                      <button
                        class="table-action-btn"
                        @click.stop="showDetail(scope.row)"
                      >
                        详情
                      </button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </transition>

            <!-- 分页 -->
            <div
              v-if="totalSchools.length > 0"
              class="pagination"
            >
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

            <div
              v-else
              class="empty-state"
            >
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">暂无匹配的院校</div>
              <div class="empty-state-desc">尝试调整筛选条件或搜索其他关键词</div>
            </div>
          </el-tab-pane>

          <!-- Tab 2: 专业搜索 -->
          <el-tab-pane
            label="专业搜索"
            name="majors"
          >
            <!-- 专业极简标签筛选 -->
            <div class="filter-chips">
              <div class="filter-chips__row">
                <span class="filter-chips__label">类别</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': !filterCategory }"
                  @click="filterCategory = ''"
                >全部</span>
                <span
                  v-for="cat in uniqueCategories"
                  :key="cat"
                  class="filter-chip"
                  :class="{ 'is-active': filterCategory === cat }"
                  @click="filterCategory = filterCategory === cat ? '' : cat"
                >{{ cat }}</span>
              </div>

              <div class="filter-chips__row">
                <span class="filter-chips__label">学位</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': !filterDegreeType }"
                  @click="filterDegreeType = ''"
                >全部</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': filterDegreeType === '本科' }"
                  @click="filterDegreeType = filterDegreeType === '本科' ? '' : '本科'"
                >本科</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': filterDegreeType === '硕士' }"
                  @click="filterDegreeType = filterDegreeType === '硕士' ? '' : '硕士'"
                >硕士</span>
                <span
                  class="filter-chip"
                  :class="{ 'is-active': filterDegreeType === '博士' }"
                  @click="filterDegreeType = filterDegreeType === '博士' ? '' : '博士'"
                >博士</span>

                <div class="major-search-inline">
                  <svg class="search-mini-icon" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M9.5 9.5L12.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  <input
                    v-model="majorSearchKeyword"
                    placeholder="搜索专业..."
                    class="search-mini-input"
                  >
                </div>
              </div>
            </div>

            <!-- 结果计数 + 视图提示 -->
            <div class="view-toggle">
              <span class="result-count">共 {{ totalMajors.length }} 个专业</span>
            </div>

            <!-- 专业列表 -->
            <div
              v-if="filteredMajors.length > 0"
              class="majors-grid"
            >
              <div
                v-for="major in filteredMajors"
                :key="major.id"
                class="major-card"
                :class="'category-' + getCategoryClass(major.category)"
                @click="goToMajorDetail(major)"
              >
                <div class="major-card__top-bar" />

                <div class="major-card__body">
                  <div class="major-card__header">
                    <div
                      class="major-checkbox"
                      @click.stop
                    >
                      <el-checkbox
                        v-model="selectedMajors"
                        :label="major.id"
                      >
                        <span class="checkbox-text">对比</span>
                      </el-checkbox>
                    </div>
                    <span
                      class="category-tag"
                      :class="'tag-' + getCategoryTagClass(major.category)"
                    >
                      {{ major.category }}
                    </span>
                  </div>

                  <div class="major-name">
                    <span class="major-name-cn">{{ parseMajorName(major.name).chinese }}</span>
                    <span
                      v-if="parseMajorName(major.name).english"
                      class="major-name-en"
                    >
                      {{ parseMajorName(major.name).english }}
                    </span>
                  </div>

                  <p class="major-degree">
                    <span class="degree-dot" />{{ major.degreeType }} · {{ major.duration }}
                  </p>

                  <div class="major-salary">
                    <span class="salary-label">平均薪资</span>
                    <span class="salary-value">{{ major.salaryRange }}</span>
                  </div>
                </div>

                <div class="major-card__footer">
                  <button
                    class="detail-link"
                    @click.stop="goToMajorDetail(major)"
                  >
                    查看详情
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="margin-left:4px;flex-shrink:0"><path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 专业分页 -->
            <div
              v-if="totalMajors.length > 0"
              class="pagination"
            >
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

            <div
              v-else
              class="empty-state"
            >
              <div class="empty-state-icon">📚</div>
              <div class="empty-state-title">暂无匹配的专业</div>
              <div class="empty-state-desc">尝试调整筛选条件或搜索其他关键词</div>
            </div>

            <!-- 对比操作栏 -->
            <div
              v-if="selectedMajors.length > 0"
              class="compare-bar"
            >
              <div class="compare-info">
                已选择 <strong>{{ selectedMajors.length }}</strong> 个专业进行对比
              </div>
              <button
                class="compare-btn compare-btn--primary"
                @click="showCompare"
              >
                开始对比
              </button>
              <button
                class="compare-btn"
                @click="clearSelection"
              >
                清空选择
              </button>
            </div>

            <!-- 专业对比对话框 -->
            <el-dialog
              v-model="compareVisible"
              title="专业对比"
              width="80%"
              top="5vh"
              class="major-compare-dialog"
            >
              <div
                v-if="majorsToCompare.length > 0"
                class="compare-container"
              >
                <el-table
                  :data="compareTableData"
                  border
                  style="width: 100%"
                  class="major-compare-table"
                >
                  <el-table-column
                    prop="field"
                    label="对比项"
                    min-width="140"
                    fixed
                  >
                    <template #default="scope">
                      <strong>{{ scope.row.field }}</strong>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="major in majorsToCompare"
                    :key="major.id"
                    :label="major.name"
                    :prop="'major_' + major.id"
                    min-width="180"
                    show-overflow-tooltip
                  >
                    <template #default="scope">
                      {{ scope.row['major_' + major.id] || '-' }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { List, Grid } from '@element-plus/icons-vue'
import { majorsData } from '@/data/majors'
import { schoolsData } from '@/data/schools'

const router = useRouter()
const route = useRoute()

const heroRef = ref(null)
const contentRef = ref(null)
const heroVisible = ref(false)
const contentVisible = ref(false)

const activeTab = ref('schools')
const heroSearchKeyword = ref('')
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
const shortlisted = ref([])

const majorSearchKeyword = ref('')
const filterDegreeType = ref('')
const filterCategory = ref('')
const selectedMajors = ref([])
const compareVisible = ref(false)
const majorsToCompare = ref([])
const compareTableData = ref([])

const hotTags = ['计算机科学', '商科', '人工智能', '医学', '工程学', '法学']

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'ℹ'
}

const toast = reactive({
  visible: false,
  message: '',
  type: 'info'
})

let toastTimer = null

function showToast(message, type = 'info', duration = 3000) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.message = message
  toast.type = type
  toast.visible = true
  toastTimer = setTimeout(() => {
    toast.visible = false
  }, duration)
}

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

const allMajors = ref(majorsData)

const uniqueMajors = computed(() => {
  const majors = allSchools.value.map(s => s.major)
  return Array.from(new Set(majors))
})

const uniqueCountries = computed(() => {
  const countries = allSchools.value.map(s => s.country)
  return Array.from(new Set(countries)).sort()
})

const uniqueCategories = computed(() => {
  const categories = allMajors.value.map(m => m.category)
  return Array.from(new Set(categories))
})

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

const filteredMajors = computed(() => {
  const start = (currentMajorPage.value - 1) * majorPageSize.value
  const end = start + majorPageSize.value
  return totalMajors.value.slice(start, end)
})

function getCategoryTagClass(category) {
  const map = {
    '工科': 'primary',
    '商科': 'success',
    '社科': 'warning',
    '理科': 'info',
    '文科': 'danger'
  }
  return map[category] || 'info'
}

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

const getRankNumber = (ranking) => {
  const match = ranking.match(/(\d+)/)
  return match ? parseInt(match[1]) : 999
}

const parseMajorName = (name) => {
  const match = name.match(/^(.+?)\s*\((.+)\)$/)
  if (match) {
    return { chinese: match[1], english: match[2] }
  }
  return { chinese: name, english: '' }
}

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

const filteredSchools = computed(() => {
  const start = (currentSchoolPage.value - 1) * schoolPageSize.value
  const end = start + schoolPageSize.value
  return totalSchools.value.slice(start, end)
})

const handleHeroSearch = () => {
  searchKeyword.value = heroSearchKeyword.value
  activeTab.value = 'schools'
  currentSchoolPage.value = 1
  showToast(`找到 ${totalSchools.value.length} 所学校`, 'success')
}

const searchByTag = (tag) => {
  heroSearchKeyword.value = tag
  searchKeyword.value = tag
  activeTab.value = 'schools'
  currentSchoolPage.value = 1
  showToast(`按「${tag}」搜索，找到 ${totalSchools.value.length} 所学校`, 'success')
}

const resetFilters = () => {
  searchKeyword.value = ''
  filterCountry.value = ''
  filterRankRange.value = ''
  filterMajor.value = ''
  sortBy.value = ''
  currentSchoolPage.value = 1
}

const toggleRankFilter = (val) => {
  filterRankRange.value = filterRankRange.value === val ? '' : val
}

const clearSelection = () => {
  selectedMajors.value = []
  showToast('已清空选择', 'info')
}

const showCompare = () => {
  majorsToCompare.value = allMajors.value.filter(m => selectedMajors.value.includes(m.id))
  buildCompareTableData()
  compareVisible.value = true
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
  router.push('/school-detail/' + school.id + '?from=database')
}

const goToMajorDetail = (major) => {
  router.push(`/major-detail/${major.id}`)
}

const addToShortlist = (school) => {
  const idx = shortlisted.value.indexOf(school.id)
  if (idx > -1) {
    shortlisted.value.splice(idx, 1)
    localStorage.setItem('school_favorites', JSON.stringify(shortlisted.value))
    showToast(`已将 ${school.name} 从选校清单移除`, 'info')
  } else {
    shortlisted.value.push(school.id)
    localStorage.setItem('school_favorites', JSON.stringify(shortlisted.value))
    showToast(`已将 ${school.name} 加入选校清单`, 'success')
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

watch(activeTab, (newTab) => {
  if (newTab === 'schools') {
    currentSchoolPage.value = 1
  } else {
    currentMajorPage.value = 1
  }
})

let heroObserver = null
let contentObserver = null

const setupObservers = () => {
  heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroVisible.value = true
          heroObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  contentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          contentVisible.value = true
          contentObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.05 }
  )
}

onMounted(() => {
  const saved = localStorage.getItem('school_favorites')
  if (saved) {
    shortlisted.value = JSON.parse(saved)
  }

  if (route.query.tab === 'majors') {
    activeTab.value = 'majors'
  }

  setTimeout(() => {
    heroVisible.value = true
  }, 100)

  setupObservers()

  requestAnimationFrame(() => {
    if (heroRef.value) heroObserver?.observe(heroRef.value)
    if (contentRef.value) contentObserver?.observe(contentRef.value)
  })

  setTimeout(() => {
    if (!contentVisible.value) {
      contentVisible.value = true
    }
  }, 800)
})

onUnmounted(() => {
  heroObserver?.disconnect()
  contentObserver?.disconnect()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
/* ========== 页面根容器 ========== */
.university-database-page {
  padding-bottom: 40px;
  min-height: 100vh;
  background: var(--color-background);
}

/* ========== Toast 通知系统 ========== */
.toast-notification {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px 20px;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
}

.toast-success {
  background: var(--color-solid);
  color: var(--color-text-inverse);
}

.toast-error {
  background: var(--color-danger);
  color: white;
}

.toast-warning {
  background: var(--color-warning);
  color: white;
}

.toast-info {
  background: var(--color-solid);
  color: var(--color-text-inverse);
}

.toast-icon {
  flex-shrink: 0;
  font-weight: 700;
  font-size: var(--text-base);
}

.toast-message {
  line-height: 1.4;
}

.toast-fade-enter-active {
  transition: opacity 250ms ease, transform 250ms ease;
}

.toast-fade-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

/* ========== Hero 搜索区域 ========== */
.db-hero {
  position: relative;
  overflow: hidden;
  padding: var(--space-16) var(--space-10) var(--space-12);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.db-hero.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.db-hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(15, 23, 42, 0.015) 1px, transparent 1px),
    linear-gradient(rgba(15, 23, 42, 0.015) 1px, transparent 1px),
    linear-gradient(180deg, var(--color-background-alt) 0%, var(--color-surface) 100%);
  background-size: 80px 80px, 80px 80px, 100% 100%;
}

.db-hero-content {
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.db-hero-title {
  font-family: var(--font-family-base);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
  line-height: var(--leading-tight);
  letter-spacing: -1px;
}

.db-hero-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 3px;
  background: var(--color-solid);
  margin: var(--space-4) auto 0;
  border-radius: 2px;
}

.db-hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-8);
  line-height: var(--leading-relaxed);
}

/* Hero 搜索框 */
.db-hero-search {
  max-width: 560px;
  margin: 0 auto var(--space-6);
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--color-border-light);
  transition: all var(--transition-normal);
  padding: 2px;
}

.db-hero-search:hover {
  box-shadow: var(--shadow-xl), 0 0 0 1px var(--color-border);
}

.db-hero-search:focus-within {
  box-shadow: var(--shadow-xl), 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.hero-search-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 14px 6px 14px 20px;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: 24px;
  min-width: 0;
}

.hero-search-field::placeholder {
  color: var(--color-text-tertiary);
}

.hero-search-action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  margin: 4px;
  background: var(--color-solid);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
  letter-spacing: 0.3px;
}

.hero-search-action:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.hero-search-action:active {
  transform: translateY(0);
}

/* 热门标签 */
.db-hero-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-bottom: var(--space-6);
}

.tag-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-right: var(--space-1);
}

.hot-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.hot-tag:hover {
  color: var(--color-slate-700);
  border-color: var(--color-slate-200);
  background: var(--color-slate-50);
  transform: translateY(-1px);
}

/* Hero 统计 */
.db-hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
}

.hero-stat-item {
  text-align: center;
}

.hero-stat-number {
  display: block;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-slate-700);
}

.hero-stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  letter-spacing: 0.5px;
}

.hero-stat-divider {
  width: 1px;
  height: 28px;
  background: var(--color-border);
}

/* ========== 主内容区域 ========== */
.db-content {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.db-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.db-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--space-10);
  box-sizing: border-box;
}

/* ========== Tab 导航 ========== */
.database-tabs {
  margin-top: var(--space-4);
}

.database-tabs :deep(.el-tabs__header) {
  margin-bottom: var(--space-6);
}

.database-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--color-border-light);
}

.database-tabs :deep(.el-tabs__item) {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  transition: all var(--transition-normal);
  padding: 0 var(--space-6);
  height: 48px;
  line-height: 48px;
}

.database-tabs :deep(.el-tabs__item:hover) {
  color: var(--color-slate-700);
}

.database-tabs :deep(.el-tabs__item.is-active) {
  color: var(--color-solid);
  font-weight: var(--font-semibold);
}

.database-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  background: var(--color-solid);
  border-radius: var(--radius-sm);
}

/* ========== 极简标签筛选栏 ========== */
.filter-chips {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-2);
  margin-bottom: var(--space-6);
}

.filter-chips__row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.filter-chips__label {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  min-width: 28px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
  user-select: none;
}

.filter-chip:hover {
  color: var(--color-slate-700);
  border-color: var(--color-slate-200);
  background: var(--color-slate-50);
}

.filter-chip.is-active {
  color: var(--color-text-inverse);
  background: var(--color-solid);
  border-color: transparent;
}

.filter-chip--sort {
  font-size: var(--text-xs);
  padding: 4px 10px;
}

/* 专业搜索 - 紧凑内联输入框 */
.major-search-inline {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px 3px 10px;
  margin-left: auto;
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.major-search-inline:focus-within {
  border-color: var(--color-slate-300);
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.06);
}

.search-mini-icon {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.search-mini-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  width: 100px;
  line-height: 20px;
}

.search-mini-input::placeholder {
  color: var(--color-text-tertiary);
}

/* ========== 视图切换 ========== */
.view-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
}

.view-mode-switch {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: var(--color-background-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.view-mode-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  border-radius: var(--radius-md);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-mode-btn:hover {
  color: var(--color-text-secondary);
  background: var(--color-surface);
}

.view-mode-btn.is-active {
  color: var(--color-text-inverse);
  background: var(--color-solid);
}

.result-count {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

/* ========== 过渡动画 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== 院校卡片网格 ========== */
.schools-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr;
}

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

@media (min-width: 1200px) {
  .schools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1440px) {
  .schools-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ========== 院校卡片 ========== */
.school-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  height: 100%;
  box-sizing: border-box;
}

.school-card__top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-solid);
  transition: height 0.25s ease;
}

.school-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}

.school-card:hover .school-card__top-bar {
  height: 4px;
}

.school-card__body {
  padding: var(--space-5);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.school-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
  gap: var(--space-3);
}

.school-card__title {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  flex: 1;
}

.school-card__rank {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  color: white;
}

.school-card__rank.rank-danger {
  background: var(--color-danger);
}

.school-card__rank.rank-warning {
  background: var(--color-accent);
}

.school-card__rank.rank-success {
  background: var(--color-success);
}

.school-card__rank.rank-info {
  background: var(--color-info);
}

.school-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.meta-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  display: inline-block;
}

.school-card__country {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.school-card__major {
  color: var(--color-slate-700);
  font-weight: var(--font-medium);
  margin: 0 0 var(--space-4);
  font-size: var(--text-base);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.major-icon {
  font-size: 14px;
}

.school-card__stats {
  display: flex;
  gap: var(--space-4);
  margin-top: auto;
  padding: var(--space-3);
  background: var(--color-background-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.stat-block {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-block__label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.stat-block__value {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.stat-block__value.low-rate {
  color: var(--color-danger);
}

.school-card__footer {
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: flex-end;
}

.card-action-btn {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  padding: 6px 16px;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 32px;
}

.card-action-btn:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  transform: translateY(-1px);
}

.card-action-btn.is-added {
  background: var(--color-slate-50);
  border-color: var(--color-success);
  color: var(--color-success);
}

/* ========== 列表视图 ========== */
.schools-list {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.schools-list :deep(.el-table) {
  border-radius: var(--radius-xl);
}

.schools-list :deep(.el-table__row) {
  cursor: pointer;
}

.schools-list :deep(.el-table__row:hover) {
  background-color: var(--color-slate-50);
}

.list-school-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-school-name .name-text {
  font-weight: 500;
  color: var(--color-text-primary);
}

.rank-tag {
  flex-shrink: 0;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  color: white;
}

.rank-tag.rank-danger {
  background: var(--color-danger);
}

.rank-tag.rank-warning {
  background: var(--color-accent);
}

.rank-tag.rank-success {
  background: var(--color-success);
}

.rank-tag.rank-info {
  background: var(--color-info);
}

.table-action-btn {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: 5px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-right: 6px;
}

.table-action-btn:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

.table-action-btn--primary {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  border-color: var(--color-solid);
}

.table-action-btn--primary:hover {
  background: var(--color-solid-hover);
}

.table-action-btn.is-added {
  background: var(--color-slate-50);
  border-color: var(--color-success);
  color: var(--color-success);
}

.low-rate {
  color: var(--color-danger);
  font-weight: 500;
}

/* ========== 分页器 ========== */
.pagination {
  margin-top: var(--space-8);
  display: flex;
  justify-content: center;
  padding: var(--space-4) 0;
}

.pagination :deep(.el-pagination) {
  --el-pagination-button-bg-color: var(--color-surface);
}

/* ========== 空状态 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-8);
  text-align: center;
}

.empty-state-icon {
  font-size: 48px;
  color: var(--color-slate-300);
  margin-bottom: var(--space-6);
}

.empty-state-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  max-width: 320px;
}

/* ========== 专业卡片网格 ========== */
.majors-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .majors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .majors-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .majors-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1440px) {
  .majors-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ========== 专业卡片 ========== */
.major-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
  padding: var(--space-5);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  height: 100%;
  box-sizing: border-box;
}

.major-card__top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-slate-300);
  transition: height 0.25s ease;
}

.major-card.category-engineering .major-card__top-bar {
  background: var(--color-slate-700);
}

.major-card.category-business .major-card__top-bar {
  background: var(--color-success);
}

.major-card.category-social .major-card__top-bar {
  background: var(--color-accent);
}

.major-card.category-science .major-card__top-bar {
  background: var(--color-info);
}

.major-card.category-arts .major-card__top-bar {
  background: var(--color-danger);
}

.major-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}

.major-card:hover .major-card__top-bar {
  height: 4px;
}

.major-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.major-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  height: 24px;
}

.major-checkbox {
  flex-shrink: 0;
}

.major-checkbox :deep(.el-checkbox__label) {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.checkbox-text {
  font-size: var(--text-xs);
}

.category-tag {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

.category-tag.tag-primary {
  background: var(--color-slate-100);
  color: var(--color-slate-700);
}

.category-tag.tag-success {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.category-tag.tag-warning {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

.category-tag.tag-info {
  background: var(--color-info-bg);
  color: var(--color-info);
}

.category-tag.tag-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.major-name {
  margin: 0 0 var(--space-2);
  line-height: var(--leading-tight);
  height: 28px;
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  overflow: hidden;
}

.major-name-cn {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.major-name-en {
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  color: var(--color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
}

.major-degree {
  margin: 0 0 var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.degree-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  display: inline-block;
  flex-shrink: 0;
}

.major-salary {
  margin-top: auto;
  padding: var(--space-3);
  background: var(--color-background-alt);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid var(--color-border-light);
  height: 60px;
  justify-content: center;
}

.salary-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.salary-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-accent);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.major-card__footer {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: flex-end;
  height: 32px;
  align-items: center;
}

.detail-link {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: var(--color-slate-700);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
}

.detail-link:hover {
  color: var(--color-solid);
  transform: translateX(4px);
}

/* ========== 对比操作栏 ========== */
.compare-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  background: var(--color-slate-50);
  border-radius: var(--radius-xl);
  margin-top: var(--space-5);
  border: 1px solid var(--color-slate-100);
  flex-wrap: wrap;
  gap: var(--space-3);
}

.compare-info {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.compare-info strong {
  color: var(--color-slate-700);
}

.compare-btn {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  padding: 8px 18px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.compare-btn:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

.compare-btn--primary {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  border-color: var(--color-solid);
}

.compare-btn--primary:hover {
  background: var(--color-solid-hover);
}

.compare-container {
  overflow-x: auto;
}

.major-compare-table :deep(.el-table__cell) {
  overflow: hidden;
}

.major-compare-table :deep(.el-table__body .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 响应式设计 ========== */

/* 平板及以下 */
@media (max-width: 1199px) {
  .db-container {
    padding: 0 var(--space-6);
  }

  .db-hero {
    padding: var(--space-12) var(--space-6) var(--space-8);
  }

  .db-hero-title {
    font-size: var(--text-3xl);
  }

  .db-hero-stats {
    gap: var(--space-4);
  }
}

/* 大手机 */
@media (max-width: 767px) {
  .db-hero {
    padding: var(--space-10) var(--space-5) var(--space-6);
  }

  .db-container {
    padding: 0 var(--space-5);
  }

  .db-hero-title {
    font-size: var(--text-2xl);
  }

  .db-hero-subtitle {
    font-size: var(--text-base);
  }

  .db-hero-search {
    max-width: 100%;
  }

  .hero-search-action {
    padding: 10px 16px;
    font-size: var(--text-xs);
  }

  .db-hero-stats {
    gap: var(--space-5);
  }

  .hero-stat-number {
    font-size: var(--text-xl);
  }

  .filter-chips {
    padding: var(--space-3) 0;
    gap: var(--space-2);
  }

  .filter-chips__row {
    gap: var(--space-1);
  }

  .filter-chip {
    padding: 4px 10px;
    font-size: var(--text-xs);
  }

  .filter-chips__label {
    display: none;
  }

  .major-search-inline {
    margin-left: 0;
    width: 100%;
  }

  .search-mini-input {
    width: auto;
    flex: 1;
  }

  .view-toggle {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}

/* 小手机 */
@media (max-width: 576px) {
  .db-hero-title {
    font-size: var(--text-xl);
  }

  .db-hero-tags {
    gap: var(--space-1);
  }

  .hot-tag {
    font-size: 11px;
    padding: 0 8px;
  }

  .db-hero-stats {
    flex-direction: column;
    gap: var(--space-3);
  }

  .hero-stat-divider {
    width: 40px;
    height: 1px;
  }

  .pagination :deep(.el-pagination__total) {
    display: none;
  }

  .pagination :deep(.el-pagination__sizes) {
    display: none;
  }

  .pagination :deep(.el-pagination__jump) {
    display: none;
  }

  .compare-bar {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .compare-btn {
    width: 100%;
  }

  .major-compare-table :deep(.el-table__body .cell) {
    white-space: normal !important;
    text-overflow: unset !important;
    overflow: visible !important;
  }

  .major-compare-table :deep(.el-table__cell) {
    overflow: visible !important;
  }
}

@media (max-width: 480px) {
  .major-compare-dialog {
    width: 96% !important;
    max-width: 96% !important;
  }

  .major-compare-table {
    font-size: 13px;
  }

  .major-compare-table :deep(.el-table__header th) {
    font-size: 11px;
  }

  .major-compare-table :deep(.el-table__body td) {
    padding: 6px 4px;
  }
}

@media (max-width: 767px) {
  .major-compare-dialog {
    width: 90% !important;
    max-width: 90% !important;
  }
}

/* Toast 移动端适配 */
@media (max-width: 767px) {
  .toast-notification {
    left: 16px;
    right: 16px;
    transform: none;
  }

  .toast-fade-enter-from {
    transform: translateY(-12px);
  }

  .toast-fade-leave-to {
    transform: translateY(-8px);
  }

  .toast-message {
    white-space: normal;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .db-hero,
  .db-content {
    transition: none;
    opacity: 1;
    transform: none;
  }

  .school-card,
  .major-card {
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .school-card:hover,
  .major-card:hover {
    transform: none;
  }

  .toast-fade-enter-active,
  .toast-fade-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
