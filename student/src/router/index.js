import Vue from 'vue'
import VueRouter from 'vue-router'
import Join from '@/views/Join.vue'
import Room from '@/views/Room.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Join',
    component: Join,
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: Room,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
