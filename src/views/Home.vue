<template>
  <div
    ref="homePageRef"
    class="hp-page"
  >
    <div class="hp-noise" />

    <!-- ===== SECTION 1: HERO ===== -->
    <section
      ref="heroRef"
      class="hp-hero"
      :class="{ 'hp-hero--visible': heroVisible }"
      @mousemove="onHeroMouseMove"
    >
      <div
        ref="gridBgRef"
        class="hp-hero__grid-bg"
        :style="{ '--px': mouseParallax.x + 'px', '--py': mouseParallax.y + 'px' }"
      />
      <div class="hp-hero__glow" />
      <div
        class="hp-hero__cursor-glow"
        :style="{ '--cgx': mouseParallax.x * 2.5 + 'px', '--cgy': mouseParallax.y * 2.5 + 'px' }"
      />

      <div class="hp-hero__tech">
        <svg
          class="hp-tech__svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="techLineGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stop-color="#0F172A"
                stop-opacity="0"
              />
              <stop
                offset="50%"
                stop-color="#0F172A"
                stop-opacity="0.12"
              />
              <stop
                offset="100%"
                stop-color="#0F172A"
                stop-opacity="0"
              />
            </linearGradient>
            <linearGradient
              id="techLineGradV"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-color="#D97706"
                stop-opacity="0"
              />
              <stop
                offset="50%"
                stop-color="#D97706"
                stop-opacity="0.12"
              />
              <stop
                offset="100%"
                stop-color="#D97706"
                stop-opacity="0"
              />
            </linearGradient>
          </defs>

          <g
            class="hp-tech__grid-lines"
            opacity="0.4"
          >
            <line
              x1="120"
              y1="80"
              x2="120"
              y2="820"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.15"
            />
            <line
              x1="360"
              y1="60"
              x2="360"
              y2="840"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.12"
            />
            <line
              x1="600"
              y1="70"
              x2="600"
              y2="830"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.15"
            />
            <line
              x1="840"
              y1="50"
              x2="840"
              y2="850"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.12"
            />
            <line
              x1="1080"
              y1="75"
              x2="1080"
              y2="825"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.14"
            />
            <line
              x1="1320"
              y1="65"
              x2="1320"
              y2="835"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.13"
            />

            <line
              x1="40"
              y1="150"
              x2="1400"
              y2="150"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.13"
            />
            <line
              x1="30"
              y1="300"
              x2="1410"
              y2="300"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.11"
            />
            <line
              x1="45"
              y1="450"
              x2="1395"
              y2="450"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.14"
            />
            <line
              x1="35"
              y1="600"
              x2="1405"
              y2="600"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.12"
            />
            <line
              x1="42"
              y1="750"
              x2="1398"
              y2="750"
              stroke="#0F172A"
              stroke-width="0.5"
              stroke-dasharray="4 6"
              opacity="0.13"
            />
          </g>

          <g
            class="hp-tech__connections"
            opacity="0.6"
          >
            <path
              d="M180,200 Q340,180 420,320 T620,380 T780,280 T980,350"
              fill="none"
              stroke="url(#techLineGrad)"
              stroke-width="1.2"
            />
            <path
              d="M220,650 Q400,620 520,700 T720,660 T920,720 T1120,680"
              fill="none"
              stroke="url(#techLineGrad)"
              stroke-width="1"
            />
            <path
              d="M1100,160 Q1180,260 1160,380 T1240,500 T1220,620"
              fill="none"
              stroke="url(#techLineGradV)"
              stroke-width="1"
            />
            <path
              d="M80,480 Q160,400 240,430 T360,380 T440,450"
              fill="none"
              stroke="url(#techLineGrad)"
              stroke-width="0.8"
            />
          </g>

          <g class="hp-tech__nodes">
            <circle
              cx="420"
              cy="320"
              r="3"
              fill="#0F172A"
              opacity="0.35"
            />
            <circle
              cx="620"
              cy="380"
              r="2.5"
              fill="#D97706"
              opacity="0.4"
            />
            <circle
              cx="780"
              cy="280"
              r="3"
              fill="#0F172A"
              opacity="0.3"
            />
            <circle
              cx="980"
              cy="350"
              r="2"
              fill="#0F172A"
              opacity="0.28"
            />
            <circle
              cx="520"
              cy="700"
              r="3"
              fill="#0F172A"
              opacity="0.32"
            />
            <circle
              cx="720"
              cy="660"
              r="2.5"
              fill="#D97706"
              opacity="0.38"
            />
            <circle
              cx="920"
              cy="720"
              r="2"
              fill="#0F172A"
              opacity="0.26"
            />
            <circle
              cx="1160"
              cy="380"
              r="2.5"
              fill="#0F172A"
              opacity="0.3"
            />
            <circle
              cx="1240"
              cy="500"
              r="2"
              fill="#D97706"
              opacity="0.35"
            />
            <circle
              cx="240"
              cy="430"
              r="2"
              fill="#0F172A"
              opacity="0.28"
            />
            <circle
              cx="440"
              cy="450"
              r="2.5"
              fill="#0F172A"
              opacity="0.32"
            />
          </g>

          <g class="hp-tech__rings">
            <circle
              cx="1150"
              cy="220"
              r="60"
              fill="none"
              stroke="#0F172A"
              stroke-width="0.5"
              opacity="0.08"
              stroke-dasharray="3 8"
            />
            <circle
              cx="1150"
              cy="220"
              r="90"
              fill="none"
              stroke="#0F172A"
              stroke-width="0.4"
              opacity="0.05"
              stroke-dasharray="2 10"
            />
            <circle
              cx="1150"
              cy="220"
              r="120"
              fill="none"
              stroke="#D97706"
              stroke-width="0.3"
              opacity="0.06"
              stroke-dasharray="1 12"
            />
            <circle
              cx="260"
              cy="620"
              r="45"
              fill="none"
              stroke="#0F172A"
              stroke-width="0.5"
              opacity="0.07"
              stroke-dasharray="3 7"
            />
            <circle
              cx="260"
              cy="620"
              r="72"
              fill="none"
              stroke="#0F172A"
              stroke-width="0.4"
              opacity="0.04"
              stroke-dasharray="2 9"
            />
          </g>
        </svg>

        <span class="hp-tech__watermark">ASTROPATH</span>
        <span class="hp-tech__watermark hp-tech__watermark--sub">v2.0</span>

        <div class="hp-tech__axis hp-tech__axis--x" />
        <div class="hp-tech__axis hp-tech__axis--y" />
        <span class="hp-tech__label hp-tech__label--x">X</span>
        <span class="hp-tech__label hp-tech__label--y">Y</span>

        <div class="hp-tech__ticks-x">
          <i
            v-for="n in 8"
            :key="'tx'+n"
            class="hp-tech__tick"
            :style="{ '--ti': n }"
          />
        </div>
        <div class="hp-tech__ticks-y">
          <i
            v-for="n in 6"
            :key="'ty'+n"
            class="hp-tech__tick hp-tech__tick--y"
            :style="{ '--ti': n }"
          />
        </div>

        <div class="hp-tech__scanline" />
        <div class="hp-tech__scanline hp-tech__scanline--h" />

        <div class="hp-tech__floating-ui">
          <span class="hp-fui hp-fui--coord"><b>lat:</b> 23.1291°</span>
          <span class="hp-fui hp-fui--coord"><b>lng:</b> 113.2644°</span>
          <span class="hp-fui hp-fui--badge">SYS.OK</span>
          <span class="hp-fui hp-fui--hex">#0F172A</span>
          <span class="hp-fui hp-fui--mini">AI×6</span>
          <span class="hp-fui hp-fui--status"><i /> ONLINE</span>
        </div>

        <span class="hp-tech__coord">SYS.INIT // ASTROPATH v2.0 // READY</span>
      </div>

      <div class="hp-hero__inner">
        <div class="hp-hero__main">
          <h1 class="hp-hero__title">
            <span class="hp-hero__line hp-hero__line--lead">
              <span
                v-for="(w, wi) in leadWords"
                :key="'l'+wi"
                class="hp-w"
                :style="{ '--wi': wi }"
              ><span class="hp-w__inner">{{ w }}</span></span>
            </span>
            <span class="hp-hero__line hp-hero__line--anchor">
              <span class="hp-anchor-bracket">&lt;</span>
              <span
                v-for="(w, wi) in anchorWords"
                :key="'a'+wi"
                class="hp-w"
                :style="{ '--wi': wi }"
              ><span class="hp-w__inner">{{ w }}</span></span>
              <span class="hp-anchor-bracket">/&gt;</span>
              <span class="hp-anchor-cursor" />
            </span>
          </h1>
        </div>

        <div class="hp-hero__side">
          <p class="hp-hero__sub">
            AI 智能解析背景<br>为你生成专属留学路线图
          </p>
          <button
            ref="ctaBtnRef"
            class="hp-btn hp-btn--primary hp-btn--magnetic"
            @click="router.push('/assessment')"
            @mouseenter="onCtaEnter"
            @mouseleave="onCtaLeave"
            @mousemove="onCtaMove"
          >
            开始规划
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            ><path
              d="M3 8H13M9 4L13 8L9 12"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg>
          </button>
          <div class="hp-hero__stats">
            <span class="hp-stat"><em>{{ SCHOOL_COUNT_DISPLAY }}</em><i>院校</i></span>
            <span class="hp-stat"><em>6大</em><i>场景</i></span>
            <span class="hp-stat"><em>Multi-AI</em><i>协同</i></span>
          </div>
        </div>
      </div>
    </section>

    <div class="hp-marquee">
      <div class="hp-marquee__track">
        <span
          v-for="n in 8"
          :key="'m1-'+n"
          class="hp-marquee__item"
        >{{ SCHOOL_COUNT_DISPLAY }} 精选院校</span>
        <span class="hp-marquee__dot" />
        <span
          v-for="n in 8"
          :key="'m2-'+n"
          class="hp-marquee__item"
        >6 大核心场景</span>
        <span class="hp-marquee__dot" />
        <span
          v-for="n in 8"
          :key="'m3-'+n"
          class="hp-marquee__item"
        >Multi-AI 智能协同</span>
        <span class="hp-marquee__dot" />
      </div>
    </div>

    <!-- ===== SECTION 2: MANIFESTO — 理念宣言 (垂直布局) ===== -->
    <section
      ref="manifestoRef"
      class="hp-manifesto"
      :class="{ 'hp-manifesto--visible': manifestoVisible }"
    >
      <header class="hp-manifesto__header">
        <span class="hp-manifesto__eyebrow">WHAT WE BELIEVE</span>
        <h2 class="hp-manifesto__title">
          不是工具，是导航系统
        </h2>
      </header>

      <div class="hp-manifesto__list">
        <a
          v-for="(item, index) in manifestoItems"
          :key="index"
          :ref="el => { if (el) manifestoItemRefs[index] = el }"
          class="hp-manifesto__item"
          :class="[`hp-manifesto__item--${index % 2 === 0 ? 'even' : 'odd'}`, { 'hp-manifesto__item--visible': visibleItems.has(index) }]"
          :href="item.path"
          @click.prevent="router.push(item.path)"
        >
          <span class="hp-manifesto__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="hp-manifesto__body">
            <div class="hp-manifesto__head">
              <h3 class="hp-manifesto__item-title">{{ item.title }}</h3>
              <span class="hp-manifesto__cta">
                进入
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                ><path
                  d="M3 7H11M8 4L11 7L8 10"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg>
              </span>
            </div>
            <p class="hp-manifesto__item-desc">{{ item.desc }}</p>
          </div>
          <span class="hp-manifesto__line" />
        </a>
      </div>
    </section>

    <!-- ===== SECTION 3: BENTO GRID ===== -->
    <section
      ref="bentoRef"
      class="hp-bento"
      :class="{ 'hp-bento--visible': bentoVisible }"
    >
      <div class="hp-bento__inner">
        <header class="hp-bento__header">
          <span class="hp-bento__eyebrow">THE TOOLKIT</span>
          <h2 class="hp-bento__title">
            六大核心能力
          </h2>
        </header>

        <div class="hp-bento__grid">
          <a
            v-for="(card, idx) in bentoCards"
            :key="idx"
            :ref="el => { if (el) bentoCardRefs[idx] = el }"
            class="hp-bento__card"
            :class="[`hp-bento__card--${card.size}`, { 'hp-bento__card--visible': visibleBentoCards.has(idx) }]"
            :style="{ '--card-i': idx }"
            :href="card.path"
            @click.prevent="handleBentoClick($event, card.path)"
            @mouseenter="onBentoHover($event, true)"
            @mouseleave="onBentoHover($event, false)"
          >
            <span class="hp-bento__num">{{ String(idx + 1).padStart(2, '0') }}</span>
            <div class="hp-bento__card-body">
              <div
                v-if="card.icon && card.size === 'ai'"
                class="hp-bento__card-icon"
                v-html="card.icon"
              />
              <div class="hp-bento__card-content">
                <h3 class="hp-bento__card-title">{{ card.title }}</h3>
                <p
                  v-if="card.desc"
                  class="hp-bento__card-desc"
                >{{ card.desc }}</p>
                <span
                  v-if="card.size === 'ai'"
                  class="hp-bento__card-cta"
                >进入对话
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style="margin-left:6px;flex-shrink:0"
                  ><path
                    d="M3 6H9M7 3L10 6L7 9"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  /></svg>
                </span>
              </div>
            </div>
            <span class="hp-bento__corner hp-bento__corner--tl" />
            <span class="hp-bento__corner hp-bento__corner--br" />
          </a>
        </div>
      </div>
    </section>

    <!-- ===== SECTION 5: INVITATION — 终章 CTA ===== -->
    <section
      ref="invitationRef"
      class="hp-invitation"
      :class="{ 'hp-invitation--visible': invitationVisible }"
    >
      <div class="hp-invitation__grid-bg" />
      <span class="hp-invitation__watermark">LAUNCH</span>

      <div class="hp-invitation__inner">
        <div class="hp-invitation__left">
          <span class="hp-invitation__eyebrow">READY TO BEGIN?</span>
          <h2 class="hp-invitation__title">
            <span class="hp-invitation__title-line-1">
              <span
                v-for="(w, wi) in invLeadWords"
                :key="'il'+wi"
                class="hp-w hp-w--inv"
                :style="{ '--wi': wi }"
              ><span class="hp-w__inner">{{ w }}</span></span>
            </span>
            <span class="hp-invitation__title-line-2">
              <span
                v-for="(w, wi) in invAnchorWords"
                :key="'ia'+wi"
                class="hp-w hp-w--inv"
                :style="{ '--wi': wi }"
              ><span class="hp-w__inner">{{ w }}</span></span>
            </span>
          </h2>
          <p class="hp-invitation__sub">
            30 秒完成背景评估，获取专属留学路线图。<br>AI 将为你生成从选校到录取的完整规划。
          </p>
          <span class="hp-invitation__meta">
            <i class="hp-invitation__dot" />
            无需注册 · 完全免费 · 隐私安全
          </span>
        </div>

        <div class="hp-invitation__right">
          <button
            class="hp-btn hp-btn--hero"
            @click="router.push('/assessment')"
          >
            <span class="hp-btn-hero__content">
              <span class="hp-btn-hero__label">开始你的旅程</span>
              <span class="hp-btn-hero__sub">Start Your Journey</span>
            </span>
            <svg
              class="hp-btn-hero__arrow"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            ><path
              d="M5 12H19M13 6L19 12L13 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg>
            <span class="hp-btn-hero__border" />
          </button>
          <span class="hp-invitation__hint">按 Enter 或点击进入</span>
        </div>
      </div>

      <div class="hp-invitation__footer">
        <span class="hp-invitation__footer-line" />
        <span class="hp-invitation__footer-text">ASTROPATH v2.0 &copy; 2026</span>
      </div>
    </section>

    <SiteFooter
      v-if="false"
      @show-guide="guideVisible = true"
    />

    <button
      class="hp-back-to-top"
      :class="{ visible: showBackToTop }"
      title="返回顶部"
      @click="scrollToTop"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      ><path
        d="M8 12V4M4 8L8 4L12 8"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import SiteFooter from '../components/common/SiteFooter.vue'
