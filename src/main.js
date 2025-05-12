import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import Unnnic from '@weni/unnnic-system';
import '@weni/unnnic-system/dist/style.css';
import i18n from '@/utils/plugins/i18n';
import * as vueUse from '@vueuse/components';
import * as Sentry from '@sentry/vue';
import getEnv from '@/utils/env';
import '@/utils/plugins/Hotjar';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from '@/router';
import { getJwtToken } from '@/utils/jwt';
import { auth_store } from '@/stores/modules/auth.store';

getJwtToken().then(() => {
  const app = createApp(App);
  app.config.productionTip = false;

  if (getEnv('USE_SENTRY') && getEnv('SENTRY_DSN')) {
    Sentry.init({
      dsn: getEnv('SENTRY_DSN'),
      integrations: [Sentry.browserTracingIntegration({ router }), Sentry.replayIntegration()],
      logErrors: true,
    });
  }

  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  pinia.use(({ store }) => {
    store.router = markRaw(router);
  });

  app.use(Unnnic);
  app.use(pinia);
  app.use(router);
  app.use(i18n);
  app.use(vueUse);

  const token = localStorage.getItem('authToken');
  if (token) {
    auth_store().externalLogin({ token });
  }

  app.mount('#app');
});
