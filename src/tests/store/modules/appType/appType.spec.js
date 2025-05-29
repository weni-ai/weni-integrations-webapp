import { setActivePinia, createPinia } from 'pinia';
import { app_type } from '@/stores/modules/appType/appType.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import appType from '@/api/appType';
import email from '@/api/appType/email';
import genericType from '@/api/appType/generic';

vi.mock('@/api/appType');
vi.mock('@/api/appType/generic');
vi.mock('@/utils/sentry');
vi.mock('@/api/appType/email');
vi.mock('@/utils/clearHtmlTags', () => ({
  clearHtmlTags: vi.fn((text) => text),
}));

describe('app_type store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with correct default state', () => {
    const store = app_type();
    expect(store.appUuid).toBe(null);
    expect(store.loadingDeleteApp).toBe(false);
  });

  describe('getAllAppTypes', () => {
    it('should fetch and set all app types', async () => {
      const store = app_type();
      const mockBaseApps = [{ id: 1, name: 'App 1' }];
      const mockEmailApps = [{ id: 'email', name: 'Email' }];
      const mockGenericAppsData = {
        generic1: { attributes: { claim_blurb: 'Description 1' } },
      };
      const mockIcons = { generic1: 'icon1.png' };
      appType.getAllAppTypes.mockResolvedValueOnce(mockBaseApps);
      email.getAllEmailTypes.mockResolvedValueOnce(mockEmailApps);
      genericType.getAllGenericTypes.mockResolvedValueOnce(mockGenericAppsData);
      genericType.getIcons.mockResolvedValueOnce(mockIcons);

      await store.getAllAppTypes({ params: {} });

      expect(store.allAppTypes.length).toBe(3);
      expect(store.allAppTypes[1].icon).toBe('icon1.png');
      expect(store.loadingAllAppTypes).toBe(false);
    });

    it('should handle error during fetching app types', async () => {
      const store = app_type();
      const mockError = new Error('Error fetching app types');

      appType.getAllAppTypes.mockRejectedValueOnce(mockError);

      await store.getAllAppTypes({ params: {} });

      expect(store.errorAllAppTypes).toBe(mockError);
      expect(store.loadingAllAppTypes).toBe(false);
    });

    it('should handle error during fetching all app types', async () => {
      const store = app_type();
      const mockError = new Error('Failed to fetch app types');
      appType.getAllAppTypes.mockRejectedValueOnce(mockError);

      await store.getAllAppTypes({ params: {} });

      expect(store.errorAllAppTypes).toBe(mockError);
      expect(store.loadingAllAppTypes).toBe(false);
      expect(store.allAppTypes).toBeNull();
    });

    it('should successfully fetch app type', async () => {
      const store = app_type();
      const mockAppType = { name: 'AppType1' };

      appType.getAppType.mockResolvedValueOnce({ data: mockAppType });

      await store.getAppType({ code: 'code1', shouldLoad: true });

      expect(store.currentAppType).toEqual(mockAppType);
      expect(store.loadingCurrentAppType).toBe(false);
      expect(store.errorCurrentAppType).toBeNull();
    });
  });

  describe('getAppType', () => {
    it('should fetch and set current app type', async () => {
      const store = app_type();
      const mockAppType = { id: 1, name: 'App Type 1' };

      appType.getAppType.mockResolvedValueOnce({ data: mockAppType });

      await store.getAppType({ code: '123', shouldLoad: true });

      expect(store.currentAppType).toEqual(mockAppType);
      expect(store.loadingCurrentAppType).toBe(false);
    });

    it('should handle error during fetching app type', async () => {
      const store = app_type();
      const mockError = new Error('Error fetching app type');

      appType.getAppType.mockRejectedValueOnce(mockError);

      await store.getAppType({ code: '123', shouldLoad: true });

      expect(store.errorCurrentAppType).toBe(mockError);
      expect(store.loadingCurrentAppType).toBe(false);
    });
  });

  describe('createApp', () => {
    it('should create app and set createAppResponse', async () => {
      const store = app_type();
      const mockCreateResponse = { id: 1, name: 'New App' };

      appType.createApp.mockResolvedValueOnce({ data: mockCreateResponse });

      await store.createApp({ code: '123', payload: {} });

      expect(store.createAppResponse).toEqual(mockCreateResponse);
      expect(store.loadingCreateApp).toBe(false);
    });

    it('should handle error during app creation', async () => {
      const store = app_type();
      const mockError = new Error('Error creating app');

      appType.createApp.mockRejectedValueOnce(mockError);

      await store.createApp({ code: '123', payload: {} });

      expect(store.errorCreateApp).toBe(mockError);
      expect(store.loadingCreateApp).toBe(false);
    });
  });

  describe('deleteApp', () => {
    it('should delete app successfully', async () => {
      const store = app_type();

      appType.deleteApp.mockResolvedValueOnce();

      await store.deleteApp({ code: '123', appUuid: 'uuid-1' });

      expect(store.loadingDeleteApp).toBe(false);
      expect(store.errorDeleteApp).toBe(null);
    });

    it('should handle error during updating app', async () => {
      const store = app_type();
      const mockError = new Error('Failed to update app');

      appType.updateApp.mockRejectedValueOnce(mockError);

      await store.updateApp({ code: 'code1', appUuid: 'uuid1', payload: {} });

      expect(store.errorUpdateApp).toBe(mockError);
      expect(store.loadingUpdateApp).toBe(false);
      expect(store.updateAppResult).toBeNull();
    });

    it('should handle error during app deletion', async () => {
      const store = app_type();
      const mockError = new Error('Error deleting app');

      appType.deleteApp.mockRejectedValueOnce(mockError);

      await store.deleteApp({ code: '123', appUuid: 'uuid-1' });

      expect(store.errorDeleteApp).toBe(mockError);
      expect(store.loadingDeleteApp).toBe(false);
    });

    it('should successfully update app', async () => {
      const store = app_type();
      const mockUpdateResult = { success: true };

      appType.updateApp.mockResolvedValueOnce({ data: mockUpdateResult });

      await store.updateApp({ code: 'testCode', appUuid: '123', payload: {} });

      expect(store.updateAppResult).toEqual(mockUpdateResult);
      expect(store.loadingUpdateApp).toBe(false);
      expect(store.errorUpdateApp).toBeNull();
    });

    it('should successfully update app config', async () => {
      const store = app_type();
      const mockUpdateConfigResult = { success: true };

      appType.updateAppConfig.mockResolvedValueOnce({ data: mockUpdateConfigResult });

      await store.updateAppConfig({ code: 'code1', appUuid: 'uuid1', payload: {} });

      expect(store.updateAppConfigResult).toEqual(mockUpdateConfigResult);
      expect(store.loadingUpdateAppConfig).toBe(false);
      expect(store.errorUpdateAppConfig).toBeNull();
    });

    it('should handle error during updating app config', async () => {
      const store = app_type();
      const mockError = new Error('Failed to update app config');

      appType.updateAppConfig.mockRejectedValueOnce(mockError);

      await store.updateAppConfig({ code: 'code1', appUuid: 'uuid1', payload: {} });

      expect(store.errorUpdateAppConfig).toBe(mockError);
      expect(store.loadingUpdateAppConfig).toBe(false);
      expect(store.updateAppConfigResult).toBeNull();
    });
  });

  describe('fetchFeatured', () => {
    it('should fetch and set featured apps', async () => {
      const store = app_type();
      const mockFeaturedApps = [{ id: 1, name: 'Featured App 1' }];

      appType.fetchFeatured.mockResolvedValueOnce(mockFeaturedApps);

      await store.fetchFeatured();

      expect(store.featuredApps).toEqual(mockFeaturedApps);
      expect(store.loadingFeaturedApps).toBe(false);
    });

    it('should handle error during fetching featured apps', async () => {
      const store = app_type();
      const mockError = new Error('Error fetching featured apps');

      appType.fetchFeatured.mockRejectedValueOnce(mockError);

      await store.fetchFeatured();

      expect(store.errorFeaturedApps).toBe(mockError);
      expect(store.loadingFeaturedApps).toBe(false);
    });
  });

  describe('Post rating', () => {
    it('should successfully post rating', async () => {
      const store = app_type();
      const mockRatingResult = { success: true };

      appType.postRating.mockResolvedValueOnce({ data: mockRatingResult });

      await store.postRating({ code: 'code1', payload: {} });

      expect(store.postRatingResult).toEqual(mockRatingResult);
      expect(store.loadingPostRating).toBe(false);
      expect(store.errorPostRating).toBeNull();
    });

    it('should handle error during posting rating', async () => {
      const store = app_type();
      const mockError = new Error('Failed to post rating');

      appType.postRating.mockRejectedValueOnce(mockError);

      await store.postRating({ code: 'code1', payload: {} });

      expect(store.errorPostRating).toBe(mockError);
      expect(store.loadingPostRating).toBe(false);
      expect(store.postRatingResult).toBeNull();
    });
  });
});
