import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from '../plugins/logger';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const modules = require.context('./modules', false, /\.js$/);

/* eslint no-shadow: ["error", { "allow": ["state"] }] */

export default new Vuex.Store({
  modules: modules.keys()
    .reduce((acc, key) => ({
      ...acc,
      [key.replace(/(\.\/|\.js)/g, '')]: modules(key).default,
    }), {}),
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
