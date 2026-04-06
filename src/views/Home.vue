<template>
  <div
    ref="homePageRef"
    class="home-page"
  >
    <!-- Hero区域 -->
    <section
      ref="heroRef"
      class="hero"
    >
      <!-- 视差滚动背景层 -->
      <div
        ref="heroParallaxRef"
        class="hero-parallax-layer"
      >
        <!-- 星座网络背景 - 科技感 -->
        <div class="hero-network-bg">
          <canvas
            ref="networkCanvas"
            class="network-canvas"
          />
        </div>
        <!-- 渐变叠加层 -->
        <div class="hero-gradient-overlay" />
        <!-- 动态光晕装饰 -->
        <div class="hero-glow-decoration" />
      </div>

      <div
        class="hero-content"
        :class="{ 'is-visible': heroVisible }"
      >
        <h1 class="hero-title">
          {{ animatedTitle }}
        </h1>
        <p class="hero-subtitle">
          {{ animatedSubtitle }}
        </p>
        <div class="hero-actions">
          <el-button
            type="primary"
            size="large"
            class="cta-button"
            @click="router.push('/assessment')"
          >
            开始规划
          </el-button>
          <el-button
            size="large"
            class="secondary-button"
            @click="router.push('/university-database')"
          >
            探索院校
          </el-button>
        </div>
        <div class="hero-stats">
          <div
            v-for="(stat, index) in heroStats"
            :key="index"
            class="stat-item"
          >
            <span class="stat-number">{{ stat.animated || stat.value }}</span>
            <span class="stat-desc">{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <!-- 滚动提示 -->
      <div
        class="scroll-indicator"
        @click="scrollToNextSection"
      >
        <div class="scroll-mouse">
          <div class="scroll-wheel" />
        </div>
        <span class="scroll-text">向下滚动</span>
      </div>
    </section>

    <!-- 核心功能展示 -->
    <section
      ref="featuresRef"
      class="features"
      :class="{ 'is-visible': featuresVisible }"
    >
      <div class="container">
        <h2 class="section-title">
          核心功能
        </h2>
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="navigateTo(feature.path)"
          >
            <div class="feature-icon-wrapper">
              <el-icon class="feature-icon">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
            <el-link
              type="primary"
              underline="never"
              class="feature-link"
              :href="feature.path"
            >
              了解更多
              <el-icon class="link-arrow">
                <ArrowRight />
              </el-icon>
            </el-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台特色 -->
    <section
      ref="highlightsRef"
      class="highlights"
      :class="{ 'is-visible': highlightsVisible }"
    >
      <!-- 背景装饰 -->
      <div class="highlights-bg-decoration">
        <div class="bg-circle bg-circle-1" />
        <div class="bg-circle bg-circle-2" />
        <div class="bg-grid" />
      </div>
      <div class="container">
        <h2 class="section-title">
          为什么选择我们
        </h2>
        <div class="highlights-content">
          <div
            v-for="(item, index) in highlights"
            :key="index"
            class="highlight-item"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="highlight-number">
              {{ String(index + 1).padStart(2, '0') }}
            </div>
            <div class="highlight-icon-wrapper">
              <div class="icon-ring" />
              <el-icon
                :size="40"
                :color="'var(--color-slate-700)'"
              >
                <component :is="item.icon" />
              </el-icon>
            </div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section
      ref="ctaRef"
      class="cta-section"
      :class="{ 'is-visible': ctaVisible }"
    >
      <div class="cta-content">
        <h2>准备好开始您的留学规划了吗？</h2>
        <p>30秒完成背景评估，获取专属留学路径图</p>
        <el-button
          type="primary"
          size="large"
          class="cta-final-button"
          @click="router.push('/assessment')"
        >
          立即开始
        </el-button>
      </div>
    </section>

    <SiteFooter @show-guide="guideVisible = true" />

    <!-- 返回顶部按钮 -->
    <button
      class="back-to-top"
      :class="{ visible: showBackToTop }"
      title="返回顶部"
      @click="scrollToTop"
    >
      <el-icon><Top /></el-icon>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  Document, Cpu, Calendar, Files, School, ChatDotRound,
  MagicStick, Timer, DataLine, User, ArrowRight, Top
} from '@element-plus/icons-vue'
import SiteFooter from '../components/common/SiteFooter.vue'

