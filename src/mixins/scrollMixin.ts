import type { App, ComponentOptions } from 'vue';

import { addEventListener, removeEventListener } from '../utils/common';

/* export interface ScrollChange{
    scrollEl?: string;
    scrollToView: (event: Event) => Error | boolean;
    handleScroll?: (status: 'start' | 'end' | 'ing') => void
} */

export const scrollMixin: ComponentOptions = {
    mounted(): boolean | Error {
        const { scrollEl } : {scrollEl : string} = this.$options;
        if (scrollEl) {
            addEventListener(<HTMLElement>document.getElementById(scrollEl), 'scroll', this.scrollToView);
            return false;
        }
        return new Error('缺少自定义的选项“scrollEl”，这是你监听的滚动容器[DOM-ID]，不应该是window');
    },
    scrollToView(event: Event) : Error | boolean {
        event.stopPropagation(); // 阻止下一步执行
        if (!this.handleScroll) return new Error('需要在methods选项中提供“handleScroll”方法，在滚动过程中会自动调用该方法');
        /* eslint no-nested-ternary: 0 */
        // @ts-ignore
        const { scrollHeight, scrollTop, clientHeight } = <MSInputMethodContext>event.target;
        const status: 'start' | 'ing' | 'end' = scrollTop === 0 ? 'start' : scrollHeight - scrollTop <= clientHeight ? 'end' : 'ing';
        process.nextTick(this.handleScroll.bind(this, status));
        return false;
    },
    beforeUnmount(): void {
        if (this.$options.scrollEl) {
            const { scrollEl } : {scrollEl : string} = this.$options;
            removeEventListener(<HTMLElement>document.getElementById(scrollEl), 'scroll', this.scrollToView);
        }
    }
};

export default {
    install: (app: App): void => {
        app.mixin(scrollMixin);
    }
};
