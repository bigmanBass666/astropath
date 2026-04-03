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
              :underline="false"
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
                :color="'var(--color-primary)'"
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

    <!-- 波浪过渡区域 -->
    <div class="footer-transition">
      <!-- 多层波浪 - 使用CSS动画替代位移 -->
      <div class="footer-wave wave-layer-3">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
          <path
            fill="rgba(30, 58, 95, 0.15)"
            d="M0,64 C240,128 480,0 720,64 C960,128 1200,0 1440,64 L1440,150 L0,150 Z"
          />
        </svg>
      </div>
      <div class="footer-wave wave-layer-2">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
          <path
            fill="rgba(30, 58, 95, 0.3)"
            d="M0,80 C320,20 640,140 960,80 C1120,50 1280,110 1440,80 L1440,150 L0,150 Z"
          />
        </svg>
      </div>
      <div class="footer-wave wave-layer-1">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
          <path
            fill="var(--color-primary-dark)"
            d="M0,100 C360,40 720,160 1080,100 C1260,70 1350,120 1440,100 L1440,150 L0,150 Z"
          />
        </svg>
      </div>
      <!-- 过渡区域星点 -->
      <div class="transition-stars">
        <div
          v-for="i in 12"
          :key="i"
          class="star"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }"
        />
      </div>
    </div>

    <!-- 页脚区域 -->
    <footer
      ref="footerRef"
      class="site-footer"
    >
      <!-- 顶部动态光线 -->
      <div class="footer-glow-line" />
      <!-- 背景星点装饰 -->
      <div class="footer-stars">
        <div
          v-for="i in 20"
          :key="i"
          class="star"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }"
        />
      </div>
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="brand-logo">
              <svg
                class="footer-logo-svg"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  class="logo-ring-outer"
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                />
                <circle
                  class="logo-ring-inner"
                  cx="24"
                  cy="24"
                  r="19"
                  stroke="currentColor"
                  stroke-width="1"
                  fill="none"
                />
                <path
                  class="logo-cap-top"
                  d="M24 12L36 18L24 24L12 18L24 12Z"
                  fill="currentColor"
                />
                <rect
                  class="logo-cap-brim"
                  x="10"
                  y="26"
                  width="28"
                  height="4"
                  rx="1"
                  fill="currentColor"
                />
                <g class="logo-tassel-group">
                  <circle
                    cx="34"
                    cy="20"
                    r="3"
                    fill="#D4AF37"
                    class="logo-tassel"
                  />
                  <path
                    d="M34 23V30"
                    stroke="#D4AF37"
                    stroke-width="2"
                    stroke-linecap="round"
                    class="logo-tassel-line"
                  />
                  <path
                    d="M32 30L34 34L36 30"
                    stroke="#D4AF37"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                    class="logo-tassel-tip"
                  />
                </g>
                <path
                  class="logo-star"
                  d="M24 6L25 8H27L25.5 9.5L26 11.5L24 10.5L22 11.5L22.5 9.5L21 8H23L24 6Z"
                  fill="#D4AF37"
                />
              </svg>
              <h3>智途 AstroPath</h3>
            </div>
            <p>通过AI分析您的背景，生成动态、可执行的个性化留学路径图</p>
          </div>
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><a href="/assessment">背景评估</a></li>
              <li><a href="/school-recommendation">AI选校</a></li>
              <li><a href="/timeline">时间规划</a></li>
              <li><a href="/materials">材料中心</a></li>
              <li><a href="/university-database">院校数据库</a></li>
              <li><a href="/ai-chat">AI对话</a></li>
            </ul>
          </div>
          <div class="footer-help">
            <h4>帮助支持</h4>
            <ul>
              <li>
                <a
                  href="#"
                  @click.prevent="guideVisible = true"
                >使用指南</a>
              </li>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">联系我们</a></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h4>联系方式</h4>
            <p><el-icon><Message /></el-icon> support@astropath.com</p>
            <p><el-icon><Phone /></el-icon> 400-123-4567</p>
            <div class="social-links">
              <a
                href="https://github.com/bigmanBass666"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                title="GitHub"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                class="social-link"
                title="微信"
              ><el-icon><ChatDotRound /></el-icon></a>
              <a
                href="#"
                class="social-link"
                title="微博"
              ><el-icon><Platform /></el-icon></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 智途 AstroPath. All rights reserved.</p>
        </div>
      </div>
    </footer>

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
  MagicStick, Timer, DataLine, User, ArrowRight, Top,
  Message, Phone, Platform
} from '@element-plus/icons-vue'

const router = useRouter()

const homePageRef = ref(null)
const heroRef = ref(null)
const heroParallaxRef = ref(null)
const networkCanvas = ref(null)
const featuresRef = ref(null)
const highlightsRef = ref(null)
const ctaRef = ref(null)
const footerRef = ref(null)

const heroVisible = ref(false)
const featuresVisible = ref(false)
const highlightsVisible = ref(false)
const ctaVisible = ref(false)
const showBackToTop = ref(false)
// 通过 inject 接收 App.vue provide 的对话框状态
const guideVisible = inject('guideVisible')

