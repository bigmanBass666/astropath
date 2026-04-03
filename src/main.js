import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import './styles/index.css'

// 设计系统样式
import './styles/variables.css'
import './styles/animations.css'
import './styles/utilities.css'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/ai-config',
    name: 'AIConfig',
    component: () => import('@/views/AIConfig.vue'),
    meta: { title: 'AI配置' }
  },
  {
    path: '/assessment',
    name: 'Assessment',
    component: () => import('@/views/Assessment.vue'),
    meta: { title: '背景评估' }
  },
  {
    path: '/school-recommendation',
    name: 'SchoolRecommendation',
    component: () => import('@/views/SchoolRecommendation.vue'),
    meta: { title: '选校推荐' }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('@/views/Timeline.vue'),
    meta: { title: '时间规划' }
  },
  {
    path: '/materials',
    name: 'Materials',
    component: () => import('@/views/Materials.vue'),
    meta: { title: '材料中心' }
  },
  {
    path: '/university-database',
    name: 'UniversityDatabase',
    component: () => import('@/views/UniversityDatabase.vue'),
    meta: { title: '院校数据库' }
  },
  {
    path: '/ai-chat',
    name: 'AIChat',
    component: () => import('@/views/AIChat.vue'),
    meta: { title: 'AI对话' }
  },
  {
    path: '/major-detail/:id',
    name: 'MajorDetail',
    component: () => import('@/views/MajorDetail.vue'),
    meta: { title: '专业详情' }
  },
  {
    path: '/school-detail/:id',
    name: 'SchoolDetail',
    component: () => import('@/views/SchoolDetail.vue'),
    meta: { title: '院校详情' }
  }
]

const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

app.use(router)
app.use(ElementPlus)

// 路由守卫：设置页面标题
router.beforeEach((to) => {
  document.title = `${to.meta.title || '首页'} - 一站式智能留学规划平台`
  return true
})

// 暴露 router 到 window 以便测试和调试
import { useRoute } from 'vue-router'
app.config.globalProperties.$router = router
// 实例挂载后，可以通过 getCurrentInstance() 获取
app.mount('#app')

// 将 router 和 route 暴露到 window 方便 Playwright 测试
window.$router = router
