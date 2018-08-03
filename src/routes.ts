import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'main',
        component: () => import(/* webpackChunkName: "main-view" */ './views/Main.vue'),
        children: <RouteRecordRaw[]>[
            {
                path: '',
                name: 'default',
                redirect: 'home'
                // meta: { title: '首页' },
            },
            {
                path: 'home',
                name: 'home',
                component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
                // meta: { title: '首页' },
            }
        ]
    }
];

export default routes;
