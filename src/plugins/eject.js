import { alert, toast, confirm } from '../utils/common';

const ejects = {
  alert,
  toast,
  confirm,
};

// !!window && window.Vue && install(window.Vue) // auto install

export default {
  install: Vue => Object.assign(Vue.prototype, Object.entries(ejects).reduce((acc, [key, func]) => ({ ...acc, [`$${key}`]: func }), {})),
};
