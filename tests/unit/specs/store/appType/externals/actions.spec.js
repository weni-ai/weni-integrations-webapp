jest.mock('@/api/appType/externalServices', () => {
  return {
    getAllExternalServicesTypes: jest.fn(),
    createPrompts: jest.fn(),
    getPrompts: jest.fn(),
    deletePrompts: jest.fn(),
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

  describe('createPrompts', () => {
    const params = {
      code: '123',
      appUuid: '456',
      payload: {
        project_uuid: '789',
        prompts: [{ text: 'prompt' }],
      },
    };

    beforeEach(() => {
      externalServiceApi.createPrompts.mockImplementation(() => {
        return Promise.resolve({
          data: {
            foo: 'bar',
          },
        });
      });
    });

    it('should call createPrompts from API', async () => {
      await store.dispatch('Externals/createPrompts', params);
      expect(externalServiceApi.createPrompts).toHaveBeenCalledTimes(1);
    });

    it('should set createPromptsResult as result data', async () => {
      store.state.Externals.createPromptsResult = {};
      expect(store.state.Externals.createPromptsResult).not.toEqual('form');
      await store.dispatch('Externals/createPrompts', params);
      expect(store.state.Externals.createPromptsResult).toEqual({ foo: 'bar' });
    });

    it('should set loadingCreatePrompts to false', async () => {
      store.state.Externals.loadingCreatePrompts = true;
      expect(store.state.Externals.loadingCreatePrompts).toBe(true);
      await store.dispatch('Externals/createPrompts', params);
      expect(store.state.Externals.loadingCreatePrompts).toBe(false);
    });

    it('should set errorCreatePrompts as result data', async () => {
      const error = { error: 'failed' };
      externalServiceApi.createPrompts.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.Externals.errorCreatePrompts = {};
      expect(store.state.Externals.errorCreatePrompts).not.toEqual(error);
      await store.dispatch('Externals/createPrompts', params);
      expect(store.state.Externals.errorCreatePrompts).toEqual(error);
    });
  });

  describe('getPrompts', () => {
    const params = {
      input_token: '123',
    };

    beforeEach(() => {
      externalServiceApi.getPrompts.mockImplementation(() => {
        return Promise.resolve({
          data: {
            foo: 'bar',
          },
        });
      });
    });

    it('should call getPrompts from API', async () => {
      await store.dispatch('Externals/getPrompts', params);
      expect(externalServiceApi.getPrompts).toHaveBeenCalledTimes(1);
    });

    it('should set getPromptsResult as result data', async () => {
      store.state.Externals.getPromptsResult = {};
      expect(store.state.Externals.getPromptsResult).not.toEqual('form');
      await store.dispatch('Externals/getPrompts', params);
      expect(store.state.Externals.getPromptsResult).toEqual({ foo: 'bar' });
    });

    it('should set loadingGetPrompts to false', async () => {
      store.state.Externals.loadingGetPrompts = true;
      expect(store.state.Externals.loadingGetPrompts).toBe(true);
      await store.dispatch('Externals/getPrompts', params);
      expect(store.state.Externals.loadingGetPrompts).toBe(false);
    });

    it('should set errorGetPrompts as result data', async () => {
      const error = { error: 'failed' };
      externalServiceApi.getPrompts.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.Externals.errorGetPrompts = {};
      expect(store.state.Externals.errorGetPrompts).not.toEqual(error);
      await store.dispatch('Externals/getPrompts', params);
      expect(store.state.Externals.errorGetPrompts).toEqual(error);
    });
  });

  describe('deletePrompts', () => {
    const params = {};

    beforeEach(() => {
      externalServiceApi.deletePrompts.mockImplementation(() => {
        return Promise.resolve({
          data: {
            foo: 'bar',
          },
        });
      });
    });

    it('should call deletePrompts from API', async () => {
      await store.dispatch('Externals/deletePrompts', params);
      expect(externalServiceApi.deletePrompts).toHaveBeenCalledTimes(1);
    });

    it('should set deletePromptsResult as result data', async () => {
      store.state.Externals.deletePromptsResult = {};
      expect(store.state.Externals.deletePromptsResult).not.toEqual('form');
      await store.dispatch('Externals/deletePrompts', params);
      expect(store.state.Externals.deletePromptsResult).toEqual({ foo: 'bar' });
    });

    it('should set loadingDeletePrompts to false', async () => {
      store.state.Externals.loadingDeletePrompts = true;
      expect(store.state.Externals.loadingDeletePrompts).toBe(true);
      await store.dispatch('Externals/deletePrompts', params);
      expect(store.state.Externals.loadingDeletePrompts).toBe(false);
    });

    it('should set errorDeletePrompts as result data', async () => {
      const error = { error: 'failed' };
      externalServiceApi.deletePrompts.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.Externals.errorDeletePrompts = {};
      expect(store.state.Externals.errorDeletePrompts).not.toEqual(error);
      await store.dispatch('Externals/deletePrompts', params);
      expect(store.state.Externals.errorDeletePrompts).toEqual(error);
    });
  });
});
