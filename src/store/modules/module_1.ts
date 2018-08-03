import type { Module, GetterTree, ActionTree, MutationTree } from 'vuex';
import type { State as RootState, Payload } from '../types';

const namespaced: boolean = true;
export interface State {
    msg: string;
}

const state: State = {
    msg: 'hello vuex'
};

const mutations: MutationTree<State> = {
    updateMsg(state: State, payload: Payload): void {
        state.msg = payload.data;
    }
};

const actions: ActionTree<State, RootState> = {
    fetchMsg({ commit }): Promise<void> {
        return Promise.resolve('modify vuex').then((r: any) => commit('updateMsg', { data: r }));
    }
};

const getters: GetterTree<State, RootState> = {
    'computedA&Msg': function (state: State, getters: object, rootState: RootState): string {
        return `${state.msg}------>${rootState.a}`;
    }
};

const store: Module<State, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters
};

export default store;
