import { createRouter, createWebHistory } from 'vue-router'
import { toast } from '@/components/ui/toast'
import { AUTH } from './auth'
import { APP } from './app'

export let activedRoutes = []

const routes = [
  AUTH,
  APP,
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../views/legal/PrivacyView.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('../views/legal/TermsView.vue'),
  },
  {
    path: '/styles',
    name: 'styles',
    component: () => import('../views/StylesView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  activedRoutes = [];
  to.matched.forEach((record) => { activedRoutes.push(record) })

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.signedIn) {
      toast({
        title: 'Not Authorized',
        description: "You need to be logged in to access that page.",
      })
      next({ name: 'login' })
      return
    }
  }
  if (to.matched.some(record => record.meta.redirectIfAuthorized)) {
    if (localStorage.signedIn) {
      next({ name: 'milestones' })
      return
    }
  }
  next()
})

export default router