const router = useRouter()

const homePageRef = ref(null)
const heroRef = ref(null)
const heroParallaxRef = ref(null)
const networkCanvas = ref(null)
const featuresRef = ref(null)
const highlightsRef = ref(null)
const ctaRef = ref(null)

const heroVisible = ref(false)
const featuresVisible = ref(false)
const highlightsVisible = ref(false)
const ctaVisible = ref(false)
const showBackToTop = ref(false)
// 通过 inject 接收 App.vue provide 的对话框状态
const guideVisible = inject('guideVisible')

// 打字机效果的标题和副标题
const fullTitle = '一站式智能留学规划'
const fullSubtitle = 'AI 智能解析背景，为你生成专属留学路线图'
const animatedTitle = ref('')
const animatedSubtitle = ref('')

let subtitleIndex = 0
let typingInterval = null

const heroStats = ref([
  { value: '55+', label: '精选院校', animated: '' },
  { value: '6大', label: '核心场景', animated: '' },
  { value: 'Multi-AI', label: '智能协同', animated: '' }
])

const features = [
  { title: '背景评估', desc: '全面的背景信息收集与分析，生成竞争力雷达图', icon: Document, path: '/assessment' },
  { title: 'AI智能选校', desc: '基于多维度数据的智能匹配，推荐最适合的院校', icon: Cpu, path: '/school-recommendation' },
  { title: '时间规划', desc: '动态时间线与任务看板，轻松管理申请进度', icon: Calendar, path: '/timeline' },
  { title: '材料中心', desc: '文书助手与材料清单，赋能申请全流程', icon: Files, path: '/materials' },
  { title: '院校数据库', desc: '全球院校信息搜索与对比，快速了解目标学校', icon: School, path: '/university-database' },
  { title: 'AI智能对话', desc: '多角色智能体在线问答，随时获取专业建议', icon: ChatDotRound, path: '/ai-chat' }
]

const highlights = [
  { title: 'AI驱动', desc: '整合多个AI供应商，提供智能化的分析与建议', icon: MagicStick },
  { title: '动态规划', desc: '根据您的背景自动生成个性化时间路线图', icon: Timer },
  { title: '数据可视化', desc: '竞争力雷达图直观展示您的优势与不足', icon: DataLine },
  { title: '智能体对话', desc: '多角色AI助手，提供专属咨询服务', icon: User }
]

const navigateTo = (path) => {
  router.push(path)
}

