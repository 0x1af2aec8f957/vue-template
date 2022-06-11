import type { RouteRecordRaw } from 'vue-router';

import { RouterView } from 'vue-router';
import { h } from 'vue';

const routes: RouteRecordRaw[] = [
    { /// view mode
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
                name: 'main-home',
                component: () => import(/* webpackChunkName: "main-home" */ './views/Home.vue'),
                meta: { title: '首页', keepAlive: false }
            }
        ]
    },
    { /// menu mode
        path: 'menu',
        name: 'menu',
        component: { render: () => h(RouterView) }, // 嵌套路由无固定component模式
        meta: { title: '菜单嵌套递归占位模式', keepAlive: false },
        children: [{
            path: 'home',
            name: 'menu-home',
            component: () => import(/* webpackChunkName: "menu-home" */ './views/Home.vue'),
            meta: { title: '首页', keepAlive: false }
        }]
    }
];

export default routes;
