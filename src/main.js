import { createApp, h } from 'vue';
import App from './App.vue';
import './index.css';
import i18n from './utils/plugins/i18n';
import router from './router';

const app = createApp({
  render: () => h(App),
});

app.use(router);
app.use(i18n);

app.mount('#app');