import { SCHOOL_COUNT_DISPLAY } from '../data/schoolsData'

const router = useRouter()

const homePageRef = ref(null)
const heroRef = ref(null)
const gridBgRef = ref(null)
const ctaBtnRef = ref(null)
const manifestoRef = ref(null)
const bentoRef = ref(null)
const invitationRef = ref(null)

const heroVisible = ref(false)
const manifestoVisible = ref(false)
const bentoVisible = ref(false)
const invitationVisible = ref(false)
const showBackToTop = ref(false)

const guideVisible = inject('guideVisible')

const leadWords = ['一站式', '智能', '留学']
const anchorWords = ['规划', '平台']
const invLeadWords = ['准备好开始']
const invAnchorWords = ['你的留学旅程了吗？']

const mouseParallax = reactive({ x: 0, y: 0 })

const manifestoItems = [
  { title: '背景即地图', desc: '全面采集学术背景与实践经历，生成竞争力雷达图，让优势与短板一目了然。', path: '/assessment' },
  { title: 'AI 选校不是搜索', desc: `基于多维度数据智能匹配，AI 从 ${SCHOOL_COUNT_DISPLAY} 所院校中筛选最适合你的目标清单。`, path: '/school-recommendation' },
  { title: '时间可见方可掌控', desc: '动态时间线与任务看板，将漫长的申请季拆解为可执行的每日行动。', path: '/timeline' },
  { title: '材料有序，文书有力', desc: '结构化材料清单管理，配合AI文书助手，让每一份申请材料都精准有力。', path: '/materials' },
  { title: '数据面前人人平等', desc: '全球院校信息透明化，排名、学费、录取率、专业方向——全面对比，理性决策。', path: '/university-database' },
  { title: '多智能体协同思考', desc: 'Multi-AI 智能体团队在线协作，从选校策略到面试模拟，提供多维度专业建议。', path: '/ai-chat' }
]

