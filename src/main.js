import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './styles/index.css'

// 设计系统样式
import './styles/variables.css'
import './styles/animations.css'
import './styles/utilities.css'
import './styles/atmosphere.css'

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

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, left: 0, behavior: 'instant' }
  }
})

app.use(router)
app.use(ElementPlus)

router.beforeEach((to) => {
  document.title = `${to.meta.title || '首页'} - 智途 AstroPath`
  return true
})

router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
})

app.config.globalProperties.$router = router
app.mount('#app')

// 将 router 和 route 暴露到 window 方便 Playwright 测试
window.$router = router
