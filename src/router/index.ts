import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteComponent,
} from 'vue-router'
import { navRoutes } from '@/content/navigation'
import { applySeo } from '@/utils/seo'

/** route name → 對應的頁面元件（唯一需要在此維護的對照表）。 */
const viewMap: Record<string, () => Promise<RouteComponent>> = {
  home: () => import('@/views/HomeView.vue'),
  wedding: () => import('@/views/WeddingView.vue'),
  commercial: () => import('@/views/CommercialView.vue'),
  about: () => import('@/views/AboutView.vue'),
  faq: () => import('@/views/FaqView.vue'),
  contact: () => import('@/views/ContactView.vue'),
}

const routes: RouteRecordRaw[] = [
  {
    path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue'),
    meta: { title: '後台系統' },
  },
  ...navRoutes.map<RouteRecordRaw>((route) => ({
    path: route.path,
    name: route.name,
    component: viewMap[route.name],
    meta: {
      title: route.title,
      description: route.description,
      navTitle: route.navTitle,
      showInNavbar: route.showInNavbar,
      showInFooter: route.showInFooter,
    },
  })),
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 96 }
    return { top: 0 }
  },
})

router.beforeEach((to, from) => {
  if (from.query.preview === '1' && to.name !== 'admin' && to.query.preview !== '1') {
    return { path: to.path, query: { ...to.query, preview: '1' }, hash: to.hash }
  }
})

router.afterEach((to) => {
  applySeo({
    title: (to.meta.title as string | undefined) ?? '',
    description: (to.meta.description as string | undefined) ?? '',
    path: to.path,
  })
})

export default router
