import { createRouter, createWebHistory } from 'vue-router'

// Lazy loading
const ExplorerView = () => import('@/presentation/views/ExplorerView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: ExplorerView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router