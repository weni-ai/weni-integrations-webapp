jest.mock('@/api/appType/whatsapp_cloud', () => {
  return {
    getDebugToken: jest.fn(),
    getWhatsAppPhoneNumbers: jest.fn(),
    configurePhoneNumber: jest.fn(),
    getWhatsAppCloudCatalogs: jest.fn(),
    fetchCatalogData: jest.fn(),
    disableWhatsAppCloudCatalogs: jest.fn(),
    enableWhatsAppCloudCatalogs: jest.fn(),
    toggleCartVisibility: jest.fn(),
    toggleCatalogVisibility: jest.fn(),
    getCommerceSettings: jest.fn(),
  };
});
import WhatsAppCloudApi from '@/api/appType/whatsapp_cloud';

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/channels/whatsapp_cloud/actions';
import mutations from '@/store/appType/channels/whatsapp_cloud/mutations';
import state from '@/store/appType/channels/whatsapp_cloud/state';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/whatsapp_cloud/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        WhatsAppCloud: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('getDebugToken', () => {
    const params = {
      input_token: '123',
    };

    beforeEach(() => {
      WhatsAppCloudApi.getDebugToken.mockImplementation(() => {
        return Promise.resolve({
          data: {
            waba_id: 'waba_id_123',
            business_id: 'business_id_123',
          },
        });
      });
    });

    it('should call getDebugToken from API', async () => {
      await store.dispatch('WhatsAppCloud/getDebugToken', params);
      expect(WhatsAppCloudApi.getDebugToken).toHaveBeenCalledTimes(1);
    });

    it('should set wabaId as result data', async () => {
      store.state.WhatsAppCloud.wabaId = {};
      expect(store.state.WhatsAppCloud.wabaId).not.toEqual('waba_id_123');
      await store.dispatch('WhatsAppCloud/getDebugToken', params);
      expect(store.state.WhatsAppCloud.wabaId).toEqual('waba_id_123');
    });

    it('should set businessId as result data', async () => {
      store.state.WhatsAppCloud.businessId = {};
      expect(store.state.WhatsAppCloud.businessId).not.toEqual('business_id_123');
      await store.dispatch('WhatsAppCloud/getDebugToken', params);
      expect(store.state.WhatsAppCloud.businessId).toEqual('business_id_123');
    });

    it('should set loadingDebugToken to false', async () => {
      store.state.WhatsAppCloud.loadingDebugToken = true;
      expect(store.state.WhatsAppCloud.loadingDebugToken).toBe(true);
      await store.dispatch('WhatsAppCloud/getDebugToken', params);
      expect(store.state.WhatsAppCloud.loadingDebugToken).toBe(false);
    });

    it('should set errorDebugToken as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.getDebugToken.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorDebugToken = {};
      expect(store.state.WhatsAppCloud.errorDebugToken).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/getDebugToken', params);
      expect(store.state.WhatsAppCloud.errorDebugToken).toEqual(error);
    });
  });

  describe('getWhatsAppPhoneNumbers', () => {
    const params = {
      input_token: '123',
    };

    const mockPhoneNumbers = [{ id: 1 }, { id: 2 }];

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.getWhatsAppPhoneNumbers.mockImplementation(() => {
        return Promise.resolve({ data: mockPhoneNumbers });
      });
    });

    it('should call getWhatsAppPhoneNumbers from API', async () => {
      expect(WhatsAppCloudApi.getWhatsAppPhoneNumbers).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/getWhatsAppPhoneNumbers', params);
      expect(WhatsAppCloudApi.getWhatsAppPhoneNumbers).toHaveBeenCalledTimes(1);
    });

    it('should set whatsAppPhoneNumbers as result data', async () => {
      store.state.WhatsAppCloud.whatsAppPhoneNumbers = {};
      expect(store.state.WhatsAppCloud.whatsAppPhoneNumbers).not.toEqual(mockPhoneNumbers);
      await store.dispatch('WhatsAppCloud/getWhatsAppPhoneNumbers', params);
      expect(store.state.WhatsAppCloud.whatsAppPhoneNumbers).toEqual(mockPhoneNumbers);
    });

    it('should set loadingPhoneNumbers to false', async () => {
      store.state.WhatsAppCloud.loadingPhoneNumbers = true;
      expect(store.state.WhatsAppCloud.loadingPhoneNumbers).toBe(true);
      await store.dispatch('WhatsAppCloud/getWhatsAppPhoneNumbers', params);
      expect(store.state.WhatsAppCloud.loadingPhoneNumbers).toBe(false);
    });

    it('should set errorPhoneNumbers as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.getWhatsAppPhoneNumbers.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorPhoneNumbers = {};
      expect(store.state.WhatsAppCloud.errorPhoneNumbers).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/getWhatsAppPhoneNumbers', params);
      expect(store.state.WhatsAppCloud.errorPhoneNumbers).toEqual(error);
    });
  });

  describe('configurePhoneNumber', () => {
    const data = {
      input_token: '123',
    };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.configurePhoneNumber.mockImplementation(() => {
        return Promise.resolve({ data: {} });
      });
    });

    it('should call configurePhoneNumber from API', async () => {
      expect(WhatsAppCloudApi.configurePhoneNumber).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/configurePhoneNumber', data);
      expect(WhatsAppCloudApi.configurePhoneNumber).toHaveBeenCalledTimes(1);
    });

    it('should set loadingWhatsAppCloudConfigure to false', async () => {
      store.state.WhatsAppCloud.loadingWhatsAppCloudConfigure = true;
      expect(store.state.WhatsAppCloud.loadingWhatsAppCloudConfigure).toBe(true);
      await store.dispatch('WhatsAppCloud/configurePhoneNumber', data);
      expect(store.state.WhatsAppCloud.loadingWhatsAppCloudConfigure).toBe(false);
    });

    it('should set errorCloudConfigure as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.configurePhoneNumber.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorCloudConfigure = {};
      expect(store.state.WhatsAppCloud.errorCloudConfigure).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/configurePhoneNumber', data);
      expect(store.state.WhatsAppCloud.errorCloudConfigure).toEqual(error);
    });
  });

  describe('setSelectedPhoneNumber', () => {
    it('should set selected phone number to parameter data', async () => {
      store.state.WhatsAppCloud.selectedPhoneNumber = 0;
      expect(store.state.WhatsAppCloud.selectedPhoneNumber).not.toEqual(1);
      await store.dispatch('WhatsAppCloud/setSelectedPhoneNumber', { data: 1 });
      expect(store.state.WhatsAppCloud.selectedPhoneNumber).toEqual(1);
    });
  });

  describe('getWhatsAppCloudCatalogs()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      params: {
        page: 1,
        limit: 12,
      },
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.getWhatsAppCloudCatalogs.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call getWhatsAppCloudCatalogs from API', async () => {
      expect(WhatsAppCloudApi.getWhatsAppCloudCatalogs).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/getWhatsAppCloudCatalogs', data);
      expect(WhatsAppCloudApi.getWhatsAppCloudCatalogs).toHaveBeenCalledTimes(1);
      expect(WhatsAppCloudApi.getWhatsAppCloudCatalogs).toHaveBeenCalledWith(
        data.appUuid,
        data.params,
      );
    });

    it('should set whatsAppCloudCatalogs as result data', async () => {
      store.state.WhatsAppCloud.whatsAppCloudCatalogs = {};
      expect(store.state.WhatsAppCloud.whatsAppCloudCatalogs).not.toEqual(mockedResult);
      await store.dispatch('WhatsAppCloud/getWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.whatsAppCloudCatalogs).toEqual(mockedResult);
    });

    it('should set loadingWhatsAppCloudCatalogs to false', async () => {
      store.state.WhatsAppCloud.loadingWhatsAppCloudCatalogs = true;
      expect(store.state.WhatsAppCloud.loadingWhatsAppCloudCatalogs).toBe(true);
      await store.dispatch('WhatsAppCloud/getWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.loadingWhatsAppCloudCatalogs).toBe(false);
    });

    it('should set errorWhatsAppCloudCatalogs as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.getWhatsAppCloudCatalogs.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorWhatsAppCloudCatalogs = {};
      expect(store.state.WhatsAppCloud.errorWhatsAppCloudCatalogs).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/getWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.errorWhatsAppCloudCatalogs).toEqual(error);
    });
  });

  describe('fetchCatalogData()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      catalogUuid: '123',
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.fetchCatalogData.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call fetchCatalogData from API', async () => {
      expect(WhatsAppCloudApi.fetchCatalogData).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/fetchCatalogData', data);
      expect(WhatsAppCloudApi.fetchCatalogData).toHaveBeenCalledTimes(1);
      expect(WhatsAppCloudApi.fetchCatalogData).toHaveBeenCalledWith(
        data.appUuid,
        data.catalogUuid,
      );
    });

    it('should set whatsAppCloudCatalog as result data', async () => {
      store.state.WhatsAppCloud.whatsAppCloudCatalog = {};
      expect(store.state.WhatsAppCloud.whatsAppCloudCatalog).not.toEqual(mockedResult);
      await store.dispatch('WhatsAppCloud/fetchCatalogData', data);
      expect(store.state.WhatsAppCloud.whatsAppCloudCatalog).toEqual(mockedResult);
    });

    it('should set loadingFetchWhatsAppCloudCatalog to false', async () => {
      store.state.WhatsAppCloud.loadingFetchWhatsAppCloudCatalog = true;
      expect(store.state.WhatsAppCloud.loadingFetchWhatsAppCloudCatalog).toBe(true);
      await store.dispatch('WhatsAppCloud/fetchCatalogData', data);
      expect(store.state.WhatsAppCloud.loadingFetchWhatsAppCloudCatalog).toBe(false);
    });

    it('should set errorFetchWhatsAppCloudCatalog as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.fetchCatalogData.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorFetchWhatsAppCloudCatalog = {};
      expect(store.state.WhatsAppCloud.errorFetchWhatsAppCloudCatalog).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/fetchCatalogData', data);
      expect(store.state.WhatsAppCloud.errorFetchWhatsAppCloudCatalog).toEqual(error);
    });
  });

  describe('disableWhatsAppCloudCatalogs()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      catalogUuid: '123',
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.disableWhatsAppCloudCatalogs.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call disableWhatsAppCloudCatalogs from API', async () => {
      expect(WhatsAppCloudApi.disableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/disableWhatsAppCloudCatalogs', data);
      expect(WhatsAppCloudApi.disableWhatsAppCloudCatalogs).toHaveBeenCalledTimes(1);
      expect(WhatsAppCloudApi.disableWhatsAppCloudCatalogs).toHaveBeenCalledWith(
        data.appUuid,
        data.catalogUuid,
      );
    });

    it('should set disabledCatalog as result data', async () => {
      store.state.WhatsAppCloud.disabledCatalog = {};
      expect(store.state.WhatsAppCloud.disabledCatalog).not.toEqual(mockedResult);
      await store.dispatch('WhatsAppCloud/disableWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.disabledCatalog).toEqual(mockedResult);
    });

    it('should set loadingDisableCatalog to false', async () => {
      store.state.WhatsAppCloud.loadingDisableCatalog = true;
      expect(store.state.WhatsAppCloud.loadingDisableCatalog).toBe(true);
      await store.dispatch('WhatsAppCloud/disableWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.loadingDisableCatalog).toBe(false);
    });

    it('should set errorDisableCatalog as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.disableWhatsAppCloudCatalogs.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorDisableCatalog = {};
      expect(store.state.WhatsAppCloud.errorDisableCatalog).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/disableWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.errorDisableCatalog).toEqual(error);
    });
  });

  describe('enableWhatsAppCloudCatalogs()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      catalogUuid: '123',
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.enableWhatsAppCloudCatalogs.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call enableWhatsAppCloudCatalogs from API', async () => {
      expect(WhatsAppCloudApi.enableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/enableWhatsAppCloudCatalogs', data);
      expect(WhatsAppCloudApi.enableWhatsAppCloudCatalogs).toHaveBeenCalledTimes(1);
      expect(WhatsAppCloudApi.enableWhatsAppCloudCatalogs).toHaveBeenCalledWith(
        data.appUuid,
        data.catalogUuid,
      );
    });

    it('should set enabledCatalog as result data', async () => {
      store.state.WhatsAppCloud.enabledCatalog = {};
      expect(store.state.WhatsAppCloud.enabledCatalog).not.toEqual(mockedResult);
      await store.dispatch('WhatsAppCloud/enableWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.enabledCatalog).toEqual(mockedResult);
    });

    it('should set loadingEnableCatalog to false', async () => {
      store.state.WhatsAppCloud.loadingEnableCatalog = true;
      expect(store.state.WhatsAppCloud.loadingEnableCatalog).toBe(true);
      await store.dispatch('WhatsAppCloud/enableWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.loadingEnableCatalog).toBe(false);
    });

    it('should set errorEnableCatalog as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.enableWhatsAppCloudCatalogs.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorEnableCatalog = {};
      expect(store.state.WhatsAppCloud.errorEnableCatalog).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/enableWhatsAppCloudCatalogs', data);
      expect(store.state.WhatsAppCloud.errorEnableCatalog).toEqual(error);
    });
  });

  describe('toggleCartVisibility()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      payload: {
        catalogUuid: '123',
      },
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.toggleCartVisibility.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call toggleCartVisibility from API', async () => {
      expect(WhatsAppCloudApi.toggleCartVisibility).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/toggleCartVisibility', data);
      expect(WhatsAppCloudApi.toggleCartVisibility).toHaveBeenCalledTimes(1);
      expect(WhatsAppCloudApi.toggleCartVisibility).toHaveBeenCalledWith(
        data.appUuid,
        data.payload,
      );
    });

    it('should set toggledCartVisibility as result data', async () => {
      store.state.WhatsAppCloud.toggledCartVisibility = {};
      expect(store.state.WhatsAppCloud.toggledCartVisibility).not.toEqual(mockedResult);
      await store.dispatch('WhatsAppCloud/toggleCartVisibility', data);
      expect(store.state.WhatsAppCloud.toggledCartVisibility).toEqual(mockedResult);
    });

    it('should set loadingToggleCartVisibility to false', async () => {
      store.state.WhatsAppCloud.loadingToggleCartVisibility = true;
      expect(store.state.WhatsAppCloud.loadingToggleCartVisibility).toBe(true);
      await store.dispatch('WhatsAppCloud/toggleCartVisibility', data);
      expect(store.state.WhatsAppCloud.loadingToggleCartVisibility).toBe(false);
    });

    it('should set errorToggleCartVisibility as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.toggleCartVisibility.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorToggleCartVisibility = {};
      expect(store.state.WhatsAppCloud.errorToggleCartVisibility).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/toggleCartVisibility', data);
      expect(store.state.WhatsAppCloud.errorToggleCartVisibility).toEqual(error);
    });
  });

  describe('toggleCatalogVisibility()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      payload: {
        catalogUuid: '123',
      },
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.toggleCatalogVisibility.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call toggleCatalogVisibility from API', async () => {
      expect(WhatsAppCloudApi.toggleCatalogVisibility).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/toggleCatalogVisibility', data);
      expect(WhatsAppCloudApi.toggleCatalogVisibility).toHaveBeenCalledTimes(1);
      expect(WhatsAppCloudApi.toggleCatalogVisibility).toHaveBeenCalledWith(
        data.appUuid,
        data.payload,
      );
    });

    it('should set toggledCatalogVisibility as result data', async () => {
      store.state.WhatsAppCloud.toggledCatalogVisibility = {};
      expect(store.state.WhatsAppCloud.toggledCatalogVisibility).not.toEqual(mockedResult);
      await store.dispatch('WhatsAppCloud/toggleCatalogVisibility', data);
      expect(store.state.WhatsAppCloud.toggledCatalogVisibility).toEqual(mockedResult);
    });

    it('should set loadingToggleCatalogVisibility to false', async () => {
      store.state.WhatsAppCloud.loadingToggleCatalogVisibility = true;
      expect(store.state.WhatsAppCloud.loadingToggleCatalogVisibility).toBe(true);
      await store.dispatch('WhatsAppCloud/toggleCatalogVisibility', data);
      expect(store.state.WhatsAppCloud.loadingToggleCatalogVisibility).toBe(false);
    });

    it('should set errorToggleCatalogVisibility as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.toggleCatalogVisibility.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorToggleCatalogVisibility = {};
      expect(store.state.WhatsAppCloud.errorToggleCatalogVisibility).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/toggleCatalogVisibility', data);
      expect(store.state.WhatsAppCloud.errorToggleCatalogVisibility).toEqual(error);
    });
  });

  describe('getCommerceSettings()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
    };

    const mockedResult = { data: ['ok'] };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.getCommerceSettings.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call getCommerceSettings from API', async () => {
      expect(WhatsAppCloudApi.getCommerceSettings).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/getCommerceSettings', data);
      expect(WhatsAppCloudApi.getCommerceSettings).toHaveBeenCalledTimes(1);
      expect(WhatsAppCloudApi.getCommerceSettings).toHaveBeenCalledWith(data.appUuid);
    });

    it('should set commerceSettings as result data', async () => {
      store.state.WhatsAppCloud.commerceSettings = {};
      expect(store.state.WhatsAppCloud.commerceSettings).not.toEqual(mockedResult.data[0]);
      await store.dispatch('WhatsAppCloud/getCommerceSettings', data);
      expect(store.state.WhatsAppCloud.commerceSettings).toEqual(mockedResult.data[0]);
    });

    it('should set loadingCommerceSettings to false', async () => {
      store.state.WhatsAppCloud.loadingCommerceSettings = true;
      expect(store.state.WhatsAppCloud.loadingCommerceSettings).toBe(true);
      await store.dispatch('WhatsAppCloud/getCommerceSettings', data);
      expect(store.state.WhatsAppCloud.loadingCommerceSettings).toBe(false);
    });

    it('should set errorCommerceSettings as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.getCommerceSettings.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorCommerceSettings = {};
      expect(store.state.WhatsAppCloud.errorCommerceSettings).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/getCommerceSettings', data);
      expect(store.state.WhatsAppCloud.errorCommerceSettings).toEqual(error);
    });
  });
});
