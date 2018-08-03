/* eslint-disable camelcase */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import http from 'axios';
import en_US from '../lang/en-US.yml';
import zh_CN from '../lang/zh-CN.yml';

Vue.use(VueI18n);

const [
  isProduction,
  localeDefault,
] = [
  process.env.NODE_ENV === 'production',
  window.navigator.language,
];

const messages = { // 语言包
  'en-US': en_US,
  'zh-CN': zh_CN,
};

const languages = Object.keys(messages);

const fallbackLocale = languages.includes(localeDefault)
  ? localeDefault
  : languages.find(lan => lan.indexOf(localeDefault.split('-')[0]) > -1) || localeDefault;

const i18n = new VueI18n({
  locale: fallbackLocale, // 设置语言环境
  fallbackLocale, // 如果未找到key,需要回溯到语言包的环境
  silentTranslationWarn: isProduction, // 警告信息
  messages, // 设置语言环境信息
});

export function setI18nLanguage(lang = fallbackLocale) { // 设置规则：完全匹配 -> 模糊匹配 -> 默认语言
  const { locale, availableLocales } = i18n;
  if (locale === lang) return lang; // 不允许重复设置语言

  const language = availableLocales.includes(lang)
    ? lang
    : availableLocales.find(lan => lan.indexOf(lang.split('-')[0]) > -1) || localeDefault;

  [
    i18n.locale, // set vue-i18n
    http.defaults.headers.common['Accept-Language'], // set http
  ] = new Array(2).fill(language);

  document.querySelector('html').setAttribute('lang', language); // set html
  return language;
}

export default i18n;
