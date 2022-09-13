jest.mock('@/api/auth', () => {
  return {
    getFlowToken: jest.fn(),
  };
});

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/auth/actions';
import state from '@/store/auth/state';
import mutations from '@/store/auth/mutations';
import authApi from '@/api/auth';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/auth/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        auth: {
          state,
          actions,
          mutations,
        },
      },
    });
  });

  describe('MISSING', () => {
    it('should NOT login if token is missing', async () => {
      store.state.auth.token = null;
      await store.dispatch('externalLogin', '');
      expect(store.state.auth.token).toEqual(null);
    });

    it('should NOT set org if org is missing', async () => {
      store.state.auth.org = null;
      await store.dispatch('selectedOrg', '');
      expect(store.state.auth.org).toEqual(null);
    });

    it('should NOT set project if project is missing', async () => {
      store.state.auth.project = null;
      await store.dispatch('selectedProject', '');
      expect(store.state.auth.project).toEqual(null);
    });

    it('should NOT set flowOrg if flowOrg is missing', async () => {
      store.state.auth.flowOrg = null;
      await store.dispatch('selectedFlowOrg', '');
      expect(store.state.auth.flowOrg).toEqual(null);
    });
  });

  describe('PROVIDED', () => {
    it('should login if token provided', async () => {
      store.state.auth.token = null;
      await store.dispatch('externalLogin', { token: '123' });
      expect(store.state.auth.token).toEqual('123');
    });

    it('should set org if org is provided', async () => {
      store.state.auth.org = null;
      await store.dispatch('selectedOrg', { org: 'org' });
      expect(store.state.auth.org).toEqual('org');
    });

    it('should set project if project provided', async () => {
      store.state.auth.project = null;
      await store.dispatch('selectedProject', { project: 'project' });
      expect(store.state.auth.project).toEqual('project');
    });

    it('should set flowOrg if flowOrg provided', async () => {
      store.state.auth.flowOrg = null;
      await store.dispatch('selectedFlowOrg', { flowOrg: 'org123' });
      expect(store.state.auth.flowOrg).toEqual('org123');
    });
  });

  describe('getFlowToken()', () => {
    beforeEach(() => {
      jest.resetAllMocks();

      authApi.getFlowToken.mockImplementation(() => {
        return Promise.resolve({ data: { api_token: '123' } });
      });
    });

    it('should call getFlowToken from API', async () => {
      expect(authApi.getFlowToken).not.toHaveBeenCalled();
      await store.dispatch('getFlowToken');
      expect(authApi.getFlowToken).toHaveBeenCalledTimes(1);
    });

    it('should set returned app as result data', async () => {
      store.state.auth.flowToken = null;
      expect(store.state.auth.flowToken).not.toEqual('123');
      await store.dispatch('getFlowToken');
      expect(store.state.auth.flowToken).toEqual('123');
    });

    it('should set loadingFlowToken to false', async () => {
      store.state.auth.loadingFlowToken = true;
      expect(store.state.auth.loadingFlowToken).toBe(true);
      await store.dispatch('getFlowToken');
      expect(store.state.auth.loadingFlowToken).toBe(false);
    });

    it('should set errorFlowToken as result data', async () => {
      const error = { error: 'failed' };
      authApi.getFlowToken.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.auth.errorFlowToken = {};
      expect(store.state.auth.errorFlowToken).not.toEqual(error);
      await store.dispatch('getFlowToken');
      expect(store.state.auth.errorFlowToken).toEqual(error);
    });
  });
});
