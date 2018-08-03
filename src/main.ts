/// doc: https://v3.vuejs.org
import { createApp } from 'vue';

import store, { key } from './store';
import router from './setup/router-setup';
import i18n from './setup/i18n-setup';
import AppComponent from './App.vue';

createApp(AppComponent)
    .use(router)
    .use(store, key)
    .use(i18n)
    .mount('#root');
