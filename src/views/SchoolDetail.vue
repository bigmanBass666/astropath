<template>
  <div class="sd-page">
    <div class="sd-noise" />

    <template v-if="school">
      <!-- ===== HERO: 院校档案头部 ===== -->
      <header
        ref="heroRef"
        class="sd-hero"
        :class="{ 'sd-hero--visible': heroVisible }"
      >
        <div class="sd-hero__grid-bg" />

        <div class="sd-hero__inner">
          <!-- 返回导航 -->
          <nav class="sd-breadcrumb">
            <button
              class="sd-back"
              @click="router.back()"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              ><path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg>
              <span>{{ backLabel }}</span>
            </button>
          </nav>

          <!-- 主内容区：排名徽章 + 名称 + 元信息 -->
          <div class="sd-hero__content">
            <!-- 排名徽章 — 视觉锚点 -->
            <div
              class="sd-rank-badge"
              :class="'sd-rank-badge--' + rankType"
            >
              <span class="sd-rank-badge__label">RANKING</span>
              <span class="sd-rank-badge__value">
                {{ rankNumber }}
                <sup
                  v-if="refIndex('ranking')"
                  class="sd-ref"
                  @click.stop="openRef(school.sources.ranking.url)"
                >{{ refIndex('ranking') }}</sup>
              </span>
              <span class="sd-rank-badge__source">{{ rankSource }}</span>
            </div>

            <!-- 院校名称 -->
            <h1
              ref="titleRef"
              class="sd-title"
            >
              <span
                v-for="(word, i) in nameWords"
                :key="i"
                class="sd-title__word"
                :style="{ '--tw': i }"
              >
                <span class="sd-title__inner">{{ word }}</span>
              </span>
            </h1>

            <!-- 元信息行 -->
            <div class="sd-meta-row">
              <span class="sd-country">{{ school.country }}</span>
              <span class="sd-dot" />
              <span
                v-if="school.type"
                class="sd-type"
              >{{ school.type }}</span>
              <span
                v-if="school.students"
                class="sd-students"
              >{{ school.students }}</span>
            </div>

            <!-- 描述 -->
            <p
              v-if="school.description"
              class="sd-desc"
            >
              {{ school.description }}
            </p>

            <!-- 收藏按钮 -->
            <button
              class="sd-fav"
              :class="{ 'sd-fav--active': isFavorite }"
              @click="toggleFavorite"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              ><path
                d="M8 13L3 8.5C1.5 7 1.5 4.5 3 3C4.5 1.5 7 1.5 8 3C9 1.5 11.5 1.5 13 3C14.5 4.5 14.5 7 13 8.5L8 13Z"
                :fill="isFavorite ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg>
              {{ isFavorite ? '已收藏' : '收藏院校' }}
            </button>
          </div>
        </div>
      </header>

      <!-- ===== 关键指标条 — 数据驱动 Wow Moment ===== -->
      <section
        ref="metricsRef"
        class="sd-metrics"
        :class="{ 'sd-metrics--visible': metricsVisible }"
      >
        <div class="sd-container">
          <div class="sd-metrics__grid">
            <div class="sd-metric">
              <span class="sd-metric__lbl">TUITION</span>
              <span class="sd-metric__val">{{ school.tuition }}<sup
                v-if="refIndex('tuition')"
                class="sd-ref sd-ref--light"
                @click.stop="openRef(school.sources.tuition.url)"
              >{{ refIndex('tuition') }}</sup></span>
              <span class="sd-metric__sub">预估年学费</span>
            </div>
            <div class="sd-metric sd-metric--divider">
              <span class="sd-metric__lbl">ACCEPTANCE RATE</span>
              <span
                class="sd-metric__val"
                :class="{ 'sd-metric__val--low': acceptanceRateNum < 10 }"
              >{{ school.acceptanceRate }}<sup
                v-if="refIndex('acceptance')"
                class="sd-ref sd-ref--light"
                @click.stop="openRef(school.sources.acceptance.url)"
              >{{ refIndex('acceptance') }}</sup></span>
              <span class="sd-metric__sub">录取率</span>
            </div>
            <div class="sd-metric">
              <span class="sd-metric__lbl">MATCH SCORE</span>
              <span class="sd-metric__val">{{ school.match }}<small>%</small></span>
              <span class="sd-metric__sub">{{ difficultyText }}难度</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 主体内容 ===== -->
      <main
        ref="contentRef"
        class="sd-body"
        :class="{ 'sd-body--visible': contentVisible }"
      >
        <div class="sd-container">
          <!-- 双栏：概况 + 费用 -->
          <div class="sd-grid">
            <!-- 左栏：院校概况 -->
            <section class="sd-section">
              <header class="sd-sec-head">
                <span class="sd-sec-num">01</span>
                <h2 class="sd-sec-title">
                  院校概况
                </h2>
              </header>
              <dl class="sd-dl">
                <div class="sd-dl__row">
                  <dt>国家 / 地区</dt>
                  <dd>{{ school.country }}</dd>
                </div>
                <div class="sd-dl__row">
                  <dt>世界排名</dt>
                  <dd>
                    <strong>{{ school.ranking }}</strong><sup
                      v-if="refIndex('ranking')"
                      class="sd-ref"
                      @click.stop="openRef(school.sources.ranking.url)"
                    >{{ refIndex('ranking') }}</sup>
                  </dd>
                </div>
                <div class="sd-dl__row">
                  <dt>热门专业</dt>
                  <dd>{{ school.major }}</dd>
                </div>
                <div class="sd-dl__row">
                  <dt>录取难度</dt>
                  <dd>
                    <span
                      class="sd-diff-tag"
                      :class="'sd-diff-tag--' + diffClass"
                    >{{ difficultyText }}</span>
                    <span class="sd-diff-pct">匹配度 {{ school.match }}%</span>
                  </dd>
                </div>
                <div
                  v-if="school.deadline"
                  class="sd-dl__row"
                >
                  <dt>申请截止</dt>
                  <dd>{{ school.deadline }}</dd>
                </div>
                <div
                  v-if="school.website"
                  class="sd-dl__row"
                >
                  <dt>官网</dt>
                  <dd>
                    <a
                      :href="school.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="sd-link"
                    >{{ school.website.replace('https://', '') }} ↗</a>
                  </dd>
                </div>
              </dl>
            </section>

            <!-- 右栏：费用与录取 -->
            <section class="sd-section">
              <header class="sd-sec-head">
                <span class="sd-sec-num">02</span>
                <h2 class="sd-sec-title">
                  费用与录取
                </h2>
              </header>
              <dl class="sd-dl">
                <div class="sd-dl__row">
                  <dt>预估学费</dt>
                  <dd>
                    <strong>{{ school.tuition }}</strong><sup
                      v-if="refIndex('tuition')"
                      class="sd-ref"
                      @click.stop="openRef(school.sources.tuition.url)"
                    >{{ refIndex('tuition') }}</sup><span class="sd-note">/ 年</span>
                  </dd>
                </div>
                <div class="sd-dl__row">
                  <dt>录取率</dt>
                  <dd :class="{ 'sd-rate--low': acceptanceRateNum < 10 }">
                    <strong>{{ school.acceptanceRate }}</strong><sup
                      v-if="refIndex('acceptance')"
                      class="sd-ref"
                      @click.stop="openRef(school.sources.acceptance.url)"
                    >{{ refIndex('acceptance') }}</sup>
                  </dd>
                </div>
                <div class="sd-dl__note-row">
                  <span class="sd-note-icon">ℹ</span>
                  <span class="sd-note-text">费用仅供参考，具体以学校官方公布为准</span>
                </div>
              </dl>
            </section>
          </div>

          <!-- 专业设置 -->
          <section class="sd-section sd-section--full">
            <header class="sd-sec-head">
              <span class="sd-sec-num">03</span>
              <h2 class="sd-sec-title">
                专业设置
              </h2>
              <span class="sd-sec-sub">热门专业方向</span>
            </header>
            <div class="sd-program">
              <div class="sd-program__head">
                <span class="sd-program__name">{{ school.major }}</span>
                <span class="sd-program__tag">HOT</span>
              </div>
              <p class="sd-program__desc">
                该院校在{{ school.major }}领域具有较强的学术实力和研究资源。
              </p>
              <div class="sd-program__highlight">
                <span class="sd-hl-icon">◆</span>
                <span>{{ programHighlight }}</span>
              </div>
            </div>
          </section>

          <!-- 申请要求 -->
          <section class="sd-section sd-section--full">
            <header class="sd-sec-head">
              <span class="sd-sec-num">04</span>
              <h2 class="sd-sec-title">
                申请要求
              </h2>
              <sup
                v-if="refIndex('requirements')"
                class="sd-ref sd-ref--head"
                @click.stop="openRef(school.sources.requirements.url)"
              >{{ refIndex('requirements') }}</sup>
            </header>
            <div class="sd-reqs">
              <div class="sd-reqs__block">
                <h3 class="sd-reqs__subtitle">
                  学术要求
                </h3>
                <ul class="sd-reqs__list">
                  <li
                    v-for="(req, i) in school.requirements"
                    :key="i"
                  >
                    {{ req }}
                  </li>
                </ul>
              </div>
              <div class="sd-reqs__block">
                <h3 class="sd-reqs__subtitle">
                  其他材料
                </h3>
                <ul class="sd-reqs__list">
                  <li>个人陈述（Statement of Purpose）</li>
                  <li>推荐信（2-3封）</li>
                  <li>英语成绩：托福90+ 或 雅思6.5+</li>
                  <li>GRE/GMAT成绩（视专业而定）</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 底部操作栏 -->
          <footer class="sd-actions">
            <button
              class="sd-btn sd-btn--ghost"
              @click="router.push('/school-recommendation')"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              ><path
                d="M14 14L10 10M11 7A4 4 0 1 0 7 3a4 4 0 0 0 4 4z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              /></svg>
              匹配度分析
            </button>
            <button
              class="sd-btn sd-btn--ghost"
              @click="router.push('/timeline')"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              ><path
                d="M8 2v6l4 2"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              /><circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                stroke-width="1.5"
              /></svg>
              时间规划
            </button>
            <button
              class="sd-btn sd-btn--primary"
              @click="startChat"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              ><path
                d="M14 8c0 3.31-2.69 6-6 6-.58 0-1.14-.08-1.67-.23L4 15l.75-2.27C3.93 11.73 3.44 10.42 3.44 9c0-3.31 2.69-6 6-6s6 2.69 6 6v1z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              /><circle
                cx="6"
                cy="7"
                r="0.8"
                fill="currentColor"
              /><circle
                cx="10"
                cy="7"
                r="0.8"
                fill="currentColor"
              /></svg>
              AI 顾问咨询
            </button>
          </footer>

          <!-- ===== 引用列表 ===== -->
          <section
            v-if="refList.length > 0"
            class="sd-references"
          >
            <header class="sd-sec-head">
              <span class="sd-sec-num">REF</span>
              <h2 class="sd-sec-title">
                数据来源
              </h2>
            </header>
            <ol class="sd-ref-list">
              <li
                v-for="ref in refList"
                :key="ref.key"
                class="sd-ref-item"
              >
                <span
                  class="sd-ref-item__num"
                  @click.stop="openRef(ref.url)"
                >[{{ ref.index }}]</span>
                <a
                  :href="ref.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="sd-ref-item__link"
                >{{ ref.label }}</a>
                <span class="sd-ref-item__arrow">↗</span>
              </li>
            </ol>
          </section>
        </div>
      </main>
    </template>

    <!-- 未找到 -->
    <div
      v-else
      class="sd-error"
    >
      <div class="sd-error__icon">
        404
      </div>
      <div class="sd-error__title">
        院校未找到
      </div>
      <div class="sd-error__desc">
        未找到对应的院校信息
      </div>
      <button
        class="sd-btn sd-btn--primary"
        @click="router.push('/university-database')"
      >
        返回院校数据库
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSchoolById } from '@/utils/recommendationEngine'

