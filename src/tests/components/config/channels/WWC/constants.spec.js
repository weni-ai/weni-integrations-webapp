import { describe, it, expect } from 'vitest';
import {
  DEFAULT_COLOR,
  WEBCHAT_SCRIPT_URLS,
  TIME_BETWEEN_MESSAGES_OPTIONS,
  APPEARANCE_FIELDS,
  TIME_REGEX,
  generateScriptCode,
  formatContactTimeout,
  parseContactTimeout,
  isInvalidTime,
} from '@/components/config/channels/WWC/constants';

describe('WWC constants', () => {
  describe('DEFAULT_COLOR', () => {
    it('should be the correct default color', () => {
      expect(DEFAULT_COLOR).toBe('#009E96');
    });
  });

  describe('WEBCHAT_SCRIPT_URLS', () => {
    it('should have v1 and v2 URLs', () => {
      expect(WEBCHAT_SCRIPT_URLS.v1).toBe(
        'https://storage.googleapis.com/push-webchat/wwc-latest.js',
      );
      expect(WEBCHAT_SCRIPT_URLS.v2).toBe('https://cdn.cloud.weni.ai/webchat-latest.umd.js');
    });
  });

  describe('TIME_BETWEEN_MESSAGES_OPTIONS', () => {
    it('should have 4 options', () => {
      expect(TIME_BETWEEN_MESSAGES_OPTIONS).toHaveLength(4);
    });

    it('should have values from 1 to 4', () => {
      expect(TIME_BETWEEN_MESSAGES_OPTIONS.map((o) => o.value)).toEqual(['1', '2', '3', '4']);
    });
  });

  describe('APPEARANCE_FIELDS', () => {
    it('should have 4 fields', () => {
      expect(APPEARANCE_FIELDS).toHaveLength(4);
    });

    it('should have correct field ids', () => {
      const ids = APPEARANCE_FIELDS.map((f) => f.id);
      expect(ids).toContain('subtitle');
      expect(ids).toContain('initPayload');
      expect(ids).toContain('tooltipMessage');
      expect(ids).toContain('inputTextFieldHint');
    });

    it('should have labelKey and placeholderKey for each field', () => {
      APPEARANCE_FIELDS.forEach((field) => {
        expect(field.labelKey).toBeDefined();
        expect(field.placeholderKey).toBeDefined();
      });
    });
  });

  describe('TIME_REGEX', () => {
    it('should match valid time formats', () => {
      expect(TIME_REGEX.test('00:00')).toBe(true);
      expect(TIME_REGEX.test('12:30')).toBe(true);
      expect(TIME_REGEX.test('23:59')).toBe(true);
      expect(TIME_REGEX.test('9:30')).toBe(true);
    });

    it('should not match invalid time formats', () => {
      expect(TIME_REGEX.test('24:00')).toBe(false);
      expect(TIME_REGEX.test('12:60')).toBe(false);
      expect(TIME_REGEX.test('abc')).toBe(false);
      expect(TIME_REGEX.test('')).toBe(false);
    });
  });

  describe('generateScriptCode', () => {
    it('should return empty string if config has no script', () => {
      expect(generateScriptCode({})).toBe('');
      expect(generateScriptCode(null)).toBe('');
      expect(generateScriptCode({ script: '' })).toBe('');
    });

    it('should generate script code for v1', () => {
      const config = { script: 'https://test.script.url', version: '1' };
      const result = generateScriptCode(config);

      expect(result).toContain('https://storage.googleapis.com/push-webchat/wwc-latest.js');
      expect(result).toContain('https://test.script.url');
      expect(result).toContain('<script>');
    });

    it('should generate script code for v2', () => {
      const config = { script: 'https://test.script.url', version: '2' };
      const result = generateScriptCode(config);

      expect(result).toContain('https://cdn.cloud.weni.ai/webchat-latest.umd.js');
      expect(result).toContain('https://test.script.url');
    });

    it('should default to v1 if version is not specified', () => {
      const config = { script: 'https://test.script.url' };
      const result = generateScriptCode(config);

      expect(result).toContain('https://storage.googleapis.com/push-webchat/wwc-latest.js');
    });
  });

  describe('formatContactTimeout', () => {
    it('should return 00:00 for falsy input', () => {
      expect(formatContactTimeout(0)).toBe('00:00');
      expect(formatContactTimeout(null)).toBe('00:00');
      expect(formatContactTimeout(undefined)).toBe('00:00');
    });

    it('should format minutes to HH:MM', () => {
      expect(formatContactTimeout(0)).toBe('00:00');
      expect(formatContactTimeout(1)).toBe('00:01');
      expect(formatContactTimeout(60)).toBe('01:00');
      expect(formatContactTimeout(90)).toBe('01:30');
      expect(formatContactTimeout(750)).toBe('12:30');
      expect(formatContactTimeout(1439)).toBe('23:59');
    });
  });

  describe('parseContactTimeout', () => {
    it('should return 0 for falsy input', () => {
      expect(parseContactTimeout('')).toBe(0);
      expect(parseContactTimeout(null)).toBe(0);
      expect(parseContactTimeout(undefined)).toBe(0);
    });

    it('should parse HH:MM to minutes', () => {
      expect(parseContactTimeout('00:00')).toBe(0);
      expect(parseContactTimeout('00:01')).toBe(1);
      expect(parseContactTimeout('01:00')).toBe(60);
      expect(parseContactTimeout('01:30')).toBe(90);
      expect(parseContactTimeout('12:30')).toBe(750);
      expect(parseContactTimeout('23:59')).toBe(1439);
    });
  });

  describe('isInvalidTime', () => {
    it('should return true for 00:00', () => {
      expect(isInvalidTime('00:00')).toBe(true);
    });

    it('should return true for invalid formats', () => {
      expect(isInvalidTime('')).toBe(true);
      expect(isInvalidTime(null)).toBe(true);
      expect(isInvalidTime('abc')).toBe(true);
      expect(isInvalidTime('1234')).toBe(true);
      expect(isInvalidTime('24:00')).toBe(true);
      expect(isInvalidTime('12:60')).toBe(true);
    });

    it('should return false for valid times (except 00:00)', () => {
      expect(isInvalidTime('00:01')).toBe(false);
      expect(isInvalidTime('12:30')).toBe(false);
      expect(isInvalidTime('23:59')).toBe(false);
    });
  });
});
