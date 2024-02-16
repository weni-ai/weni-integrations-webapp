jest.mock('@/api/appType/ecommerce', () => {
  return {
    getAllEcommerceTypes: jest.fn(),
    connectVtexCatalog: jest.fn(),
    getVtexAppUuid: jest.fn(),
  };
});
import ecommerceApi from '@/api/appType/ecommerce';

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/ecommerce/actions';
import mutations from '@/store/appType/ecommerce/mutations';
import state from '@/store/appType/ecommerce/state';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/ecommerce/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        ecommerce: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('getEcommerceTypes', () => {
    const params = {
      input_token: '123',
    };

    beforeEach(() => {
      ecommerceApi.getAllEcommerceTypes.mockImplementation(() => {
        return Promise.resolve({
          data: {
            foo: 'bar',
          },
        });
      });
    });

    it('should call getAllEcommerceTypes from API', async () => {
      await store.dispatch('ecommerce/getEcommerceTypes', params);
      expect(ecommerceApi.getAllEcommerceTypes).toHaveBeenCalledTimes(1);
    });

    it('should set ecommerceAppsList as result data', async () => {
      store.state.ecommerce.ecommerceAppsList = {};
      expect(store.state.ecommerce.ecommerceAppsList).not.toEqual('form');
      await store.dispatch('ecommerce/getEcommerceTypes', params);
      expect(store.state.ecommerce.ecommerceAppsList).toEqual({ foo: 'bar' });
    });

    it('should set loadingEcommerceApps to false', async () => {
      store.state.ecommerce.loadingEcommerceApps = true;
      expect(store.state.ecommerce.loadingEcommerceApps).toBe(true);
      await store.dispatch('ecommerce/getEcommerceTypes', params);
      expect(store.state.ecommerce.loadingEcommerceApps).toBe(false);
    });

    it('should set errorEcommerceApps as result data', async () => {
      const error = { error: 'failed' };
      ecommerceApi.getAllEcommerceTypes.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.ecommerce.errorEcommerceApps = {};
      expect(store.state.ecommerce.errorEcommerceApps).not.toEqual(error);
      await store.dispatch('ecommerce/getEcommerceTypes', params);
      expect(store.state.ecommerce.errorEcommerceApps).toEqual(error);
    });
  });

  describe('connectVtexCatalog', () => {
    const params = {
      input_token: '123',
    };

    beforeEach(() => {
      ecommerceApi.connectVtexCatalog.mockImplementation(() => {
        return Promise.resolve({
          data: {
            foo: 'bar',
          },
        });
      });
    });

    it('should call connectVtexCatalog from API', async () => {
      await store.dispatch('ecommerce/connectVtexCatalog', params);
      expect(ecommerceApi.connectVtexCatalog).toHaveBeenCalledTimes(1);
    });

    it('should set connectVtexCatalogData as result data', async () => {
      store.state.ecommerce.connectVtexCatalogData = {};
      expect(store.state.ecommerce.connectVtexCatalogData).not.toEqual('form');
      await store.dispatch('ecommerce/connectVtexCatalog', params);
      expect(store.state.ecommerce.connectVtexCatalogData).toEqual({ foo: 'bar' });
    });

    it('should set loadingConnectVtexCatalog to false', async () => {
      store.state.ecommerce.loadingConnectVtexCatalog = true;
      expect(store.state.ecommerce.loadingConnectVtexCatalog).toBe(true);
      await store.dispatch('ecommerce/connectVtexCatalog', params);
      expect(store.state.ecommerce.loadingConnectVtexCatalog).toBe(false);
    });

    it('should set errorConnectVtexCatalog as result data', async () => {
      const error = { error: 'failed' };
      ecommerceApi.connectVtexCatalog.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.ecommerce.errorConnectVtexCatalog = {};
      expect(store.state.ecommerce.errorConnectVtexCatalog).not.toEqual(error);
      await store.dispatch('ecommerce/connectVtexCatalog', params);
      expect(store.state.ecommerce.errorConnectVtexCatalog).toEqual(error);
    });
  });

  describe('getVtexAppUuid', () => {
    const params = {
      code: '123',
    };

    beforeEach(() => {
      ecommerceApi.getVtexAppUuid.mockImplementation(() => {
        return Promise.resolve({
          data: {
            uuid: '123',
          },
        });
      });
    });

    it('should call getVtexAppUuid from API', async () => {
      await store.dispatch('ecommerce/getVtexAppUuid', params);
      expect(ecommerceApi.getVtexAppUuid).toHaveBeenCalledTimes(1);
    });

    it('should set generatedVtexAppUuid as result data', async () => {
      store.state.ecommerce.generatedVtexAppUuid = '';
      expect(store.state.ecommerce.generatedVtexAppUuid).not.toEqual('123');
      await store.dispatch('ecommerce/getVtexAppUuid', params);
      expect(store.state.ecommerce.generatedVtexAppUuid).toEqual('123');
    });

    it('should set loadingVtexAppUuid to false', async () => {
      store.state.ecommerce.loadingVtexAppUuid = true;
      expect(store.state.ecommerce.loadingVtexAppUuid).toBe(true);
      await store.dispatch('ecommerce/getVtexAppUuid', params);
      expect(store.state.ecommerce.loadingVtexAppUuid).toBe(false);
    });

    it('should set errorVtexAppUuid as result data', async () => {
      const error = { error: 'failed' };
      ecommerceApi.getVtexAppUuid.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.ecommerce.errorVtexAppUuid = {};
      expect(store.state.ecommerce.errorVtexAppUuid).not.toEqual(error);
      await store.dispatch('ecommerce/getVtexAppUuid', params);
      expect(store.state.ecommerce.errorVtexAppUuid).toEqual(error);
    });
  });
});
