<template>
  <div class="university-database-page">
    <!-- Hero 搜索区域 -->
    <section
      ref="heroRef"
      class="db-hero"
      :class="{ 'is-visible': heroVisible }"
    >
      <!-- 渐变叠加层 -->
      <div class="db-hero-gradient" />

      <!-- 光晕装饰 -->
      <div class="db-hero-glow" />

      <div class="db-hero-content">
        <h1 class="db-hero-title">
          院校数据库
        </h1>
        <p class="db-hero-subtitle">
          探索全球顶尖院校，找到最适合你的留学目标
        </p>

        <!-- Hero 搜索框 -->
        <div class="db-hero-search">
          <el-input
            v-model="heroSearchKeyword"
            placeholder="搜索院校名称、专业或国家..."
            size="large"
            clearable
            class="hero-search-input"
            @keyup.enter="handleHeroSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #suffix>
              <div
                class="hero-search-suffix"
                @click="handleHeroSearch"
              >
                搜索
                <el-icon class="search-arrow-icon"><ArrowRight /></el-icon>
              </div>
            </template>
          </el-input>
        </div>

        <!-- 热门搜索标签 -->
        <div class="db-hero-tags">
          <span class="tag-label">热门搜索：</span>
          <el-tag
            v-for="tag in hotTags"
            :key="tag"
            class="hot-tag"
            effect="plain"
            round
            @click="searchByTag(tag)"
          >
            {{ tag }}
          </el-tag>
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
                      <el-tag
                        :type="school.rankType"
                        size="small"
                        class="school-card__rank"
                      >
                        {{ school.ranking }}
                      </el-tag>
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
                    <el-button
                      type="primary"
                      size="small"
                      plain
                      class="card-action-btn"
                      @click.stop="addToShortlist(school)"
                    >
                      {{ shortlisted.includes(school.id) ? '✓ 已在清单' : '+ 加入清单' }}
                    </el-button>
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
                        <el-tag
                          :type="scope.row.rankType"
                          size="small"
                          class="rank-tag"
                        >
                          {{ scope.row.ranking }}
                        </el-tag>
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
                      <el-button
                        type="primary"
                        size="small"
                        plain
                        @click.stop="addToShortlist(scope.row)"
                      >
                        {{ shortlisted.includes(scope.row.id) ? '已加入' : '加入清单' }}
                      </el-button>
                      <el-button
                        size="small"
                        @click.stop="showDetail(scope.row)"
                      >
                        详情
                      </el-button>
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

            <el-empty
              v-else
              description="暂无匹配的院校数据"
            />
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
                  <el-icon class="search-mini-icon"><Search /></el-icon>
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
                    <el-tag
                      :type="getCategoryTagType(major.category)"
                      size="small"
                      class="category-tag"
                    >
                      {{ major.category }}
                    </el-tag>
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
                  <el-button
                    type="primary"
                    size="small"
                    text
                    class="detail-link"
                    @click.stop="goToMajorDetail(major)"
                  >
                    查看详情 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
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

            <el-empty
              v-else
              description="暂无匹配的专业数据"
            />

            <!-- 对比操作栏 -->
            <div
              v-if="selectedMajors.length > 0"
              class="compare-bar"
            >
              <div class="compare-info">
                已选择 <strong>{{ selectedMajors.length }}</strong> 个专业进行对比
              </div>
              <el-button
                type="primary"
                @click="showCompare"
              >
                开始对比
              </el-button>
              <el-button @click="clearSelection">
                清空选择
              </el-button>
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

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      :title="currentSchool?.name"
      width="70%"
      class="school-detail-dialog"
    >
      <div
        v-if="currentSchool"
        class="school-detail"
      >
        <div class="detail-header">
          <img
            v-if="currentSchool.image"
            :src="currentSchool.image"
            class="school-image"
          >
          <div class="detail-title">
            <h2>{{ currentSchool.name }}</h2>
            <p class="detail-subtitle">
              {{ currentSchool.country }} | {{ currentSchool.ranking }}
            </p>
          </div>
        </div>

        <el-descriptions
          :column="2"
          border
        >
          <el-descriptions-item label="国家">
            {{ currentSchool.country }}
          </el-descriptions-item>
          <el-descriptions-item label="排名">
            <span>{{ currentSchool.ranking }}</span>
            <sup
              v-if="currentSchool.sources?.ranking"
              class="source-sup"
              @click.stop="openSource(currentSchool.sources.ranking.url)"
            >[{{ currentSchool.sources.ranking.label }}]</sup>
          </el-descriptions-item>
          <el-descriptions-item label="热门专业">
            {{ currentSchool.major }}
          </el-descriptions-item>
          <el-descriptions-item label="学费">
            <span>{{ currentSchool.tuition }}</span>
            <sup
              v-if="currentSchool.sources?.tuition"
              class="source-sup"
              @click.stop="openSource(currentSchool.sources.tuition.url)"
            >[{{ currentSchool.sources.tuition.label }}]</sup>
          </el-descriptions-item>
          <el-descriptions-item label="录取率">
            <span>{{ currentSchool.acceptanceRate }}</span>
            <sup
              v-if="currentSchool.sources?.accept"
              class="source-sup"
              @click.stop="openSource(currentSchool.sources.accept.url)"
            >[{{ currentSchool.sources.accept.label }}]</sup>
          </el-descriptions-item>
          <el-descriptions-item label="学校类型">
            {{ currentSchool.type || '综合大学' }}
          </el-descriptions-item>
          <el-descriptions-item label="学生人数">
            {{ currentSchool.students || 'N/A' }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="description-section">
          <h4>学校简介</h4>
          <p>{{ currentSchool.description || '暂无简介信息' }}</p>
        </div>

        <div class="requirements-section">
          <h4>
            申请要求
            <sup
              v-if="currentSchool.sources?.requirements"
              class="source-sup"
              @click.stop="openSource(currentSchool.sources.requirements.url)"
            >[{{ currentSchool.sources.requirements.label }}]</sup>
          </h4>
          <ul>
            <li
              v-for="(req, idx) in currentSchool.requirements"
              :key="idx"
            >
              {{ req }}
            </li>
          </ul>
        </div>

        <div class="detail-actions">
          <el-button
            type="primary"
            @click="addToShortlist(currentSchool)"
          >
            {{ shortlisted.includes(currentSchool.id) ? '已在清单中' : '加入选校清单' }}
          </el-button>
          <el-button
            type="success"
            plain
            @click="goToApply(currentSchool)"
          >
            开始申请
          </el-button>
          <el-button
            type="info"
            plain
            @click="visitWebsite(currentSchool.website)"
          >
            访问官网
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, List, Grid, ArrowRight } from '@element-plus/icons-vue'
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
const detailVisible = ref(false)
const currentSchool = ref(null)
const shortlisted = ref([])

