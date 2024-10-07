import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generic_store } from '@/stores/modules/appType/channels/generic.store';
import genericTypeApi from '@/api/appType/generic/index';
import { captureSentryException } from '@/utils/sentry';

vi.mock('@/api/appType/generic', () => ({
  default: {
    getAppForm: vi.fn(),
  },
}));
vi.mock('@/utils/sentry', () => ({
  captureSentryException: vi.fn(),
}));

describe('generic_store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks(); // Limpa todos os mocks antes de cada teste
  });

  it('should initialize with default state', () => {
    const store = generic_store();
    expect(store.genericAppForm).toBeNull();
    expect(store.genericAppAttributes).toBeNull();
    expect(store.loadingAppForm).toBe(false);
    expect(store.errorAppForm).toBe(false);
  });

  it('should fetch app form and update state', async () => {
    const store = generic_store();
    const mockForm = { id: 1, name: 'Test Form' };
    const mockAttributes = { attribute1: 'value1' };
    const mockData = { form: mockForm, attributes: mockAttributes };

    genericTypeApi.getAppForm.mockResolvedValue(mockData);

    await store.getAppForm({ channelCode: 'test-channel' });

    expect(store.genericAppForm).toEqual(mockForm);
    expect(store.genericAppAttributes).toEqual(mockAttributes);
    expect(store.loadingAppForm).toBe(false);
    expect(store.errorAppForm).toBeNull();
    expect(genericTypeApi.getAppForm).toHaveBeenCalledWith('test-channel');
  });

  it('should handle error when fetching app form', async () => {
    const store = generic_store();
    const mockError = new Error('Test Error');
    mockError.response = { data: { error: 'Some error' } };
    genericTypeApi.getAppForm.mockRejectedValue(mockError);

    await store.getAppForm({ channelCode: 'test-channel' });

    expect(store.genericAppForm).toBeNull();
    expect(store.genericAppAttributes).toBeNull();
    expect(store.loadingAppForm).toBe(false);
    expect(store.errorAppForm).toBe('Some error');
    expect(captureSentryException).toHaveBeenCalledWith(mockError);
  });
});
