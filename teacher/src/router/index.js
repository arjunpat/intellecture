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
      title: 'Intellecture | Lecture tool',
      metaTags: [
        {
          name: 'description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        },
        {
          property: 'og:description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
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
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        },
        {
          property: 'og:description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        }
      ]
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'About Us | Intellecture',
      metaTags: [
        {
          name: 'description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        },
        {
          property: 'og:description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        }
      ]
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard | Intellecture',
      metaTags: [
        {
          name: 'description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        },
        {
          property: 'og:description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        }
      ]
    }
  },
  {
    path: '/lecture/:id',
    name: 'Lecture',
    component: Lecture,
    props: true,
    meta: {
      title: 'Lecture | Intellecture',
      metaTags: [
        {
          name: 'description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        },
        {
          property: 'og:description',
          content: 'Intellecture is an online tool facilitating real-time lecture feedback between teacher and student. Sign up for free now!'
        }
      ]
    }
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

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  if(!nearestWithMeta) return next();

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router
