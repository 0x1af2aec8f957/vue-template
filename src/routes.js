export default [
  /* {
    path: '/test',
    name: 'test',
    component: () => import(/!* webpackChunkName: "test" *!/ './views/Test.vue'),
    meta: { title: '测试' },
  }, */
  {
    path: '/',
    name: 'main',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "main" */ './views/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
        meta: { title: '首页' },
      },
      {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
        meta: { title: '关于' },
      },
    ],
  },
];
