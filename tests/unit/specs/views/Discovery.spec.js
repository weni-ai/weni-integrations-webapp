import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Discovery from '@/views/Discovery/index.vue';
import AppGrid from '@/components/AppGrid/index.vue';
import { singleApp } from '../../../__mocks__/appMock';

const genericApp = {
  ...singleApp,
  name: 'generic',
  code: 'generic',
  generic: true,
  config: { channel_name: 'A random generic', channel_icon_url: 'https://weni.ai/icon.png' },
};

const mockManuallyCreateApp = jest.fn();
AppGrid.methods = {
  ...AppGrid.methods,
  manuallyCreateApp: mockManuallyCreateApp,
};

const mountComponent = async ({ createAppCode = null, apps = [singleApp] } = {}) => {
  const actions = {
    getAllAppTypes: jest.fn(),
    deleteApp: jest.fn(),
    getConfiguredApps: jest.fn(),
    fetchFeatured: jest.fn(),
  };

  const state = {
    appType: {
      loadingDeleteApp: false,
      errorDeleteApp: false,

      allAppTypes: apps,
      loadingAllAppTypes: false,
      errorAllAppTypes: false,
    },
    auth: {
      project: '123',
    },
  };

  const externalServicesActions = {
    getExternalServicesTypes: jest.fn(),
  };

  const externalServicesState = {
    loadingExternalServices: false,
    errorExternalServices: null,
    externalServicesList: apps,
  };

  const ecommerceAppsActions = {
    getEcommerceTypes: jest.fn(),
  };

  const ecommerceAppsState = {
    loadingEcommerceApps: false,
    errorEcommerceApps: null,
    ecommerceAppsList: apps,
  };

  const store = new Vuex.Store({
    modules: {
      externals: {
        namespaced: true,
        actions: externalServicesActions,
        state: externalServicesState,
      },
      ecommerce: {
        namespaced: true,
        actions: ecommerceAppsActions,
        state: ecommerceAppsState,
      },
    },
    actions,
    state,
  });

  const wrapper = mount(Discovery, {
    localVue,
    store,
    mocks: {
      $t: () => 'some specific text',
      $route: {
        query: { create_app: createAppCode },
      },
    },
    stubs: {
      AppGrid,
      OnboardModal: true,
    },
  });

  await wrapper.vm.$nextTick();
  await jest.runAllTimers();

  return { wrapper, store, actions };
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Discovery/index.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('mounted', () => {
    it('should call fetchChannels', async () => {
      const spy = jest.spyOn(Discovery.methods, 'fetchChannels');
      await mountComponent();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call manuallyCreateApp if create_app is recieved as query param', async () => {
      await mountComponent({ createAppCode: 'tg' });

      expect(mockManuallyCreateApp).toHaveBeenCalledTimes(1);
    });

    it('should not call manuallyCreateApp if create_app is not recieved as query param', async () => {
      await mountComponent({ createAppCode: null });

      expect(mockManuallyCreateApp).toHaveBeenCalledTimes(0);
    });
  });

  describe('fetchChannels', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should call getAllAppTypes', async () => {
      const { wrapper, actions } = await mountComponent();
      jest.clearAllMocks();
      expect(actions.getAllAppTypes).not.toHaveBeenCalled();
      await wrapper.vm.fetchChannels();
      expect(actions.getAllAppTypes).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      const { wrapper, store } = await mountComponent();
      store.state.appType.errorAllAppTypes = true;
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.fetchChannels();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('search', () => {
    it('should filter apps, externalservices and biApps apps by name', async () => {
      const { wrapper, store } = await mountComponent();
      store.state.appType.allAppTypes = [singleApp, genericApp];
      store.state.externals.externalServicesList = [singleApp, genericApp];
      store.state.ecommerce.ecommerceAppsList = [singleApp, genericApp];

      expect(wrapper.vm.filteredApps).toEqual([singleApp, genericApp]);
      expect(wrapper.vm.filteredExternalServices).toEqual([singleApp, genericApp]);
      expect(wrapper.vm.filteredEcommerceApps).toEqual([singleApp, genericApp]);
      expect(wrapper.vm.filteredBiApps).toEqual(wrapper.vm.biApps);

      wrapper.vm.searchTerm = 'weni';
      expect(wrapper.vm.filteredApps).toEqual([singleApp]);
      expect(wrapper.vm.filteredExternalServices).toEqual([singleApp]);
      expect(wrapper.vm.filteredEcommerceApps).toEqual([singleApp]);
      expect(wrapper.vm.filteredBiApps).toEqual([]);

      wrapper.vm.searchTerm = ' ';
      expect(wrapper.vm.filteredApps).toEqual([singleApp, genericApp]);
      expect(wrapper.vm.filteredExternalServices).toEqual([singleApp, genericApp]);
      expect(wrapper.vm.filteredEcommerceApps).toEqual([singleApp, genericApp]);
      expect(wrapper.vm.filteredBiApps).toEqual(wrapper.vm.biApps);
    });

    it('should return empty array if there were no apps from store', async () => {
      const { wrapper, store } = await mountComponent();
      store.state.appType.allAppTypes = null;
      store.state.externals.externalServicesList = null;
      store.state.ecommerce.ecommerceAppsList = null;

      expect(wrapper.vm.filteredApps).toEqual([]);
      expect(wrapper.vm.filteredExternalServices).toEqual([]);
      expect(wrapper.vm.filteredEcommerceApps).toEqual([]);
    });
  });

  describe('hasAnyVisibleApp', () => {
    it('should return true if there are any visible app', async () => {
      const { wrapper } = await mountComponent();
      wrapper.vm.searchTerm = 'weni';

      expect(wrapper.vm.hasAnyVisibleApp).toBeTruthy();
    });

    it('should return false if there are no visible app', async () => {
      const { wrapper } = await mountComponent();
      wrapper.vm.searchTerm = 'unexisting app';

      expect(wrapper.vm.hasAnyVisibleApp).toBeFalsy();
    });
  });
});
