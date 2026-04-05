<template>
  <div class="md-page">
    <div class="md-noise" />

    <div v-if="loading" class="md-loading">
      <div class="md-loading__spinner" />
      <span>加载专业信息中...</span>
    </div>

    <template v-else-if="major">
      <!-- ===== HERO: 专业档案头部 ===== -->
      <header
        ref="heroRef"
        class="md-hero"
        :class="{ 'md-hero--visible': heroVisible }"
      >
        <div class="md-hero__grid-bg" />
        <div class="md-hero__accent-bar" :class="'md-hero__accent-bar--' + categoryClass" />

        <div class="md-hero__inner">
          <!-- 返回导航 -->
          <nav class="md-breadcrumb">
            <button class="md-back" @click="goBack">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>返回</span>
            </button>
            <span class="md-breadcrumb__sep">/</span>
            <span class="md-breadcrumb__text">材料中心</span>
            <span class="md-breadcrumb__sep">/</span>
            <span class="md-breadcrumb__current">专业详情</span>
          </nav>

          <!-- 类别标签 -->
          <div class="md-hero__meta-row">
            <span
              class="md-cat"
              :class="'md-cat--' + categoryTagClass"
            >{{ major.category }}</span>
            <span class="md-meta-dot" />
            <span class="md-meta">{{ major.degreeType }}</span>
            <span class="md-meta-dot" />
            <span class="md-meta">{{ major.duration }}</span>
          </div>

          <!-- 专业名称 — 超大展示字体 -->
          <h1 ref="titleRef" class="md-title">
            <span
              v-for="(word, i) in titleWords"
              :key="i"
              class="md-title__word"
              :style="{ '--tw': i }"
            >
              <span class="md-title__inner">{{ word }}</span>
            </span>
          </h1>

          <!-- 英文名 -->
          <p v-if="englishName" class="md-subtitle">{{ englishName }}</p>

          <!-- 描述 -->
          <p class="md-desc">{{ major.description }}</p>
        </div>
      </header>

      <!-- ===== 主体：编辑式内容网格 ===== -->
      <main
        ref="contentRef"
        class="md-body"
        :class="{ 'md-body--visible': contentVisible }"
      >
        <div class="md-container">

          <!-- ===== 薪资数据 — Wow Moment ===== -->
          <section class="md-section md-section--salary">
            <div class="md-salary-block">
              <div class="md-salary__label-row">
                <span class="md-salary__label">AVERAGE SALARY</span>
                <span class="md-salary__source-link" @click="openSource(salarySource)">
                  {{ salarySource?.label }} →
                </span>
              </div>
              <div class="md-salary__numbers">
                <div class="md-salary__item">
                  <span class="md-salary__region">CN</span>
                  <span class="md-salary__val">{{ cnSalary }}<sup v-if="mdRefIndex('salary')" class="md-ref" @click.stop="openSource(major.sources.salary)">{{ mdRefIndex('salary') }}</sup></span>
                  <span class="md-salary__unit">/月</span>
                </div>
                <div class="md-salary__divider" />
                <div class="md-salary__item">
                  <span class="md-salary__region">US</span>
                  <span class="md-salary__val">{{ usSalary }}<sup v-if="mdRefIndex('salary')" class="md-ref" @click.stop="openSource(major.sources.salary)">{{ mdRefIndex('salary') }}</sup></span>
                  <span class="md-salary__unit">/年</span>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== 双栏编辑区 ===== -->
          <div class="md-grid">

            <!-- 左栏: 核心课程 -->
            <section class="md-section md-section--courses">
              <header class="md-sec-head">
                <span class="md-sec-num">01</span>
                <h2 class="md-sec-title">核心课程</h2>
              </header>
              <div class="md-courses">
                <div
                  v-for="(course, i) in major.courses"
                  :key="course"
                  class="md-course"
                  :style="{ '--ci': i }"
                >
                  <span class="md-course__idx">{{ String(i + 1).padStart(2, '0') }}</span>
                  <span class="md-course__name">{{ course }}</span>
                </div>
              </div>
            </section>

            <!-- 右栏: 就业方向 -->
            <section class="md-section md-section--career">
              <header class="md-sec-head">
                <span class="md-sec-num">02</span>
                <h2 class="md-sec-title">就业方向</h2>
              </header>
              <div class="md-careers">
                <div
                  v-for="(job, i) in careerList"
                  :key="job"
                  class="md-career"
                  :style="{ '--ci': i }"
                >
                  <span class="md-career__dot" />
                  <span class="md-career__name">{{ job }}</span>
                </div>
              </div>
            </section>

          </div>

          <!-- ===== 推荐院校 ===== -->
          <section class="md-section md-section--schools">
            <header class="md-sec-head">
              <span class="md-sec-num">03</span>
              <h2 class="md-sec-title">推荐院校</h2>
              <span class="md-sec-sub">开设此专业的顶尖院校</span>
            </header>
            <div class="md-schools">
              <div
                v-for="(school, idx) in recommendedSchools"
                :key="school.id"
                class="md-school"
                :style="{ '--si': idx }"
                @click="viewSchoolDetail(school)"
              >
                <div class="md-school__rank" :class="'md-school__rank--' + getRankType(school.ranking)">
                  {{ school.ranking }}
                </div>
                <div class="md-school__info">
                  <span class="md-school__name">{{ school.name }}</span>
                  <span class="md-school__loc">{{ school.country }}</span>
                </div>
                <svg class="md-school__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </section>

          <!-- ===== 数据来源 ===== -->
          <section class="md-section md-section--sources">
            <header class="md-sec-head">
              <span class="md-sec-num">04</span>
              <h2 class="md-sec-title">数据来源</h2>
            </header>
            <ol v-if="mdRefList.length > 0" class="md-ref-list">
              <li
                v-for="ref in mdRefList"
                :key="ref.key"
                class="md-ref-item"
              >
                <span
                  class="md-ref-item__num"
                  @click.stop="openSource(ref)"
                >[{{ ref.index }}]</span>
                <a :href="ref.url" target="_blank" rel="noopener noreferrer" class="md-ref-item__link">{{ ref.label }}</a>
                <span class="md-ref-item__arrow">↗</span>
              </li>
            </ol>
          </section>

          <!-- ===== 底部操作栏 ===== -->
          <footer class="md-actions">
            <button class="md-btn md-btn--ghost" @click="goBack">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              返回材料中心
            </button>
            <button class="md-btn md-btn--primary" @click="startAIChat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8C14 11.31 11.31 14 8 14C6.58 14 5.27 13.51 4.23 12.69L2 13L2.75 10.77C1.93 9.73 1.44 8.42 1.44 7C1.44 3.69 4.13 1 7.44 1C10.75 1 14 3.69 14 7V8Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="7" r="0.8" fill="currentColor"/><circle cx="10" cy="7" r="0.8" fill="currentColor"/></svg>
              AI 深度解析
            </button>
          </footer>

        </div>
      </main>
    </template>

    <div v-else class="md-error">
      <div class="md-error__icon">404</div>
      <div class="md-error__title">专业未找到</div>
      <div class="md-error__desc">该专业可能已被移除或 ID 无效</div>
      <button class="md-btn md-btn--primary" @click="router.push('/materials')">返回材料中心</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { majorsData } from '@/data/majors'
