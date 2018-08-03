/// doc: https://vuex.vuejs.org/api
import type { Store } from 'vuex';
import type { InjectionKey, ComponentCustomProperties } from 'vue';
// import path from 'path';
import Vuex, { createStore, useStore as baseUseStore } from 'vuex';

import { State } from './types';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

// @ts-ignore
const modules: Module = require.context('./modules', false, /\.(js|ts)$/);
const isDebug: boolean = process.env.NODE_ENV !== 'production';
// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
    modules: modules.keys()
        .reduce((acc: object, key: string) => ({
            ...acc,
            [key.replace(/(\.\/|\.js|\.ts)/g, '')]: modules(key).default
        }), {}),
    state,
    mutations,
    actions,
    getters,
    strict: !isDebug // 任何 mutation 处理函数以外修改 Vuex state 都会抛出错误
    // plugins: debug ? [createLogger()] : [],
});

// define your own `useStore` composition function
export const useStore = () => baseUseStore(key);

declare module '@vue/runtime-core' { // 扩展支持this.$store类型推断
    // declare your own store states
    /* interface State {
        count: number
    } */

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}