// 打字机效果
const startTypingEffect = () => {
  // 先快速显示标题
  animatedTitle.value = fullTitle

  // 延迟后显示副标题
  setTimeout(() => {
    typingInterval = setInterval(() => {
      if (subtitleIndex < fullSubtitle.length) {
        animatedSubtitle.value = fullSubtitle.substring(0, subtitleIndex + 1)
        subtitleIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 40)
  }, 600)
}

// 视差滚动和滚动动画 - 使用节流优化性能
let scrollTicking = false

const handleScroll = () => {
  if (!homePageRef.value || scrollTicking) return

  scrollTicking = true
  requestAnimationFrame(() => {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight

    // 显示/隐藏返回顶部按钮
    showBackToTop.value = scrollY > 400

    // Hero区域视差效果
    if (heroParallaxRef.value && heroRef.value) {
      const heroHeight = heroRef.value.offsetHeight
      if (scrollY < heroHeight) {
        // 背景移动速度为滚动速度的30%，方向与滚动相反创造视差
        const parallaxOffset = scrollY * 0.3
        heroParallaxRef.value.style.setProperty('--parallax-y', `${parallaxOffset}px`)
        // 淡出效果
        const opacity = Math.max(0, 1 - scrollY / (heroHeight * 0.6))
        heroParallaxRef.value.style.setProperty('--hero-opacity', opacity)
      }
    }

    // Features区域滚动进入动画
    if (featuresRef.value && !featuresVisible.value) {
      const rect = featuresRef.value.getBoundingClientRect()
      if (rect.top < windowHeight * 0.8) {
        featuresVisible.value = true
      }
    }

    // Highlights区域滚动进入动画
    if (highlightsRef.value && !highlightsVisible.value) {
      const rect = highlightsRef.value.getBoundingClientRect()
      if (rect.top < windowHeight * 0.8) {
        highlightsVisible.value = true
      }
    }

    // CTA区域滚动进入动画
    if (ctaRef.value && !ctaVisible.value) {
      const rect = ctaRef.value.getBoundingClientRect()
      if (rect.top < windowHeight * 0.8) {
        ctaVisible.value = true
      }
    }

    scrollTicking = false
  })
}

// 使用 IntersectionObserver 检测元素可见性（更可靠）
const setupIntersectionObserver = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target === featuresRef.value) featuresVisible.value = true
        if (entry.target === highlightsRef.value) highlightsVisible.value = true
        if (entry.target === ctaRef.value) ctaVisible.value = true
      }
    })
  }, observerOptions)

  nextTick(() => {
    if (featuresRef.value) observer.observe(featuresRef.value)
    if (highlightsRef.value) observer.observe(highlightsRef.value)
    if (ctaRef.value) observer.observe(ctaRef.value)
  })

  return observer
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 滚动到下一个区域
const scrollToNextSection = () => {
  if (featuresRef.value) {
    featuresRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 星座网络Canvas动画
let networkAnimationId = null
let cleanupNetworkAnimation = null

const initNetworkAnimation = () => {
  if (!networkCanvas.value) return

  const canvas = networkCanvas.value
  const ctx = canvas.getContext('2d')
  let width, height

  const resize = () => {
    width = canvas.width = canvas.offsetWidth
    height = canvas.height = canvas.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // 创建节点
  const nodes = []
  const nodeCount = 25
  const connectionDistance = 150

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 2
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, width, height)

    // 更新节点位置
    nodes.forEach(node => {
      node.x += node.vx
      node.y += node.vy

      if (node.x < 0 || node.x > width) node.vx *= -1
      if (node.y < 0 || node.y > height) node.vy *= -1
    })

    // 绘制连线
    ctx.strokeStyle = 'rgba(30, 58, 95, 0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.15
          ctx.strokeStyle = `rgba(30, 58, 95, ${opacity})`
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }

    // 绘制节点
    nodes.forEach(node => {
      // 外圈光晕
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3)
      gradient.addColorStop(0, 'rgba(30, 58, 95, 0.1)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2)
      ctx.fill()

      // 核心点
      ctx.fillStyle = 'rgba(30, 58, 95, 0.3)'
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    networkAnimationId = requestAnimationFrame(animate)
  }

  animate()

  return () => {
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(networkAnimationId)
  }
}

let intersectionObserver = null

onMounted(() => {
  // 触发打字机效果
  setTimeout(() => {
    heroVisible.value = true
    startTypingEffect()
  }, 200)

  // 添加滚动监听（用于视差效果和返回顶部按钮）
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 使用 IntersectionObserver 检测区域可见性（更可靠）
  intersectionObserver = setupIntersectionObserver()

  // 初始化星座网络动画
  cleanupNetworkAnimation = initNetworkAnimation()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (typingInterval) clearInterval(typingInterval)
  if (cleanupNetworkAnimation) cleanupNetworkAnimation()
  if (intersectionObserver) intersectionObserver.disconnect()
})
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 140px);
}

/* ===== Hero区域 ===== */
.hero {
  position: relative;
  background: var(--gradient-hero);
  color: var(--color-text-primary);
  padding: 100px 0 80px;
  text-align: center;
  overflow: hidden;
}

/* Hero底部渐变过渡阴影 - 分隔Hero和Features */
.hero::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(180deg,
    rgba(250, 250, 250, 0) 0%,
    rgba(250, 250, 250, 0.3) 30%,
    rgba(250, 250, 250, 0.7) 60%,
    #FAFAFA 100%
  );
  pointer-events: none;
  z-index: 5;
}

/* Hero视差效果容器 */
.hero-parallax-layer {
  position: absolute;
  inset: 0;
  transform: translateY(var(--parallax-y, 0));
  opacity: var(--hero-opacity, 1);
  pointer-events: none;
}

