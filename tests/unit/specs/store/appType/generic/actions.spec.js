jest.mock('@/api/appType/generic', () => {
  return {
    getAppForm: jest.fn(),
  };
});
import genericTypeApi from '@/api/appType/generic';

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/channels/generic/actions';
import mutations from '@/store/appType/channels/generic/mutations';
import state from '@/store/appType/channels/generic/state';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/generic/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        Generic: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('getAppForm', () => {
    const params = {
      input_token: '123',
    };

    beforeEach(() => {
      genericTypeApi.getAppForm.mockImplementation(() => {
        return Promise.resolve({
          data: {
            form: 'form',
            attributes: 'attributes',
          },
        });
      });
    });

    it('should call getAppForm from API', async () => {
      await store.dispatch('Generic/getAppForm', params);
      expect(genericTypeApi.getAppForm).toHaveBeenCalledTimes(1);
    });

    it('should set genericAppForm as result data', async () => {
      store.state.Generic.genericAppForm = {};
      expect(store.state.Generic.genericAppForm).not.toEqual('form');
      await store.dispatch('Generic/getAppForm', params);
      expect(store.state.Generic.genericAppForm).toEqual('form');
    });

    it('should set genericAppAttributes as result data', async () => {
      store.state.Generic.genericAppAttributes = {};
      expect(store.state.Generic.genericAppAttributes).not.toEqual('attributes');
      await store.dispatch('Generic/getAppForm', params);
      expect(store.state.Generic.genericAppAttributes).toEqual('attributes');
    });

    it('should set loadingAppForm to false', async () => {
      store.state.Generic.loadingAppForm = true;
      expect(store.state.Generic.loadingAppForm).toBe(true);
      await store.dispatch('Generic/getAppForm', params);
      expect(store.state.Generic.loadingAppForm).toBe(false);
    });

    it('should set errorAppForm as result data', async () => {
      const error = { error: 'failed' };
      genericTypeApi.getAppForm.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.Generic.errorAppForm = {};
      expect(store.state.Generic.errorAppForm).not.toEqual(error);
      await store.dispatch('Generic/getAppForm', params);
      expect(store.state.Generic.errorAppForm).toEqual(error);
    });
  });
});
