import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CommunityView from '../views/CommunityView.vue'
import DashboardView from '../views/DashboardView.vue'
import CategoryView from '../views/CategoryView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/community', name: 'Community', component: CommunityView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/category/:id', name: 'Category', component: CategoryView, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