const bentoCards = [
  { size: 'ai', title: 'AI 智能对话', desc: 'Multi-AI 智能体团队在线协作，随时获取专业申请建议。', icon: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 4v24M4 16h24"/><circle cx="16" cy="16" r="10"/></svg>', path: '/ai-chat' },
  { size: 'sm', title: '背景评估', desc: '竞争力雷达图', path: '/assessment' },
  { size: 'sm', title: 'AI 选校', desc: '智能匹配推荐', path: '/school-recommendation' },
  { size: 'sm', title: '时间规划', desc: '动态时间线管理', path: '/timeline' },
  { size: 'sm', title: '材料中心', desc: '文书与清单管理', path: '/materials' },
  { size: 'wide', title: '院校数据库', desc: `${SCHOOL_COUNT_DISPLAY} 所全球院校信息，支持按国家/排名/专业筛选，数据透明化决策。`, path: '/university-database' },
  { size: 'wide', title: '全流程覆盖', desc: '从背景评估到最终录取，AstroPath 陪伴你走完留学规划的每一步。', path: '/assessment' }
]

const visibleItems = reactive(new Set())
const visibleBentoCards = reactive(new Set())
const manifestoItemRefs = ref([])
const bentoCardRefs = ref([])

let heroObserver = null
let manifestoObserver = null
let bentoObserver = null
let invitationObserver = null
let itemObservers = []
let cardObservers = []

const scrollToManifesto = () => {
  manifestoRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleBentoClick = (e, path) => {
  router.push(path)
}

const onBentoHover = (e, entering) => {
  const card = e.currentTarget
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  if (entering) {
    card.style.setProperty('--mx', `${-(y / rect.width) * 8}deg`)
    card.style.setProperty('--my', `${(x / rect.height) * 8}deg`)
  } else {
    card.style.setProperty('--mx', '0deg')
    card.style.setProperty('--my', '0deg')
  }
}

const onHeroMouseMove = (e) => {
  const rect = heroRef.value?.getBoundingClientRect()
  if (!rect) return
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  mouseParallax.x = x * -50
  mouseParallax.y = y * -35
}

const onCtaEnter = () => {
  ctaBtnRef.value?.classList.add('hp-btn--magnetic--hover')
}
const onCtaLeave = () => {
  ctaBtnRef.value?.classList.remove('hp-btn--magnetic--hover')
  ctaBtnRef.value.style.transform = ''
}
const onCtaMove = (e) => {
  const btn = ctaBtnRef.value
  if (!btn) return
  const rect = btn.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 400
}

const setupObservers = () => {
  const observeWithDelay = (refVal, visibleRef, delay = 0) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => { visibleRef.value = true }, delay)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    return obs
  }

  heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => { heroVisible.value = true }, 100)
          heroObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  manifestoObserver = observeWithDelay(manifestoRef, manifestoVisible, 0)
  bentoObserver = observeWithDelay(bentoRef, bentoVisible, 0)
  invitationObserver = observeWithDelay(invitationRef, invitationVisible, 0)

  const itemObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target
        const idx = manifestoItemRefs.value.indexOf(el)
        if (idx >= 0 && entry.isIntersecting && !visibleItems.has(idx)) {
          setTimeout(() => { visibleItems.add(idx) }, idx * 100)
          itemObs.unobserve(el)
        }
      })
    },
    { threshold: 0.15 }
  )

  const cardObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target
        const idx = bentoCardRefs.value.indexOf(el)
        if (idx >= 0 && entry.isIntersecting && !visibleBentoCards.has(idx)) {
          setTimeout(() => { visibleBentoCards.add(idx) }, idx * 80)
          cardObs.unobserve(el)
        }
      })
    },
    { threshold: 0.1 }
  )

  nextTick(() => {
    if (heroRef.value) heroObserver.observe(heroRef.value)
    if (manifestoRef.value) manifestoObserver.observe(manifestoRef.value)
    if (bentoRef.value) bentoObserver.observe(bentoRef.value)
    if (invitationRef.value) invitationObserver.observe(invitationRef.value)

    manifestoItemRefs.value.forEach(el => { if (el) itemObs.observe(el) })
    bentoCardRefs.value.forEach(el => { if (el) cardObs.observe(el) })

    itemObservers.push(itemObs)
    cardObservers.push(cardObs)
  })

  return () => {
    itemObs.disconnect()
    cardObs.disconnect()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  setupObservers()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  heroObserver?.disconnect()
  manifestoObserver?.disconnect()
  bentoObserver?.disconnect()
  invitationObserver?.disconnect()
  itemObservers.forEach(o => o.disconnect())
  cardObservers.forEach(o => o.disconnect())
})
</script>

