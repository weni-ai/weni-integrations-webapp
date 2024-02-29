import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Unnnic from '@weni/unnnic-system';
import '@weni/unnnic-system/dist/unnnic.css';
import i18n from './utils/plugins/i18n';
import * as vueUse from '@vueuse/components';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia()).use(router).use(Unnnic).use(i18n).use(vueUse);

app.mount('#app');