const route = useRoute()
const router = useRouter()

const heroRef = ref(null)
const contentRef = ref(null)
const metricsRef = ref(null)
const titleRef = ref(null)
const heroVisible = ref(false)
const contentVisible = ref(false)
const metricsVisible = ref(false)

let heroObserver = null
let contentObserver = null
let metricsObserver = null

const fromLabels = {
  recommendation: '返回选校推荐',
  database: '返回院校库',
  timeline: '返回时间规划',
  materials: '返回材料中心',
  'major-detail': '返回专业详情',
  home: '返回首页'
}

const backLabel = computed(() => fromLabels[route.query.from] || '返回')

const school = computed(() => {
  const id = parseInt(route.params.id)
  const found = getSchoolById(id)
  if (!found) return null
  if (found.match !== undefined) return found
  const competitivenessMap = { extreme: 88, very_high: 78, high: 68, moderate: 55, accessible: 45 }
  return {
    ...found,
    match: found.admissionCriteria ? competitivenessMap[found.admissionCriteria.competitiveness] || 50 : 50
  }
})

const isFavorite = computed(() => {
  try {
    const favs = JSON.parse(localStorage.getItem('school_favorites') || '[]')
    return favs.includes(school.value?.id)
  } catch { return false }
})

const nameWords = computed(() => {
  if (!school.value?.name) return []
  return school.value.name.split(/\s+/).filter(Boolean)
})

