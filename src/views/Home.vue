<template>
  <div class="home-page" ref="homePageRef">
    <!-- Hero区域 -->
    <section class="hero" ref="heroRef">
      <!-- 动态背景粒子 -->
      <div class="hero-bg-effects">
        <div class="particle p1"></div>
        <div class="particle p2"></div>
        <div class="particle p3"></div>
        <div class="particle p4"></div>
        <div class="particle p5"></div>
        <div class="particle p6"></div>
      </div>
      <!-- 渐变叠加层 -->
      <div class="hero-gradient-overlay"></div>

      <div class="hero-content" :class="{ 'is-visible': heroVisible }">
        <h1 class="hero-title">{{ animatedTitle }}</h1>
        <p class="hero-subtitle">{{ animatedSubtitle }}</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" class="cta-button" @click="$router.push('/assessment')">
            开始规划
          </el-button>
          <el-button size="large" class="secondary-button" @click="$router.push('/university-database')">
            探索院校
          </el-button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">32+</span>
            <span class="stat-desc">功能模块</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">1000+</span>
            <span class="stat-desc">院校数据</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">AI</span>
            <span class="stat-desc">智能辅助</span>
          </div>
        </div>
      </div>

      <!-- 向下滚动提示 -->
      <div class="scroll-indicator">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span>向下滚动</span>
      </div>
    </section>

    <!-- 核心功能展示 -->
    <section class="features" ref="featuresRef" :class="{ 'is-visible': featuresVisible }">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="navigateTo(feature.path)">
            <div class="feature-icon-wrapper">
              <el-icon class="feature-icon" :is="feature.icon" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
            <el-link type="primary" :underline="false" class="feature-link" :href="feature.path">
              了解更多
              <el-icon class="link-arrow"><ArrowRight /></el-icon>
            </el-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台特色 -->
    <section class="highlights" ref="highlightsRef" :class="{ 'is-visible': highlightsVisible }">
      <div class="container">
        <h2 class="section-title">为什么选择我们</h2>
        <div class="highlights-content">
          <div class="highlight-item" v-for="(item, index) in highlights" :key="index"
            :style="{ animationDelay: `${index * 0.15}s` }">
            <div class="highlight-icon-wrapper">
              <el-icon :size="48" color="#667eea" :is="item.icon" />
            </div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta-section" ref="ctaRef" :class="{ 'is-visible': ctaVisible }">
      <div class="cta-content">
        <h2>准备好开始您的留学规划了吗？</h2>
        <p>30秒完成背景评估，获取专属留学路径图</p>
        <el-button type="primary" size="large" class="cta-final-button" @click="$router.push('/assessment')">
          立即开始
        </el-button>
      </div>
    </section>

    <!-- 页脚区域 -->
    <footer class="site-footer" ref="footerRef">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>一站式智能留学规划</h3>
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
              <li><a href="#" @click.prevent="showGuide = true">使用指南</a></li>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">联系我们</a></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h4>联系方式</h4>
            <p><el-icon><Message /></el-icon> support@liuxue-platform.com</p>
            <p><el-icon><Phone /></el-icon> 400-123-4567</p>
            <div class="social-links">
              <a href="#" class="social-link" title="微信"><el-icon><ChatDotRound /></el-icon></a>
              <a href="#" class="social-link" title="微博"><el-icon><Platform /></el-icon></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 一站式智能留学规划平台. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- 使用指南模态框 -->
    <el-dialog
      v-model="showGuide"
      title="使用指南"
      width="800px"
      :close-on-click-modal="true"
      class="guide-dialog"
    >
      <div class="guide-content">
        <div class="guide-section">
          <h4><el-icon><Document /></el-icon> 快速开始</h4>
          <ol>
            <li><strong>填写背景评估</strong>：在"背景评估"页面完成您的个人信息、学术背景和实践经历的填写</li>
            <li><strong>获取评估报告</strong>：系统会自动生成您的竞争力雷达图和详细评语</li>
            <li><strong>AI智能选校</strong>：基于您的评估结果，系统推荐匹配的院校清单</li>
            <li><strong>时间规划</strong>：查看动态生成的时间线，管理申请任务</li>
            <li><strong>材料准备</strong>：使用文书助手和材料清单，赋能申请全流程</li>
          </ol>
        </div>
        <div class="guide-section">
          <h4><el-icon><Cpu /></el-icon> AI功能使用</h4>
          <p>本平台支持多个AI供应商（OpenAI、Anthropic等），请先在"AI配置"页面完成API配置：</p>
          <ul>
            <li>配置Base URL、API Key和模型名称</li>
            <li>使用"测试连接"验证配置有效性</li>
            <li>在AI对话和文书生成功能中选择已配置的provider</li>
          </ul>
        </div>
        <div class="guide-section">
          <h4><el-icon><DataLine /></el-icon> 数据持久化</h4>
          <p>您的所有数据（评估结果、选校清单、对话历史等）均保存在浏览器本地存储中：</p>
          <ul>
            <li>数据不会上传到服务器，保护您的隐私</li>
            <li>清除浏览器数据会导致信息丢失，请及时导出重要内容</li>
            <li>支持导出对话历史、材料清单等</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="showGuide = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 返回顶部按钮 -->
    <button class="back-to-top" :class="{ visible: showBackToTop }" @click="scrollToTop" title="返回顶部">
      <el-icon><Top /></el-icon>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Document, Cpu, Calendar, Files, School, ChatDotRound,
  MagicStick, Timer, DataLine, User, ArrowRight, Top,
  Message, Phone, Platform
} from '@element-plus/icons-vue'

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
const showGuide = ref(false)

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
  if (window.$router) {
    window.$router.push(path)
  }
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 120px 100px;
  text-align: center;
  overflow: hidden;
  opacity: var(--hero-opacity, 1);
  transform: translateY(calc(var(--parallax-y, 0) * -0.3));
}

