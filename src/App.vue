<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <el-icon class="logo-icon"><Briefcase /></el-icon>
          <span class="logo-text">留学规划平台</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          :router="true"
          class="nav-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/" route="/">首页</el-menu-item>
          <el-menu-item index="/ai-config" route="/ai-config">AI配置</el-menu-item>
          <el-menu-item index="/assessment" route="/assessment">背景评估</el-menu-item>
          <el-menu-item index="/school-recommendation" route="/school-recommendation">选校推荐</el-menu-item>
          <el-menu-item index="/timeline" route="/timeline">时间规划</el-menu-item>
          <el-menu-item index="/materials" route="/materials">材料中心</el-menu-item>
          <el-menu-item index="/university-database" route="/university-database">院校数据库</el-menu-item>
          <el-menu-item index="/ai-chat" route="/ai-chat">AI对话</el-menu-item>
        </el-menu>
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
import { Briefcase } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)

const guideVisible = ref(false)
const aboutVisible = ref(false)
const contactVisible = ref(false)

const handleMenuSelect = (index) => {
  console.log('handleMenuSelect called with:', index)
  console.log('router object:', router)
  console.log('router.push exists:', typeof router.push)
  // 尝试使用全局 router 对比
  if (window.$router) {
    console.log('window.$router exists')
  }
  router.push(index).then(() => {
    console.log('router.push resolved, new route:', route.path)
  }).catch(err => {
    console.error('router.push error:', err)
  })
}

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
  color: rgba(255, 255, 255, 0.45);
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
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 10px 0;
  }

  .nav-menu {
    width: 100%;
    margin-top: 10px;
  }

  .nav-menu :deep(.el-menu-item) {
    font-size: 14px;
    padding: 0 10px;
  }
}
</style>
