import Vue from 'vue'
import VueRouter from 'vue-router'
import Join from '@/views/Join'
import Room from '@/views/Room'
import Feedback from '@/views/Feedback'

Vue.use(VueRouter)
const isProd = process.env.NODE_ENV === 'production'

const routes = [
  {
    path: '/',
    name: 'Join',
    component: Join,
    props: true,
    meta: {
      title: 'Join Intellecture - Enter a room code here!',
      metaTags: [
        {
          name: 'description',
          content: 'Join an Intellecture room here! Intellecture is an online tool that provides easy communication between a teacher and student to create a better learning enviornment!'
        },
        {
          property: 'og:description',
          content: 'Join an Intellecture room here! Intellecture is an online tool that provides easy communication between a teacher and student to create a better learning enviornment!'
        }
      ]
    }
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
  mode: isProd ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
