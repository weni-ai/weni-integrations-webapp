import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import * as Integrations from '@sentry/integrations';
import LogRocket from 'logrocket';
import App from './App.vue';
import i18n from './utils/plugins/i18n';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

if (process.env.VUE_APP_USE_SENTRY && process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
      }),
    ],
    logErrors: true,
  });
}

if (process.env.VUE_APP_LOGROCKET_ID) {
  LogRocket.init(process.env.VUE_APP_LOGROCKET_ID, {
    mergeIframes: true,
    parentDomain: process.env.VUE_APP_PARENT_IFRAME_DOMAIN,
  });
}

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
