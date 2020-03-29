import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Lecture from '@/views/Lecture.vue'
import New from '@/views/New.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/lecture',
    name: 'Lecture',
    component: Lecture
  },
  {
    path: '/new',
    name: 'New',
    component: New
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