/* 动态粒子背景 */
.hero-bg-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.p1 { width: 80px; height: 80px; top: 10%; left: 5%; animation-duration: 8s; animation-delay: 0s; }
.p2 { width: 120px; height: 120px; top: 20%; right: 10%; animation-duration: 10s; animation-delay: 1s; background: rgba(255,255,255,0.08); }
.p3 { width: 60px; height: 60px; top: 60%; left: 15%; animation-duration: 7s; animation-delay: 2s; }
.p4 { width: 100px; height: 100px; bottom: 20%; right: 20%; animation-duration: 9s; animation-delay: 0.5s; background: rgba(255,255,255,0.06); }
.p5 { width: 50px; height: 50px; top: 40%; left: 50%; animation-duration: 6s; animation-delay: 3s; }
.p6 { width: 70px; height: 70px; bottom: 10%; left: 30%; animation-duration: 11s; animation-delay: 1.5s; background: rgba(255,255,255,0.09); }

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-20px) translateX(10px) scale(1.05);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) translateX(-5px) scale(0.95);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-30px) translateX(15px) scale(1.08);
    opacity: 0.7;
  }
}

/* 渐变叠加动画 */
.hero-gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(118, 75, 162, 0.3) 0%, transparent 50%);
  animation: gradientShift 8s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes gradientShift {
  0% {
    background: radial-gradient(ellipse at 30% 50%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 50%, rgba(118, 75, 162, 0.2) 0%, transparent 50%);
  }
  100% {
    background: radial-gradient(ellipse at 70% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 30% 50%, rgba(118, 75, 162, 0.4) 0%, transparent 50%);
  }
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
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.hero-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-title {
  font-size: 52px;
  font-weight: 800;
  margin-bottom: 24px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  letter-spacing: -1px;
  line-height: 1.2;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.9) 50%, #ffffff 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 100% center; }
  50% { background-position: 0% center; }
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.95;
  margin-bottom: 40px;
  line-height: 1.7;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  min-height: 1.7em;
}

.hero-actions {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.cta-button {
  background: white;
  color: #667eea;
  font-size: 18px;
  padding: 16px 52px;
  border-radius: 30px;
  font-weight: 600;
  border: none;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  min-width: 160px;
}

.cta-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.secondary-button {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 18px;
  padding: 16px 52px;
  border-radius: 30px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-3px);
}