/* 星座网络背景 - 科技感 */
.hero-network-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.network-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* 渐变叠加动画 - 学术风格 */
.hero-gradient-overlay {
  position: absolute;
  inset: 0;
  background:
    /* 动态网格背景 */
    linear-gradient(90deg, rgba(30, 58, 95, 0.04) 1px, transparent 1px),
    linear-gradient(rgba(30, 58, 95, 0.04) 1px, transparent 1px),
    /* 径向渐变光晕 */
    radial-gradient(ellipse at 30% 50%, rgba(30, 58, 95, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(184, 134, 11, 0.04) 0%, transparent 50%),
    /* 底部渐变过渡 */
    linear-gradient(180deg, transparent 0%, rgba(30, 58, 95, 0.02) 100%);
  background-size:
    80px 80px,
    80px 80px,
    100% 100%,
    100% 100%,
    100% 100%;
  animation: gradient-shift 8s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 1;
}

/* 动态光晕装饰 */
.hero-glow-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-glow-decoration::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  top: -200px;
  left: -100px;
  background: radial-gradient(circle, rgba(184, 134, 11, 0.08) 0%, transparent 70%);
  animation: glow-pulse 10s ease-in-out infinite;
}

.hero-glow-decoration::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  bottom: -100px;
  right: -50px;
  background: radial-gradient(circle, rgba(30, 58, 95, 0.06) 0%, transparent 70%);
  animation: glow-pulse 12s ease-in-out infinite reverse;
}

/* Hero内容 */
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.hero-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-title {
  font-size: 52px;
  font-weight: var(--font-bold);
  margin-bottom: var(--space-6);
  letter-spacing: -1px;
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
  font-family: var(--font-family-display);
  position: relative;
}

.hero-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: var(--color-accent);
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

.hero-title::after::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer-line 2s ease-in-out infinite;
}

.hero-subtitle {
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-10);
  line-height: var(--leading-relaxed);
  min-height: 1.7em;
}

.hero-actions {
  display: flex;
  gap: var(--space-6);
  justify-content: center;
  margin-bottom: var(--space-12);
  flex-wrap: wrap;
}

.cta-button {
  background: var(--color-solid);
  color: white;
  font-size: var(--text-lg);
  padding: 14px 36px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  border: none;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: 160px;
}

.cta-button:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
}

.secondary-button {
  background: transparent;
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  padding: 14px 36px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  border: 1.5px solid rgba(30, 58, 95, 0.2);
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: 160px;
}

.secondary-button:hover {
  border-color: var(--color-text-primary);
  transform: translateY(-1px);
}

/* Hero统计数据 */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  margin-top: var(--space-10);
  margin-bottom: var(--space-8);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  animation: stat-fade-in 0.6s ease forwards;
}

@keyframes stat-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--space-2);
  color: var(--color-solid);
  font-family: var(--font-family-display);
  letter-spacing: -1px;
}

.stat-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 44px;
  background: linear-gradient(180deg, transparent, var(--color-border), transparent);
}

/* stat-item之间的分隔线（用伪元素实现） */
.stat-item:not(:last-child) {
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: calc(var(--space-8) * -0.5);
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 44px;
  background: linear-gradient(180deg, transparent, var(--color-border), transparent);
}

/* 滚动提示 */
.scroll-indicator {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  opacity: 0;
  animation: scroll-fade-in 0.6s ease 1.5s forwards;
  z-index: 10;
}

@keyframes scroll-fade-in {
  to { opacity: 1; }
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid var(--color-slate-300);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
  transition: all 0.3s ease;
}

.scroll-wheel {
  width: 3px;
  height: 8px;
  background: var(--color-slate-700);
  border-radius: 2px;
  animation: scroll-wheel-move 1.5s ease-in-out infinite;
}

@keyframes scroll-wheel-move {
  0%, 100% { 
    transform: translateY(0); 
    opacity: 1; 
  }
  50% { 
    transform: translateY(6px); 
    opacity: 0.3; 
  }
}

.scroll-text {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.scroll-indicator:hover .scroll-mouse {
  border-color: var(--color-slate-700);
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.15);
}

.scroll-indicator:hover .scroll-text {
  color: var(--color-slate-700);
}

/* ===== Features区域 ===== */
.features {
  padding: var(--space-24) var(--space-10);
  background: linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 50%, #F0F4F8 100%);
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.features.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-10);
  box-sizing: border-box;
}

