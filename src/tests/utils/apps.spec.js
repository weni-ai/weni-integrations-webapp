import { describe, it, expect, vi } from 'vitest';
import { getAppDisplayName, appMatchesSearch } from '@/utils/apps';

describe('apps utils', () => {
  const t = vi.fn((key) => {
    if (key === 'weniWebChat.data.name') return 'Shopping Assistant';
    return key;
  });

  describe('getAppDisplayName', () => {
    it('returns localized name for wwc apps', () => {
      expect(getAppDisplayName({ code: 'wwc', name: 'Weni Web Chat' }, t)).toBe(
        'Shopping Assistant',
      );
    });

    it('returns api name for non-wwc apps', () => {
      expect(getAppDisplayName({ code: 'telegram', name: 'Telegram' }, t)).toBe('Telegram');
    });

    it('falls back to WhatsApp when wpp-cloud has no name', () => {
      expect(getAppDisplayName({ code: 'wpp-cloud' }, t)).toBe('WhatsApp');
    });

    it('returns empty string when app is undefined', () => {
      expect(getAppDisplayName(undefined, t)).toBe('');
    });
  });

  describe('appMatchesSearch', () => {
    const wwcApp = { code: 'wwc', name: 'Weni Web Chat' };

    it('matches display name', () => {
      expect(appMatchesSearch(wwcApp, 'shopping assistant', t)).toBe(true);
    });

    it('matches legacy api name', () => {
      expect(appMatchesSearch(wwcApp, 'weni web chat', t)).toBe(true);
    });

    it('returns false when search term does not match', () => {
      expect(appMatchesSearch(wwcApp, 'telegram', t)).toBe(false);
    });

    it('returns true for empty search term', () => {
      expect(appMatchesSearch(wwcApp, '  ', t)).toBe(true);
    });
  });
});