const rankNumber = computed(() => {
  if (!school.value?.ranking) return '--'
  const m = school.value.ranking.match(/#?(\d+)/)
  return m ? '#' + m[1] : school.value.ranking
})

const rankSource = computed(() => {
  if (!school.value?.ranking) return ''
  return school.value.ranking.includes('QS') ? 'QS World' : 'World Rank'
})

const rankType = computed(() => {
  const n = parseInt(rankNumber.value.replace('#', '')) || 999
  if (n <= 10) return 'danger'
  if (n <= 20) return 'warning'
  if (n <= 50) return 'success'
  return 'info'
})

const acceptanceRateNum = computed(() => {
  if (!school.value?.acceptanceRate) return 100
  const m = parseFloat(school.value.acceptanceRate)
  return isNaN(m) ? 100 : m
})

const diffClass = computed(() => {
  const m = school.value?.match ?? 50
  if (m >= 85) return 'hard'
  if (m >= 70) return 'medium'
  return 'easy'
})

const difficultyText = computed(() => {
  const m = school.value?.match ?? 50
  if (m >= 85) return '高'
  if (m >= 70) return '中等'
  return '较易'
})

const programHighlight = computed(() => {
  const major = school.value?.major || ''
  const map = {
    'CS': '提供 AI、系统、理论等多个研究方向',
    'Computer Science': '提供 AI、系统、理论等多个研究方向',
    'AI': '涵盖机器学习、计算机视觉、自然语言处理',
    'Engineering': '工程学科覆盖广泛，含多个细分方向',
    'Business': '商科课程丰富，注重实践与案例教学'
  }
  return map[major] || `提供广泛的${major}课程和研究机会`
})

/* ===== 引用系统 ===== */
const refOrder = ['ranking', 'tuition', 'acceptance', 'requirements']

const refList = computed(() => {
  const srcs = school.value?.sources
  if (!srcs) return []
  return refOrder
    .filter(key => srcs[key]?.url && srcs[key]?.label)
    .map((key, idx) => ({ ...srcs[key], index: idx + 1, key }))
})

function refIndex(key) {
  const srcs = school.value?.sources
  if (!srcs || !srcs[key]) return null
  return refOrder.indexOf(key) + 1 || null
}

function openRef(url) {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

function toggleFavorite() {
  if (!school.value) return
  let favs = []
  try { favs = JSON.parse(localStorage.getItem('school_favorites') || '[]') } catch {}
  const idx = favs.indexOf(school.value.id)
  if (idx > -1) {
    favs.splice(idx, 1)
  } else {
    favs.push(school.value.id)
  }
  localStorage.setItem('school_favorites', JSON.stringify(favs))
}

function startChat() {
  const name = school.value?.name || ''
  router.push({
    path: '/ai-chat',
    query: { message: `请详细介绍${name}的申请条件、优势专业和就业前景` }
  })
}

onMounted(() => {
  const resetScroll = () => {
    const appMain = document.querySelector('.app-main')
    if (appMain) appMain.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
  resetScroll()
  requestAnimationFrame(resetScroll)

  setTimeout(() => { heroVisible.value = true }, 60)
  setupObservers()

  requestAnimationFrame(() => {
    if (heroRef.value) heroObserver?.observe(heroRef.value)
    if (contentRef.value) contentObserver?.observe(contentRef.value)
    if (metricsRef.value) metricsObserver?.observe(metricsRef.value)
  })

  setTimeout(() => {
    if (!contentVisible.value) contentVisible.value = true
    if (!metricsVisible.value) metricsVisible.value = true
  }, 600)
})

function setupObservers() {
  const makeObs = (cb) => new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { cb(true); e.target._obs?.unobserve(e.target) } }),
    { threshold: 0.1 }
  )
  heroObserver = makeObs(v => { heroVisible.value = v })
  contentObserver = makeObs(v => { contentVisible.value = v })
  metricsObserver = makeObs(v => { metricsVisible.value = v })
  ;[heroObserver, contentObserver, metricsObserver].forEach(o => { o._obs = o })
}