/* Hero统计数据 */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  opacity: 0.9;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 13px;
  opacity: 0.8;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* 滚动提示 */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.7;
  animation: bounce 2s ease-in-out infinite;
  z-index: 2;
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollWheel {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(12px); }
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

.scroll-indicator span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* ===== Features区域 ===== */
.features {
  padding: 100px 120px;
  background: #f5f7fa;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.features.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 60px;
  position: relative;
  font-weight: 700;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 16px auto 0;
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 36px 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
  animation: fadeInUp 0.6s ease both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.2);
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon-wrapper {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  transform: scale(1.1);
}

.feature-icon {
  font-size: 40px;
  color: #667eea;
}

.feature-card h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 12px;
  font-weight: 600;
}

.feature-card p {
  color: #606266;
  line-height: 1.7;
  margin-bottom: 20px;
  font-size: 14px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-link {
  gap: 8px;
}

.link-arrow {
  transition: transform 0.3s ease;
}

.feature-card:hover .link-arrow {
  transform: translateX(4px);
}

/* ===== Highlights区域 ===== */
.highlights {
  padding: 100px 120px;
  background: white;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.highlights.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.highlights-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 50px;
}

.highlight-item {
  text-align: center;
  animation: fadeInUp 0.6s ease both;
}

.highlight-icon-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.4s ease;
}

.highlight-item:hover .highlight-icon-wrapper {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  transform: scale(1.1);
}

.highlight-item h4 {
  margin: 0 0 10px;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.highlight-item p {
  color: #606266;
  line-height: 1.7;
  font-size: 14px;
}

/* ===== CTA区域 ===== */
.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 120px;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.cta-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.cta-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.cta-content h2 {
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  margin-bottom: 36px;
}

.cta-final-button {
  background: white;
  color: #667eea;
  font-size: 18px;
  padding: 16px 56px;
  border-radius: 30px;
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-final-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

/* ===== 返回顶部按钮 ===== */
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 999;
  opacity: 0;
  pointer-events: none;
}

.back-to-top.visible {
  opacity: 1;
  pointer-events: auto;
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
  .hero {
    padding: 60px 20px 80px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-button,
  .secondary-button {
    width: 100%;
    max-width: 280px;
    padding: 14px 32px;
    font-size: 16px;
  }

  .hero-stats {
    gap: 20px;
  }

  .stat-number {
    font-size: 22px;
  }

  .section-title {
    font-size: 26px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .features {
    padding: 60px 20px;
  }

  .highlights {
    padding: 60px 20px;
  }

  .cta-content h2 {
    font-size: 24px;
  }

  .scroll-indicator {
    display: none;
  }

  .cta-section {
    padding: 60px 20px;
  }
}

/* ===== 页脚样式 ===== */
.site-footer {
  background: #1a1a2e;
  color: #fff;
  padding: 60px 120px 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.7;
}

.footer-links h4,
.footer-help h4,
.footer-contact h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
}

.footer-links ul,
.footer-help ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li,
.footer-help li {
  margin-bottom: 12px;
}

.footer-links a,
.footer-help a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-links a:hover,
.footer-help a:hover {
  color: #667eea;
}

.footer-contact p {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 12px;
}

.footer-contact .el-icon {
  font-size: 16px;
  color: #667eea;
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 16px;
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
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.footer-bottom {
  padding: 20px 0;
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  margin: 0;
}

/* ===== 使用指南模态框样式 ===== */
.guide-dialog .el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}

.guide-content {
  padding: 10px 0;
}

.guide-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.guide-section:last-child {
  margin-bottom: 0;
}

.guide-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.guide-section .el-icon {
  color: #667eea;
  font-size: 18px;
}

.guide-section p,
.guide-section ul,
.guide-section ol {
  margin: 0;
  padding-left: 20px;
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}

.guide-section li {
  margin-bottom: 8px;
}

/* ===== 页脚响应式设计 ===== */
@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .site-footer {
    padding: 40px 0 0;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .footer-links ul,
  .footer-help ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px 16px;
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
