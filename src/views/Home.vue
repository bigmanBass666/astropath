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
      <!-- 动态背景粒子 - 从6个减少到4个优化性能 -->
      <div class="hero-bg-effects">
        <div class="particle p1" />
        <div class="particle p2" />
        <div class="particle p3" />
        <div class="particle p4" />
      </div>
      <!-- 渐变叠加层 -->
      <div class="hero-gradient-overlay" />

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
          <div class="stat-item">
            <span class="stat-number">32+</span>
            <span class="stat-desc">功能模块</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-number">1000+</span>
            <span class="stat-desc">院校数据</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-number">AI</span>
            <span class="stat-desc">智能辅助</span>
          </div>
        </div>
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
            <div class="highlight-icon-wrapper">
              <el-icon
                :size="48"
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

    <!-- 页脚区域 -->
    <footer
      ref="footerRef"
      class="site-footer"
    >
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>智途 AstroPath</h3>
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
                class="social-link github-link"
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
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import {
  Document, Cpu, Calendar, Files, School, ChatDotRound,
  MagicStick, Timer, DataLine, User, ArrowRight, Top,
  Message, Phone, Platform
} from '@element-plus/icons-vue'

const router = useRouter()

const homePageRef = ref(null)
const heroRef = ref(null)
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
const aboutVisible = inject('aboutVisible')
const contactVisible = inject('contactVisible')

// 打字机效果的标题和副标题
const fullTitle = '一站式智能留学规划'
const fullSubtitle = '通过AI分析您的背景，生成动态、可执行的个性化留学路径图'
const animatedTitle = ref('')
const animatedSubtitle = ref('')

let titleIndex = 0
let subtitleIndex = 0
let typingInterval = null

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

// 视差滚动和滚动动画
const handleScroll = () => {
  if (!homePageRef.value) return

  const scrollY = window.scrollY
  const windowHeight = window.innerHeight

  // 显示/隐藏返回顶部按钮
  showBackToTop.value = scrollY > 400

  // Hero区域视差效果
  if (heroRef.value) {
    const heroHeight = heroRef.value.offsetHeight
    if (scrollY < heroHeight) {
      // 背景移动速度为滚动速度的30%
      const parallaxOffset = scrollY * 0.3
      heroRef.value.style.setProperty('--parallax-y', `${parallaxOffset}px`)
      // 淡出效果
      const opacity = Math.max(0, 1 - scrollY / (heroHeight * 0.6))
      heroRef.value.style.setProperty('--hero-opacity', opacity)
    }
  }

  // Features区域滚动进入动画
  if (featuresRef.value) {
    const rect = featuresRef.value.getBoundingClientRect()
    if (rect.top < windowHeight * 0.8) {
      featuresVisible.value = true
    }
  }

  // Highlights区域滚动进入动画
  if (highlightsRef.value) {
    const rect = highlightsRef.value.getBoundingClientRect()
    if (rect.top < windowHeight * 0.8) {
      highlightsVisible.value = true
    }
  }

  // CTA区域滚动进入动画
  if (ctaRef.value) {
    const rect = ctaRef.value.getBoundingClientRect()
    if (rect.top < windowHeight * 0.8) {
      ctaVisible.value = true
    }
  }
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  // 触发打字机效果
  setTimeout(() => {
    heroVisible.value = true
    startTypingEffect()
  }, 200)

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 检查初始可见性
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (typingInterval) clearInterval(typingInterval)
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
  opacity: var(--hero-opacity, 1);
  transform: translateY(calc(var(--parallax-y, 0) * -0.3));
  border-bottom: 1px solid var(--color-border);
}

/* 动态粒子背景 - 优化性能 */
.hero-bg-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(30, 58, 95, 0.05);
  animation: particle-float 6s ease-in-out infinite;
  will-change: transform;
  transform: translateZ(0);
}

.p1 { width: 80px; height: 80px; top: 10%; left: 5%; animation-duration: 8s; animation-delay: 0s; }
.p2 { width: 120px; height: 120px; top: 20%; right: 10%; animation-duration: 10s; animation-delay: 1s; background: rgba(30, 58, 95, 0.04); }
.p3 { width: 60px; height: 60px; top: 60%; left: 15%; animation-duration: 7s; animation-delay: 2s; }
.p4 { width: 100px; height: 100px; bottom: 20%; right: 20%; animation-duration: 9s; animation-delay: 0.5s; background: rgba(30, 58, 95, 0.03); }

