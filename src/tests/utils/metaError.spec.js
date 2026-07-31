import { describe, expect, it } from 'vitest';
import { isMetaCreditAllocationError, META_CREDIT_ALLOCATION_SUBCODE } from '@/utils/metaError';

const metaPayload = {
  error: {
    message: 'Fatal',
    type: 'OAuthException',
    code: '-1',
    error_subcode: META_CREDIT_ALLOCATION_SUBCODE,
    is_transient: 'False',
    error_user_title: 'Alocação de crédito não permitida',
    error_user_msg: 'A moeda fornecida para o objeto faturável não será aceita.',
    fbtrace_id: 'ANVS9Va2_vOb2vAsaX3X0HW',
  },
};

describe('isMetaCreditAllocationError', () => {
  it('returns true for the Meta credit allocation payload', () => {
    expect(isMetaCreditAllocationError(metaPayload)).toBe(true);
  });

  it('returns true when error_subcode is a number', () => {
    expect(
      isMetaCreditAllocationError({
        error: { error_subcode: 1752246 },
      }),
    ).toBe(true);
  });

  it('returns true for the store-captured Meta error object', () => {
    expect(isMetaCreditAllocationError(metaPayload.error)).toBe(true);
  });

  it('returns true for axios-style errors', () => {
    expect(
      isMetaCreditAllocationError({
        response: { data: metaPayload },
      }),
    ).toBe(true);
  });

  it('returns true for stringified JSON', () => {
    expect(isMetaCreditAllocationError(JSON.stringify(metaPayload))).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(isMetaCreditAllocationError({ error: { message: 'boom' } })).toBe(false);
    expect(isMetaCreditAllocationError(new Error('network'))).toBe(false);
    expect(isMetaCreditAllocationError(null)).toBe(false);
    expect(isMetaCreditAllocationError(true)).toBe(false);
  });

  it('returns false for a different error_subcode', () => {
    expect(
      isMetaCreditAllocationError({
        error: { error_subcode: '9999999' },
      }),
    ).toBe(false);
  });

  it('returns true when the subcode is nested inside an array', () => {
    expect(
      isMetaCreditAllocationError({
        errors: [{ code: 1 }, { error_subcode: META_CREDIT_ALLOCATION_SUBCODE }],
      }),
    ).toBe(true);
  });

  it('returns true when a plain string contains the subcode', () => {
    expect(
      isMetaCreditAllocationError(`Meta failed with subcode ${META_CREDIT_ALLOCATION_SUBCODE}`),
    ).toBe(true);
  });

  it('returns false for circular object graphs without the subcode', () => {
    const circular = { error: { message: 'boom' } };
    circular.self = circular;

    expect(isMetaCreditAllocationError(circular)).toBe(false);
  });

  it('returns true for circular object graphs that include the subcode', () => {
    const circular = {
      error: { error_subcode: META_CREDIT_ALLOCATION_SUBCODE },
    };
    circular.self = circular;

    expect(isMetaCreditAllocationError(circular)).toBe(true);
  });

  it('exports the expected Meta credit allocation subcode', () => {
    expect(META_CREDIT_ALLOCATION_SUBCODE).toBe('1752246');
  });
});
