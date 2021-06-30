import Vue from 'vue';
import App from './App.vue';
import i18n from './utils/plugins/i18n';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