/* 渐变叠加动画 - 学术风格 */
.hero-gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(30, 58, 95, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(184, 134, 11, 0.04) 0%, transparent 50%);
  animation: gradient-shift 8s ease-in-out infinite alternate;
  pointer-events: none;
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
  width: 80px;
  height: 4px;
  background: var(--gradient-primary);
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-sm);
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
  background: var(--gradient-primary);
  color: white;
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-10);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  border: none;
  white-space: nowrap;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-md);
  min-width: 160px;
}

.cta-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg), var(--shadow-glow-primary);
}

.secondary-button {
  background: transparent;
  color: var(--color-primary);
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-10);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  border: 2px solid var(--color-primary);
  white-space: nowrap;
  transition: all var(--transition-spring);
  min-width: 160px;
}

.secondary-button:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
}

/* Hero统计数据 */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 28px;
  font-weight: var(--font-bold);
  line-height: 1;
  margin-bottom: var(--space-1);
  color: var(--color-primary);
  font-family: var(--font-family-display);
}

.stat-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

/* 滚动提示 */
.scroll-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  opacity: 0.7;
  z-index: 2;
}

.scroll-indicator .scroll-mouse {
  animation: bounce 2s ease-in-out infinite;
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid var(--color-text-tertiary);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  background: var(--color-text-secondary);
  border-radius: 2px;
  animation: scroll-wheel 2s ease-in-out infinite;
}

@keyframes scroll-wheel {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(12px); }
}

.scroll-indicator span {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

/* ===== Features区域 ===== */
.features {
  padding: var(--space-10) var(--space-10) var(--space-24);
  background: var(--color-background);
  opacity: 0;
  transform: translateY(40px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
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
}

.feature-card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-8);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  border: 1px solid transparent;
  animation: fadeInUp 0.6s ease both;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-200);
}

.feature-icon-wrapper {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-xl);
  background: var(--color-primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  transition: all var(--transition-normal);
}

.feature-card:hover .feature-icon-wrapper {
  background: var(--color-primary-100);
  transform: scale(1.1);
}

.feature-icon {
  font-size: 44px;
  color: var(--color-primary);
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
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: var(--font-medium);
  transition: all var(--transition-normal);
}

.feature-card:hover .feature-link {
  gap: var(--space-2);
}

.link-arrow {
  transition: transform var(--transition-normal);
}

.feature-card:hover .link-arrow {
  transform: translateX(4px);
}

/* ===== Highlights区域 ===== */
.highlights {
  padding: var(--space-24) var(--space-24);
  background: var(--color-surface);
  opacity: 0;
  transform: translateY(40px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.highlights.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.highlights-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-10);
}

.highlight-item {
  text-align: center;
  animation: fadeInUp 0.6s ease both;
}

.highlight-icon-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--color-primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-3);
  transition: all var(--transition-normal);
}

.highlight-item:hover .highlight-icon-wrapper {
  background: var(--color-primary-100);
  transform: scale(1.1);
}

.highlight-item h4 {
  margin: 0 0 var(--space-2);
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.highlight-item p {
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  font-size: var(--text-sm);
}

/* ===== CTA区域 ===== */
.cta-section {
  background: var(--color-background-warm);
  padding: var(--space-20) var(--space-24);
  margin-bottom: var(--space-10);
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.cta-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.cta-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-5);
  box-sizing: border-box;
}

.cta-content h2 {
  color: var(--color-text-primary);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
  font-family: var(--font-family-display);
}

.cta-content p {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-8);
}

.cta-final-button {
  background: var(--gradient-primary);
  color: white;
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-12);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  border: none;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-spring);
}

.cta-final-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg), var(--shadow-glow-primary);
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

/* ===== 页脚样式 ===== */
.site-footer {
  background: var(--color-text-primary);
  color: white;
  padding: var(--space-24) var(--space-24) 0;
  margin: 0 -20px;
  width: calc(100% + 40px);
  box-sizing: border-box;
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
}

.footer-brand h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
  color: white;
  font-family: var(--font-family-display);
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
  transition: color var(--transition-fast);
}

.footer-links a:hover,
.footer-help a:hover {
  color: #D4AF37;
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
  color: #D4AF37;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.social-link:hover {
  background: #D4AF37;
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

.footer-bottom {
  padding: var(--space-5) 0;
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.65);
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

  .highlight-icon-wrapper {
    width: 72px;
    height: 72px;
  }

  .highlight-item h4 {
    font-size: var(--text-base);
  }

  .highlight-item p {
    font-size: var(--text-xs);
  }

  .cta-content h2 {
    font-size: var(--text-xl);
  }

  .scroll-indicator {
    display: none;
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