const majorSearchKeyword = ref('')
const filterDegreeType = ref('')
const filterCategory = ref('')
const selectedMajors = ref([])
const compareVisible = ref(false)
const majorsToCompare = ref([])
const compareTableData = ref([])

const hotTags = ['计算机科学', '商科', '人工智能', '医学', '工程学', '法学']

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
  ElMessage.success(`找到 ${totalSchools.value.length} 所学校`)
}

const searchByTag = (tag) => {
  heroSearchKeyword.value = tag
  searchKeyword.value = tag
  activeTab.value = 'schools'
  currentSchoolPage.value = 1
  ElMessage.success(`按「${tag}」搜索，找到 ${totalSchools.value.length} 所学校`)
}

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

const toggleRankFilter = (val) => {
  filterRankRange.value = filterRankRange.value === val ? '' : val
}

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
  const idx = shortlisted.value.indexOf(school.id)
  if (idx > -1) {
    shortlisted.value.splice(idx, 1)
    localStorage.setItem('school_favorites', JSON.stringify(shortlisted.value))
    ElMessage.success(`已将 ${school.name} 从选校清单移除`)
  } else {
    shortlisted.value.push(school.id)
    localStorage.setItem('school_favorites', JSON.stringify(shortlisted.value))
    ElMessage.success(`已将 ${school.name} 加入选校清单`)
  }
}

const goToApply = (_school) => {
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
})
</script>

<style scoped>
/* ========== 页面根容器 ========== */
.university-database-page {
  padding-bottom: 40px;
  min-height: 100vh;
  background: var(--color-background);
}

/* ========== Hero 搜索区域 ========== */
.db-hero {
  position: relative;
  overflow: hidden;
  padding: var(--space-16) var(--space-10) var(--space-12);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.db-hero.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.db-hero-gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(30, 58, 95, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(30, 58, 95, 0.03) 1px, transparent 1px),
    radial-gradient(ellipse at 25% 50%, rgba(30, 58, 95, 0.05) 0%, transparent 55%),
    radial-gradient(ellipse at 75% 50%, rgba(184, 134, 11, 0.04) 0%, transparent 55%),
    linear-gradient(180deg, var(--color-background-warm) 0%, var(--color-surface) 100%);
  background-size: 80px 80px, 80px 80px, 100% 100%, 100% 100%, 100% 100%;
}

.db-hero-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.db-hero-glow::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  top: -150px;
  left: -80px;
  background: radial-gradient(circle, rgba(184, 134, 11, 0.07) 0%, transparent 70%);
  animation: glow-pulse 10s ease-in-out infinite;
  pointer-events: none;
}

