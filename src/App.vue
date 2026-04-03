<template>
  <el-container
    class="app-container"
    :class="{ 'is-immersive': isImmersivePage, 'is-home': isHomePage }"
  >
    <el-header
      v-if="!isImmersivePage"
      class="app-header"
    >
      <div class="header-content">
        <Logo @click="router.push('/')" />
        <!-- 桌面端导航菜单 -->
        <nav class="nav-menu-container desktop-nav">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
          >
            {{ item.name }}
          </router-link>
        </nav>
        <!-- 移动端汉堡菜单按钮 -->
        <button
          class="hamburger-btn"
          aria-label="打开菜单"
          @click="mobileMenuVisible = true"
        >
          <el-icon :size="24">
            <Expand />
          </el-icon>
        </button>
      </div>
    </el-header>
    <el-main class="app-main">
      <router-view v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </router-view>
    </el-main>
    <footer
      v-if="!isImmersivePage && !isHomePage"
      class="app-footer"
    >
      <div class="footer-container">
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
                  @click.prevent="showGuide"
                >使用指南</a>
              </li>
              <li><a href="#">常见问题</a></li>
              <li>
                <a
                  href="#"
                  @click.prevent="showContact"
                >联系我们</a>
              </li>
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

    <!-- 移动端导航抽屉 -->
    <el-drawer
      v-model="mobileMenuVisible"
      direction="rtl"
      size="280px"
      :show-close="false"
      class="mobile-menu-drawer"
    >
      <template #header>
        <div class="drawer-header">
          <span class="drawer-title">导航菜单</span>
          <button
            class="drawer-close-btn"
            aria-label="关闭菜单"
            @click="mobileMenuVisible = false"
          >
            <el-icon :size="20">
              <Close />
            </el-icon>
          </button>
        </div>
      </template>
      <div class="mobile-menu-list">
        <div
          v-for="item in menuItems"
          :key="item.path"
          class="mobile-menu-item"
          :class="{ 'is-active': activeMenu === item.path }"
          @click="navigateTo(item.path)"
        >
          <el-icon><Menu /></el-icon>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </el-drawer>

    <!-- 使用指南对话框 -->
    <el-dialog
      v-model="guideVisible"
      title="使用指南"
      width="60%"
      class="guide-dialog"
    >
      <div class="guide-content">
        <div class="guide-section">
          <h4><el-icon><Document /></el-icon> 快速开始（6个步骤）</h4>
          <ol>
            <li><strong>填写背景评估</strong>：在"背景评估"页面完成您的个人信息、学术背景和实践经历的填写</li>
            <li><strong>获取评估报告</strong>：系统会自动生成您的竞争力雷达图和详细评语</li>
            <li><strong>AI智能选校</strong>：基于您的评估结果，系统推荐匹配的院校清单</li>
            <li><strong>时间规划</strong>：查看动态生成的时间线，管理申请任务</li>
            <li><strong>材料准备</strong>：使用文书助手和材料清单，赋能申请全流程</li>
            <li><strong>AI智能对话</strong>：与多角色AI智能体对话，获取专业申请建议</li>
          </ol>
        </div>
        <div class="guide-section">
          <h4><el-icon><Cpu /></el-icon> AI功能使用</h4>
          <p>本平台支持多个AI供应商（OpenAI、Anthropic、DeepSeek等），请先在"AI配置"页面完成API配置：</p>
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
    </el-dialog>

    <!-- 关于对话框 -->
    <el-dialog
      v-model="aboutVisible"
      title="关于我们"
      width="50%"
    >
      <p>智途 AstroPath - 智能留学规划平台，通过AI分析用户背景，生成动态的、可执行的个性化留学规划路径图。</p>
      <p>技术栈：Vue 3 + Vite + Element-Plus + ECharts</p>
    </el-dialog>

    <!-- 联系对话框 -->
    <el-dialog
      v-model="contactVisible"
      title="联系方式"
      width="40%"
    >
      <p>如有问题或建议，欢迎联系我们：</p>
      <p>邮箱：contact@example.com</p>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { computed, ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Expand, Menu, Close, Document, Cpu, DataLine, Message, Phone } from '@element-plus/icons-vue'
import Logo from './components/common/Logo.vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)

const isImmersivePage = computed(() => route.path === '/ai-chat')
const isHomePage = computed(() => route.path === '/')

const mobileMenuVisible = ref(false)

const menuItems = [
  { path: '/', name: '首页' },
  { path: '/ai-config', name: 'AI配置' },
  { path: '/assessment', name: '背景评估' },
  { path: '/school-recommendation', name: '选校推荐' },
  { path: '/timeline', name: '时间规划' },
  { path: '/materials', name: '材料中心' },
  { path: '/university-database', name: '院校数据库' },
  { path: '/ai-chat', name: 'AI对话' },
]

const navigateTo = (path) => {
  router.push(path)
  mobileMenuVisible.value = false
}

const handleMenuSelect = (path) => {
  router.push(path)
}

// 对话框状态 - 通过 provide 共享给子组件（如 Home.vue 的页脚）
const guideVisible = ref(false)
const aboutVisible = ref(false)
const contactVisible = ref(false)

provide('guideVisible', guideVisible)
provide('aboutVisible', aboutVisible)
provide('contactVisible', contactVisible)

