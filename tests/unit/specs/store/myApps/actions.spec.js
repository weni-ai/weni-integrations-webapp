jest.mock('@/api/myApps', () => {
  return {
    getConfiguredApps: jest.fn(),
    getInstalledApps: jest.fn(),
  };
});

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/myApps/actions';
import state from '@/store/myApps/state';
import mutations from '@/store/myApps/mutations';
import appTypeApi from '@/api/myApps';
import { singleApp } from '../../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/myApps/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        myApps: {
          actions,
          state,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('myApps', () => {
    describe('getConfiguredApps()', () => {
      const params = {
        project_uuid: '123',
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.getConfiguredApps.mockImplementation(() => {
          return Promise.resolve({ data: [singleApp] });
        });
      });

      it('should call getConfiguredApps from API', async () => {
        expect(appTypeApi.getConfiguredApps).not.toHaveBeenCalled();
        await store.dispatch('getConfiguredApps', params);
        expect(appTypeApi.getConfiguredApps).toHaveBeenCalledTimes(1);
      });

      it('should set configuredApps as result data', async () => {
        store.state.myApps.configuredApps = {};
        expect(store.state.myApps.configuredApps).not.toEqual([singleApp]);
        await store.dispatch('getConfiguredApps', params);
        expect(store.state.myApps.configuredApps).toEqual([singleApp]);
      });

      it('should set loadingConfiguredApps to false', async () => {
        store.state.myApps.loadingConfiguredApps = true;
        expect(store.state.myApps.loadingConfiguredApps).toBe(true);
        await store.dispatch('getConfiguredApps', params);
        expect(store.state.myApps.loadingConfiguredApps).toBe(false);
      });

      it('should set errorConfiguredApps as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.getConfiguredApps.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.myApps.errorConfiguredApps = {};
        expect(store.state.myApps.errorConfiguredApps).not.toEqual(error);
        await store.dispatch('getConfiguredApps', params);
        expect(store.state.myApps.errorConfiguredApps).toEqual(error);
      });
    });

    describe('getInstalledApps()', () => {
      const params = {
        project_uuid: '123',
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.getInstalledApps.mockImplementation(() => {
          return Promise.resolve({ data: [singleApp] });
        });
      });

      it('should call getInstalledApps from API', async () => {
        expect(appTypeApi.getInstalledApps).not.toHaveBeenCalled();
        await store.dispatch('getInstalledApps', params);
        expect(appTypeApi.getInstalledApps).toHaveBeenCalledTimes(1);
      });

      it('should set installedApps as result data', async () => {
        store.state.myApps.installedApps = {};
        expect(store.state.myApps.installedApps).not.toEqual([singleApp]);
        await store.dispatch('getInstalledApps', params);
        expect(store.state.myApps.installedApps).toEqual([singleApp]);
      });

      it('should set loadingInstalledApps to false', async () => {
        store.state.myApps.loadingInstalledApps = true;
        expect(store.state.myApps.loadingInstalledApps).toBe(true);
        await store.dispatch('getInstalledApps', params);
        expect(store.state.myApps.loadingInstalledApps).toBe(false);
      });

      it('should set errorInstalledApps as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.getInstalledApps.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.myApps.errorInstalledApps = {};
        expect(store.state.myApps.errorInstalledApps).not.toEqual(error);
        await store.dispatch('getInstalledApps', params);
        expect(store.state.myApps.errorInstalledApps).toEqual(error);
      });
    });
  });
});
