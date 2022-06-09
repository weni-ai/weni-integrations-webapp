jest.mock('@/api/appType/whatsapp_cloud', () => {
  return {
    getWabaId: jest.fn(),
    getWhatsAppPhoneNumbers: jest.fn(),
  };
});
import WhatsAppCloudApi from '@/api/appType/whatsapp_cloud';

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/whatsapp_cloud/actions';
import mutations from '@/store/appType/whatsapp_cloud/mutations';
import state from '@/store/appType/whatsapp_cloud/state';

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

  describe('getWabaId', () => {
    const params = {
      input_token: '123',
    };

    beforeEach(() => {
      WhatsAppCloudApi.getWabaId.mockImplementation(() => {
        return Promise.resolve({ data: 'waba_id_123' });
      });
    });

    it('should call getWabaId from API', async () => {
      await store.dispatch('WhatsAppCloud/getWabaId', params);
      expect(WhatsAppCloudApi.getWabaId).toHaveBeenCalledTimes(1);
    });

    it('should set fetchedWabaId to true', async () => {
      store.state.WhatsAppCloud.fetchedWabaId = false;
      expect(store.state.WhatsAppCloud.fetchedWabaId).toBe(false);
      await store.dispatch('WhatsAppCloud/getWabaId', params);
      expect(store.state.WhatsAppCloud.fetchedWabaId).toBe(true);
    });

    it('should set loadingWabaId to false', async () => {
      store.state.WhatsAppCloud.loadingWabaId = true;
      expect(store.state.WhatsAppCloud.loadingWabaId).toBe(true);
      await store.dispatch('WhatsAppCloud/getWabaId', params);
      expect(store.state.WhatsAppCloud.loadingWabaId).toBe(false);
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

    it('should set fetchedPhoneNumbers to true', async () => {
      store.state.WhatsAppCloud.fetchedPhoneNumbers = false;
      expect(store.state.WhatsAppCloud.fetchedPhoneNumbers).toBe(false);
      await store.dispatch('WhatsAppCloud/getWhatsAppPhoneNumbers', params);
      expect(store.state.WhatsAppCloud.fetchedPhoneNumbers).toBe(true);
    });

    it('should set loadingPhoneNumbers to false', async () => {
      store.state.WhatsAppCloud.loadingPhoneNumbers = true;
      expect(store.state.WhatsAppCloud.loadingPhoneNumbers).toBe(true);
      await store.dispatch('WhatsAppCloud/getWhatsAppPhoneNumbers', params);
      expect(store.state.WhatsAppCloud.loadingPhoneNumbers).toBe(false);
    });
  });
});