<style scoped>
.hp-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-background);
  overflow-x: hidden;
  cursor: default;
}

.hp-page > * {
  box-sizing: border-box;
  max-width: 100%;
}

.hp-noise {
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
   SECTION 1: HERO
   ============================================ */
.hp-hero {
  position: relative;
  overflow: hidden;
  height: calc(100dvh - 64px);
  margin-top: 0;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.hp-hero--visible { opacity: 1; }

.hp-hero__grid-bg {
  position: absolute;
  inset: -40px;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 45%, black 22%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 45%, black 22%, transparent 100%);
  transition: transform 0.15s ease-out;
  will-change: transform;
  transform: translate(var(--px), var(--py));
}

.hp-hero__cursor-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.09) 0%, rgba(217, 119, 6, 0.03) 30%, transparent 65%);
  pointer-events: none;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
  transform: translate(calc(-50% + var(--cgx)), calc(-50% + var(--cgy)));
  z-index: 0;
}


/* ===== 科技感装饰层 — 密集版 ===== */
.hp-hero__tech {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.hp-tech__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease 0.3s;
}
.hp-hero--visible .hp-tech__svg { opacity: 1; }


/* 巨型水印文字 */
.hp-tech__watermark {
  position: absolute;
  font-family: var(--font-family-mono);
  font-weight: 800;
  color: var(--color-solid);
  opacity: 0;
  letter-spacing: -0.06em;
  line-height: 0.85;
  user-select: none;
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
}
.hp-hero--visible .hp-tech__watermark { opacity: 0.03; }

.hp-tech__watermark {
  bottom: 18%;
  right: 4%;
  font-size: clamp(140px, 18vw, 280px);
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
.hp-tech__watermark--sub {
  top: 12%;
  left: 3%;
  font-size: clamp(56px, 7vw, 110px);
  letter-spacing: 0.08em;
  writing-mode: horizontal-tb;
}


/* 坐标轴 */
.hp-tech__axis {
  position: absolute;
  background: rgba(15, 23, 42, 0.07);
}
.hp-tech__axis--x {
  bottom: 24%;
  left: 5%;
  width: 22%;
  height: 1px;
}
.hp-tech__axis--y {
  top: 22%;
  left: 6%;
  width: 1px;
  height: 30%;
}

.hp-tech__label {
  position: absolute;
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 600;
  color: var(--color-border);
  letter-spacing: 2px;
  text-transform: uppercase;
}
.hp-tech__label--x {
  bottom: calc(24% - 14px);
  left: calc(5% + 22% + 4px);
}
.hp-tech__label--y {
  top: 22%;
  left: calc(6% - 12px);
}

/* 刻度线 */
.hp-tech__ticks-x {
  position: absolute;
  bottom: calc(24% - 3px);
  left: 5%;
  width: 22%;
  display: flex;
  justify-content: space-between;
}
.hp-tech__ticks-y {
  position: absolute;
  top: 22%;
  left: calc(6% - 3px);
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hp-tech__tick {
  width: 6px;
  height: 1px;
  background: rgba(15, 23, 42, 0.1);
  opacity: 0;
  animation: tickIn 0.3s ease forwards;
  animation-delay: calc(var(--ti) * 0.1s + 1.2s);
}
.hp-hero--visible .hp-tech__tick { animation-delay: calc(var(--ti) * 0.1s + 1.2s); }
.hp-tech__tick--y {
  width: 1px;
  height: 6px;
}
@keyframes tickIn {
  from { opacity: 0; transform: scaleX(0); }
  to   { opacity: 1; transform: scaleX(1); }
}


/* 扫描线 */
.hp-tech__scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.18), transparent);
  animation: scanMove 4s ease-in-out infinite;
  opacity: 0;
  transition: opacity 0.8s ease 1s;
}
.hp-tech__scanline--h {
  top: 0;
  right: 0;
  bottom: 0;
  width: 2px;
  height: auto;
  background: linear-gradient(180deg, transparent, rgba(15, 23, 42, 0.1), transparent);
  animation: scanMoveH 5s ease-in-out infinite;
  animation-delay: 1s;
}
.hp-hero--visible .hp-tech__scanline { opacity: 1; }

@keyframes scanMove {
  0%, 100% { top: 8%; }
  50% { top: 88%; }
}
@keyframes scanMoveH {
  0%, 100% { right: 6%; }
  50% { right: 92%; }
}


/* 浮动 UI 元素 */
.hp-tech__floating-ui {
  position: absolute;
  inset: 0;
}
.hp-fui {
  position: absolute;
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 1px;
  white-space: nowrap;
  opacity: 0;
  animation: fuiFloat 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--fi, 0) * 0.12s + 1.4s);
}
.hp-hero--visible .hp-fui { animation-delay: calc(var(--fi, 0) * 0.12s + 1.4s); }

.hp-fui--coord {
  --fi: 0;
  top: 16%;
  right: 18%;
  color: var(--color-border);
  padding: 4px 8px;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
}
.hp-fui--coord b { color: var(--color-accent); font-weight: 700; }