.db-hero-glow::after {
  content: '';
  position: absolute;
  width: 350px;
  height: 350px;
  bottom: -80px;
  right: -40px;
  background: radial-gradient(circle, rgba(30, 58, 95, 0.06) 0%, transparent 70%);
  animation: glow-pulse 12s ease-in-out infinite reverse;
  pointer-events: none;
}

.db-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.db-hero-title {
  font-family: var(--font-family-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
  line-height: var(--leading-tight);
  position: relative;
  display: inline-block;
}

.db-hero-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: var(--gradient-primary);
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-sm);
}

.db-hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-8);
  line-height: var(--leading-relaxed);
}

/* Hero 搜索框 */
.db-hero-search {
  max-width: 600px;
  margin: 0 auto var(--space-6);
}

.hero-search-input :deep(.el-input__wrapper) {
  padding: 8px 8px 8px 16px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md), 0 0 0 1px var(--color-border-light);
  transition: all var(--transition-normal);
}

.hero-search-input :deep(.el-input__wrapper:hover) {
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--color-primary-200);
}

.hero-search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: var(--shadow-lg), 0 0 0 3px rgba(30, 58, 95, 0.1), var(--shadow-glow-primary);
  border-color: var(--color-primary);
}

.hero-search-input :deep(.el-input__inner) {
  font-size: var(--text-base);
}

.hero-search-suffix {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 14px;
  background: var(--gradient-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
  margin-right: -4px;
}

.hero-search-suffix:hover {
  transform: translateX(2px);
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
}

.search-arrow-icon {
  font-size: 12px;
  transition: transform var(--transition-fast);
}

.hero-search-suffix:hover .search-arrow-icon {
  transform: translateX(2px);
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
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--text-xs);
}

.hot-tag:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-primary-50);
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
  color: var(--color-primary);
  font-family: var(--font-family-display);
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
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.db-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.db-container {
  max-width: 1400px;
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
  color: var(--color-primary);
}

.database-tabs :deep(.el-tabs__item.is-active) {
  color: var(--color-primary);
  font-weight: var(--font-semibold);
}

.database-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  background: var(--gradient-primary);
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
  color: var(--color-primary);
  border-color: var(--color-primary-200);
  background: var(--color-primary-50);
}

.filter-chip.is-active {
  color: #fff;
  background: var(--gradient-primary);
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.2);
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
  border-color: var(--color-primary-300);
  box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.08);
}

.search-mini-icon {
  color: var(--color-text-tertiary);
  font-size: 13px;
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
  background: var(--color-background);
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
  color: #fff;
  background: var(--gradient-primary);
  box-shadow: 0 1px 4px rgba(30, 58, 95, 0.15);
}

.result-count {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

/* ========== 过渡动画 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ========== 院校卡片 - 学术优雅风格 ========== */
.school-card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  transform-style: preserve-3d;
  height: 100%;
  box-sizing: border-box;
}

.school-card__top-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--gradient-primary);
  transition: height 0.3s ease;
}

.school-card:hover {
  transform: translateY(-8px) rotateX(2deg);
  box-shadow: 0 25px 50px -12px rgba(30, 58, 95, 0.15), 0 0 0 1px rgba(30, 58, 95, 0.05);
  border-color: var(--color-primary-200);
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
  font-family: var(--font-family-display);
  line-height: var(--leading-tight);
  flex: 1;
}

.school-card__rank {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  border: none;
  flex-shrink: 0;
}