const showGuide = () => {
  guideVisible.value = true
}

const showAbout = () => {
  aboutVisible.value = true
}

const showContact = () => {
  contactVisible.value = true
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  flex-direction: column;
}

.app-header {
  background: var(--color-surface);
  padding: 0 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 9999;
}

.header-content {
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 40px;
}

.nav-menu-container {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-bottom-color: var(--color-primary-300);
}

.nav-item.is-active,
.nav-item.router-link-active {
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-bottom: 3px solid var(--color-primary);
  font-weight: 600;
}

.nav-menu {
  border-bottom: none;
  background: transparent;
  flex: 1;
  overflow-x: auto;
  /* Element Plus菜单变量覆盖 */
  --el-menu-active-color: var(--color-primary);
  --el-menu-hover-color: var(--color-primary);
  --el-menu-text-color: var(--color-text-secondary);
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
}

.nav-menu :deep(.el-menu) {
  /* 菜单项水平居中 */
  justify-content: center;
}

/* 汉堡菜单按钮 */
.hamburger-btn {
  display: none;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s;
  flex-shrink: 0;
}

.hamburger-btn:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 响应式布局 */
@media (max-width: 992px) {
  .header-content {
    justify-content: space-between;
    gap: 16px;
  }

  .nav-menu,
  .nav-menu-container {
    display: none;
  }

  .hamburger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.nav-menu::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.nav-menu :deep(.el-menu-item) {
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  padding: 0 12px;  /* 减少水平内边距以容纳更多菜单项 */
}

.nav-menu :deep(.el-menu-item:hover) {
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-bottom-color: var(--color-primary-300);
}

.nav-menu :deep(.el-menu-item.is-active) {
  background: var(--color-primary-50) !important;
  color: var(--color-primary) !important;
  border-bottom: 3px solid var(--color-primary);
  font-weight: 600;
}

.app-main {
  flex: 1;
  padding: 20px;
  background: var(--color-background);
}

.app-container.is-immersive .app-main,
.app-container.is-home .app-main {
  padding: 0;
  background: var(--color-surface);
}

.app-footer {
  background-color: var(--color-text-primary);
  color: rgba(255, 255, 255, 0.75);
  padding: 0;
}

.app-footer .footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px 0;
  box-sizing: border-box;
}

.app-footer .footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-footer .footer-brand h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
  font-family: var(--font-family-display);
}

.app-footer .footer-brand p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.7;
}

.app-footer .footer-links h4,
.app-footer .footer-help h4,
.app-footer .footer-contact h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
}

.app-footer .footer-links ul,
.app-footer .footer-help ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.app-footer .footer-links li,
.app-footer .footer-help li {
  margin-bottom: 12px;
}

.app-footer .footer-links a,
.app-footer .footer-help a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.app-footer .footer-links a:hover,
.app-footer .footer-help a:hover {
  color: #D4AF37;
}

.app-footer .footer-contact p {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 12px;
}

.app-footer .footer-contact .el-icon {
  font-size: 16px;
  color: #D4AF37;
}

.app-footer .social-links {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.app-footer .social-link {
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

.app-footer .social-link:hover {
  background: #D4AF37;
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

.app-footer .social-link svg {
  display: block;
}

.app-footer .footer-bottom {
  padding: 20px 0;
  text-align: center;
}

.app-footer .footer-bottom p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  margin: 0;
}

@media (max-width: 992px) {
  .app-footer .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .app-footer .footer-container {
    padding: 40px 20px 0;
  }

  .app-footer .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .app-footer .footer-links ul,
  .app-footer .footer-help ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px 16px;
  }

  .app-footer .footer-links li,
  .app-footer .footer-help li {
    margin: 0;
  }

  .app-footer .footer-contact {
    text-align: center;
  }

  .app-footer .footer-contact p {
    justify-content: center;
  }

  .app-footer .social-links {
    justify-content: center;
  }
}

/* 移动端菜单抽屉 */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.drawer-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  color: #606266;
  transition: all 0.2s;
}

.drawer-close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #303133;
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.mobile-menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #606266;
  font-size: 16px;
  transition: all 0.2s;
}

.mobile-menu-item:hover {
  background: var(--color-primary-50);
  color: var(--color-primary);
}

.mobile-menu-item.is-active {
  background: var(--color-primary-50);
  color: var(--color-primary);
  font-weight: 600;
}

.mobile-menu-item .el-icon {
  font-size: 20px;
}

/* 桌面端导航 - 默认显示 */
.desktop-nav {
  display: flex;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  margin-bottom: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 15px;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--color-accent-light);
}

.footer-copyright {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
}

/* ===== 使用指南对话框样式 ===== */
:deep(.guide-dialog .el-dialog__body) {
  max-height: 60vh;
  overflow-y: auto;
}

.guide-content {
  padding: 10px 0;
}

.guide-section {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
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
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.guide-section .el-icon {
  color: var(--color-primary);
  font-size: 18px;
}

.guide-section p,
.guide-section ul,
.guide-section ol {
  margin: 0;
  padding-left: 20px;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.guide-section li {
  margin-bottom: 8px;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 隐藏桌面端导航，显示汉堡按钮 */
  .desktop-nav {
    display: none;
  }

  .hamburger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 调整 header-content 布局 */
  .header-content {
    gap: 12px;
  }
}
</style>
