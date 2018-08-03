import http from 'axios';

/* eslint no-underscore-dangle: ["error", { "allow": [
"_uid", "_isVue",
"_directInactive",
"_inactive",
"_isBeingDestroyed",
 "_isDestroyed",
 "_isMounted"] }
 ] */

const isProduction = process.env.NODE_ENV === 'production';
const api = http.create({ baseURL: '/web/api/v1.0' });

const config = {
  silent: !isProduction, // 日志与警告
  devtools: !isProduction, // 是否允许 vue-devtools 检查代码
  productionTip: !isProduction, // 设置为 false 以阻止 vue 在启动时生成生产提示
  ignoredElements: [], // 忽略在 Vue 之外的自定义元素
  keyCodes: {}, // 给 v-on 自定义键位别名
  errorHandler: isProduction ? (error, self, info) => { // 错误拦截上报
    api.post('/collect_log', JSON.stringify({
      error,
      url: window.location.href,
      component: {
        uid: self._uid,
        isVue: self._isVue,
        mode: self.$router.mode,
        route: self.$route,
        directInactive: self._directInactive,
        inactive: self._inactive,
        isBeingDestroyed: self._isBeingDestroyed,
        isDestroyed: self._isDestroyed,
        isMounted: self._isMounted,
        isServer: self.$isServer,
      },
      info,
    }));
  } : null,
  warnHandler() { /* only development */ },
};

export default {
  install(Vue) {
    // eslint-disable-next-line no-param-reassign
    Object.entries(config).forEach(([key, value]) => { Vue.config[key] = value; });
  },
};