// 打字机效果的标题和副标题
const fullTitle = '一站式智能留学规划'
const fullSubtitle = '通过AI分析您的背景，生成动态、可执行的个性化留学路径图'
const animatedTitle = ref('')
const animatedSubtitle = ref('')

let subtitleIndex = 0
let typingInterval = null

const heroStats = ref([
  { value: '32+', label: '功能模块', animated: '' },
  { value: '1000+', label: '院校数据', animated: '' },
  { value: 'AI', label: '智能辅助', animated: '' }
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
  initNetworkAnimation()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (typingInterval) clearInterval(typingInterval)
  if (networkAnimationId) cancelAnimationFrame(networkAnimationId)
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
  background: var(--gradient-accent);
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
  background: #0F172A;
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
  background: #1E293B;
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
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  border: 2px solid var(--color-primary-300);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
  transition: all 0.3s ease;
}

.scroll-wheel {
  width: 3px;
  height: 8px;
  background: var(--color-primary);
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
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.15);
}

.scroll-indicator:hover .scroll-text {
  color: var(--color-primary);
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
  background: var(--gradient-primary);
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
  border-color: var(--color-primary-200);
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
  background: linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-150) 100%);
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
  color: var(--color-primary);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  color: var(--color-primary-dark);
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
  color: var(--color-primary);
  font-weight: var(--font-semibold);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-primary-200);
  background: transparent;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.feature-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
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
    var(--color-primary-200) 15%,
    var(--color-primary) 50%,
    var(--color-primary-200) 85%,
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
  color: var(--color-primary);
  font-family: var(--font-family-mono);
  letter-spacing: 0;
  background: linear-gradient(135deg, #F0F4F8 0%, #E8EEF5 100%);
  border-radius: 50%;
  border: 1.5px solid var(--color-primary-200);
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(30, 58, 95, 0.08);
}

.highlight-item:hover .highlight-number {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  transform: scale(1.1);
}

.highlight-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
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
  border: 2px dashed var(--color-primary-200);
  opacity: 0;
  transform: rotate(0deg);
  transition: all 0.4s ease;
}

.highlight-item:hover .highlight-icon-wrapper {
  background: linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-200) 100%);
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
  color: var(--color-primary);
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
  background: var(--gradient-accent);
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-sm);
}

.cta-content p {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-8);
}

.cta-final-button {
  background: var(--gradient-accent);
  color: white;
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-12);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  border: none;
  box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.cta-final-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
}

.cta-final-button:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 10px 30px rgba(184, 134, 11, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}

.cta-final-button:hover::before {
  left: 100%;
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
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
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
  background: var(--color-primary);
  color: white;
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* ===== 页脚波浪过渡区域 ===== */
.footer-transition {
  position: relative;
  height: 150px;
  margin: 0;
  width: 100%;
  overflow: hidden;
  background: #FAFAFA;
}

/* 多层波浪效果 */
.footer-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.footer-wave svg {
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 100%;
}

.footer-wave svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* 波浪动画 - 使用缩放替代位移，避免溢出 */
@keyframes wave-breathe {
  0%, 100% { transform: scaleY(1) translateY(0); }
  50% { transform: scaleY(1.05) translateY(-5px); }
}

.wave-layer-1 {
  animation: wave-breathe 8s ease-in-out infinite;
}

.wave-layer-2 {
  animation: wave-breathe 6s ease-in-out infinite reverse;
  opacity: 0.5;
}

.wave-layer-3 {
  animation: wave-breathe 10s ease-in-out infinite;
  opacity: 0.3;
}

/* 过渡区域星点 */
.transition-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.transition-stars .star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--color-primary-light);
  border-radius: 50%;
  animation: star-twinkle 3s ease-in-out infinite;
}

/* ===== 页脚样式 ===== */
.site-footer {
  background: linear-gradient(180deg, var(--color-primary-dark) 0%, var(--color-text-primary) 100%);
  color: white;
  padding: var(--space-24) var(--space-10) 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* 顶部动态光线 */
.footer-glow-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    var(--color-primary-light) 20%,
    var(--color-accent-light) 50%,
    var(--color-primary-light) 80%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: glow-line-move 4s linear infinite;
}

.footer-glow-line::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg,
    transparent,
    rgba(184, 134, 11, 0.3),
    transparent
  );
  background-size: 200% 100%;
  animation: glow-line-move 4s linear infinite;
}

@keyframes glow-line-move {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 背景星点装饰 */
.footer-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.footer-stars .star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: star-twinkle 3s ease-in-out infinite;
}

@keyframes star-twinkle {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.5);
  }
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: var(--space-10);
  padding-bottom: var(--space-10);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 100%;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  position: relative;
  z-index: 1;
}

/* 品牌区域 */
.footer-brand .brand-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.footer-logo-svg {
  width: 44px;
  height: 44px;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.4s ease;
}

.footer-logo-svg .logo-ring-outer {
  opacity: 0.15;
  transition: all 0.4s ease;
}

.footer-logo-svg .logo-ring-inner {
  opacity: 0.25;
  transition: all 0.4s ease;
}