.hp-fui--coord:nth-of-type(2) {
  --fi: 1;
  top: calc(16% + 22px);
  right: 18%;
}

.hp-fui--badge {
  --fi: 2;
  top: 40%;
  left: 8%;
  color: #065F46;
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  border-radius: 4px;
  padding: 3px 8px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.hp-fui--hex {
  --fi: 3;
  bottom: 36%;
  right: 12%;
  color: var(--color-text-tertiary);
  padding: 3px 7px;
  border: 1px solid var(--color-border-light);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  font-weight: 600;
}

.hp-fui--mini {
  --fi: 4;
  top: 68%;
  left: 14%;
  color: var(--color-accent);
  font-weight: 700;
  font-size: 10px;
  padding: 4px 10px;
  border: 1px solid rgba(217, 119, 6, 0.2);
  border-radius: 20px;
  background: rgba(217, 119, 6, 0.06);
}

.hp-fui--status {
  --fi: 5;
  bottom: 16%;
  left: 10%;
  color: var(--color-border);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}
.hp-fui--status i {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes fuiFloat {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes statusPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { opacity: 0.6; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0); }
}


/* 系统坐标文字 */
.hp-tech__coord {
  position: absolute;
  bottom: 20px;
  right: 52px;
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--color-border);
  opacity: 0;
  transition: opacity 0.5s ease 1.2s;
}
.hp-hero--visible .hp-tech__coord { opacity: 0.5; }

.hp-hero__glow {
  position: absolute;
  bottom: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 450px;
  background: radial-gradient(ellipse, rgba(217, 119, 6, 0.055) 0%, transparent 65%);
  pointer-events: none;
}

.hp-hero__inner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 72px;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  padding: 64px 52px 0;
  box-sizing: border-box;
}


/* ===== 左栏: 主标题 · 逐词clip-reveal ===== */
.hp-hero__main { }

.hp-hero__title {
  margin: 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hp-hero__line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2em;
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-family: var(--font-family-base);
}

.hp-w {
  display: inline-block;
  overflow: hidden;
  position: relative;
}
.hp-w__inner {
  display: inline-block;
  opacity: 0;
  transform: translateY(110%);
  transition:
    transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--wi) * 0.08s + var(--line-base, 0.1s));
}
.hp-hero--visible .hp-w__inner {
  transform: translateY(0);
  opacity: 1;
}

.hp-hero__line--lead {
  --line-base: 0.08s;
  font-size: clamp(34px, 4.8vw, 62px);
  font-weight: 700;
  color: var(--color-text-secondary);
}

.hp-hero__line--anchor {
  --line-base: 0.28s;
  font-size: clamp(56px, 10vw, 120px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--color-solid);
  font-family: var(--font-family-mono);
}

.hp-anchor-bracket {
  display: inline-block;
  font-family: var(--font-family-mono);
  font-size: 0.5em;
  font-weight: 400;
  color: var(--color-accent);
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  vertical-align: middle;
}
.hp-hero--visible .hp-anchor-bracket {
  opacity: 0.7;
  transform: translateY(0);
  transition-delay: 0.7s;
}

.hp-anchor-cursor {
  display: inline-block;
  width: 3px;
  height: 0.72em;
  background: var(--color-accent);
  margin-left: 6px;
  vertical-align: baseline;
  border-radius: 2px;
  animation: hpBlink 1s step-end infinite;
  opacity: 0;
  transition: opacity 0.3s ease 0.9s;
}
.hp-hero--visible .hp-anchor-cursor { opacity: 1; }
@keyframes hpBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}


/* ===== 右栏 ===== */
.hp-hero__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.hp-hero--visible .hp-hero__side {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.55s;
}

.hp-hero__sub {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.75;
  margin: 0;
  max-width: 240px;
}


/* ===== 按钮 ===== */
.hp-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-family-base);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.02em;
  white-space: nowrap;
  will-change: transform;
}

.hp-btn--primary {
  padding: 20px 40px;
  background: var(--color-solid);
  color: white;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12);
  font-size: 16px;
}
.hp-btn--primary:hover {
  background: var(--color-solid-hover);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2), 0 4px 10px rgba(15, 23, 42, 0.08);
}
.hp-btn--primary:active { transform: scale(0.97); }

.hp-btn--magnetic {
  transition: box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
}
.hp-btn--magnetic--hover {
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.25), 0 6px 16px rgba(15, 23, 42, 0.1);
}

.hp-btn--ghost {
  padding: 13px 24px;
  background: transparent;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border-light);
  border-radius: 12px;
}
.hp-btn--ghost:hover {
  color: var(--color-solid);
  border-color: var(--color-solid);
  background: rgba(15, 23, 42, 0.03);
  transform: translateY(-2px);
}

.hp-btn--lg {
  padding: 18px 44px;
  font-size: 16px;
  border-radius: 14px;
}


/* ===== Stats ===== */
.hp-hero__stats {
  display: flex;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-light);
}

.hp-stat { text-align: left; }
.hp-stat em {
  display: block;
  font-family: var(--font-family-mono);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-solid);
  letter-spacing: -0.02em;
  line-height: 1.2;
  font-style: normal;
}
.hp-stat i {
  display: block;
  font-family: var(--font-family-mono);
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-style: normal;
  margin-top: 1px;
}


/* ============================================
   MARQUEE 跑马灯
   ============================================ */
.hp-marquee {
  overflow: hidden;
  padding: 28px 0;
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-background-alt);
}
.hp-marquee__track {
  display: flex;
  align-items: center;
  gap: 40px;
  width: max-content;
  animation: marqueeScroll 40s linear infinite;
  will-change: transform;
}
.hp-marquee__item {
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  flex-shrink: 0;
}
.hp-marquee__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
  opacity: 0.6;
}
@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}


/* ============================================
   SECTION 2: MANIFESTO — 编辑式理念宣言
   ============================================ */
.hp-manifesto {
  padding: 90px 52px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.hp-manifesto--visible {
  opacity: 1;
  transform: translateY(0);
}

.hp-manifesto__header {
  text-align: center;
  margin-bottom: 56px;
}
.hp-manifesto__eyebrow {
  display: block;
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--color-accent);
  text-transform: uppercase;
  margin-bottom: 14px;
}
.hp-manifesto__title {
  font-family: var(--font-family-base);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0;
}

.hp-manifesto__list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  max-width: 1160px;
  margin: 0 auto;
  position: relative;
}

.hp-manifesto__item {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 36px 28px 36px 0;
  text-decoration: none;
  color: inherit;
  background: transparent;
  border-bottom: 1px solid var(--color-border-light);
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.4s ease;
  overflow: hidden;
}
.hp-manifesto__item:nth-child(-n+2) { border-top: 1px solid var(--color-border-light); }
.hp-manifesto__item:nth-child(odd) { border-right: 1px solid var(--color-border-light); }
.hp-manifesto__item--visible {
  opacity: 1;
  transform: translateY(0);
}

