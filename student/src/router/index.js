import Vue from 'vue';
import VueRouter from 'vue-router';
import SignIn from '@/views/SignIn.vue';
import Join from '@/views/Join.vue';
import Room from '@/views/Room.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Sign In',
    component: SignIn,
  },
  {
    path: '/join',
    name: 'Join',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('...'),
    component: Join,
  },
  {
    path: '/room',
    name: 'Room',
    component: Room,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
