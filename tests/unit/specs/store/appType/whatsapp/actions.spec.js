jest.mock('@/api/appType/whatsapp', () => {
  return {
    fetchWppContactInfo: jest.fn(),
    updateWppContactInfo: jest.fn(),
    getConversations: jest.fn(),
    fetchWppProfile: jest.fn(),
    updateWppProfile: jest.fn(),
    deleteWppProfilePhoto: jest.fn(),
  };
});
import WhatsAppApi from '@/api/appType/whatsapp';

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/channels/whatsapp/actions';
import mutations from '@/store/appType/channels/whatsapp/mutations';
import state from '@/store/appType/channels/whatsapp/state';

import storeMock from './__mocks__/store';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/whatsapp/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        WhatsApp: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('resetWppFetchResults()', () => {
    it('should set fetchedContactInfo to false', async () => {
      store.state.WhatsApp.fetchedContactInfo = true;
      expect(store.state.WhatsApp.fetchedContactInfo).toBe(true);
      await store.dispatch('WhatsApp/resetWppFetchResults');
      expect(store.state.WhatsApp.fetchedContactInfo).toBe(false);
    });
  });

  describe('fetchWppContactInfo', () => {
    const data = {
      code: 'code',
      commentUuid: '123',
    };

    beforeEach(() => {
      WhatsAppApi.fetchWppContactInfo.mockImplementation(() => {
        return Promise.resolve({ data: storeMock.mockedContactInfo });
      });
    });

    it('should call fetchWppContactInfo from API', async () => {
      await store.dispatch('WhatsApp/fetchWppContactInfo', data);
      expect(WhatsAppApi.fetchWppContactInfo).toHaveBeenCalledTimes(1);
    });

    it('should set fetchedContactInfo to true', async () => {
      store.state.WhatsApp.fetchedContactInfo = false;
      expect(store.state.WhatsApp.fetchedContactInfo).toBe(false);
      await store.dispatch('WhatsApp/fetchWppContactInfo', data);
      expect(store.state.WhatsApp.fetchedContactInfo).toBe(true);
    });

    it('should set loadingContactInfo to false', async () => {
      store.state.WhatsApp.loadingContactInfo = true;
      expect(store.state.WhatsApp.loadingContactInfo).toBe(true);
      await store.dispatch('WhatsApp/fetchWppContactInfo', data);
      expect(store.state.WhatsApp.loadingContactInfo).toBe(false);
    });
  });

  describe('updateWppContactInfo', () => {
    const data = {
      code: 'code',
      commentUuid: '123',
      payload: {
        foo: 'bar',
      },
    };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.updateWppContactInfo.mockImplementation(() => {
        return Promise.resolve({ data: storeMock.mockedContactInfo });
      });
    });

    it('should call updateWppContactInfo from API', async () => {
      expect(WhatsAppApi.updateWppContactInfo).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/updateWppContactInfo', data);
      expect(WhatsAppApi.updateWppContactInfo).toHaveBeenCalledTimes(1);
    });

    it('should set contactInfo as result data', async () => {
      store.state.WhatsApp.contactInfo = {};
      expect(store.state.WhatsApp.contactInfo).not.toEqual(storeMock.mockedContactInfo);
      await store.dispatch('WhatsApp/updateWppContactInfo', data);
      expect(store.state.WhatsApp.contactInfo).toEqual(storeMock.mockedContactInfo);
    });
  });

  it('should call appType.getConversations', async () => {
    expect(WhatsAppApi.getConversations).not.toHaveBeenCalled();
    const data = {
      code: 'code',
      appUuid: '123',
      params: {},
    };
    await actions.getConversations({}, data);
    expect(WhatsAppApi.getConversations).toHaveBeenCalledTimes(1);
    expect(WhatsAppApi.getConversations).toHaveBeenCalledWith(data.code, data.appUuid, data.params);
  });

  it('should call appType.fetchWppProfile', async () => {
    expect(WhatsAppApi.fetchWppProfile).not.toHaveBeenCalled();
    const data = {
      code: 'code',
      appUuid: '123',
    };
    await actions.fetchWppProfile({}, data);
    expect(WhatsAppApi.fetchWppProfile).toHaveBeenCalledTimes(1);
    expect(WhatsAppApi.fetchWppProfile).toHaveBeenCalledWith(data.code, data.appUuid);
  });

  it('should call appType.updateWppProfile', async () => {
    expect(WhatsAppApi.updateWppProfile).not.toHaveBeenCalled();
    const data = {
      code: 'code',
      appUuid: '123',
      payload: {},
    };
    await actions.updateWppProfile({}, data);
    expect(WhatsAppApi.updateWppProfile).toHaveBeenCalledTimes(1);
    expect(WhatsAppApi.updateWppProfile).toHaveBeenCalledWith(
      data.code,
      data.appUuid,
      data.payload,
    );
  });

  it('should call deleteWppProfilePhoto', async () => {
    expect(WhatsAppApi.deleteWppProfilePhoto).not.toHaveBeenCalled();
    const data = {
      code: 'code',
      appUuid: '123',
    };
    await actions.deleteWppProfilePhoto({}, data);
    expect(WhatsAppApi.deleteWppProfilePhoto).toHaveBeenCalledTimes(1);
    expect(WhatsAppApi.deleteWppProfilePhoto).toHaveBeenCalledWith(data.code, data.appUuid);
  });
});
