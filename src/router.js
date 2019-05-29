import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // route level code-splitting
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./pages/Home.vue'),
    },
    {
      path: '/translators',
      name: 'Translators',
      component: () => import('./pages/Translators.vue'),
    },
    {
      path: '/ladies',
      name: 'Ladies',
      component: () => import('./pages/Ladies.vue'),
    },
    {
      path: '/invite',
      name: 'Invite',
      component: () => import('./pages/Invite.vue'),
    },
  ],
});
