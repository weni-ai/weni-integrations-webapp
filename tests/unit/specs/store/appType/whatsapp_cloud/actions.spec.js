jest.mock('@/api/appType/whatsapp_cloud', () => {
  return {
    getDebugToken: jest.fn(),
    getWhatsAppPhoneNumbers: jest.fn(),
    configurePhoneNumber: jest.fn(),
    getWhatsAppCloudCatalogs: jest.fn(),
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
    const appUuid = '456';

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppCloudApi.getWhatsAppCloudCatalogs.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call getWhatsAppCloudCatalogs from API', async () => {
      expect(WhatsAppCloudApi.getWhatsAppCloudCatalogs).not.toHaveBeenCalled();
      await store.dispatch('WhatsAppCloud/getWhatsAppCloudCatalogs', appUuid);
      expect(WhatsAppCloudApi.getWhatsAppCloudCatalogs).toHaveBeenCalledTimes(1);
    });

    it('should set whatsAppCloudCatalogs as result data', async () => {
      store.state.WhatsAppCloud.whatsAppCloudCatalogs = {};
      expect(store.state.WhatsAppCloud.whatsAppCloudCatalogs).not.toEqual(mockedResult);
      await store.dispatch('WhatsAppCloud/getWhatsAppCloudCatalogs', appUuid);
      expect(store.state.WhatsAppCloud.whatsAppCloudCatalogs).toEqual(mockedResult);
    });

    it('should set loadingWhatsAppCloudCatalogs to false', async () => {
      store.state.WhatsAppCloud.loadingWhatsAppCloudCatalogs = true;
      expect(store.state.WhatsAppCloud.loadingWhatsAppCloudCatalogs).toBe(true);
      await store.dispatch('WhatsAppCloud/getWhatsAppCloudCatalogs', appUuid);
      expect(store.state.WhatsAppCloud.loadingWhatsAppCloudCatalogs).toBe(false);
    });

    it('should set errorWhatsAppCloudCatalogs as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppCloudApi.getWhatsAppCloudCatalogs.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsAppCloud.errorWhatsAppCloudCatalogs = {};
      expect(store.state.WhatsAppCloud.errorWhatsAppCloudCatalogs).not.toEqual(error);
      await store.dispatch('WhatsAppCloud/getWhatsAppCloudCatalogs', appUuid);
      expect(store.state.WhatsAppCloud.errorWhatsAppCloudCatalogs).toEqual(error);
    });
  });
});