import { schoolsData } from '@/utils/recommendationEngine'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const major = ref(null)
const heroVisible = ref(false)
const contentVisible = ref(false)
const heroRef = ref(null)
const contentRef = ref(null)
const titleRef = ref(null)

let heroObserver = null
let contentObserver = null

const titleWords = computed(() => {
  if (!major.value?.name) return []
  const match = major.value.name.match(/^(.+?)\s*\((.+)\)$/)
  return match ? [match[1]] : major.value.name.split(/\s+/).filter(Boolean)
})

const englishName = computed(() => {
  if (!major.value?.name) return ''
  const match = major.value.name.match(/\((.+)\)$/)
  return match ? match[1] : ''
})

const categoryClass = computed(() => {
  if (!major.value?.category) return 'default'
  return { '工科': 'engineering', '商科': 'business', '社科': 'social', '理科': 'science', '文科': 'arts' }[major.value.category] || 'default'
})

const categoryTagClass = computed(() => {
  if (!major.value?.category) return 'info'
  return { '工科': 'primary', '商科': 'success', '社科': 'warning', '理科': 'info', '文科': 'danger' }[major.value.category] || 'info'
})

const careerList = computed(() => {
  if (!major.value?.career) return []
  return major.value.career.split('、').filter(Boolean)
})

