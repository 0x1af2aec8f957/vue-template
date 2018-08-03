import type { App } from 'vue';

import { deepCopy, hyphenate, typeOf } from '../utils/common';

export type ArrayItemType = string & any[] & {[key in (string | number)]: any};

export function arraySort<T extends ArrayItemType>(sourceData: T[], attr: string, rev: number = 1): T[] {
    return Array.prototype.sort.call(
        deepCopy(sourceData),
        (a: T, b: T) => {
            let old: any = a,
                cur: any = b;

            if (typeOf(a) === 'object') {
                old = attr?.split('.').reduce((acc: T, cur: string): T => acc[cur], a);
            }
            if (typeOf(b) === 'object') {
                cur = attr?.split('.').reduce((acc: T, cur: string): T => acc[cur], b);
            }

            return (old - cur) * rev;
        }
    );
}

export default {
    install: (app: App): void => {
        const { $filters: filters } = app.config.globalProperties;
        if (process.env.NODE_ENV === 'development') console.warn('过滤器在当前版本已不受支持，查看迁移指南：', 'https://v3.vuejs.org/guide/migration/filters.html#migration-strategy');
        app.config.globalProperties.$filters = Object.assign(Object.create(null), filters, { [hyphenate(arraySort.name)]: arraySort });
    }
};