.footer-logo-svg .logo-cap-top,
.footer-logo-svg .logo-cap-brim {
  opacity: 0.9;
}

.footer-logo-svg .logo-star {
  opacity: 0.8;
  transform-origin: 24px 9px;
  transition: all 0.3s ease;
}

.footer-logo-svg .logo-tassel-group {
  transform-origin: 34px 18px;
  animation: tassel-swing 3s ease-in-out infinite;
}

@keyframes tassel-swing {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.footer-brand .brand-logo:hover .footer-logo-svg {
  color: white;
  transform: scale(1.08);
  filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.4));
}

.footer-brand .brand-logo:hover .logo-ring-outer {
  opacity: 0.3;
  animation: ring-pulse 1.5s ease-in-out infinite;
}

.footer-brand .brand-logo:hover .logo-ring-inner {
  opacity: 0.5;
}

.footer-brand .brand-logo:hover .logo-star {
  opacity: 1;
  transform: scale(1.3);
  animation: star-pulse 0.6s ease-in-out infinite;
}

.footer-brand .brand-logo:hover .logo-tassel-group {
  animation: tassel-swing-hover 0.8s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

@keyframes star-pulse {
  0%, 100% { transform: scale(1.3); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.8; }
}

@keyframes tassel-swing-hover {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

.footer-brand h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: white;
  font-family: var(--font-family-display);
  margin: 0;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

.footer-links h4,
.footer-help h4,
.footer-contact h4 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-5);
  color: white;
  position: relative;
}

.footer-links h4::after,
.footer-help h4::after,
.footer-contact h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 24px;
  height: 2px;
  background: var(--color-accent-light);
  border-radius: 1px;
}

.footer-links ul,
.footer-help ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li,
.footer-help li {
  margin-bottom: var(--space-3);
}

.footer-links a,
.footer-help a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: var(--text-sm);
  position: relative;
  transition: all var(--transition-fast);
}

.footer-links a::after,
.footer-help a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent-light);
  transition: width var(--transition-normal);
}

.footer-links a:hover,
.footer-help a:hover {
  color: var(--color-accent-light);
}

.footer-links a:hover::after,
.footer-help a:hover::after {
  width: 100%;
}

.footer-contact p {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-sm);
  margin-bottom: var(--space-3);
}

.footer-contact .el-icon {
  font-size: var(--text-base);
  color: var(--color-accent-light);
}

.social-links {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
}

.social-link:hover {
  background: var(--color-accent-light);
  color: var(--color-text-primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.social-link:hover::before {
  border-color: transparent;
  transform: scale(1.2);
  opacity: 0;
}

.footer-bottom {
  padding: var(--space-5) 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--text-xs);
  margin: 0;
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
  .hero {
    padding: var(--space-12) var(--space-5) var(--space-16);
  }

  .hero-title {
    font-size: var(--text-3xl);
  }

  .hero-subtitle {
    font-size: var(--text-base);
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-button,
  .secondary-button {
    width: 100%;
    max-width: 280px;
    padding: var(--space-3) var(--space-8);
    font-size: var(--text-base);
  }

  .hero-stats {
    gap: var(--space-4);
  }

  .stat-number {
    font-size: 22px;
  }

  .section-title {
    font-size: var(--text-2xl);
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }

  .feature-card {
    padding: var(--space-6) var(--space-5);
  }

  .feature-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .feature-icon {
    font-size: 32px;
  }

  .feature-card h3 {
    font-size: var(--text-base);
  }

  .feature-card p {
    font-size: var(--text-xs);
    line-height: var(--leading-tight);
    margin-bottom: var(--space-3);
  }

  .features {
    padding: var(--space-12) var(--space-5);
  }

  .highlights {
    padding: var(--space-12) var(--space-5);
  }

  .highlights-content {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }

  .highlights-content::before,
  .highlights-content::after {
    display: none;
  }

  .highlight-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .highlight-item h4 {
    font-size: var(--text-base);
  }

  .highlight-item p {
    font-size: var(--text-xs);
  }

  .highlight-number {
    font-size: 10px;
  }

  .cta-content h2 {
    font-size: var(--text-xl);
  }

  .cta-section {
    padding: var(--space-12) var(--space-5);
  }
}

/* ===== 移动端单列布局 ===== */
@media (max-width: 576px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: var(--space-5) var(--space-4);
  }

  .highlights-content {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    gap: var(--space-4);
  }

  .stat-number {
    font-size: var(--text-xl);
  }

  .stat-divider {
    height: 32px;
  }
}

/* ===== 页脚响应式设计 ===== */
@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
}

@media (max-width: 576px) {
  .site-footer {
    padding: var(--space-10) 0 0;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    text-align: center;
  }

  .footer-brand .brand-logo {
    justify-content: center;
  }

  .footer-links h4::after,
  .footer-help h4::after,
  .footer-contact h4::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-links ul,
  .footer-help ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-2) var(--space-4);
  }

  .footer-links li,
  .footer-help li {
    margin: 0;
  }

  .footer-contact {
    text-align: center;
  }

  .footer-contact p {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
