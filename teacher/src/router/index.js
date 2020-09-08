import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '@/views/NotFound.vue'
import Landing from '@/views/Landing.vue'
import Dashboard from '@/views/Dashboard.vue'
import Lecture from '@/views/Lecture.vue'
import New from '@/views/New.vue'
import Feedback from '@/views/Feedback.vue'
import LectureAnalytics from '@/views/lecture-analytics/LectureAnalytics'
import LectureAnalyticsOverview from '@/views/lecture-analytics/Overview'
import LectureAnalyticsStudent from '@/views/lecture-analytics/Student'
import ClassLectures from '@/views/ClassLectures'
import PrivacyPolicy from '@/views/PrivacyPolicy'
import About from '@/views/About'

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
    component: Landing,
    meta: {
      title: 'Intellecture',
      metaTags: [
        {
          name: 'description',
          content: 'An online tool facilitating real-time lecture feedback between teacher and student'
        },
        {
          property: 'og:description',
          content: 'An online tool facilitating real-time lecture feedback between teacher and student'
        }
      ]
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: {
      title: 'Privacy Policy | Intellecture',
      metaTags: [
        {
          name: 'description',
          content: 'An online tool facilitating real-time lecture feedback between teacher and student'
        },
        {
          property: 'og:description',
          content: 'An online tool facilitating real-time lecture feedback between teacher and student'
        }
      ]
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
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
    path: '/feedback',
    name: 'Feedback',
    component: Feedback,
    props: true,
  },
  {
    path: '/lectures/:class_uid',
    name: 'ClassLectures',
    component: ClassLectures,
    props: true
  },
  {
    path: '/lecture-analytics/:lecture_uid',
    component: LectureAnalytics,
    props: true,
    children: [
      {
        path: '',
        name: 'LectureAnalytics',
        component: LectureAnalyticsOverview,
      },
      {
        path: 'student/:student_uid',
        name: 'LectureAnalyticsStudent',
        component: LectureAnalyticsStudent,
      },
    ]
  }
]

const router = new VueRouter({
  mode: isProd ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
