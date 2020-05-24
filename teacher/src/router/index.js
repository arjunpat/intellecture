import Vue from 'vue'
import VueRouter from 'vue-router'
import Landing from '@/views/Landing.vue'
import Dashboard from '@/views/Dashboard.vue'
import Lecture from '@/views/Lecture.vue'
import New from '@/views/New.vue'
import SignIn from '@/views/SignIn.vue'
import Feedback from '@/views/Feedback.vue'

Vue.use(VueRouter)
const isProd = process.env.NODE_ENV === 'production'

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
    path: '/lecture/:id',
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
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback,
    props: true,
  }
]

const router = new VueRouter({
  mode: isProd ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
