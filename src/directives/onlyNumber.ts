/* eslint-disable no-unused-vars,no-eval,no-unused-vars,no-param-reassign,no-shadow,func-names */
import type { VNode, App, Directive, DirectiveBinding } from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { invokeArrayFns } from '@vue/shared';

import { hyphenate } from '../utils/common';

type AssignerFn = (value: any) => void;

const getModelAssigner = (vNode: VNode): AssignerFn => { // 缺少expression，查看源码vModelText实现：@vue-next/packages/runtime-dom/src/directives/vModel.ts
    const fn = vNode.props!['onUpdate:modelValue'];
    return Array.isArray(fn) ? value => invokeArrayFns(fn, value) : fn;
};

export const onlyNumber: Directive = function (
    el: HTMLElement,
    { // 限制用户输入为number类型的value，行为特征跟type:number一致，但不会有样式兼容问题
        /* expression, */instance, value, oldValue, arg = '0' // TODO 3.x缺少expression表达式
    }: DirectiveBinding,
    vNode: VNode
): void {
    const numberArg: number = Number(arg);
    const numberValue: number = Number(value);
    // eslint-disable-next-line no-restricted-properties
    if (oldValue === value || !window.isFinite(numberArg) || !value || numberValue === 0) return;

    // const { context }: VNode = vnode;
    const _updateValue = getModelAssigner(vNode);
    const stringArg: string = String(arg);
    const digit: number = Number(/\./.test(stringArg) ? stringArg.split('.').slice(-1)[0].length : stringArg);
    // eslint-disable-next-line no-useless-escape
    const transformValue = String(value).split('.')[1]?.length > digit ? Number(value).toFixed(digit + 1).slice(0, -1) : value; // 防止用户复制粘贴
    const newValue = new RegExp(`^\\-?\\d*\\.?\\d{0,${digit}}$`).test(transformValue) ? transformValue : oldValue; // 处理用户正常输入

    const inputEl: HTMLInputElement = (el.tagName === 'INPUT' ? <HTMLInputElement>el : <HTMLInputElement>el.querySelector('input'));
    if (inputEl === null) return;
    inputEl.onblur = ({ target }: FocusEvent) => _updateValue(Number((target as any).value) || ''); // addEventListener不可覆盖，此处请勿使用监听函数处理

    _updateValue(typeof oldValue === 'undefined' ? Number(value).toFixed(digit + 1).slice(0, -1) /* 第一次及时处理原始值的小数位数，后续再失去焦点才补全小数位数 */ : newValue);
};

export default {
    install: (app: App): void => {
        app.directive(hyphenate(onlyNumber.name), onlyNumber);
    }
};
