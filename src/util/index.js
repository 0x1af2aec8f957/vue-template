import $util from 'em-util'; // 仅ES6
import * as $calc from 'js-calculation'; // 兼容node
import $api from 'js-transmission';
import 'babel-polyfill'; // 生成ES6新增的对象
import 'qc-ui/index.css';

const install = Vue => // vue plugin method
  Vue && Object.assign(Vue.prototype, {
    $util,
    $calc,
    $api,
  });

install(window && window.Vue); // auto install

export default { install };