.section-title {
  text-align: center;
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-12);
  position: relative;
  font-weight: var(--font-bold);
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: var(--color-solid);
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-sm);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  perspective: 1000px;
}

.feature-card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-8);
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--shadow-sm);
  border: 1px solid transparent;
  animation: fadeInUp 0.6s ease both, card-glow-pulse 4s ease-in-out infinite;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
}

@keyframes card-glow-pulse {
  0%, 100% {
    box-shadow: 
      var(--shadow-sm),
      0 0 0 0 rgba(30, 58, 95, 0);
  }
  50% {
    box-shadow: 
      var(--shadow-sm),
      0 0 20px -5px rgba(30, 58, 95, 0.08);
  }
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
}

.feature-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(212, 175, 55, 0.04) 45%,
    rgba(212, 175, 55, 0.08) 50%,
    rgba(212, 175, 55, 0.04) 55%,
    transparent 100%
  );
  animation: card-shimmer-sweep 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes card-shimmer-sweep {
  0% { left: -150%; }
  40%, 60% { left: 150%; }
  100% { left: 150%; }
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px -10px rgba(30, 58, 95, 0.12), 0 0 0 1px rgba(30, 58, 95, 0.05);
  border-color: var(--color-slate-200);
}

.feature-card:hover::before {
  left: 100%;
}

.feature-icon-wrapper {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, #F0F4F8 0%, #E8EEF5 50%, #D9E6F2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 1px 3px rgba(255, 255, 255, 0.8),
    inset 0 -1px 3px rgba(30, 58, 95, 0.05),
    0 4px 12px rgba(30, 58, 95, 0.06);
}

.feature-icon-wrapper::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-icon-wrapper::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: calc(var(--radius-xl) - 2px);
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, transparent 60%);
  pointer-events: none;
}

.feature-card:hover .feature-icon-wrapper {
  background: linear-gradient(135deg, var(--color-slate-100) 0%, var(--color-slate-200) 100%);
  transform: scale(1.05) translateY(-2px) rotate(-2deg);
  box-shadow:
    0 12px 28px rgba(30, 58, 95, 0.15),
    0 4px 12px rgba(30, 58, 95, 0.1),
    inset 0 1px 3px rgba(255, 255, 255, 0.5);
}

.feature-card:hover .feature-icon-wrapper::before {
  opacity: 1;
}

.feature-card:hover .feature-icon-wrapper::after {
  opacity: 0;
}

.feature-icon {
  font-size: 40px;
  color: var(--color-slate-700);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  color: var(--color-solid);
}

.feature-card h3 {
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  font-weight: var(--font-semibold);
}

.feature-card p {
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  margin-bottom: var(--space-5);
  font-size: var(--text-base);
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-slate-700);
  font-weight: var(--font-semibold);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-slate-200);
  background: transparent;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.feature-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-solid);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.feature-card:hover .feature-link {
  gap: var(--space-3);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 58, 95, 0.25);
}

.feature-card:hover .feature-link::before {
  opacity: 1;
}

.link-arrow {
  transition: transform var(--transition-normal);
}

.feature-card:hover .link-arrow {
  transform: translateX(4px);
}

/* ===== Highlights区域 ===== */
.highlights {
  padding: var(--space-24) var(--space-10);
  background: linear-gradient(180deg, #F7FAFC 0%, #EDF2F7 50%, #E8EEF5 100%);
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  position: relative;
  overflow: hidden;
}

.highlights.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.highlights::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

/* 背景装饰 */
.highlights-bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(30, 58, 95, 0.06);
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  top: -150px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.bg-circle-2 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  left: -80px;
  animation: float 25s ease-in-out infinite reverse;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(30, 58, 95, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30, 58, 95, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.8;
}

.highlights-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  position: relative;
}

/* 动态连接线 */
.highlights-content::before {
  content: '';
  position: absolute;
  top: 60px;
  left: 8%;
  right: 8%;
  height: 3px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--color-slate-200) 15%,
    var(--color-slate-700) 50%,
    var(--color-slate-200) 85%,
    transparent 100%
  );
  opacity: 0.5;
  z-index: 0;
  border-radius: 2px;
}