onUnmounted(() => {
  heroObserver?.disconnect()
  contentObserver?.disconnect()
  metricsObserver?.disconnect()
})
</script>

<style scoped>
/* ============================================
   智途 AstroPath — 院校详情页 · Awwwards 重构
   设计语言: 机构编辑式 (Institutional Editorial)
   色系: Slate(#0F172A) + Amber(#D97706)
   ============================================ */

.sd-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-background);
  overflow-x: hidden;
}

.sd-noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}


/* ============================================
   HERO — 院校档案头部（排名锚点）
   ============================================ */
.sd-hero {
  position: relative;
  overflow: hidden;
  height: calc(100dvh - 64px);
  margin-top: -20px;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateY(30px);
}
.sd-hero--visible {
  opacity: 1;
  transform: translateY(0);
}

.sd-hero__grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 70% 50% at 30% 45%, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 50% at 30% 45%, black 30%, transparent 100%);
}

.sd-hero__inner {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  width: 100%;
  padding: 36px 40px 36px;
  box-sizing: border-box;
}

/* 面包屑 */
.sd-breadcrumb {
  margin-bottom: 36px;
  opacity: 0;
  animation: sdFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
}
.sd-hero--visible .sd-breadcrumb { opacity: 1; }

@keyframes sdFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.sd-back {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.3px;
}
.sd-back:hover {
  color: var(--color-solid);
  background: var(--color-background-alt);
  transform: translateX(-3px);
}

