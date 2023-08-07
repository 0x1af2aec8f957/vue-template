/// doc: https://v3.vuejs.org
import { createApp } from 'vue';
import moment from 'dayjs';
import { createPinia } from 'pinia'; /// doc: https://pinia.esm.dev
import dayjsDuration from 'dayjs/plugin/duration';
// Android8.1.0 Webview 需要主动填充
import 'intl-pluralrules';
// Android8.1.0 Webview 无法使用 Promise.finally，需要主动填充
import 'finally-polyfill';
// Android8.1.0 Webview 无法使用 Abortcontroller，需要主动填充
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import router from './setup/router-setup';
import i18n from './setup/i18n-setup';
import AppComponent from './App.vue';

moment.extend(dayjsDuration);

createApp(AppComponent)
    .use(router)
    .use(createPinia())
    .use(i18n)
    .mount('#root');
