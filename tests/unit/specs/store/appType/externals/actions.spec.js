jest.mock('@/api/appType/externalServices', () => {
  return {
    getAllExternalServicesTypes: jest.fn(),
  };
});
import externalServiceApi from '@/api/appType/externalServices';

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/externals/actions';
import mutations from '@/store/appType/externals/mutations';
import state from '@/store/appType/externals/state';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/externals/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        Externals: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('getExternalServicesTypes', () => {
    const params = {
      input_token: '123',
    };

    beforeEach(() => {
      externalServiceApi.getAllExternalServicesTypes.mockImplementation(() => {
        return Promise.resolve({
          data: {
            foo: 'bar',
          },
        });
      });
    });

    it('should call getAllExternalServicesTypes from API', async () => {
      await store.dispatch('Externals/getExternalServicesTypes', params);
      expect(externalServiceApi.getAllExternalServicesTypes).toHaveBeenCalledTimes(1);
    });

    it('should set externalServicesList as result data', async () => {
      store.state.Externals.externalServicesList = {};
      expect(store.state.Externals.externalServicesList).not.toEqual('form');
      await store.dispatch('Externals/getExternalServicesTypes', params);
      expect(store.state.Externals.externalServicesList).toEqual({ foo: 'bar' });
    });

    it('should set loadingExternalServices to false', async () => {
      store.state.Externals.loadingExternalServices = true;
      expect(store.state.Externals.loadingExternalServices).toBe(true);
      await store.dispatch('Externals/getExternalServicesTypes', params);
      expect(store.state.Externals.loadingExternalServices).toBe(false);
    });

    it('should set errorExternalServices as result data', async () => {
      const error = { error: 'failed' };
      externalServiceApi.getAllExternalServicesTypes.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.Externals.errorExternalServices = {};
      expect(store.state.Externals.errorExternalServices).not.toEqual(error);
      await store.dispatch('Externals/getExternalServicesTypes', params);
      expect(store.state.Externals.errorExternalServices).toEqual(error);
    });
  });
});