/* Hero 内容区 — 左对齐非居中（区别于专业详情） */
.sd-hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}


/* ===== 排名徽章 — 视觉锚点 ===== */
.sd-rank-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 22px 32px;
  border-radius: 16px;
  min-width: 140px;
  text-align: center;
  opacity: 0;
  animation: sdBadgeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s forwards;
}
.sd-hero--visible .sd-rank-badge { opacity: 1; }

@keyframes sdBadgeIn {
  from { opacity: 0; transform: scale(0.85) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.sd-rank-badge--danger { background: linear-gradient(135deg, #DC2626, #EF4444); color: white; }
.sd-rank-badge--warning { background: linear-gradient(135deg, #D97706, #F59E0B); color: white; }
.sd-rank-badge--success { background: linear-gradient(135deg, #059669, #10B981); color: white; }
.sd-rank-badge--info { background: linear-gradient(135deg, #0284C7, #38BDF8); color: white; }

.sd-rank-badge__label {
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2.5px;
  opacity: 0.75;
  text-transform: uppercase;
}

.sd-rank-badge__value {
  font-family: var(--font-family-mono);
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  margin: 4px 0;
}

.sd-rank-badge__source {
  font-family: var(--font-family-mono);
  font-size: 10px;
  font-weight: 500;
  opacity: 0.7;
  letter-spacing: 0.5px;
}


/* ===== 院校名称 ===== */
.sd-title {
  font-family: var(--font-family-base);
  font-size: clamp(32px, 6vw, 58px);
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1.08;
  letter-spacing: -0.035em;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.15em;
}

.sd-title__word {
  display: inline-block;
  overflow: hidden;
}
.sd-title__inner {
  display: inline-block;
  transform: translateY(110%);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--tw) * 0.1s + 0.35s);
}
.sd-hero--visible .sd-title__inner {
  transform: translateY(0);
}


/* ===== 元信息行 ===== */
.sd-meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  opacity: 0;
  animation: sdFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
}

.sd-country {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 14px;
  background: var(--color-background-alt);
  border-radius: 100px;
  color: var(--color-solid);
  letter-spacing: 0.3px;
}

.sd-type, .sd-students {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  letter-spacing: 0.3px;
}

.sd-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-border);
  flex-shrink: 0;
}


/* 描述 */
.sd-desc {
  font-size: clamp(14px, 1.4vw, 17px);
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 520px;
  margin: 0;
  opacity: 0;
  animation: sdFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.68s forwards;
}


/* 收藏按钮 */
.sd-fav {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 600;
  padding: 9px 20px;
  border-radius: 10px;
  border: 1.5px solid var(--color-border-light);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.02em;
  margin-top: 4px;
  opacity: 0;
  animation: sdFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
}
.sd-fav:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: translateY(-1px);
}
.sd-fav--active {
  background: rgba(217, 119, 6, 0.06);
  border-color: rgba(217, 119, 6, 0.3);
  color: #D97706;
}


/* ============================================
   关键指标条 — 数据 Wow Moment
   ============================================ */
.sd-metrics {
  position: relative;
  margin-top: -36px;
  padding-top: 44px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.sd-metrics--visible {
  opacity: 1;
  transform: translateY(0);
}

.sd-metrics::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

.sd-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
}

.sd-metrics__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: var(--color-border-lighter);
  border-radius: 16px;
  overflow: hidden;
}

.sd-metric {
  background: var(--color-surface);
  padding: 28px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sd-metric__lbl {
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
}

.sd-metric__val {
  font-family: var(--font-family-mono);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  color: var(--color-solid);
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.sd-metric__val small {
  font-size: 0.5em;
  font-weight: 600;
  opacity: 0.6;
  margin-left: 2px;
}
.sd-metric__val--low { color: #DC2626; }

.sd-metric__sub {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  font-weight: 500;
}


/* ============================================
   主体内容区
   ============================================ */
.sd-body {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.sd-body--visible {
  opacity: 1;
  transform: translateY(0);
}


/* 章节通用 */
.sd-section {
  margin-top: 52px;
}
.sd-section--full {
  grid-column: 1 / -1;
}

.sd-sec-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 22px;
}

.sd-sec-num {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 800;
  color: var(--color-border-light);
  letter-spacing: -0.02em;
  min-width: 24px;
}

.sd-sec-title {
  font-family: var(--font-family-base);
  font-size: 19px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.sd-sec-sub {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-left: auto;
}


/* 双栏网格 */
.sd-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 52px;
}


/* 定义列表 */
.sd-dl {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sd-dl__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 13px 0;
  border-bottom: 1px solid var(--color-border-lighter);
  gap: 16px;
}
.sd-dl__row:last-child { border-bottom: none; }

.sd-dl dt {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.2px;
}

.sd-dl dd {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  text-align: right;
  margin: 0;
  letter-spacing: -0.005em;
}

.sd-dl dd strong {
  font-family: var(--font-family-mono);
  font-weight: 700;
  font-size: 15px;
  color: var(--color-solid);
}

.sd-rate--low strong { color: #DC2626; }

.sd-note {
  font-size: 11px;
  color: var(--color-text-tertiary);
  font-style: normal;
  margin-left: 6px;
}

.sd-dl__note-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0 0;
}
.sd-note-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-background-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}
.sd-note-text {
  font-size: 12px;
  color: var(--color-text-tertiary);
  line-height: 1.4;
}

/* 难度标签 */
.sd-diff-tag {
  font-family: var(--font-family-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 100px;
  letter-spacing: 0.5px;
}
.sd-diff-tag--hard { background: #FEF2F2; color: #DC2626; }
.sd-diff-tag--medium { background: #FFFBEB; color: #D97706; }
.sd-diff-tag--easy { background: #ECFDF5; color: #059669; }

.sd-diff-pct {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-left: 8px;
}

/* 外链 */
.sd-link {
  color: var(--color-accent);
  text-decoration: none;
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 600;
  transition: opacity 0.2s;
}
.sd-link:hover { opacity: 0.7; }


/* ===== 专业设置 ===== */
.sd-program {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  padding: 28px 32px;
}

.sd-program__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.sd-program__name {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.sd-program__tag {
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 100px;
  background: var(--color-solid);
  color: white;
  letter-spacing: 1.5px;
}

.sd-program__desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0 0 16px;
}

.sd-program__highlight {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-background-alt);
  border-radius: 10px;
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}
.sd-hl-icon {
  color: var(--color-accent);
  font-size: 10px;
  flex-shrink: 0;
}


/* ===== 申请要求 ===== */
.sd-reqs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 767px) {
  .sd-reqs { grid-template-columns: 1fr; gap: 24px; }
}

.sd-reqs__block h3 {
  font-family: var(--font-family-base);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 14px;
  letter-spacing: -0.01em;
}

.sd-reqs__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sd-reqs__list li {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  padding-left: 18px;
  position: relative;
  letter-spacing: -0.005em;
}
.sd-reqs__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-accent);
}


/* ===== 操作栏 ===== */
.sd-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid var(--color-border-lighter);
  flex-wrap: wrap;
  gap: 14px;
}

.sd-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 600;
  padding: 11px 22px;
  border-radius: 11px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.sd-btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-light);
}
.sd-btn--ghost:hover {
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

.sd-btn--primary {
  background: var(--color-solid);
  color: white;
  border: 1px solid var(--color-solid);
}
.sd-btn--primary:hover {
  background: var(--color-solid-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.18);
}


/* ===== 引用角标 ===== */
.sd-ref {
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
.sd-ref:hover { opacity: 0.7; }
.sd-ref--light { opacity: 0.55; }
.sd-ref--light:hover { opacity: 1; }
.sd-ref--head { font-size: 11px; margin-left: 8px; vertical-align: middle; }


/* ===== 引用列表 ===== */
.sd-references {
  margin-top: 56px;
  padding-bottom: 40px;
}

.sd-ref-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sd-ref-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}
.sd-ref-item:hover { background: var(--color-background-alt); }

.sd-ref-item__num {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-accent);
  cursor: pointer;
  flex-shrink: 0;
  min-width: 26px;
  transition: opacity 0.2s;
}
.sd-ref-item__num:hover { opacity: 0.7; }

.sd-ref-item__link {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.sd-ref-item__link:hover { color: var(--color-solid); }

.sd-ref-item__arrow {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-left: auto;
  flex-shrink: 0;
}


/* ===== 错误状态 ===== */
.sd-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 64px);
  padding: 60px 24px;
  text-align: center;
}
.sd-error__icon {
  font-family: var(--font-family-mono);
  font-size: clamp(48px, 8vw, 72px);
  font-weight: 800;
  color: var(--color-border-light);
  line-height: 1;
  margin-bottom: 16px;
}
.sd-error__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.sd-error__desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  max-width: 320px;
}


