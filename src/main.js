import '@babel/polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './setup/router-setup';
import i18n from './setup/i18n-setup';
import store from './store';
import vueConfig from './plugins/vueConfig';
import mixins from './plugins/mixins';
import directive from './plugins/directive';
import eject from './plugins/eject';
import filters from './plugins/filters';
// eslint-disable-next-line import/no-named-as-default
import components from './plugins/components';
// import jockey from './utils/jockey';
import './assets/styleSheet/global.css';

Vue.use(vueConfig);
Vue.mixin(mixins);
Vue.use(directive);
Vue.use(filters);
Vue.use(eject);
Vue.use(components);

/* eslint-disable no-new */

new Vue({
  el: '#root',
  router,
  store,
  i18n,
  data() {
    return { isRender: true };
  },
  watch: {
    '$i18n.locale': { // 监听语言变化
      handler(n, o) {
        if (n !== o) {
          this.isRender = false;
          this.$nextTick(() => { this.isRender = true; });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  // components: { App },
  // template: '<App/>', // https://cli.vuejs.org/config/#runtimecompiler
  render(h) {
    return this.isRender ? h(App) : null;
  },
});
