import { ref, computed, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { majorsData } from '@/data/majors'
import { schoolsData } from '@/data/schools'

export function useDatabaseState() {
  const router = useRouter()
  const route = useRoute()

  const heroRef = ref(null)
  const contentRef = ref(null)
  const heroTitleRef = ref(null)
  const heroVisible = ref(false)
  const contentVisible = ref(false)
  const searchFocused = ref(false)

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
  const shortlisted = ref<number[]>([])

  const majorSearchKeyword = ref('')
  const filterDegreeType = ref('')
  const filterCategory = ref('')
  const selectedMajors = ref<number[]>([])
  const compareVisible = ref(false)
  const majorsToCompare = ref<{ id: number; name: string }[]>([])
  const compareTableData = ref<Record<string, unknown>[]>([])

  const hotTags = ['计算机科学', '商科', '人工智能', '医学', '工程学', '法学']

  const toastIcons = { success: '✓', error: '✕', warning: '!', info: 'ℹ' }
  const toast = reactive({ visible: false, message: '', type: 'info' })
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function showToast(message: string, type = 'info', duration = 3000) {
    if (toastTimer) clearTimeout(toastTimer)
    toast.message = message
    toast.type = type
    toast.visible = true
    toastTimer = setTimeout(() => { toast.visible = false }, duration)
  }

  const heroWords = ['院校', '数据库']
  const allSchools = ref(schoolsData.map(school => ({ ...school, rankType: getRankType(school.ranking) })))
  const allMajors = ref(majorsData)

  function getRankType(ranking: string) {
    const rankNum = parseInt(ranking.match(/\d+/)?.[0] || '999')
    if (rankNum <= 10) return 'danger'
    if (rankNum <= 20) return 'warning'
    if (rankNum <= 50) return 'success'
    return 'info'
  }

  const uniqueMajors = computed(() => Array.from(new Set(allSchools.value.map(s => s.major))))
  const uniqueCountries = computed(() => Array.from(new Set(allSchools.value.map(s => s.country))).sort())
  const uniqueCategories = computed(() => Array.from(new Set(allMajors.value.map(m => m.category))))

  const heroStats = computed(() => [
    { value: allSchools.value.length + '+', label: '院校数据' },
    { value: uniqueCountries.value.length, label: '覆盖国家' },
    { value: uniqueMajors.value.length, label: '热门专业' },
  ])

  const totalMajors = computed(() => {
    let result = allMajors.value
    if (majorSearchKeyword.value) {
      const kw = majorSearchKeyword.value.toLowerCase()
      result = result.filter(m => m.name.toLowerCase().includes(kw) || m.category.toLowerCase().includes(kw) || m.career.toLowerCase().includes(kw))
    }
    if (filterDegreeType.value) result = result.filter(m => m.degreeType.includes(filterDegreeType.value))
    if (filterCategory.value) result = result.filter(m => m.category === filterCategory.value)
    return result
  })

  const filteredMajors = computed(() => {
    const start = (currentMajorPage.value - 1) * majorPageSize.value
    return totalMajors.value.slice(start, start + majorPageSize.value)
  })

  function getCategoryTagClass(category: string) {
    return { '工科': 'primary', '商科': 'success', '社科': 'warning', '理科': 'info', '文科': 'danger' }[category] || 'info'
  }

  function getCategoryClass(category: string) {
    return { '工科': 'engineering', '商科': 'business', '社科': 'social', '理科': 'science', '文科': 'arts' }[category] || 'default'
  }

  function getRankNumber(ranking: string) {
    return parseInt(ranking.match(/(\d+)/)?.[1] || '999') || 999
  }

  function parseMajorName(name: string) {
    const match = name.match(/^(.+?)\s*\((.+)\)$/)
    return match ? { chinese: match[1], english: match[2] } : { chinese: name, english: '' }
  }

  function formatMajorSalary(range: string) {
    const domestic = range.match(/(¥[\dK\-]+\/[^\s$]+)/)
    return domestic ? domestic[1].trim() : range.split(/\s/)[0]
  }

  function formatDuration(duration: string) {
    return duration.replace(/本科|硕士|博士|本科\/硕士|硕士\/博士/g, '')
  }

  const totalSchools = computed(() => {
    let result = allSchools.value
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(kw) || s.major.toLowerCase().includes(kw))
    }
    if (filterCountry.value) result = result.filter(s => s.country === filterCountry.value)
    if (filterMajor.value) result = result.filter(s => s.major === filterMajor.value)
    if (filterRankRange.value) {
      result = result.filter(s => {
        const rn = getRankNumber(s.ranking)
        return { top10: rn <= 10, top20: rn <= 20, top50: rn <= 50, top100: rn <= 100 }[filterRankRange.value] ?? true
      })
    }
    if (sortBy.value) {
      result = [...result].sort((a, b) => {
        if (sortBy.value === 'qs_rank') return getRankNumber(a.ranking) - getRankNumber(b.ranking)
        if (sortBy.value === 'acceptance_rate') return parseFloat(a.acceptanceRate) - parseFloat(b.acceptanceRate)
        if (sortBy.value === 'tuition') return a.tuition.localeCompare(b.tuition)
        return 0
      })
    }
    return result
  })

  const filteredSchools = computed(() => {
    const start = (currentSchoolPage.value - 1) * schoolPageSize.value
    return totalSchools.value.slice(start, start + schoolPageSize.value)
  })

  function handleHeroSearch() {
    searchKeyword.value = heroSearchKeyword.value
    activeTab.value = 'schools'
    currentSchoolPage.value = 1
    showToast(`找到 ${totalSchools.value.length} 所学校`, 'success')
  }

  function searchByTag(tag: string) {
    heroSearchKeyword.value = tag
    searchKeyword.value = tag
    activeTab.value = 'schools'
    currentSchoolPage.value = 1
    showToast(`按「${tag}」搜索，找到 ${totalSchools.value.length} 所学校`, 'success')
  }

  function toggleRankFilter(val: string) { filterRankRange.value = filterRankRange.value === val ? '' : val }

  function clearSelection() { selectedMajors.value = []; showToast('已清空选择', 'info') }

  function showCompare() {
    majorsToCompare.value = allMajors.value.filter(m => selectedMajors.value.includes(m.id))
    buildCompareTableData()
    compareVisible.value = true
  }

  function buildCompareTableData() {
    const majors = majorsToCompare.value
    if (!majors.length) return
    interface MajorField { field: string; key: string; format?: (v: unknown) => string }
    const fields: MajorField[] = [
      { field: '专业名称', key: 'name' },
      { field: '专业类别', key: 'category' },
      { field: '学位类型', key: 'degreeType' },
      { field: '学制', key: 'duration' },
      { field: '核心课程', key: 'courses', format: (v) => Array.isArray(v) ? v.slice(0, 4).join('、') : '-' },
      { field: '就业方向', key: 'career', format: (v) => String(v || '-') },
      { field: '平均薪资', key: 'salaryRange' },
    ]
    compareTableData.value = fields.map(f => {
      const row: Record<string, unknown> = { field: f.field }
      majors.forEach(m => { row['major_' + m.id] = f.format ? f.format((m as Record<string, unknown>)[f.key]) : (m as Record<string, unknown>)[f.key] })
      return row
    })
  }

  function showDetail(school: { id?: number }) { router.push('/school-detail/' + (school.id ?? 0) + '?from=database') }
  function goToMajorDetail(major: { id: number }) { router.push(`/major-detail/${major.id}`) }

  function addToShortlist(school: { id?: number; name?: string }) {
    if (school.id == null) return
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

  function handleSchoolSizeChange(val: number | string) { schoolPageSize.value = Number(val); currentSchoolPage.value = 1 }
  function handleSchoolPageChange(val: number | string) { currentSchoolPage.value = Number(val) }
  function handleMajorSizeChange(val: number | string) { majorPageSize.value = Number(val); currentMajorPage.value = 1 }
  function handleMajorPageChange(val: number | string) { currentMajorPage.value = Number(val) }

  watch(activeTab, () => {
    if (activeTab.value === 'schools') currentSchoolPage.value = 1
    else currentMajorPage.value = 1
  })

  function onCardHover(e: MouseEvent, entering: boolean) {
    const card = e.currentTarget as HTMLElement
    if (entering) {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      card.style.setProperty('--mx', `${x * 0.06}deg`)
      card.style.setProperty('--my', `${-y * 0.06}deg`)
    } else {
      card.style.setProperty('--mx', '0deg')
      card.style.setProperty('--my', '0deg')
    }
  }

  function onMajorHover(e: MouseEvent, entering: boolean) {
    const card = e.currentTarget as HTMLElement
    if (entering) {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      card.style.setProperty('--mx', `${x * 0.05}deg`)
      card.style.setProperty('--my', `${-y * 0.05}deg`)
    } else {
      card.style.setProperty('--mx', '0deg')
      card.style.setProperty('--my', '0deg')
    }
  }

  function initFromStorage() {
    const saved = localStorage.getItem('school_favorites')
    if (saved) shortlisted.value = JSON.parse(saved)
    if (route.query.tab === 'majors') activeTab.value = 'majors'
  }

  return {
    refs: { heroRef, contentRef, heroTitleRef },
    visibility: { heroVisible, contentVisible, searchFocused },
    tabs: { activeTab, viewMode },
    search: { heroSearchKeyword, searchKeyword, filterCountry, filterRankRange, filterMajor, sortBy },
    pagination: { currentSchoolPage, schoolPageSize, currentMajorPage, majorPageSize },
    favorites: { shortlisted },
    majors: { majorSearchKeyword, filterDegreeType, filterCategory, selectedMajors, compareVisible, majorsToCompare, compareTableData },
    ui: { hotTags, toastIcons, toast, heroWords, heroStats },
    data: { allSchools, allMajors, uniqueMajors, uniqueCountries, uniqueCategories, totalMajors, filteredMajors, totalSchools, filteredSchools },
    actions: {
      showToast, getRankType, getCategoryTagClass, getCategoryClass,
      getRankNumber, parseMajorName, formatMajorSalary, formatDuration,
      handleHeroSearch, searchByTag, toggleRankFilter, clearSelection,
      showCompare, buildCompareTableData, showDetail, goToMajorDetail,
      addToShortlist, handleSchoolSizeChange, handleSchoolPageChange,
      handleMajorSizeChange, handleMajorPageChange, onCardHover, onMajorHover,
      initFromStorage
    }
  }
}
