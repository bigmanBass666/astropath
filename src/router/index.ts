import { createRouter, createWebHashHistory } from 'vue-router'

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
  },
  {
    path: '/story',
    name: 'Story',
    component: () => import('@/views/Story.vue'),
    meta: { title: '项目故事' }
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/views/Result.vue'),
    meta: { title: '比赛结果' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return new Promise((resolve) => {
      const resetScroll = () => {
        const appMain = document.querySelector('.app-main')
        if (appMain) appMain.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }
      resetScroll()
      requestAnimationFrame(resetScroll)
      resolve({ top: 0, left: 0 })
    })
  }
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || '首页'} - 智途 AstroPath`
  return true
})

router.afterEach(() => {
  const appMain = document.querySelector('.app-main')
  if (appMain) appMain.scrollTo({ top: 0, behavior: 'instant' })
  window.scrollTo({ top: 0, behavior: 'instant' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
})

export default router
