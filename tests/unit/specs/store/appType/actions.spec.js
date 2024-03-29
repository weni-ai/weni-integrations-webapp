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
    updateApp: jest.fn(),
  };
});

jest.mock('@/api/appType/generic', () => {
  return {
    getIcons: jest.fn(),
    getAllGenericTypes: jest.fn(),
  };
});

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/actions';
import state from '@/store/appType/state';
import mutations from '@/store/appType/mutations';
import appTypeApi from '@/api/appType';
import genericTypeApi from '@/api/appType/generic';
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

        const genericApps = {
          G1: {
            attributes: {
              claim_blurb: 'claim blurb text',
              attribute1: 'value1',
            },
          },
          G2: {
            attributes: {
              claim_blurb: 'claim blurb text 2',
              attribute1: 'value2',
            },
          },
        };

        appTypeApi.getAllAppTypes.mockImplementation(() => {
          return Promise.resolve({
            data: [singleApp],
          });
        });

        genericTypeApi.getIcons.mockImplementation(() => {
          return Promise.resolve({ data: { G1: 'https://url1.com', G2: 'https://url2.com' } });
        });

        genericTypeApi.getAllGenericTypes.mockImplementation(() => {
          return Promise.resolve({ data: genericApps });
        });
      });

      it('should call getAllAppTypes from API', async () => {
        expect(appTypeApi.getAllAppTypes).not.toHaveBeenCalled();
        await store.dispatch('getAllAppTypes', code);
        expect(appTypeApi.getAllAppTypes).toHaveBeenCalledTimes(1);
      });

      it('should call getIcons from generic type API', async () => {
        expect(genericTypeApi.getIcons).not.toHaveBeenCalled();
        await store.dispatch('getAllAppTypes', code);
        expect(genericTypeApi.getIcons).toHaveBeenCalledTimes(1);
      });

      it('should set returned apps as result data', async () => {
        const genericApps = [
          {
            generic: true,
            summary: 'claim blurb text',
            icon: 'https://url1.com',
            claim_blurb: 'claim blurb text',
            attribute1: 'value1',
          },
          {
            generic: true,
            summary: 'claim blurb text 2',
            icon: 'https://url2.com',
            claim_blurb: 'claim blurb text 2',
            attribute1: 'value2',
          },
        ];
        store.state.appType.allAppTypes = [];
        expect(store.state.appType.allAppTypes).not.toEqual([singleApp, ...genericApps]);
        await store.dispatch('getAllAppTypes', code);
        expect(store.state.appType.allAppTypes).toEqual([singleApp, ...genericApps]);
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
      const data = {
        code: 'code',
        shouldLoad: true,
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.getAppType.mockImplementation(() => {
          return Promise.resolve({ data: singleApp });
        });
      });

      it('should call getAppType from API', async () => {
        expect(appTypeApi.getAppType).not.toHaveBeenCalled();
        await store.dispatch('getAppType', { ...data, shouldLoad: false });
        expect(appTypeApi.getAppType).toHaveBeenCalledTimes(1);
      });

      it('should set returned app as result data', async () => {
        store.state.appType.currentAppType = [];
        expect(store.state.appType.currentAppType).not.toEqual(singleApp);
        await store.dispatch('getAppType', data);
        expect(store.state.appType.currentAppType).toEqual(singleApp);
      });

      it('should set loadingCurrentAppType to false', async () => {
        store.state.appType.loadingCurrentAppType = true;
        expect(store.state.appType.loadingCurrentAppType).toBe(true);
        await store.dispatch('getAppType', data);
        expect(store.state.appType.loadingCurrentAppType).toBe(false);
      });

      it('should set errorCurrentAppType as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.getAppType.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.appType.errorCurrentAppType = {};
        expect(store.state.appType.errorCurrentAppType).not.toEqual(error);
        await store.dispatch('getAppType', data);
        expect(store.state.appType.errorCurrentAppType).toEqual(error);
      });
    });
  });

  describe('Rating', () => {
    const data = {
      code: 'code',
      payload: {
        foo: 'bar',
      },
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      appTypeApi.postRating.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call postRating from API', async () => {
      expect(appTypeApi.postRating).not.toHaveBeenCalled();
      await store.dispatch('postRating', data);
      expect(appTypeApi.postRating).toHaveBeenCalledTimes(1);
      expect(appTypeApi.postRating).toHaveBeenCalledWith(data.code, data.payload);
    });

    it('should set rating result as data', async () => {
      store.state.appType.postRatingResult = null;
      expect(store.state.appType.postRatingResult).not.toEqual(mockedResult);
      await store.dispatch('postRating', data);
      expect(store.state.appType.postRatingResult).toEqual(mockedResult);
    });

    it('should set loadingPostRating to false', async () => {
      store.state.appType.loadingPostRating = true;
      expect(store.state.appType.loadingPostRating).toBe(true);
      await store.dispatch('postRating', data);
      expect(store.state.appType.loadingPostRating).toBe(false);
    });

    it('should set errorPostRating as result data', async () => {
      const error = { error: 'failed' };
      appTypeApi.postRating.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.appType.errorPostRating = {};
      expect(store.state.appType.errorPostRating).not.toEqual(error);
      await store.dispatch('postRating', data);
      expect(store.state.appType.errorPostRating).toEqual(error);
    });
  });

  describe('Apps', () => {
    describe('fetchFeatured()', () => {
      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.fetchFeatured.mockImplementation(() => {
          return Promise.resolve({ data: [singleApp] });
        });
      });

      it('should call fetchFeatured from API', async () => {
        expect(appTypeApi.fetchFeatured).not.toHaveBeenCalled();
        await store.dispatch('fetchFeatured');
        expect(appTypeApi.fetchFeatured).toHaveBeenCalledTimes(1);
      });

      it('should set data as featuredApps', async () => {
        store.state.appType.featuredApps = null;
        expect(store.state.appType.featuredApps).not.toEqual([singleApp]);
        await store.dispatch('fetchFeatured');
        expect(store.state.appType.featuredApps).toEqual([singleApp]);
      });

      it('should set loadingFeaturedApps to false', async () => {
        store.state.appType.loadingFeaturedApps = true;
        expect(store.state.appType.loadingFeaturedApps).toBe(true);
        await store.dispatch('fetchFeatured');
        expect(store.state.appType.loadingFeaturedApps).toBe(false);
      });

      it('should set errorFeaturedApps as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.fetchFeatured.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.appType.errorFeaturedApps = {};
        expect(store.state.appType.errorFeaturedApps).not.toEqual(error);
        await store.dispatch('fetchFeatured');
        expect(store.state.appType.errorFeaturedApps).toEqual(error);
      });
    });

    describe('getApp()', () => {
      const data = {
        code: 'code',
        appUuid: '123',
      };

      const mockedResult = singleApp;

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.getApp.mockImplementation(() => {
          return Promise.resolve({ data: mockedResult });
        });
      });

      it('should call getApp from API', async () => {
        expect(appTypeApi.getApp).not.toHaveBeenCalled();
        await store.dispatch('getApp', data);
        expect(appTypeApi.getApp).toHaveBeenCalledTimes(1);
        expect(appTypeApi.getApp).toHaveBeenCalledWith(data.code, data.appUuid);
      });

      it('should set data as currentApp', async () => {
        store.state.appType.currentApp = null;
        expect(store.state.appType.currentApp).not.toEqual(mockedResult);
        await store.dispatch('getApp', data);
        expect(store.state.appType.currentApp).toEqual(mockedResult);
      });

      it('should set loadingCurrentApp to false', async () => {
        store.state.appType.loadingCurrentApp = true;
        expect(store.state.appType.loadingCurrentApp).toBe(true);
        await store.dispatch('getApp', data);
        expect(store.state.appType.loadingCurrentApp).toBe(false);
      });

      it('should set errorCurrentApp as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.getApp.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.appType.errorCurrentApp = {};
        expect(store.state.appType.errorCurrentApp).not.toEqual(error);
        await store.dispatch('getApp', data);
        expect(store.state.appType.errorCurrentApp).toEqual(error);
      });
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

    describe('updateAppConfig', () => {
      const data = {
        code: 'code',
        appUuid: '123',
        payload: {
          projectUuid: '123',
        },
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.updateAppConfig.mockImplementation(() => {
          return Promise.resolve({});
        });
      });

      it('should call updateAppConfig from API', async () => {
        expect(appTypeApi.updateAppConfig).not.toHaveBeenCalled();
        await store.dispatch('updateAppConfig', data);
        expect(appTypeApi.updateAppConfig).toHaveBeenCalledTimes(1);
        expect(appTypeApi.updateAppConfig).toHaveBeenCalledWith(
          data.code,
          data.appUuid,
          data.payload,
        );
      });

      it('should set loadingUpdateAppConfig to false', async () => {
        store.state.appType.loadingUpdateAppConfig = true;
        expect(store.state.appType.loadingUpdateAppConfig).toBe(true);
        await store.dispatch('updateAppConfig', data);
        expect(store.state.appType.loadingUpdateAppConfig).toBe(false);
      });

      it('should set errorUpdateAppConfig as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.updateAppConfig.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.appType.errorUpdateAppConfig = {};
        expect(store.state.appType.errorUpdateAppConfig).not.toEqual(error);
        await store.dispatch('updateAppConfig', data);
        expect(store.state.appType.errorUpdateAppConfig).toEqual(error);
      });
    });

    describe('updateApp', () => {
      const data = {
        code: 'code',
        appUuid: '123',
        payload: {
          projectUuid: '123',
        },
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.updateApp.mockImplementation(() => {
          return Promise.resolve({});
        });
      });

      it('should call updateApp from API', async () => {
        expect(appTypeApi.updateApp).not.toHaveBeenCalled();
        await store.dispatch('updateApp', data);
        expect(appTypeApi.updateApp).toHaveBeenCalledTimes(1);
        expect(appTypeApi.updateApp).toHaveBeenCalledWith(data.code, data.appUuid, data.payload);
      });

      it('should set loadingUpdateApp to false', async () => {
        store.state.appType.loadingUpdateApp = true;
        expect(store.state.appType.loadingUpdateApp).toBe(true);
        await store.dispatch('updateApp', data);
        expect(store.state.appType.loadingUpdateApp).toBe(false);
      });

      it('should set errorUpdateApp as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.updateApp.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.appType.errorUpdateApp = {};
        expect(store.state.appType.errorUpdateApp).not.toEqual(error);
        await store.dispatch('updateApp', data);
        expect(store.state.appType.errorUpdateApp).toEqual(error);
      });
    });

    describe('setOnboardStatus', () => {
      it('should set onboardStatus to false', async () => {
        expect(store.state.appType.onboardStatus).toBe(true);
        await store.dispatch('setOnboardStatus', { status: false });
        expect(store.state.appType.onboardStatus).toBe(false);
      });
    });
  });
});
