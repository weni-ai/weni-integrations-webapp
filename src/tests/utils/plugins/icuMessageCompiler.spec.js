import { describe, it, expect } from 'vitest';
import * as VueI18n from 'vue-i18n';

import icuMessageCompiler, {
  shouldUseIntlMessageFormat,
} from '@/utils/plugins/icuMessageCompiler';

const createInstance = (messages) =>
  VueI18n.createI18n({
    legacy: false,
    locale: 'en-us',
    fallbackLocale: 'en-us',
    messages,
    messageCompiler: icuMessageCompiler,
  });

describe('icuMessageCompiler', () => {
  describe('shouldUseIntlMessageFormat', () => {
    it('detects ICU plural messages', () => {
      expect(
        shouldUseIntlMessageFormat('{count, plural, one {item} other {items}}'),
      ).toBe(true);
    });

    it('detects ICU select messages', () => {
      expect(
        shouldUseIntlMessageFormat('{gender, select, male {he} other {they}}'),
      ).toBe(true);
    });

    it('ignores plain strings that merely contain the words plural or select', () => {
      expect(shouldUseIntlMessageFormat('Select an option to continue')).toBe(
        false,
      );
      expect(shouldUseIntlMessageFormat('Choose a plural form below')).toBe(
        false,
      );
    });
  });

  describe('plain messages', () => {
    it('resolves named placeholders', () => {
      const i18n = createInstance({ 'en-us': { greeting: 'Hello {name}' } });
      expect(i18n.global.t('greeting', { name: 'Ana' })).toBe('Hello Ana');
    });

    it('resolves named placeholders written with surrounding spaces', () => {
      const i18n = createInstance({ 'en-us': { greeting: 'Hello { name }' } });
      expect(i18n.global.t('greeting', { name: 'Ana' })).toBe('Hello Ana');
    });

    it('keeps unprovided placeholders literally', () => {
      const i18n = createInstance({ 'en-us': { value: 'Value {missing}' } });
      expect(i18n.global.t('value')).toBe('Value {missing}');
    });

    it('preserves literal double curly brackets used as example text', () => {
      const message =
        'Use two sets of curly brackets (for example, {{1}}, {{2}}).';
      const i18n = createInstance({ 'en-us': { hint: message } });
      expect(i18n.global.t('hint')).toBe(message);
    });
  });

  describe('ICU plural messages', () => {
    const messages = {
      'en-us': {
        seconds:
          '{count, plural, one {{count} second} other {{count} seconds}}',
      },
      'pt-br': {
        seconds:
          '{count, plural, one {{count} segundo} other {{count} segundos}}',
      },
    };

    it('selects the singular branch', () => {
      const i18n = createInstance(messages);
      expect(i18n.global.t('seconds', { count: 1 })).toBe('1 second');
    });

    it('selects the plural branch', () => {
      const i18n = createInstance(messages);
      expect(i18n.global.t('seconds', { count: 2 })).toBe('2 seconds');
    });

    it('uses the locale plural rules of the active locale', () => {
      const i18n = createInstance(messages);
      i18n.global.locale.value = 'pt-br';
      expect(i18n.global.t('seconds', { count: 1 })).toBe('1 segundo');
      expect(i18n.global.t('seconds', { count: 3 })).toBe('3 segundos');
    });
  });

  describe('falls back to the key for AST messages', () => {
    it('returns the key when the message is not a string', () => {
      const compiled = icuMessageCompiler(
        { type: 0 },
        { locale: 'en-us', key: 'some.key' },
      );
      expect(compiled()).toBe('some.key');
    });
  });
});
