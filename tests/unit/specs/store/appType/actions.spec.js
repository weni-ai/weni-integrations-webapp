jest.mock('@/api/appType', () => {
  return {
    getAllAppTypes: jest.fn(),
    getAppType: jest.fn(),
    listComments: jest.fn(),
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
    postRating: jest.fn(),
    getApp: jest.fn(),
    createApp: jest.fn(),
    fetchFeatured: jest.fn(),
    updateAppConfig: jest.fn(),
    deleteApp: jest.fn(),
  };
});

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/actions';
import state from '@/store/appType/state';
import mutations from '@/store/appType/mutations';
import appTypeApi from '@/api/appType';
import { singleApp } from '../../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        appType: {
          state,
          actions,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('AppsTypes', () => {
    describe('getAllAppTypes()', () => {
      const code = 'code';
      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.getAllAppTypes.mockImplementation(() => {
          return Promise.resolve({ data: [singleApp] });
        });
      });

      it('should call getAllAppTypes from API', async () => {
        expect(appTypeApi.getAllAppTypes).not.toHaveBeenCalled();
        await store.dispatch('getAllAppTypes', code);
        expect(appTypeApi.getAllAppTypes).toHaveBeenCalledTimes(1);
      });

      it('should set returned apps as result data', async () => {
        store.state.appType.allAppTypes = [];
        expect(store.state.appType.allAppTypes).not.toEqual(singleApp);
        await store.dispatch('getAllAppTypes', code);
        expect(store.state.appType.allAppTypes).toEqual([singleApp]);
      });

      it('should set loadingAllAppTypes to false', async () => {
        store.state.appType.loadingAllAppTypes = true;
        expect(store.state.appType.loadingAllAppTypes).toBe(true);
        await store.dispatch('getAllAppTypes', code);
        expect(store.state.appType.loadingAllAppTypes).toBe(false);
      });

      it('should set errorAllAppTypes as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.getAllAppTypes.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.appType.errorAllAppTypes = {};
        expect(store.state.appType.errorAllAppTypes).not.toEqual(error);
        await store.dispatch('getAllAppTypes', code);
        expect(store.state.appType.errorAllAppTypes).toEqual(error);
      });
    });

    describe('getAppType()', () => {
      it('should call appType.getAppType', async () => {
        expect(appTypeApi.getAppType).not.toHaveBeenCalled();
        const code = 'code';
        await actions.getAppType({}, code);
        expect(appTypeApi.getAppType).toHaveBeenCalledTimes(1);
        expect(appTypeApi.getAppType).toHaveBeenCalledWith(code);
      });
    });
  });

  describe('Rating', () => {
    it('should call appType.postRating', async () => {
      expect(appTypeApi.postRating).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        payload: {
          foo: 'bar',
        },
      };
      await actions.postRating({}, data);
      expect(appTypeApi.postRating).toHaveBeenCalledTimes(1);
      expect(appTypeApi.postRating).toHaveBeenCalledWith(data.code, data.payload);
    });
  });

  describe('Apps', () => {
    it('should call appType.fetchFeatured', async () => {
      expect(appTypeApi.fetchFeatured).not.toHaveBeenCalled();
      await actions.fetchFeatured();
      expect(appTypeApi.fetchFeatured).toHaveBeenCalledTimes(1);
    });

    it('should call appType.getApp', async () => {
      expect(appTypeApi.getApp).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        appUuid: '123',
      };
      await actions.getApp({}, data);
      expect(appTypeApi.getApp).toHaveBeenCalledTimes(1);
      expect(appTypeApi.getApp).toHaveBeenCalledWith(data.code, data.appUuid);
    });

    describe('createApp', () => {
      const data = {
        code: 'code',
        payload: {
          projectUuid: '123',
        },
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.createApp.mockImplementation(() => {
          return Promise.resolve({ data: singleApp });
        });
      });

      it('should call createApp from API', async () => {
        expect(appTypeApi.createApp).not.toHaveBeenCalled();
        await store.dispatch('createApp', data);
        expect(appTypeApi.createApp).toHaveBeenCalledTimes(1);
      });

      it('should set returned app as result data', async () => {
        store.state.appType.createAppResponse = {};
        expect(store.state.appType.createAppResponse).not.toEqual(singleApp);
        await store.dispatch('createApp', data);
        expect(store.state.appType.createAppResponse).toEqual(singleApp);
      });

      it('should set loadingCreateApp to false', async () => {
        store.state.appType.loadingCreateApp = true;
        expect(store.state.appType.loadingCreateApp).toBe(true);
        await store.dispatch('createApp', data);
        expect(store.state.appType.loadingCreateApp).toBe(false);
      });

      it('should set errorCreateApp as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.createApp.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.appType.errorCreateApp = {};
        expect(store.state.appType.errorCreateApp).not.toEqual(error);
        await store.dispatch('createApp', data);
        expect(store.state.appType.errorCreateApp).toEqual(error);
      });
    });

    describe('deleteApp', () => {
      const data = {
        code: 'code',
        appUuid: '123',
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.deleteApp.mockImplementation(() => {
          return Promise.resolve({});
        });
      });

      it('should call deleteApp from API', async () => {
        expect(appTypeApi.deleteApp).not.toHaveBeenCalled();
        await store.dispatch('deleteApp', data);
        expect(appTypeApi.deleteApp).toHaveBeenCalledTimes(1);
      });

      it('should set loadingDeleteApp to false', async () => {
        store.state.appType.loadingDeleteApp = true;
        expect(store.state.appType.loadingDeleteApp).toBe(true);
        await store.dispatch('deleteApp', data);
        expect(store.state.appType.loadingDeleteApp).toBe(false);
      });

      it('should set errorDeleteApp as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.deleteApp.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.appType.errorDeleteApp = {};
        expect(store.state.appType.errorDeleteApp).not.toEqual(error);
        await store.dispatch('deleteApp', data);
        expect(store.state.appType.errorDeleteApp).toEqual(error);
      });
    });

    it('should call appType.updateAppConfig', async () => {
      expect(appTypeApi.updateAppConfig).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        appUuid: '123',
        payload: {
          projectUuid: '123',
        },
      };
      await actions.updateAppConfig({}, data);
      expect(appTypeApi.updateAppConfig).toHaveBeenCalledTimes(1);
      expect(appTypeApi.updateAppConfig).toHaveBeenCalledWith(
        data.code,
        data.appUuid,
        data.payload,
      );
    });
  });
});
