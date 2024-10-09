import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { externals_store } from '@/stores/modules/appType/externals/externals.store';
import externalServices from '@/api/appType/externalServices';

vi.mock('@/api/appType/externalServices', () => ({
  default: {
    getAllExternalServicesTypes: vi.fn(),
    createPrompts: vi.fn(),
    getPrompts: vi.fn(),
    deletePrompts: vi.fn(),
  },
}));

describe('externals_store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const store = externals_store();
    expect(store.loadingExternalServices).toBe(true);
    expect(store.errorExternalServices).toBeNull();
    expect(store.externalServicesList).toBeNull();

    expect(store.loadingCreatePrompts).toBe(false);
    expect(store.errorCreatePrompts).toBeNull();
    expect(store.createPromptsResult).toBeNull();

    expect(store.loadingGetPrompts).toBe(false);
    expect(store.errorGetPrompts).toBeNull();
    expect(store.getPromptsResult).toBeNull();

    expect(store.loadingDeletePrompts).toBe(false);
    expect(store.errorDeletePrompts).toBeNull();
    expect(store.deletePromptsResult).toBeNull();
  });

  it('should get external services and update state', async () => {
    const store = externals_store();
    const mockExternalServices = [
      { id: 1, name: 'Service 1' },
      { id: 2, name: 'Service 2' },
    ];
    externalServices.getAllExternalServicesTypes.mockResolvedValue(mockExternalServices);

    await store.getExternalServicesTypes();

    expect(store.externalServicesList).toEqual(mockExternalServices);
    expect(store.loadingExternalServices).toBe(false);
    expect(store.errorExternalServices).toBeNull();
  });

  it('should handle error when getting external services', async () => {
    const store = externals_store();
    const mockError = new Error('Test Error');
    externalServices.getAllExternalServicesTypes.mockRejectedValue(mockError);

    await store.getExternalServicesTypes();

    expect(store.externalServicesList).toBeNull();
    expect(store.loadingExternalServices).toBe(false);
    expect(store.errorExternalServices).toBe(mockError);
  });

  it('should create prompts and update state', async () => {
    const store = externals_store();
    const mockData = { result: 'success' };
    externalServices.createPrompts.mockResolvedValue(mockData);

    await store.createPrompts({ code: 'code', appUuid: 'uuid', payload: {} });

    expect(store.createPromptsResult).toEqual(mockData);
    expect(store.loadingCreatePrompts).toBe(false);
    expect(store.errorCreatePrompts).toBeNull();
  });

  it('should handle error when creating prompts', async () => {
    const store = externals_store();
    const mockError = new Error('Test Error');
    externalServices.createPrompts.mockRejectedValue(mockError);

    await store.createPrompts({ code: 'code', appUuid: 'uuid', payload: {} });

    expect(store.createPromptsResult).toBeNull();
    expect(store.loadingCreatePrompts).toBe(false);
    expect(store.errorCreatePrompts).toBe(mockError);
  });

  it('should get prompts and update state', async () => {
    const store = externals_store();
    const mockData = [
      { id: 1, prompt: 'Prompt 1' },
      { id: 2, prompt: 'Prompt 2' },
    ];
    externalServices.getPrompts.mockResolvedValue(mockData);

    await store.getPrompts({ code: 'code', appUuid: 'uuid' });

    expect(store.getPromptsResult).toEqual(mockData);
    expect(store.loadingGetPrompts).toBe(false);
    expect(store.errorGetPrompts).toBeNull();
  });

  it('should handle error when getting prompts', async () => {
    const store = externals_store();
    const mockError = new Error('Test Error');
    externalServices.getPrompts.mockRejectedValue(mockError);

    await store.getPrompts({ code: 'code', appUuid: 'uuid' });

    expect(store.getPromptsResult).toBeNull();
    expect(store.loadingGetPrompts).toBe(false);
    expect(store.errorGetPrompts).toBe(mockError);
  });

  it('should delete prompts and update state', async () => {
    const store = externals_store();
    const mockData = { result: 'success' };
    externalServices.deletePrompts.mockResolvedValue(mockData);

    await store.deletePrompts({ code: 'code', appUuid: 'uuid', payload: {} });

    expect(store.deletePromptsResult).toEqual(mockData);
    expect(store.loadingDeletePrompts).toBe(false);
    expect(store.errorDeletePrompts).toBeNull();
  });

  it('should handle error when deleting prompts', async () => {
    const store = externals_store();
    const mockError = new Error('Test Error');
    externalServices.deletePrompts.mockRejectedValue(mockError);

    await store.deletePrompts({ code: 'code', appUuid: 'uuid', payload: {} });

    expect(store.deletePromptsResult).toBeNull();
    expect(store.loadingDeletePrompts).toBe(false);
    expect(store.errorDeletePrompts).toBe(mockError);
  });
});
