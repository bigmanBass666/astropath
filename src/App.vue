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
          :router="true"
          class="nav-menu desktop-nav"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/ai-config">AI配置</el-menu-item>
          <el-menu-item index="/assessment">背景评估</el-menu-item>
          <el-menu-item index="/school-recommendation">选校推荐</el-menu-item>
          <el-menu-item index="/timeline">时间规划</el-menu-item>
          <el-menu-item index="/materials">材料中心</el-menu-item>
          <el-menu-item index="/university-database">院校数据库</el-menu-item>
          <el-menu-item index="/ai-chat">AI对话</el-menu-item>
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
    <el-dialog v-model="guideVisible" title="使用指南" width="60%">
      <div class="guide-content">
        <h4>快速开始</h4>
        <ol>
          <li>首先配置AI API（多个供应商可选）</li>
          <li>完成背景评估问卷，获取竞争力分析</li>
          <li>查看智能选校推荐，收藏心仪学校</li>
          <li>使用时间规划工具管理申请进度</li>
          <li>利用文书助手和材料清单准备申请</li>
          <li>在院校数据库查询目标学校信息</li>
          <li>与AI智能体对话获取专业建议</li>
        </ol>
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Briefcase, Expand, Menu } from '@element-plus/icons-vue'

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

const guideVisible = ref(false)
const aboutVisible = ref(false)
const contactVisible = ref(false)


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
