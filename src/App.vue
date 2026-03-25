<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <el-icon class="logo-icon"><Briefcase /></el-icon>
          <span class="logo-text">留学规划平台</span>
        </div>
        <!-- 桌面端导航菜单 -->
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          class="nav-menu desktop-nav"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.path"
            :index="item.path"
            @click="$router.push(item.path)"
            :class="{ 'is-active': activeMenu === item.path }"
          >{{ item.name }}</el-menu-item>
        </el-menu>
        <!-- 移动端汉堡菜单按钮 -->
        <button class="hamburger-btn" @click="mobileMenuVisible = true" aria-label="打开菜单">
          <el-icon :size="24"><Expand /></el-icon>
        </button>
      </div>
    </el-header>
    <el-main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
    <el-footer class="app-footer" v-if="!route.meta?.hasFooter">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#" @click.prevent="showGuide">使用指南</a>
          <a href="#" @click.prevent="showAbout">关于我们</a>
          <a href="#" @click.prevent="showContact">联系方式</a>
        </div>
        <div class="footer-copyright">
          一站式智能留学规划与服务平台 &copy; 2026
        </div>
      </div>
    </el-footer>

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
          <button class="drawer-close-btn" @click="mobileMenuVisible = false" aria-label="关闭菜单">
            <el-icon :size="20"><Close /></el-icon>
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
    <el-dialog v-model="guideVisible" title="使用指南" width="60%" class="guide-dialog">
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
    <el-dialog v-model="aboutVisible" title="关于我们" width="50%">
      <p>一站式智能留学规划与服务平台，通过AI分析用户背景，生成动态的、可执行的个性化留学规划路径图。</p>
      <p>技术栈：Vue 3 + Vite + Element-Plus + ECharts</p>
    </el-dialog>

    <!-- 联系对话框 -->
    <el-dialog v-model="contactVisible" title="联系方式" width="40%">
      <p>如有问题或建议，欢迎联系我们：</p>
      <p>邮箱：contact@example.com</p>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { computed, ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Briefcase, Expand, Menu, Close, Document, Cpu, DataLine } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  /* F046: 导航栏固定抖动修复 - 增强渲染稳定性 */
  contain: layout style paint;
  will-change: scroll-position;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.header-content {
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.logo-icon {
  font-size: 28px;
  margin-right: 10px;
}

.logo-text {
  font-family: 'Microsoft YaHei', sans-serif;
}

.nav-menu {
  border-bottom: none;
  background: transparent;
  flex: 1;
  overflow-x: auto;
  /* Element Plus菜单变量覆盖 */
  --el-menu-active-color: #ffffff;
  --el-menu-hover-color: #ffffff;
  --el-menu-text-color: rgba(255, 255, 255, 0.9);
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
}
.nav-menu::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.nav-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 2px solid transparent;
  padding: 0 12px;  /* 减少水平内边距以容纳更多菜单项 */
}

.nav-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.5);
}

.nav-menu :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
  border-bottom: 3px solid #ffffff;
  font-weight: 600;
}

.app-main {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
}

.app-footer {
  background: #1a1a2e;
  color: rgba(255, 255, 255, 0.75);
  padding: 20px;
}

/* 汉堡菜单按钮 */
.hamburger-btn {
  display: none;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: white;
  transition: background 0.2s;
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.25);
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
  background: #f5f7fa;
  color: #667eea;
}

.mobile-menu-item.is-active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
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
  color: #667eea;
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