.hp-manifesto__item:hover {
  background: rgba(15, 23, 42, 0.015);
}
.hp-manifesto__item:hover .hp-manifesto__line {
  transform: scaleY(1);
  background: var(--color-accent);
}
.hp-manifesto__item:hover .hp-manifesto__index {
  color: var(--color-accent);
  transform: translateY(-2px);
}
.hp-manifesto__item:hover .hp-manifesto__item-title {
  color: var(--color-solid);
}
.hp-manifesto__item:hover .hp-manifesto__cta {
  opacity: 1;
  transform: translateX(0);
  color: var(--color-accent);
}


.hp-manifesto__index {
  position: relative;
  font-family: var(--font-family-mono);
  font-size: clamp(56px, 7vw, 88px);
  font-weight: 800;
  color: var(--color-border);
  letter-spacing: -0.05em;
  line-height: 0.85;
  flex-shrink: 0;
  width: 72px;
  opacity: 0.35;
  transition:
    color 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.4s ease;
  user-select: none;
}
.hp-manifesto__item:hover .hp-manifesto__index { opacity: 0.7; }


.hp-manifesto__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  padding-right: 8px;
}

.hp-manifesto__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.hp-manifesto__item-title {
  font-family: var(--font-family-base);
  font-size: clamp(19px, 2vw, 24px);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
  line-height: 1.25;
  margin: 0;
  transition: color 0.3s ease;
}

.hp-manifesto__cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  white-space: nowrap;
  color: var(--color-text-tertiary);
  opacity: 0;
  transform: translateX(-8px);
  transition:
    opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    color 0.3s ease;
  flex-shrink: 0;
}

.hp-manifesto__item-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
}


.hp-manifesto__line {
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 0%;
  background: var(--color-solid);
  transform: translateY(-50%) scaleY(0);
  transform-origin: center;
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s ease;
  border-radius: 2px;
}


/* ============================================
   SECTION 3: BENTO — 能力矩阵 (编辑式)
   ============================================ */
.hp-bento {
  padding: 60px 40px 80px;
  background: var(--color-background-alt);
  overflow: hidden;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.hp-bento--visible {
  opacity: 1;
  transform: translateY(0);
}

.hp-bento__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.hp-bento__header {
  text-align: center;
  margin-bottom: 56px;
}
.hp-bento__eyebrow {
  display: block;
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--color-accent);
  text-transform: uppercase;
  margin-bottom: 16px;
}
.hp-bento__title {
  font-family: var(--font-family-base);
  font-size: clamp(24px, 3.5vw, 38px);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  margin: 0;
}

.hp-bento__grid {
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto;
  overflow: hidden;
}

.hp-bento__card {
  --mx: 0deg;
  --my: 0deg;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 200px;
  text-decoration: none;
  color: inherit;
  background: var(--color-surface);
  opacity: 0;
  transform: translateY(32px) scale(0.97);
  transition:
    opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
.hp-bento__card--visible {
  opacity: 1;
  transform: perspective(900px) rotateX(var(--my)) rotateY(var(--mx)) translateY(0) scale(1);
}


/* ===== AI 英雄卡片 — 暗色主导 ===== */
.hp-bento__card--ai {
  grid-column: span 2;
  grid-row: span 2;
  min-height: 420px;
  background: var(--color-solid);
  color: #F8FAFC;
  border-radius: 20px;
}
.hp-bento__card--ai .hp-bento__num {
  color: rgba(248, 250, 252, 0.06);
  right: -8%;
  bottom: -6%;
  font-size: clamp(160px, 22vw, 280px);
}
.hp-bento__card--ai .hp-bento__card-body {
  padding: 44px;
}
.hp-bento__card--ai .hp-bento__card-icon {
  color: var(--color-accent);
  margin-bottom: 28px;
  opacity: 0.85;
  transition: all 0.4s ease;
}
.hp-bento__card--ai:hover .hp-bento__card-icon {
  opacity: 1;
  transform: scale(1.08);
}
.hp-bento__card--ai .hp-bento__card-title {
  font-size: clamp(26px, 3vw, 36px);
  color: #FFFFFF;
  line-height: 1.15;
}
.hp-bento__card--ai .hp-bento__card-desc {
  color: rgba(248, 250, 252, 0.55);
  font-size: 15px;
  max-width: 340px;
  line-height: 1.7;
}
.hp-bento__card--ai .hp-bento__card-cta {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-accent);
  margin-top: auto;
  padding-top: 28px;
  letter-spacing: 0.03em;
  gap: 8px;
}
.hp-bento__card--ai .hp-bento__corner { border-color: rgba(255,255,255,0.08); }
.hp-bento__card--ai:hover {
  transform: perspective(900px) rotateX(var(--my)) rotateY(var(--mx)) scale(1.01);
  box-shadow:
    0 30px 60px -15px rgba(15, 23, 42, 0.35),
    0 12px 24px -8px rgba(15, 23, 42, 0.2);
}


/* ===== 普通卡片 — 极简编辑式 ===== */
.hp-bento__card--sm {
  grid-column: span 1;
  grid-row: span 1;
  min-height: 200px;
  padding: 32px 28px;
  border-right: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
  border-radius: 0;
}
.hp-bento__card--sm:nth-child(3n + 3) { border-right: none; }

.hp-bento__card--wide {
  grid-column: span 2;
  grid-row: span 1;
  min-height: 180px;
  padding: 32px 36px;
  border-bottom: 1px solid var(--color-border-light);
  border-radius: 0;
}

.hp-bento__card--sm:hover,
.hp-bento__card--wide:hover {
  background: rgba(15, 23, 42, 0.02);
}
.hp-bento__card--sm:hover,
.hp-bento__card--wide:hover {
  transform: perspective(900px) rotateX(var(--my)) rotateY(var(--mx)) translateX(4px);
}


/* ===== 巨型数字水印 ===== */
.hp-bento__num {
  position: absolute;
  top: -8px;
  right: 4px;
  font-family: var(--font-family-mono);
  font-size: clamp(72px, 9vw, 120px);
  font-weight: 800;
  color: var(--color-border-light);
  letter-spacing: -0.06em;
  line-height: 0.85;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  opacity: 0.18;
  transition:
    color 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.5s ease,
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.hp-bento__card--sm:hover .hp-bento__num,
.hp-bento__card--wide:hover .hp-bento__num {
  color: var(--color-accent);
  opacity: 0.35;
  transform: translate(-4px, -2px) scale(1.05);
}


/* ===== 卡片内容 ===== */
.hp-bento__card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  padding: 0;
}

.hp-bento__card-content {
  position: relative;
  z-index: 1;
}

.hp-bento__card-title {
  font-family: var(--font-family-base);
  font-size: clamp(18px, 1.8vw, 22px);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
  margin: 0 0 10px;
  line-height: 1.25;
  transition: color 0.3s ease;
}
.hp-bento__card--sm:hover .hp-bento__card-title,
.hp-bento__card--wide:hover .hp-bento__card-title {
  color: var(--color-solid);
}