const cnSalary = computed(() => {
  if (!major.value?.salaryRange) return ''
  const m = major.value.salaryRange.match(/¥([\dK\-]+)/)
  return m ? m[1] : ''
})

const usSalary = computed(() => {
  if (!major.value?.salaryRange) return ''
  const m = major.value.salaryRange.match(/\$([\dK\-]+)/)
  return m ? m[1] : ''
})

const salarySource = computed(() => major.value?.sources?.salary)

const sourceList = computed(() => {
  if (!major.value?.sources) return []
  return Object.values(major.value.sources).filter(s => s && s.url && s.label)
})

const recommendedSchools = computed(() => {
  if (!major.value?.name) return []
  const majorName = englishName.value || titleWords.value[0]
  if (!majorName) return []

  return schoolsData
    .map(school => ({ ...school, rankType: getRankType(school.ranking) }))
    .filter(school => {
      if (school.major === majorName) return true
      const majorLower = majorName.toLowerCase()
      const schoolMajorLower = (school.major || '').toLowerCase()
      if (schoolMajorLower.includes(majorLower) || majorLower.includes(schoolMajorLower)) return true
      return false
    })
    .slice(0, 6)
})

function getRankType(ranking) {
  const rankNum = parseInt(ranking.match(/\d+/)?.[0] || '999')
  if (rankNum <= 10) return 'danger'
  if (rankNum <= 20) return 'warning'
  if (rankNum <= 50) return 'success'
  return 'info'
}

function goBack() {
  router.push('/materials')
}

function viewSchoolDetail(school) {
  router.push(`/school-detail/${school.id}?from=major-detail`)
}

function openSource(source) {
  if (source?.url) window.open(source.url, '_blank', 'noopener,noreferrer')
}

/* ===== 引用系统 ===== */
const mdRefList = computed(() => {
  const srcs = major.value?.sources
  if (!srcs) return []
  return Object.entries(srcs)
    .filter(([, v]) => v?.url && v?.label)
    .map(([key, val], idx) => ({ ...val, index: idx + 1, key }))
})

function mdRefIndex(key) {
  const srcs = major.value?.sources
  if (!srcs || !srcs[key]) return null
  const keys = Object.keys(srcs).filter(k => srcs[k]?.url && srcs[k]?.label)
  return keys.indexOf(key) + 1 || null
}

function startAIChat() {
  const majorName = major.value?.name || ''
  router.push({
    path: '/ai-chat',
    query: { message: `请详细介绍${majorName}这个专业的学习内容、就业前景和申请建议` }
  })
}

onMounted(async () => {
  // 强制滚动到页面顶部
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0

  try {
    const id = parseInt(route.params.id)
    await new Promise(resolve => setTimeout(resolve, 300))
    major.value = majorsData.find(m => m.id === id) || null

    setTimeout(() => { heroVisible.value = true }, 80)
    setupObservers()

    requestAnimationFrame(() => {
      if (heroRef.value) heroObserver?.observe(heroRef.value)
      if (contentRef.value) contentObserver?.observe(contentRef.value)
    })

    setTimeout(() => { if (!contentVisible.value) contentVisible.value = true }, 600)
  } catch (error) {
    console.error('加载专业详情失败:', error)
    major.value = null
  } finally {
    loading.value = false
  }
})

function setupObservers() {
  heroObserver = new IntersectionObserver(
    entries => { entries.forEach(e => { if (e.isIntersecting) { heroVisible.value = true; heroObserver?.unobserve(e.target) } }) },
    { threshold: 0.1 }
  )
  contentObserver = new IntersectionObserver(
    entries => { entries.forEach(e => { if (e.isIntersecting) { contentVisible.value = true; contentObserver?.unobserve(e.target) } }) },
    { threshold: 0.05 }
  )
}

onUnmounted(() => {
  heroObserver?.disconnect()
  contentObserver?.disconnect()
})
</script>

<style scoped>
/* ============================================
   智途 AstroPath — 专业详情页 · Awwwards 重构
   设计语言: 编辑式档案排版 (Editorial Archive)
   色系: Slate(#0F172A) + Amber(#D97706)
   ============================================ */

.md-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-background);
  overflow-x: hidden;
}

