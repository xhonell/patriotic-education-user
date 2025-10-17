import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      // 用户模块
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { title: '个人信息', requiresAuth: true }
      },
      {
        path: 'learning-info',
        name: 'LearningInfo',
        component: () => import('@/views/user/LearningInfo.vue'),
        meta: { title: '学习信息查看', requiresAuth: true }
      },
      // 内容管理模块
      {
        path: 'article-learning',
        name: 'ArticleLearning',
        component: () => import('@/views/content/ArticleLearning.vue'),
        meta: { title: '文章学习' }
      },
      {
        path: 'article-detail/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/content/ArticleDetail.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: 'video-learning',
        name: 'VideoLearning',
        component: () => import('@/views/content/VideoLearning.vue'),
        meta: { title: '视频学习' }
      },
      {
        path: 'video-detail/:id',
        name: 'VideoDetail',
        component: () => import('@/views/content/VideoDetail.vue'),
        meta: { title: '视频详情' }
      },
      {
        path: 'integration',
        name: 'Integration',
        component: () => import('@/views/content/Integration.vue'),
        meta: { title: '积分积累', requiresAuth: true }
      },
      // 社区模块
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/views/community/Community.vue'),
        meta: { title: '社区交流' }
      },
      {
        path: 'check-in',
        name: 'CheckIn',
        component: () => import('@/views/community/CheckIn.vue'),
        meta: { title: '签到打卡', requiresAuth: true }
      },
      {
        path: 'forum',
        name: 'Forum',
        component: () => import('@/views/community/Forum.vue'),
        meta: { title: '论坛模块' }
      },
      {
        path: 'topic/:id',
        name: 'TopicDetail',
        component: () => import('@/views/community/TopicDetail.vue'),
        meta: { title: '话题详情' }
      },
      {
        path: 'ranking',
        name: 'Ranking',
        component: () => import('@/views/community/Ranking.vue'),
        meta: { title: '社区等级' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 青少年爱国教育平台` : '青少年爱国教育平台'
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const userStore = useUserStore()
    if (!userStore.isLogin) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  next()
})

export default router