.hp-bento__card-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
}


/* ===== 角标装饰 (编辑式 L形角线) ===== */
.hp-bento__corner {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.4s ease 0.05s;
}
.hp-bento__card:hover .hp-bento__corner { opacity: 1; }

.hp-bento__corner--tl {
  top: 14px;
  left: 14px;
  border-top: 1.5px solid var(--color-accent);
  border-left: 1.5px solid var(--color-accent);
}
.hp-bento__corner--br {
  bottom: 14px;
  right: 14px;
  border-bottom: 1.5px solid var(--color-accent);
  border-right: 1.5px solid var(--color-accent);
}


/* ============================================
   SECTION 5: INVITATION — 暗色终章
   ============================================ */
.hp-invitation {
  position: relative;
  padding: 68px 40px 100px;
  background: var(--color-solid);
  color: #F8FAFC;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.hp-invitation--visible {
  opacity: 1;
}


/* ===== 背景网格 + 水印 ===== */
.hp-invitation__grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(ellipse 85% 60% at 50% 45%, black 25%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 85% 60% at 50% 45%, black 25%, transparent 100%);
}

.hp-invitation__watermark {
  position: absolute;
  bottom: -4%;
  right: 2%;
  font-family: var(--font-family-mono);
  font-size: clamp(180px, 22vw, 340px);
  font-weight: 800;
  color: rgba(248, 250, 252, 0.03);
  letter-spacing: -0.06em;
  line-height: 0.85;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}


/* ===== 主布局：非对称双栏 ===== */
.hp-invitation__inner {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 64px;
  align-items: center;
}


/* ===== 左栏：标题区 ===== */
.hp-invitation__left { }

.hp-invitation__eyebrow {
  display: inline-block;
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--color-accent);
  text-transform: uppercase;
  margin-bottom: 28px;
}

.hp-invitation__title {
  font-family: var(--font-family-base);
  font-size: clamp(36px, 5.5vw, 68px);
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hp-invitation__title-line-1,
.hp-invitation__title-line-2 {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15em;
  line-height: 1.05;
}

.hp-w--inv .hp-w__inner {
  opacity: 0;
  transform: translateY(110%);
  transition:
    transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--wi) * 0.08s + 0.6s);
}
.hp-invitation--visible .hp-w--inv .hp-w__inner {
  transform: translateY(0);
  opacity: 1;
}

.hp-invitation__sub {
  font-size: 16px;
  color: rgba(248, 250, 252, 0.5);
  line-height: 1.75;
  margin: 0 0 32px;
  max-width: 480px;
}

.hp-invitation__meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  color: rgba(248, 250, 252, 0.3);
  text-transform: uppercase;
}
.hp-invitation__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  animation: invPulse 2.5s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes invPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
}


/* ===== 右栏：英雄 CTA ===== */
.hp-invitation__right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.hp-btn--hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 36px 44px;
  min-width: 280px;
  background: transparent;
  border: 1.5px solid rgba(248, 250, 252, 0.12);
  border-radius: 18px;
  cursor: pointer;
  transition:
    border-color 0.4s ease,
    background 0.4s ease,
    box-shadow 0.4s ease,
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  color: #FFFFFF;
  text-align: left;
}
.hp-btn--hero:hover {
  border-color: var(--color-accent);
  background: rgba(217, 119, 6, 0.06);
  box-shadow:
    0 20px 50px -12px rgba(217, 119, 6, 0.2),
    0 8px 20px -8px rgba(217, 119, 6, 0.1);
  transform: translateY(-3px);
}
.hp-btn--hero:active { transform: scale(0.98); }

.hp-btn-hero__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hp-btn-hero__label {
  font-family: var(--font-family-base);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.hp-btn-hero__sub {
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  color: rgba(248, 250, 252, 0.4);
  text-transform: uppercase;
}

.hp-btn-hero__arrow {
  flex-shrink: 0;
  color: var(--color-accent);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
}
.hp-btn--hero:hover .hp-btn-hero__arrow {
  transform: translateX(4px);
  color: var(--color-accent);
}

.hp-btn-hero__border {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  padding: 1.5px;
  background: linear-gradient(135deg, var(--color-accent), transparent 60%, var(--color-accent));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.hp-btn--hero:hover .hp-btn-hero__border { opacity: 0.6; }


.hp-invitation__hint {
  font-family: var(--font-family-mono);
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(248, 250, 252, 0.2);
  text-transform: uppercase;
}


/* ===== 底部签名栏 ===== */
.hp-invitation__footer {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 72px auto 0;
  display: flex;
  align-items: center;
  gap: 20px;
}
.hp-invitation__footer-line {
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, rgba(248, 250, 252, 0.12), transparent);
}
.hp-invitation__footer-text {
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 3px;
  color: rgba(248, 250, 252, 0.2);
  text-transform: uppercase;
  white-space: nowrap;
}


/* ===== 返回顶部按钮 ===== */
.hp-back-to-top {
  position: fixed;
  right: 28px;
  bottom: 28px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-slate-700);
  border: 1.5px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
}
.hp-back-to-top.visible {
  opacity: 1;
  pointer-events: auto;
}
.hp-back-to-top:hover {
  background: var(--color-solid);
  color: white;
  border-color: var(--color-solid);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}


/* ============================================
   响应式设计
   ============================================ */

@media (max-width: 1199px) {
  .hp-hero { height: calc(100dvh - 56px); margin-top: 0; }
  .hp-hero__inner { padding: 52px 36px 0; gap: 56px; max-width: 1160px; }
  .hp-hero__line--lead { font-size: clamp(28px, 4.2vw, 54px); }
  .hp-hero__line--anchor { font-size: clamp(50px, 10vw, 108px); }
  .hp-hero__sub { max-width: 210px; }

  .hp-marquee { padding: 22px 0; }
  .hp-manifesto { padding: 70px 36px; }
  .hp-manifesto__item { padding: 30px 24px 30px 0; }
  .hp-manifesto__index { font-size: clamp(48px, 6vw, 72px); width: 60px; }

  .hp-bento { padding: 48px 28px 24px; }
  .hp-bento__grid { gap: 2px; }
  .hp-bento__card--ai { min-height: 360px; }
  .hp-bento__card--ai .hp-bento__card-body { padding: 32px; }
  .hp-bento__card--ai .hp-bento__num { font-size: clamp(120px, 18vw, 220px); }
  .hp-bento__card--sm { padding: 26px 22px; min-height: 180px; }
  .hp-bento__card--wide { padding: 26px 28px; min-height: 160px; }

  .hp-invitation { padding: 48px 28px 72px; }
  .hp-invitation__inner { grid-template-columns: 1fr; gap: 44px; }
  .hp-invitation__watermark { font-size: clamp(120px, 20vw, 220px); }
  .hp-btn--hero { min-width: auto; width: 100%; max-width: 360px; padding: 30px 36px; }
  .hp-invitation__footer { margin-top: 52px; }
}