.highlights-content::after {
  content: '';
  position: absolute;
  top: 60px;
  left: 10%;
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(212, 175, 55, 0.3) 20%,
    rgba(212, 175, 55, 0.9) 50%,
    rgba(212, 175, 55, 0.3) 80%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: line-flow 3s linear infinite;
  z-index: 0;
  border-radius: 2px;
  filter: blur(0.5px);
}

@keyframes line-flow {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.highlight-item {
  text-align: center;
  animation: fadeInUp 0.6s ease both;
  position: relative;
  z-index: 1;
  padding: var(--space-6) var(--space-4);
  border-radius: var(--radius-xl);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.highlight-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.02) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.highlight-item:hover {
  transform: translateY(-8px);
}

.highlight-item:hover::before {
  opacity: 1;
}

/* 序号 */
.highlight-number {
  position: absolute;
  top: var(--space-3);
  right: var(--space-4);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-slate-700);
  font-family: var(--font-family-mono);
  letter-spacing: 0;
  background: linear-gradient(135deg, #F0F4F8 0%, #E8EEF5 100%);
  border-radius: 50%;
  border: 1.5px solid var(--color-slate-200);
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(30, 58, 95, 0.08);
}

.highlight-item:hover .highlight-number {
  background: var(--color-solid);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  transform: scale(1.1);
}

.highlight-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-slate-50) 0%, var(--color-slate-100) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-5);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  box-shadow: 
    0 4px 12px rgba(30, 58, 95, 0.08),
    inset 0 -2px 4px rgba(30, 58, 95, 0.05);
}

/* 图标环形装饰 */
.icon-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px dashed var(--color-slate-200);
  opacity: 0;
  transform: rotate(0deg);
  transition: all 0.4s ease;
}

.highlight-item:hover .highlight-icon-wrapper {
  background: linear-gradient(135deg, var(--color-slate-100) 0%, var(--color-slate-200) 100%);
  transform: scale(1.05);
  box-shadow: 
    0 8px 24px rgba(30, 58, 95, 0.15),
    0 0 0 4px rgba(30, 58, 95, 0.05),
    inset 0 -2px 4px rgba(30, 58, 95, 0.05);
}

.highlight-item:hover .icon-ring {
  opacity: 1;
  transform: rotate(180deg);
  border-color: var(--color-accent-light);
}

.highlight-item h4 {
  margin: 0 0 var(--space-2);
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  transition: color 0.3s ease;
}

.highlight-item:hover h4 {
  color: var(--color-slate-700);
}

.highlight-item p {
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  font-size: var(--text-sm);
}

/* ===== CTA区域 ===== */
.cta-section {
  background: linear-gradient(135deg, #EEF2F7 0%, #F0F4F8 35%, #E8EDF3 70%, #DFE6EF 100%);
  padding: var(--space-24) var(--space-10);
  margin-bottom: var(--space-10);
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  border-top: 1px solid rgba(30, 58, 95, 0.08);
  border-bottom: 1px solid rgba(30, 58, 95, 0.08);
  position: relative;
  overflow: hidden;
}

.cta-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 顶部波浪分隔 */
.cta-section::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 80px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath fill='%23FAFAFA' d='M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,0 L0,0 Z'/%3E%3C/svg%3E") no-repeat center top;
  background-size: 100% 100%;
  filter: drop-shadow(0 2px 4px rgba(30, 58, 95, 0.1));
}

/* CTA区域底部不再使用波浪分隔，由页脚过渡区域统一处理 */

.cta-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-5);
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.cta-content h2 {
  color: var(--color-text-primary);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
  font-family: var(--font-family-display);
  position: relative;
}

.cta-content h2::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: var(--color-accent);
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-sm);
}

.cta-content p {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-8);
}

.cta-final-button {
  background: var(--color-solid);
  color: white;
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-12);
  border-radius: var(--radius-lg);
  font-weight: 600;
  border: none;
  transition: all 0.2s ease;
}

.cta-final-button:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
}

/* ===== 返回顶部按钮 ===== */
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-slate-700);
  border: 2px solid var(--color-slate-700);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
}

.back-to-top.visible {
  opacity: 1;
  pointer-events: auto;
}

.back-to-top:hover {
  background: var(--color-slate-700);
  color: white;
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
</style>
