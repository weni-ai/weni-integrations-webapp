jest.mock('@/api/appType/whatsapp', () => {
  return {
    fetchWppContactInfo: jest.fn(),
    updateWppContactInfo: jest.fn(),
    getConversations: jest.fn(),
    fetchWppProfile: jest.fn(),
    updateWppProfile: jest.fn(),
    deleteWppProfilePhoto: jest.fn(),
    getWhatsAppTemplates: jest.fn(),
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

  describe('getConversations()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      params: {},
    };

    const mockConversations = {
      business_initiated: 1,
      user_initiated: 2,
      total: 3,
    };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.getConversations.mockImplementation(() => {
        return Promise.resolve({
          data: mockConversations,
        });
      });
    });

    it('should call getConversations from API', async () => {
      expect(WhatsAppApi.getConversations).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/getConversations', data);
      expect(WhatsAppApi.getConversations).toHaveBeenCalledTimes(1);
    });

    it('should set whatsAppConversations as result data', async () => {
      store.state.WhatsApp.whatsAppConversations = {};
      expect(store.state.WhatsApp.whatsAppConversations).not.toEqual(mockConversations);
      await store.dispatch('WhatsApp/getConversations', data);
      expect(store.state.WhatsApp.whatsAppConversations).toEqual(mockConversations);
    });

    it('should set loadingConversations to false', async () => {
      store.state.WhatsApp.loadingConversations = true;
      expect(store.state.WhatsApp.loadingConversations).toBe(true);
      await store.dispatch('WhatsApp/getConversations', data);
      expect(store.state.WhatsApp.loadingConversations).toBe(false);
    });

    it('should set errorConversations as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.getConversations.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorConversations = {};
      expect(store.state.WhatsApp.errorConversations).not.toEqual(error);
      await store.dispatch('WhatsApp/getConversations', data);
      expect(store.state.WhatsApp.errorConversations).toEqual(error);
    });
  });

  describe('fetchWppProfile()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
    };

    const mockProfileResult = {
      photo_url: 'url',
    };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.fetchWppProfile.mockImplementation(() => {
        return Promise.resolve({
          data: mockProfileResult,
        });
      });
    });

    it('should call fetchWppProfile from API', async () => {
      expect(WhatsAppApi.fetchWppProfile).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/fetchWppProfile', data);
      expect(WhatsAppApi.fetchWppProfile).toHaveBeenCalledTimes(1);
    });

    it('should set whatsAppProfile as result data', async () => {
      store.state.WhatsApp.whatsAppProfile = {};
      expect(store.state.WhatsApp.whatsAppProfile).not.toEqual(mockProfileResult);
      await store.dispatch('WhatsApp/fetchWppProfile', data);
      expect(store.state.WhatsApp.whatsAppProfile).toEqual(mockProfileResult);
    });

    it('should set loadingWhatsAppProfile to false', async () => {
      store.state.WhatsApp.loadingWhatsAppProfile = true;
      expect(store.state.WhatsApp.loadingWhatsAppProfile).toBe(true);
      await store.dispatch('WhatsApp/fetchWppProfile', data);
      expect(store.state.WhatsApp.loadingWhatsAppProfile).toBe(false);
    });

    it('should set errorWhatsAppProfile as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.fetchWppProfile.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorWhatsAppProfile = {};
      expect(store.state.WhatsApp.errorWhatsAppProfile).not.toEqual(error);
      await store.dispatch('WhatsApp/fetchWppProfile', data);
      expect(store.state.WhatsApp.errorWhatsAppProfile).toEqual(error);
    });
  });

  describe('updateWppProfile', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      payload: {
        foo: 'bar',
      },
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.updateWppProfile.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call updateWppProfile from API', async () => {
      expect(WhatsAppApi.updateWppProfile).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/updateWppProfile', data);
      expect(WhatsAppApi.updateWppProfile).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.updateWppProfile).toHaveBeenCalledWith(
        data.code,
        data.appUuid,
        data.payload,
      );
    });

    it('should set updateWhatsAppProfileResult as result data', async () => {
      store.state.WhatsApp.updateWhatsAppProfileResult = {};
      expect(store.state.WhatsApp.updateWhatsAppProfileResult).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/updateWppProfile', data);
      expect(store.state.WhatsApp.updateWhatsAppProfileResult).toEqual(mockedResult);
    });

    it('should set loadingUpdateWhatsAppProfile to false', async () => {
      store.state.WhatsApp.loadingUpdateWhatsAppProfile = true;
      expect(store.state.WhatsApp.loadingUpdateWhatsAppProfile).toBe(true);
      await store.dispatch('WhatsApp/updateWppProfile', data);
      expect(store.state.WhatsApp.loadingUpdateWhatsAppProfile).toBe(false);
    });

    it('should set errorUpdateWhatsAppProfile as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.updateWppProfile.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorUpdateWhatsAppProfile = {};
      expect(store.state.WhatsApp.errorUpdateWhatsAppProfile).not.toEqual(error);
      await store.dispatch('WhatsApp/updateWppProfile', data);
      expect(store.state.WhatsApp.errorUpdateWhatsAppProfile).toEqual(error);
    });
  });

  describe('deleteWppProfilePhoto()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.deleteWppProfilePhoto.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call deleteWppProfilePhoto from API', async () => {
      expect(WhatsAppApi.deleteWppProfilePhoto).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/deleteWppProfilePhoto', data);
      expect(WhatsAppApi.deleteWppProfilePhoto).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.deleteWppProfilePhoto).toHaveBeenCalledWith(data.code, data.appUuid);
    });

    it('should set deleteWhatsAppProfilePhotoResult as result data', async () => {
      store.state.WhatsApp.deleteWhatsAppProfilePhotoResult = {};
      expect(store.state.WhatsApp.deleteWhatsAppProfilePhotoResult).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/deleteWppProfilePhoto', data);
      expect(store.state.WhatsApp.deleteWhatsAppProfilePhotoResult).toEqual(mockedResult);
    });

    it('should set loadingDeleteWhatsAppProfilePhoto to false', async () => {
      store.state.WhatsApp.loadingDeleteWhatsAppProfilePhoto = true;
      expect(store.state.WhatsApp.loadingDeleteWhatsAppProfilePhoto).toBe(true);
      await store.dispatch('WhatsApp/deleteWppProfilePhoto', data);
      expect(store.state.WhatsApp.loadingDeleteWhatsAppProfilePhoto).toBe(false);
    });

    it('should set errorDeleteWhatsAppProfilePhoto as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.deleteWppProfilePhoto.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorDeleteWhatsAppProfilePhoto = {};
      expect(store.state.WhatsApp.errorDeleteWhatsAppProfilePhoto).not.toEqual(error);
      await store.dispatch('WhatsApp/deleteWppProfilePhoto', data);
      expect(store.state.WhatsApp.errorDeleteWhatsAppProfilePhoto).toEqual(error);
    });
  });

  describe('getWhatsAppTemplates()', () => {
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

      WhatsAppApi.getWhatsAppTemplates.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call getWhatsAppTemplates from API', async () => {
      expect(WhatsAppApi.getWhatsAppTemplates).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/getWhatsAppTemplates', data);
      expect(WhatsAppApi.getWhatsAppTemplates).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.getWhatsAppTemplates).toHaveBeenCalledWith(
        data.code,
        data.appUuid,
        data.params,
      );
    });

    it('should set whatsAppTemplates as result data', async () => {
      store.state.WhatsApp.whatsAppTemplates = {};
      expect(store.state.WhatsApp.whatsAppTemplates).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/getWhatsAppTemplates', data);
      expect(store.state.WhatsApp.whatsAppTemplates).toEqual(mockedResult);
    });

    it('should set loadingWhatsAppTemplates to false', async () => {
      store.state.WhatsApp.loadingWhatsAppTemplates = true;
      expect(store.state.WhatsApp.loadingWhatsAppTemplates).toBe(true);
      await store.dispatch('WhatsApp/getWhatsAppTemplates', data);
      expect(store.state.WhatsApp.loadingWhatsAppTemplates).toBe(false);
    });

    it('should set errorWhatsAppTemplates as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.getWhatsAppTemplates.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorWhatsAppTemplates = {};
      expect(store.state.WhatsApp.errorWhatsAppTemplates).not.toEqual(error);
      await store.dispatch('WhatsApp/getWhatsAppTemplates', data);
      expect(store.state.WhatsApp.errorWhatsAppTemplates).toEqual(error);
    });
  });
});