@media (max-width: 767px) {
  .hp-hero { height: calc(100dvh - 52px); margin-top: 0; }
  .hp-hero__inner {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 28px 24px 0;
    align-items: center;
  }
  .hp-hero__line--lead { font-size: clamp(26px, 7.5vw, 42px); }
  .hp-hero__line--anchor { font-size: clamp(42px, 12vw, 78px); }
  .hp-hero__side { gap: 18px; }
  .hp-hero__sub { max-width: 100%; font-size: 13px; }
  .hp-hero__stats { gap: 16px; }
  .hp-scroll-hint { left: 24px; bottom: 28px; }

  .hp-tech__watermark { font-size: clamp(100px, 22vw, 200px); }
  .hp-tech__watermark--sub { font-size: clamp(40px, 9vw, 76px); }
  .hp-tech__svg { opacity: 0.4; }

  .hp-fui { font-size: 8px; }
  .hp-fui--coord { padding: 3px 6px; }
  .hp-fui--badge { padding: 2px 6px; font-size: 8px; }
  .hp-fui--hex { display: none; }
  .hp-fui--mini { font-size: 9px; }
  .hp-fui--status { font-size: 8px; }

  .hp-marquee { padding: 18px 0; }
  .hp-marquee__track { gap: 28px; animation-duration: 30s; }
  .hp-marquee__item { font-size: 10px; letter-spacing: 2px; }

  .hp-manifesto { padding: 50px 20px; }
  .hp-manifesto__list {
    grid-template-columns: 1fr;
  }
  .hp-manifesto__item {
    padding: 28px 20px 28px 0;
    border-right: none !important;
  }
  .hp-manifesto__item:nth-child(odd) { border-right: none; }
  .hp-manifesto__index { font-size: clamp(42px, 10vw, 64px); width: 52px; }
  .hp-manifesto__body { padding-left: 16px; }
  .hp-manifesto__head { flex-direction: column; align-items: flex-start; gap: 4px; margin-bottom: 6px; }
  .hp-manifesto__item-title { font-size: 18px; }
  .hp-manifesto__item-desc { font-size: 12px; }

  .hp-bento { padding: 44px 20px 40px; }
  .hp-bento__header { margin-bottom: 36px; }
  .hp-bento__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .hp-bento__card--ai,
  .hp-bento__card--sm,
  .hp-bento__card--wide {
    grid-column: span 1;
    grid-row: span 1;
    min-height: auto;
    border-right: none !important;
    border-radius: 12px !important;
    padding: 24px 20px;
    margin-bottom: 12px;
  }
  .hp-bento__card { min-height: 140px; border-bottom: none; }
  .hp-bento__card--ai {
    background: var(--color-solid);
    color: #F8FAFC;
    min-height: 200px;
    margin-bottom: 16px;
  }
  .hp-bento__card--ai .hp-bento__card-body { padding: 28px; }
  .hp-bento__card--ai .hp-bento__num { font-size: clamp(80px, 18vw, 140px); right: -2%; bottom: -4%; }
  .hp-bento__card--ai .hp-bento__card-title { font-size: 22px; }
  .hp-bento__card-title { font-size: 17px; }
  .hp-bento__num { font-size: clamp(52px, 10vw, 80px); }

  .hp-invitation { padding: 52px 20px 64px; }
  .hp-invitation__inner {
    grid-template-columns: 1fr;
    gap: 36px;
    text-align: center;
  }
  .hp-invitation__left { display: flex; flex-direction: column; align-items: center; }
  .hp-invitation__title { font-size: clamp(28px, 8vw, 44px); text-align: center; }
  .hp-invitation__title-line-1,
  .hp-invitation__title-line-2 { justify-content: center; }
  .hp-invitation__sub { font-size: 14px; max-width: 100%; text-align: center; }
  .hp-invitation__watermark { font-size: clamp(90px, 24vw, 160px); right: -4%; bottom: 0; }
  .hp-btn--hero {
    width: 100%;
    max-width: none;
    padding: 28px 32px;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }
  .hp-btn-hero__content { align-items: center; }
  .hp-btn-hero__arrow { transform: rotate(-90deg); }
  .hp-btn--hero:hover .hp-btn-hero__arrow { transform: rotate(-90deg) translateX(4px); }
  .hp-invitation__footer { margin-top: 48px; flex-direction: column-reverse; gap: 12px; }

  .hp-back-to-top { right: 18px; bottom: 18px; width: 42px; height: 42px; }
}

@media (max-width: 480px) {
  .hp-hero__inner { padding: 0 20px; gap: 22px; }
  .hp-hero__line--lead { font-size: clamp(24px, 8.5vw, 38px); }
  .hp-hero__line--anchor { font-size: clamp(38px, 14vw, 72px); }
  .hp-hero__title { gap: 14px; }
  .hp-manifesto__item { padding: 24px 16px 24px 0; }
  .hp-manifesto__index { font-size: clamp(38px, 12vw, 56px); width: 46px; }
  .hp-btn--lg { padding: 16px 36px; font-size: 16px; }
}


/* ===== 减少动画偏好 ===== */
@media (prefers-reduced-motion: reduce) {
  .hp-hero,
  .hp-manifesto,
  .hp-bento,
  .hp-invitation {
    transition: opacity 0.3s ease;
    opacity: 1;
    transform: none;
  }
  .hp-w__inner { transform: none; transition: none; opacity: 1; }
  .hp-hero__side { transform: none; transition: none; opacity: 1; }
  .hp-bento__card {
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    transform: none !important;
  }
  .hp-bento__card:hover { transform: none; }
  .hp-bento__card--visible { transform: none !important; opacity: 1; }
  .hp-manifesto__item {
    transition: background 0.2s ease;
    opacity: 1;
    transform: none;
  }
  .hp-manifesto__item--visible { transform: none; opacity: 1; }
  .hp-manifesto__index { transition: none; opacity: 0.4 !important; transform: none !important; }
  .hp-manifesto__line { transform: scaleY(0) !important; }
  .hp-manifesto__cta { transition: none; opacity: 0.5 !important; transform: none !important; }
  .hp-marquee__track { animation: none; }
  .hp-scroll-hint { animation: none; opacity: 1; }
  .hp-scroll-hint__line { animation: none; }
  .hp-hero__grid-bg { transition: none; transform: none !important; }
  .hp-hero__cursor-glow { display: none; }
  .hp-anchor-bracket,
  .hp-anchor-cursor { animation: none; opacity: 0.7 !important; }
  .hp-tech__scanline { animation: none; }
  .hp-tech__svg { opacity: 0.5 !important; transition: none; }
  .hp-tech__watermark { opacity: 0.03 !important; transition: none; }
  .hp-tech__tick { animation: none; opacity: 0.5 !important; transform: scaleX(1); }
  .hp-fui { animation: none; opacity: 0.7 !important; transform: none; }
  .hp-fui--status i { animation: none; }
  .hp-w--inv .hp-w__inner { transform: none !important; transition: none; opacity: 1 !important; }
  .hp-invitation__dot { animation: none; }
}
</style>
