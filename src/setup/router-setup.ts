import type { Router, NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw, _RouteLocationBase } from 'vue-router'; /// doc: https://router.vuejs.org/api
import type { Locale } from '@intlify/runtime';

import VueRouter, { createRouter, createWebHistory } from 'vue-router'; /// doc: https://router.vuejs.org/api
import cookies from 'cookies-js';

import i18n, { setI18nLanguage, LangKeyString } from './i18n-setup';
import routes from '../routes';

type _RouteMethod = {
    [key in keyof Router]: any
};

const TITLE: string = window.document.title; // 获取初始window窗口的标题
const locales: string[] = i18n.global?.availableLocales.map((_locale: Locale) => _locale.toLowerCase()) || []; // 项目支持的语言包[小写]

const router: Router = createRouter({
    history: createWebHistory(process.env.BASE_URL /* 适用于OSS/CDN，process.env.BASE_URL仅适用于开发部署 */),
    routes, // short for `routes: routes`
    scrollBehavior<ScrollBehavior>(to: RouteLocationNormalized, from: RouteLocationNormalized) {
        return { top: 0 };
    }
});

const routerNext = { // router进入页面前执行的事件
    setLanguage({ meta, path }: RouteLocationNormalized): Promise<boolean> { // 语言设置
        const {
            lang = locales.find(_locale => new RegExp(`^/${_locale}`, 'im').test(path)) /* 路径设置语言 */ || i18n.global.locale
        } = meta;

        if (lang) setI18nLanguage(lang as LangKeyString);
        return Promise.resolve(true);
    },
    setTitle({ meta }: RouteLocationNormalized): Promise<boolean> { // 窗口标题设置
        const { title } = meta;
        window.document.title = (typeof title === 'function' ? title() : title) || TITLE; // 动态修改窗口标题
        return Promise.resolve(true);
    },
    setRequiresAuth({ meta }: RouteLocationNormalized): Promise<boolean | string> { // 路由鉴权
        const { requiresAuth } = meta;
        if (requiresAuth) return Promise.resolve(cookies.get('token') || '/login');
        return Promise.resolve(true);
    },
    setRedirect({ meta }: RouteLocationNormalized): Promise<boolean> { // 动态路由重定向
        const { redirection } = meta;
        // eslint-disable-next-line prefer-rest-params
        if (redirection) return Promise.resolve(typeof redirection === 'function' ? redirection.apply(router, arguments) : redirection);
        return Promise.resolve(true);
    }
};

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized/* , next: NavigationGuardNext */): Promise<RouteLocationRaw | boolean> => Promise.all(
    Object.values(routerNext).map((func: Function): Promise<boolean | string> => func(to, from))
).then((response:(string | boolean)[]): RouteLocationRaw | boolean => {
    const path = [...response].reverse()/* 遵循webpack-loader加载与解析顺序规则 */.find((_path: string | boolean) => _path && typeof _path === 'string') as string;
    switch (true) {
    case Boolean(path):
        return ({ path, replace: true });
    case response.some(isNext => !isNext):
        return false;
    default:
        return true;
    }
}));

router.afterEach((/* to: RouteLocationNormalized, from: RouteLocationNormalized */): void => { // 自定义元素滚动到顶部
    const el: HTMLElement | null = document.getElementById('app');
    if (el) el.scrollTop = <number>0;
});

export const route = Object.keys(router.currentRoute.value)
    // @ts-ignore
    .reduce((acc, cur: keyof _RouteLocationBase) => Object.defineProperty(acc, cur, {
        get: () => router.currentRoute.value[cur]
    }),
    Object.create(null)) as unknown as _RouteLocationBase;

export default router;

declare module 'vue-router' { // 扩展RouteMeta类型信息
    interface RouteMeta {
        // is optional
        lang?: string
        title?: string | Function
        requiresAuth?: string
        // must be declared by every route
        redirection: Function | string
    }
}
