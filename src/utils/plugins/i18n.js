import * as VueI18n from 'vue-i18n';

import icuMessageCompiler from '@/utils/plugins/icuMessageCompiler';
import en from '../../locales/en.json';
import pt_br from '../../locales/pt_br.json';
import es_es from '../../locales/es_es.json';
import ro_ro from '../../locales/ro_ro.json';
const languages = {
  'en-us': en,
  'pt-br': pt_br,
  es: es_es,
  'ro-ro': ro_ro,
};

const messages = Object.assign(languages);

const i18n = VueI18n.createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages,
  messageCompiler: icuMessageCompiler,
});

export default i18n;
