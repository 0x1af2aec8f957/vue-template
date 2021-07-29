/* eslint-disable camelcase */
import type { VueMessageType } from 'vue-i18n';
import type { LocaleMessages, Locale, FallbackLocale } from '@intlify/core-base';

import { createI18n } from 'vue-i18n';

import http from '../plugins/http';

import en_US from '../lang/en-US.yml';
import zh_CN from '../lang/zh-CN.yml';

type MessageSchema = typeof en_US | typeof zh_CN;

const isProduction: boolean = process.env.NODE_ENV === 'production';
const localeDefault: string = window.navigator.language;

const messages: {
    [key in 'en-US' | 'zh-CN']: MessageSchema
} = { // 语言包
    'en-US': en_US,
    'zh-CN': zh_CN
};

const languages: Locale[] = Object.keys(messages);

const fallbackLocale/* FallbackLocale */ = (languages.includes(localeDefault)
    ? localeDefault
    : languages.find((lan: string) => lan.indexOf(localeDefault.split('-')[0]) > -1) ?? localeDefault) as keyof typeof messages;

const i18n = createI18n({
    locale: fallbackLocale, // 设置语言环境
    fallbackLocale, // 如果未找到key,需要回溯到语言包的环境
    silentTranslationWarn: isProduction, // 警告信息
    messages // 设置语言环境信息
});

export type LangKeyString = typeof fallbackLocale;

export function setI18nLanguage(lang: LangKeyString = fallbackLocale): Locale { // 设置规则：完全匹配 -> 模糊匹配 -> 默认语言
    const { global: { locale, availableLocales } } = i18n;

    if (locale === lang) return lang; // 不允许重复设置语言
    const language: Locale = availableLocales.includes(lang)
        ? lang
        : availableLocales.find((lan: Locale) => lan.indexOf(lang.split('-')[0]) > -1) ?? localeDefault;

    [
        i18n.global.locale, // set vue-i18n
        http.defaults.headers.common['Accept-Language'] // set http
    ] = new Array(2).fill(language);

    document.documentElement?.setAttribute('lang', language.split(/-/)[0]); // set html
    return language;
}

export default i18n;