/* ============================================
   响应式设计
   ============================================ */
@media (max-width: 1024px) {
  .sd-container { padding: 0 28px; }
  .sd-hero__inner { padding: 30px 28px 30px; }
  .sd-grid { gap: 32px; }
  .sd-metrics__grid { grid-template-columns: 1fr; }
  .sd-metric { padding: 22px 20px; }
  .sd-metric__val { font-size: clamp(26px, 5vw, 32px); }
}

@media (max-width: 767px) {
  .sd-hero__inner { padding: 26px 20px 26px; }
  .sd-container { padding: 0 20px; }
  .sd-title { font-size: clamp(28px, 8vw, 46px); }
  .sd-desc { font-size: 14px; }
  .sd-grid { grid-template-columns: 1fr; gap: 0; }
  .sd-section { margin-top: 40px; }
  .sd-sec-title { font-size: 17px; }
  .sd-breadcrumb { margin-bottom: 24px; }
  .sd-rank-badge { padding: 18px 26px; min-width: 120px; }
  .sd-rank-badge__value { font-size: clamp(30px, 7vw, 42px); }
  .sd-actions { flex-direction: column; align-items: stretch; }
  .sd-actions .sd-btn { justify-content: center; }
}

@media (max-width: 480px) {
  .sd-hero__inner { padding: 22px 16px 22px; }
  .sd-rank-badge { padding: 16px 22px; min-width: 100px; }
  .sd-rank-badge__value { font-size: clamp(26px, 9vw, 36px); }
  .sd-metric__val { font-size: clamp(22px, 7vw, 28px); }
  .sd-dl__row { flex-direction: column; align-items: flex-start; gap: 4px; }
  .sd-dl dd { text-align: left; }
  .sd-program { padding: 22px 20px; }
  .sd-sec-head { gap: 10px; }
  .sd-sec-num { font-size: 11px; min-width: 20px; }
}


/* ===== 减少动画偏好 ===== */
@media (prefers-reduced-motion: reduce) {
  .sd-hero,
  .sd-body,
  .sd-metrics { transition: opacity 0.3s ease; opacity: 1; transform: none; }
  .sd-title__inner { transform: none; transition: none; }
  .sd-rank-badge,
  .sd-breadcrumb,
  .sd-meta-row,
  .sd-desc,
  .sd-fav { animation: none; opacity: 1; }
  .sd-back:hover,
  .sd-fav:hover,
  .sd-btn--ghost:hover,
  .sd-btn--primary:hover { transform: none; }
}
</style>
