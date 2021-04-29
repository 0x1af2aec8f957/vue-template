import type { App, ComponentOptions } from 'vue';

import { ref, onMounted, onUnmounted } from 'vue';

import { addEventListener, removeEventListener } from '../utils/common';

const confirmationMessage: string = '你确定要离开吗？';

export const beforeunloadMixin: ComponentOptions = {
    data(): {
        isAllowClose: boolean // 是否允许关闭
        } {
        return {
            isAllowClose: true
        };
    },
    mounted() {
        addEventListener(window, 'beforeunload', this.handleBeforeunload);
    },
    methods: {
        handleBeforeunload(event: Event): void | string {
            if (this.isAllowClose) {
                event.preventDefault();
                // @ts-ignore, 兼容方案
                (event ?? window.event).returnValue = confirmationMessage;
                return confirmationMessage; // 兼容 Gecko + Webkit, Safari, Chrome
            }
        }
    },
    unmounted() {
        removeEventListener(window, 'beforeunload', this.handleBeforeunload);
    }
};

export function useBeforeunload(_props: any) { // setup[composition-api]，可在组件内部监听 isAllowClose 获取网络状态
    const isAllowClose = ref<boolean>(true); // 初始化允许关闭状态

    function updateNetworkState(status: boolean): void { // 变更 networkState
        isAllowClose.value = status;
    }

    onMounted((): void => { // 监听
        addEventListener(window, 'beforeunload', beforeunloadMixin.methods.handleBeforeunload);
    });
    onUnmounted(() => { // 移除
        removeEventListener(window, 'beforeunload', beforeunloadMixin.methods.handleBeforeunload);
    });

    return { // 这里返回的任何内容都可以用于组件的其余部分
        isAllowClose,
        updateNetworkState
    };
}

export default {
    install: (app: App): void => {
        app.mixin(beforeunloadMixin);
    }
};
