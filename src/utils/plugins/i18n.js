import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

import en from '../../locales/en.json';
import pt_br from '../../locales/pt_br.json';

const languages = {
  'en-us': en,
  'pt-br': pt_br,
};

const messages = Object.assign(languages);

const i18n = new VueI18n({
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages,
});

export default i18n;
