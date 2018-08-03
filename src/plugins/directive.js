/* eslint-disable no-unused-vars,no-eval,no-unused-vars,no-param-reassign,no-shadow,func-names */

const directives = {
  'only-number': function (
    el,
    { // 限制用户输入为number类型的value，行为特征跟type:number一致，但不会有样式兼容问题
      expression, value, oldValue, arg = 0,
    },
    vnode,
  ) {
    // eslint-disable-next-line no-restricted-properties
    if (oldValue === value || window.isNaN(arg) || !value || Number(value) === 0) return;

    const { context } = vnode;
    const newArg = String(arg);
    const digit = Number(/\./.test(newArg) ? newArg.split('.').slice(-1)[0].length : newArg);
    // eslint-disable-next-line no-useless-escape
    const transformValue = String(value).split('.')[1]?.length > digit ? Number(value).toFixed(digit + 1).slice(0, -1) : value; // 防止用户复制粘贴
    const newValue = new RegExp(`^\\-?\\d*\\.?\\d{0,${digit}}$`).test(transformValue) ? transformValue : oldValue; // 处理用户正常输入

    (el.tagName === 'INPUT' ? el : el.querySelector('input')).onblur = ({ // addeventlistener不可覆盖，此处请勿使用监听函数处理
      target: { value },
    }) => eval(`context.${expression}=Number(value)||'';`);

    eval(typeof oldValue === 'undefined'
      ? `context.${expression}=Number(value).toFixed(digit+1).slice(0,-1);` // 第一次及时处理原始值的小数位数，后续再失去焦点才补全小数位数
      : `context.${expression}=newValue;`);
  },
};

export default {
  install: Vue => Object.entries(directives).forEach(([directive, func]) => Vue.directive(directive, func)),
};
