import * as VueI18n from 'vue-i18n';

import en from '../../locales/en.json';
import pt_br from '../../locales/pt_br.json';
import es_es from '../../locales/es_es.json';

const languages = {
  'en-us': en,
  'pt-br': pt_br,
  es: es_es,
};

const messages = Object.assign(languages);

const i18n = VueI18n.createI18n({
  locale: 'pt-br',
  fallbackLocale: 'en-us',
  messages,
});

export default i18n;
