import Vue from 'vue'
import VueRouter from 'vue-router'
import Landing from '@/views/Landing.vue'
import Dashboard from '@/views/Dashboard.vue'
import Lecture from '@/views/Lecture.vue'
import New from '@/views/New.vue'
import SignIn from '@/views/SignIn.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/lecture',
    name: 'Lecture',
    component: Lecture,
    props: true
  },
  {
    path: '/new',
    name: 'New',
    component: New
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
