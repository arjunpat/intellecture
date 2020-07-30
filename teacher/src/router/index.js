import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '@/views/NotFound.vue'
import Landing from '@/views/Landing.vue'
import Dashboard from '@/views/Dashboard.vue'
import Lecture from '@/views/Lecture.vue'
import New from '@/views/New.vue'
import SignIn from '@/views/SignIn.vue'
import Feedback from '@/views/Feedback.vue'
import LectureAnalyticsStudent from '@/views/lecture-analytics/Student';

Vue.use(VueRouter)
const isProd = process.env.NODE_ENV === 'production'

const routes = [
  { 
    path: '/404', 
    name: 'NotFound',
    component: NotFound 
  },  
  { 
    path: '*', 
    name: 'NotFound',
    redirect: '/404'
  }, 
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
  },
  {
    path: '/lecture-analytics/:lecture_uid',
    redirect: '/lecture-analytics/:lecture_uid/students'
  },
  {
    path: '/lecture-analytics/:lecture_uid/students',
    name: 'LectureAnalyticsStudent',
    component: LectureAnalyticsStudent
  }
]

const router = new VueRouter({
  mode: isProd ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
