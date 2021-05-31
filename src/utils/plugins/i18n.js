import { createI18n } from 'vue-i18n';

import en from '../../locales/en.json';
import pt_br from '../../locales/pt_br.json';

const languages = {
  en: en,
  pt_br: pt_br,
  pt_BR: pt_br,
};

const messages = Object.assign(languages);

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
});

export default i18n;
