import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) { // 期望滚动到哪个的位置
    return savedPosition || { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/components/Home'),
    },
  ],
});
