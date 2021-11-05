/// doc: https://v3.vuejs.org
import { createApp } from 'vue';

import { createPinia } from 'pinia'; /// doc: https://pinia.esm.dev
import router from './setup/router-setup';
import i18n from './setup/i18n-setup';
import AppComponent from './App.vue';

createApp(AppComponent)
    .use(router)
    .use(createPinia())
    .use(i18n)
    .mount('#root');
