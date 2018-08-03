import type { App } from 'vue';

import { hyphenate } from '../utils/common';

export type InputStr = string | number;

export function strIntercept(str: InputStr, length: number = 3): string { // 过滤中间信息，不予展示
    const newStr: string = String(str);
    const prefix: RegExpMatchArray | null = newStr.match(new RegExp(`^[\\s\\S]{${length}}`));
    const suffix: RegExpMatchArray | null = newStr.match(new RegExp(`[\\s\\S]{${length}}$`));
    return `${prefix}****${suffix}`;
}

export default {
    install: (app: App): void => {
        const { $filters: filters } = app.config.globalProperties;
        if (process.env.NODE_ENV === 'development') console.warn('过滤器在当前版本已不受支持，查看迁移指南：', 'https://v3.vuejs.org/guide/migration/filters.html#migration-strategy');
        app.config.globalProperties.$filters = Object.assign(Object.create(null), filters, { [hyphenate(strIntercept.name)]: strIntercept });
    }
};
