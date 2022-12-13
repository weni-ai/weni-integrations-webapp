import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import * as Integrations from '@sentry/integrations';
import LogRocket from 'logrocket';
import vClickOutside from 'v-click-outside';
import App from './App.vue';
import i18n from './utils/plugins/i18n';
import router from './router';
import store from './store';
import getEnv from '@/utils/env';

Vue.use(vClickOutside);

import { initFacebookSdk } from './utils/plugins/fb';

Vue.config.productionTip = false;

if (getEnv('NODE_ENV') === 'development') {
  makeServer();
}

if (getEnv('VUE_APP_USE_SENTRY') && getEnv('VUE_APP_SENTRY_DSN')) {
  Sentry.init({
    dsn: getEnv('VUE_APP_SENTRY_DSN'),
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
      }),
    ],
    logErrors: true,
  });
}

if (getEnv('VUE_APP_FACEBOOK_APP_ID')) {
  initFacebookSdk();
}

if (getEnv('VUE_APP_LOGROCKET_ID')) {
  LogRocket.init(getEnv('VUE_APP_LOGROCKET_ID'), {
    mergeIframes: true,
    parentDomain: getEnv('VUE_APP_PARENT_IFRAME_DOMAIN'),
  });
}

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
