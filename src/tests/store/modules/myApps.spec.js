import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { my_apps } from '@/stores/modules/myApps.store';
import appType from '@/api/myApps';
import { formatGenericApp } from '@/stores/utils';

vi.mock('@/api/myApps', () => ({
  default: {
    getConfiguredApps: vi.fn(),
    getInstalledApps: vi.fn(),
  },
}));

vi.mock('@/stores/utils', () => ({
  formatGenericApp: vi.fn((data) => data),
}));

describe('my_apps store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = my_apps();
    expect(store.configuredApps).toEqual([]);
    expect(store.loadingConfiguredApps).toBe(false);
    expect(store.errorConfiguredApps).toBeNull();

    expect(store.installedApps).toEqual([]);
    expect(store.loadingInstalledApps).toBe(false);
    expect(store.errorInstalledApps).toBeNull();
  });

  it('should fetch configured apps and update state', async () => {
    const store = my_apps();
    const mockData = [{ id: 1, name: 'Test App' }];
    appType.getConfiguredApps.mockResolvedValue({ data: mockData });

    await store.getConfiguredApps({ params: { test: 'test' } });

    expect(store.configuredApps).toEqual(mockData);
    expect(store.loadingConfiguredApps).toBe(false);
    expect(store.errorConfiguredApps).toBeNull();
    expect(appType.getConfiguredApps).toHaveBeenCalledWith({ test: 'test' });
    expect(formatGenericApp).toHaveBeenCalledWith(mockData);
  });

  it('should handle error when fetching configured apps', async () => {
    const store = my_apps();
    const mockError = new Error('Test Error');
    appType.getConfiguredApps.mockRejectedValue(mockError);

    await store.getConfiguredApps({ params: { test: 'test' } });

    expect(store.configuredApps).toBeNull();
    expect(store.loadingConfiguredApps).toBe(false);
    expect(store.errorConfiguredApps).toBe(mockError);
  });

  it('should fetch installed apps and update state', async () => {
    const store = my_apps();
    const mockData = [{ id: 2, name: 'Installed App' }];
    appType.getInstalledApps.mockResolvedValue({ data: mockData });

    await store.getInstalledApps({ params: { test: 'test' } });

    expect(store.installedApps).toEqual(mockData);
    expect(store.loadingInstalledApps).toBe(false);
    expect(store.errorInstalledApps).toBeNull();
    expect(appType.getInstalledApps).toHaveBeenCalledWith({ test: 'test' });
    expect(formatGenericApp).toHaveBeenCalledWith(mockData);
  });

  it('should handle error when fetching installed apps', async () => {
    const store = my_apps();
    const mockError = new Error('Test Error');
    appType.getInstalledApps.mockRejectedValue(mockError);

    await store.getInstalledApps({ params: { test: 'test' } });

    expect(store.installedApps).toBeNull();
    expect(store.loadingInstalledApps).toBe(false);
    expect(store.errorInstalledApps).toBe(mockError);
  });

  it('should skip loading when skipLoading is true in getConfiguredApps', async () => {
    const store = my_apps();
    const mockData = [{ id: 1, name: 'Test App' }];
    appType.getConfiguredApps.mockResolvedValue({ data: mockData });

    await store.getConfiguredApps({ params: { test: 'test' }, skipLoading: true });

    expect(store.loadingConfiguredApps).toBe(false);
    expect(store.configuredApps).toEqual(mockData);
  });
});
