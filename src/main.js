import Vue from 'vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Unnnic from './utils/plugins/UnnnicSystem';
import '@weni/unnnic-system/dist/unnnic.css';
import i18n from './utils/plugins/i18n';
import * as vueUse from '@vueuse/components';
import * as Sentry from '@sentry/vue';
import * as Integrations from '@sentry/integrations';
import LogRocket from 'logrocket';
import getEnv from '@/utils/env';
import { makeServer } from '@/miragejs/server';

import App from './App.vue';
import router from './router';

const app = createApp(App);

Vue.config.productionTip = false;

if (getEnv('NODE_ENV') === 'development') {
  makeServer();
}

if (getEnv('VITE_APP_USE_SENTRY') && getEnv('VITE_APP_SENTRY_DSN')) {
  Sentry.init({
    dsn: getEnv('VITE_APP_SENTRY_DSN'),
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
      }),
    ],
    logErrors: true,
  });
}

if (getEnv('VITE_APP_LOGROCKET_ID')) {
  LogRocket.init(getEnv('VITE_APP_LOGROCKET_ID'), {
    mergeIframes: true,
    parentDomain: getEnv('VITE_APP_PARENT_IFRAME_DOMAIN'),
  });
}

app.use(createPinia()).use(router).use(Unnnic).use(i18n).use(vueUse);

app.mount('#app');
