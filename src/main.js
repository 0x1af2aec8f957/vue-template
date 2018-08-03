// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import { router } from './config';
import Util from './util';
import Ux from './template';
import './assets/style/global.css';

Vue.use(Util);
Vue.use(Ux);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#root',
  router,
  components: { App },
  template: '<App/>',
});