/* 噪点纹理 */
.md-noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}


/* ===== 加载状态 ===== */
.md-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 64px);
  gap: 20px;
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
}
.md-loading__spinner {
  width: 36px;
  height: 36px;
  border: 2.5px solid var(--color-border-light);
  border-top-color: var(--color-solid);
  border-radius: 50%;
  animation: mdSpin 0.7s linear infinite;
}
@keyframes mdSpin { to { transform: rotate(360deg); } }


/* ===== 错误状态 ===== */
.md-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 64px);
  padding: 60px 24px;
  text-align: center;
}
.md-error__icon {
  font-family: var(--font-family-mono);
  font-size: clamp(48px, 8vw, 72px);
  font-weight: 800;
  color: var(--color-border-light);
  line-height: 1;
  margin-bottom: 16px;
}
.md-error__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.md-error__desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  max-width: 320px;
}


/* ============================================
   HERO — 专业档案头部（编辑式）
   ============================================ */
.md-hero {
  position: relative;
  overflow: hidden;
  min-height: calc(100dvh - 64px);
  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateY(30px);
}
.md-hero--visible {
  opacity: 1;
  transform: translateY(0);
}

/* 网格背景 */
.md-hero__grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 100%);
}

/* 顶部强调色条 */
.md-hero__accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}
.md-hero__accent-bar--engineering { background: linear-gradient(90deg, #334155, #475569, #334155); }
.md-hero__accent-bar--business { background: linear-gradient(90deg, #059669, #10B981, #059669); }
.md-hero__accent-bar--social { background: linear-gradient(90deg, #D97706, #F59E0B, #D97706); }
.md-hero__accent-bar--science { background: linear-gradient(90deg, #0284C7, #38BDF8, #0284C7); }
.md-hero__accent-bar--arts { background: linear-gradient(90deg, #DC2626, #EF4444, #DC2626); }
.md-hero__accent-bar--default { background: linear-gradient(90deg, #94A3B8, #CBD5E1, #94A3B8); }

.md-hero__inner {
  position: relative;
  z-index: 2;
  max-width: 900px;
  width: 100%;
  padding: 36px 40px 36px;
  box-sizing: border-box;
}


/* ===== 面包屑导航 ===== */
.md-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-family: var(--font-family-mono);
  font-size: 11px;
  letter-spacing: 0.5px;
  opacity: 0;
  animation: mdFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
}
.md-hero--visible .md-breadcrumb { opacity: 1; }

@keyframes mdFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.md-back {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: inherit;
  font-size: inherit;
}
.md-back:hover {
  color: var(--color-solid);
  background: var(--color-background-alt);
  transform: translateX(-3px);
}

.md-breadcrumb__sep { color: var(--color-border); }
.md-breadcrumb__text { color: var(--color-text-tertiary); }
.md-breadcrumb__current { color: var(--color-text-secondary); font-weight: 600; }


/* ===== 元信息行 ===== */
.md-hero__meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  opacity: 0;
  animation: mdFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
}

.md-cat {
  font-family: var(--font-family-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 100px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.md-cat--primary { background: #F1F5F9; color: #334155; }
.md-cat--success { background: #ECFDF5; color: #059669; }
.md-cat--warning { background: #FFFBEB; color: #D97706; }
.md-cat--info { background: #F0F9FF; color: #0284C7; }
.md-cat--danger { background: #FEF2F2; color: #DC2626; }

.md-meta {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  letter-spacing: 0.3px;
}
.md-meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-border);
  flex-shrink: 0;
}


/* ===== 超大标题 ===== */
.md-title {
  font-family: var(--font-family-base);
  font-size: clamp(36px, 7vw, 72px);
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin: 0 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.15em;
}

.md-title__word {
  display: inline-block;
  overflow: hidden;
}
.md-title__inner {
  display: inline-block;
  transform: translateY(110%);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--tw) * 0.12s + 0.3s);
}
.md-hero--visible .md-title__inner {
  transform: translateY(0);
}


/* ===== 英文副标题 ===== */
.md-subtitle {
  font-family: var(--font-family-mono);
  font-size: clamp(14px, 1.5vw, 18px);
  color: var(--color-text-tertiary);
  font-weight: 400;
  letter-spacing: 0.01em;
  margin: 0 0 28px;
  opacity: 0;
  animation: mdFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
}


/* ===== 描述文字 ===== */
.md-desc {
  font-size: clamp(15px, 1.6vw, 19px);
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 600px;
  margin: 0;
  opacity: 0;
  animation: mdFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
}


/* ============================================
   主体内容区
   ============================================ */
.md-body {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.md-body--visible {
  opacity: 1;
  transform: translateY(0);
}

.md-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px 80px;
  box-sizing: border-box;
}


/* ===== 薪资区块 — Wow Moment ===== */
.md-section--salary {
  margin-top: -40px;
  padding-top: 60px;
  position: relative;
}

.md-salary-block {
  background: var(--color-surface);
  border-radius: 20px;
  border: 1px solid var(--color-border-light);
  padding: 40px 44px;
  box-shadow: 0 4px 30px rgba(15, 23, 42, 0.04);
}

.md-salary__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.md-salary__label {
  font-family: var(--font-family-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
}

.md-salary__source-link {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-accent);
  cursor: pointer;
  transition: opacity 0.2s;
  letter-spacing: 0.02em;
}
.md-salary__source-link:hover { opacity: 0.7; }

.md-salary__numbers {
  display: flex;
  align-items: baseline;
  gap: 32px;
}

.md-salary__item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.md-salary__region {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-accent);
  padding: 2px 8px;
  background: rgba(217, 119, 6, 0.08);
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.md-salary__val {
  font-family: var(--font-family-mono);
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  color: var(--color-solid);
  letter-spacing: -0.03em;
  line-height: 1;
}

.md-salary__unit {
  font-family: var(--font-family-mono);
  font-size: 13px;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.md-salary__divider {
  width: 1px;
  height: 40px;
  background: var(--color-border-light);
  flex-shrink: 0;
}


/* ===== 章节通用 ===== */
.md-section {
  margin-top: 56px;
}

.md-sec-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 24px;
}

.md-sec-num {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 800;
  color: var(--color-border-light);
  letter-spacing: -0.02em;
  min-width: 24px;
}

.md-sec-title {
  font-family: var(--font-family-base);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.md-sec-sub {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-left: auto;
}


/* ===== 双栏网格 ===== */
.md-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-top: 56px;
}


/* ===== 核心课程 ===== */
.md-courses {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.md-course {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-lighter);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(12px);
  animation: mdCourseIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--ci) * 0.06s + 0.1s);
}
.md-course:last-child { border-bottom: none; }
.md-course:hover { padding-left: 8px; }

@keyframes mdCourseIn {
  to { opacity: 1; transform: translateY(0); }
}

.md-course__idx {
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--color-border);
  min-width: 22px;
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.md-course__name {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: -0.005em;
}


/* ===== 就业方向 ===== */
.md-careers {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.md-career {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-lighter);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(12px);
  animation: mdCareerIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--ci) * 0.06s + 0.15s);
}
.md-career:last-child { border-bottom: none; }
.md-career:hover { padding-left: 8px; }

@keyframes mdCareerIn {
  to { opacity: 1; transform: translateX(0); }
}

.md-career__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
}

.md-career__name {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: -0.005em;
}


/* ===== 推荐院校 ===== */
.md-schools {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.md-school {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  transform: translateY(10px);
  animation: mdSchoolIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--si) * 0.07s + 0.1s);
}
.md-school:hover {
  border-color: var(--color-border);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.06);
  transform: translateX(6px);
}

@keyframes mdSchoolIn {
  to { opacity: 1; transform: translateY(0); }
}

.md-school__rank {
  font-family: var(--font-family-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
  color: white;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}
.md-school__rank--danger { background: #DC2626; }
.md-school__rank--warning { background: #D97706; }
.md-school__rank--success { background: #059669; }
.md-school__rank--info { background: #0284C7; }

.md-school__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.md-school__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.md-school__loc {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.md-school__arrow {
  color: var(--color-border);
  flex-shrink: 0;
  transition: transform 0.3s ease, color 0.3s ease;
}
.md-school:hover .md-school__arrow {
  color: var(--color-solid);
  transform: translateX(3px);
}


/* ===== 数据来源 ===== */
.md-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.md-source {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: var(--font-family-base);
}
.md-source:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.md-source__icon {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
  transition: color 0.3s;
}
.md-source:hover .md-source__icon { color: var(--color-accent); }

.md-source__label {
  white-space: nowrap;
}

.md-source__arrow {
  font-family: var(--font-family-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
  transition: color 0.3s;
}
.md-source:hover .md-source__arrow { color: var(--color-solid); }


/* ===== 引用角标 ===== */
.md-ref {
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--color-accent);
  margin-left: 3px;
  cursor: pointer;
  vertical-align: super;
  line-height: 0;
  transition: opacity 0.2s, color 0.2s;
  user-select: none;
}
.md-ref:hover { opacity: 0.7; }


/* ===== 引用列表（统一格式）===== */
.md-ref-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.md-ref-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}
.md-ref-item:hover { background: var(--color-background-alt); }

.md-ref-item__num {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-accent);
  cursor: pointer;
  flex-shrink: 0;
  min-width: 26px;
  transition: opacity 0.2s;
}
.md-ref-item__num:hover { opacity: 0.7; }

.md-ref-item__link {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.md-ref-item__link:hover { color: var(--color-solid); }

.md-ref-item__arrow {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-left: auto;
  flex-shrink: 0;
}


/* ===== 操作栏 ===== */
.md-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid var(--color-border-lighter);
  flex-wrap: wrap;
  gap: 16px;
}

.md-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.md-btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-light);
}
.md-btn--ghost:hover {
  border-color: var(--color-border);
  color: var(--color-text-primary);
  transform: translateX(-3px);
}

.md-btn--primary {
  background: var(--color-solid);
  color: white;
  border: 1px solid var(--color-solid);
}
.md-btn--primary:hover {
  background: var(--color-solid-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.18);
}


/* ============================================
   响应式设计
   ============================================ */
@media (max-width: 1024px) {
  .md-container { padding: 0 28px 60px; }
  .md-hero__inner { padding: 44px 28px 38px; }
  .md-grid { gap: 36px; }
  .md-salary-block { padding: 32px 28px; }
  .md-salary__val { font-size: clamp(28px, 4.5vw, 40px); }
}

@media (max-width: 767px) {
  .md-hero__inner { padding: 36px 20px 32px; }
  .md-container { padding: 0 20px 48px; }
  .md-title { font-size: clamp(30px, 9vw, 52px); }
  .md-subtitle { font-size: 13px; }
  .md-desc { font-size: 14px; }
  .md-grid { grid-template-columns: 1fr; gap: 0; }
  .md-section { margin-top: 40px; }
  .md-salary-block { padding: 28px 22px; }
  .md-salary__numbers { flex-direction: column; gap: 20px; }
  .md-salary__divider { width: 100%; height: 1px; }
  .md-salary__val { font-size: clamp(26px, 8vw, 38px); }
  .md-sec-title { font-size: 18px; }
  .md-breadcrumb { margin-bottom: 24px; }
  .md-actions { flex-direction: column; align-items: stretch; }
  .md-actions .md-btn { justify-content: center; }
  .md-school:hover { transform: none; }
}

@media (max-width: 480px) {
  .md-hero__inner { padding: 32px 16px 28px; }
  .md-salary-block { padding: 24px 18px; }
  .md-salary__val { font-size: clamp(24px, 10vw, 34px); }
  .md-school { padding: 14px 16px; }
  .md-sec-head { gap: 10px; }
  .md-sec-num { font-size: 11px; min-width: 20px; }
}


/* ===== 减少动画偏好 ===== */
@media (prefers-reduced-motion: reduce) {
  .md-hero,
  .md-body { transition: opacity 0.3s ease; opacity: 1; transform: none; }
  .md-title__inner { transform: none; transition: none; }
  .md-course,
  .md-career,
  .md-school { animation: none; opacity: 1; transform: none; }
  .md-breadcrumb,
  .md-hero__meta-row,
  .md-subtitle,
  .md-desc { animation: none; opacity: 1; }
  .md-course:hover,
  .md-career:hover { transform: none; padding-left: 0; }
  .md-school:hover { transform: none; }
  .md-back:hover,
  .md-btn--ghost:hover { transform: none; }
  .md-btn--primary:hover { transform: none; }
  .md-source:hover { transform: none; }
  .md-loading__spinner { animation-duration: 2s; }
}
</style>
