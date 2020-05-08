import Vue from 'vue'
import VueRouter from 'vue-router'
import Join from '@/views/Join'
import Room from '@/views/Room'
import Feedback from '@/views/Feedback'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Join',
    component: Join,
    props: true,
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: Room,
    props: true,
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback,
    props: true,
  },
  {
    path: '*',
    redirect: '/',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
