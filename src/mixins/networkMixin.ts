import type { App, ComponentOptions } from 'vue';

import { ref, onMounted, onUnmounted } from 'vue';

import { addEventListener, removeEventListener } from '../utils/common';

export enum NetworkState{
    ONE_LINE,
    OFF_LINE
}

function getNetworkState(): NetworkState { // 获取网络状态
    const onLine: boolean = navigator.onLine ?? false;
    return onLine ? NetworkState.ONE_LINE : NetworkState.OFF_LINE;
}

export const networkMixin: ComponentOptions = {
    data(): {
        networkState: NetworkState
        } {
        return {
            networkState: getNetworkState()
        };
    },
    mounted() {
        addEventListener(window, 'online', this.updateNetworkState);
        addEventListener(window, 'offline', this.updateNetworkState);
    },
    methods: {
        updateNetworkState(): void {
            this.networkState = getNetworkState();
        }
    },
    unmounted() {
        removeEventListener(window, 'online', this.updateNetworkState);
        removeEventListener(window, 'offline', this.updateNetworkState);
    }
};

export function useNetwork(_props: any) { // setup[composition-api]，可在组件内部监听 networkState 获取网络状态
    const networkState = ref<NetworkState>(getNetworkState()); // 初始化网络状态

    function updateNetworkState(): void { // 变更 networkState
        networkState.value = getNetworkState();
    }

    onMounted((): void => { // 监听
        addEventListener(window, 'online', networkMixin.methods.updateNetworkState);
        addEventListener(window, 'offline', networkMixin.methods.updateNetworkState);
    });
    onUnmounted(() => { // 移除
        removeEventListener(window, 'online', networkMixin.methods.updateNetworkState);
        removeEventListener(window, 'offline', networkMixin.methods.updateNetworkState);
    });
    return { // 这里返回的任何内容都可以用于组件的其余部分
        networkState
    };
}

export default {
    install: (app: App): void => {
        app.mixin(networkMixin);
    }
};
