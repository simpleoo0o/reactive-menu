import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/template/:a?',
          name: 'template',
          component: () => import('../views/TheTemplate.vue')
        },
        {
          path: '/template2',
          name: 'template2',
          component: () => import('../views/TheTemplate.vue')
        }
      ]
    },
    {
      path: '/tree',
      name: 'tree',
      component: () => import('../views/TheTree.vue')
    }
  ]
})

export default router
