import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CommunityView from '../views/CommunityView.vue'
import DashboardView from '../views/DashboardView.vue'
import CategoryView from '../views/CategoryView.vue'
import PlaceDetailView from '../views/PlaceDetailView.vue'
import DataSourceView from '../views/DataSourceView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import FestivalCalendar from '../components/FestivalCalendar.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/community', name: 'Community', component: CommunityView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/category/:id', name: 'Category', component: CategoryView, props: true },
  { path: '/place/:id', name: 'PlaceDetail', component: PlaceDetailView, props: true },
  { path: '/data-source', name: 'DataSource', component: DataSourceView },
  { path: '/festival-calendar', name: 'FestivalCalendar', component: FestivalCalendar },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
