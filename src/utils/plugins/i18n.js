import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

import en from '../../locales/en.json';
import pt_br from '../../locales/pt_br.json';

const languages = {
  en: en,
  'pt-BR': pt_br,
};

const messages = Object.assign(languages);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