.school-card__rank.el-tag--danger {
  background: linear-gradient(135deg, var(--color-danger) 0%, #ef5350 100%);
  color: white;
}

.school-card__rank.el-tag--warning {
  background: linear-gradient(135deg, var(--color-warning) 0%, #ffb74d 100%);
  color: white;
}

.school-card__rank.el-tag--success {
  background: linear-gradient(135deg, var(--color-success) 0%, #66bb6a 100%);
  color: white;
}

.school-card__rank.el-tag--info {
  background: linear-gradient(135deg, var(--color-info) 0%, #64b5f6 100%);
  color: white;
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
  color: var(--color-primary);
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
  background: linear-gradient(135deg, var(--color-background-warm) 0%, var(--color-primary-50) 100%);
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
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.card-action-btn:hover {
  transform: translateY(-2px);
}

/* ========== 列表视图 ========== */
.schools-list {
  background: #fff;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.schools-list :deep(.el-table) {
  border-radius: var(--radius-xl);
}

.schools-list :deep(.el-table__row) {
  cursor: pointer;
}

.schools-list :deep(.el-table__row:hover) {
  background-color: var(--color-primary-50);
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

.list-school-name .rank-tag {
  flex-shrink: 0;
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
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ========== 专业卡片 ========== */
.major-card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border-light);
  padding: var(--space-5);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  transform-style: preserve-3d;
  height: 100%;
  box-sizing: border-box;
}

.major-card__top-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--color-primary-300);
  transition: height 0.3s ease;
}

.major-card.category-engineering .major-card__top-bar {
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
}

.major-card.category-business .major-card__top-bar {
  background: linear-gradient(90deg, var(--color-success) 0%, #66bb6a 100%);
}

.major-card.category-social .major-card__top-bar {
  background: linear-gradient(90deg, var(--color-warning) 0%, #ffb74d 100%);
}

.major-card.category-science .major-card__top-bar {
  background: linear-gradient(90deg, var(--color-info) 0%, #64b5f6 100%);
}

.major-card.category-arts .major-card__top-bar {
  background: linear-gradient(90deg, var(--color-danger) 0%, #ef5350 100%);
}

.major-card:hover {
  transform: translateY(-8px) rotateX(2deg);
  box-shadow: 0 25px 50px -12px rgba(30, 58, 95, 0.15), 0 0 0 1px rgba(30, 58, 95, 0.05);
  border-color: var(--color-primary-200);
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
  border: none;
}

.category-tag.el-tag--primary {
  background: var(--color-primary-50);
  color: var(--color-primary);
}

.category-tag.el-tag--success {
  background: #e8f5e9;
  color: var(--color-success);
}

.category-tag.el-tag--warning {
  background: #fff3e0;
  color: var(--color-warning);
}

.category-tag.el-tag--info {
  background: #e3f2fd;
  color: var(--color-info);
}

.category-tag.el-tag--danger {
  background: #ffebee;
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
  font-family: var(--font-family-display);
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
  background: linear-gradient(135deg, var(--color-background-warm) 0%, var(--color-primary-50) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid var(--color-border-light);
  position: relative;
  overflow: hidden;
  height: 60px;
  justify-content: center;
}

.major-salary::before {
  content: '💰';
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.08;
  font-size: 36px;
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
  color: var(--color-primary);
  transition: all var(--transition-normal);
}

.detail-link:hover {
  color: var(--color-primary-light);
  transform: translateX(4px);
}

.major-card:hover .detail-link .el-icon {
  transform: translateX(4px);
}

/* ========== 详情对话框 ========== */
.school-detail {
  padding: var(--space-5);
}

.detail-header {
  display: flex;
  gap: var(--space-5);
  padding: var(--space-5);
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-background-warm) 100%);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-6);
}

.school-image {
  width: 160px;
  height: 110px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.detail-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detail-title h2 {
  margin: 0 0 var(--space-2);
  font-family: var(--font-family-display);
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
}

.detail-subtitle {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: var(--text-base);
}

.description-section,
.requirements-section {
  padding: var(--space-5);
  margin-top: var(--space-5);
  background: var(--color-background);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
}

.description-section h4,
.requirements-section h4 {
  margin-bottom: var(--space-3);
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.requirements-section ul {
  padding-left: var(--space-6);
  list-style: square;
}

.requirements-section li {
  margin-bottom: var(--space-2);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.detail-actions {
  margin-top: var(--space-6);
  padding: var(--space-5);
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  background: var(--color-background);
  border-radius: var(--radius-xl);
}

.source-sup {
  color: var(--color-info);
  cursor: pointer;
  font-size: 10px;
  margin-left: 2px;
  font-weight: normal;
}

.source-sup:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

/* ========== 对比操作栏 ========== */
.compare-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  background: var(--color-primary-50);
  border-radius: var(--radius-xl);
  margin-top: var(--space-5);
  border: 1px solid var(--color-primary-100);
  flex-wrap: wrap;
  gap: var(--space-3);
}

.compare-info {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.compare-info strong {
  color: var(--color-primary);
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

/* 平板端 */
@media (max-width: 992px) {
  .db-hero {
    padding: var(--space-12) var(--space-6) var(--space-8);
  }

  .db-container {
    padding: 0 var(--space-6);
  }

  .db-hero-title {
    font-size: var(--text-3xl);
  }

  .db-hero-stats {
    gap: var(--space-4);
  }
}

/* 大手机 */
@media (max-width: 768px) {
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

/* 手机 */
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

  .detail-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .detail-title {
    align-items: center;
  }

  .detail-actions {
    flex-direction: column;
  }

  .detail-actions .el-button {
    width: 100%;
  }

  .compare-bar {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .compare-bar .el-button {
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

@media (max-width: 768px) {
  .major-compare-dialog {
    width: 90% !important;
    max-width: 90% !important;
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

  .db-hero-glow::before,
  .db-hero-glow::after {
    animation: none;
  }
}
</style>
