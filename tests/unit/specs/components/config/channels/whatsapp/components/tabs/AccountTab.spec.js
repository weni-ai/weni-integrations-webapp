import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';
jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import AccountTab from '@/components/config/channels/whatsapp/components/tabs/AccountTab.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

// Global mock
window.open = jest.fn(() => {
  return {
    focus: jest.fn(),
  };
});

const mountComponent = async ({
  configuredApps = [{ code: 'vtex', uuid: '123' }],
  loadingConnectVtexCatalog = false,
  errorConnectVtexCatalog = null,
  hasCatalog = false,
} = {}) => {
  const state = {
    auth: {
      project: 'project_123',
    },
    myApps: {
      configuredApps,
    },
  };

  const actions = {
    getConfiguredApps: jest.fn(),
  };

  const ecommerceState = {
    loadingConnectVtexCatalog,
    errorConnectVtexCatalog,
  };

  const ecommerceActions = {
    connectVtexCatalog: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      ecommerce: {
        namespaced: true,
        actions: ecommerceActions,
        state: ecommerceState,
      },
    },
    actions,
    state,
  });

  const wrapper = mount(AccountTab, {
    localVue,
    i18n,
    store,
    mocks: {
      $router: {
        push: jest.fn(),
      },
    },
    propsData: {
      appInfo: {
        code: 'vtex',
        uuid: '123',
        config: {
          phone_number: {
            display_phone_number: '+5511999999999',
            display_name: 'Number Name',
            default_template_language: 'pt-BR',
            certificate: 'certificateData',
            consent_status: 'status',
          },
          waba: {
            name: 'Waba name',
            message_behalf_name: 'on behalf name',
            timezone: 'America/Sao_Paulo',
            id: '123',
            namespace: '123123123123123',
          },
        },
      },
      hasCatalog,
    },
  });

  await wrapper.vm.$nextTick();

  return { wrapper, actions, state, ecommerceActions };
};

describe('whatsapp/components/tabs/AccountTab.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();

    expect(wrapper).toMatchSnapshot();
  });

  describe('emitClose()', () => {
    it('should emit close event', async () => {
      const { wrapper } = await mountComponent();

      expect(wrapper.emitted('close')).toBeFalsy();
      wrapper.vm.emitClose();
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('appConfig', () => {
    it('should return app config attribute', async () => {
      const { wrapper } = await mountComponent();

      expect(wrapper.vm.appConfig).toBe(wrapper.vm.appInfo.config);
    });

    it('should return empty if appInfo is undefined', async () => {
      const { wrapper } = await mountComponent();

      await wrapper.setProps({ appInfo: undefined });
      expect(wrapper.vm.appConfig).toEqual({
        phone_number: {},
        certificate: null,
        default_template_language: null,
        consent_status: null,
      });
    });
  });

  describe('wabaInfo', () => {
    it('should return waba config attribute', async () => {
      const { wrapper } = await mountComponent();
      expect(wrapper.vm.wabaInfo).toBe(wrapper.vm.appInfo.config.waba);
    });

    it('should return empty if appInfo is undefined', async () => {
      const { wrapper } = await mountComponent();
      await wrapper.setProps({ appInfo: undefined });
      expect(wrapper.vm.wabaInfo).toEqual({});
    });
  });

  describe('navigateToTemplates()', () => {
    it('should change route to templates', async () => {
      const { wrapper } = await mountComponent();

      const spy = spyOn(wrapper.vm.$router, 'push');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.navigateToTemplates();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        path: `/apps/my/${wrapper.vm.appInfo.code}/${wrapper.vm.appInfo.uuid}/templates`,
      });
    });
  });

  describe('handleCatalogButtonClick()', () => {
    it('should change route to catalogs', async () => {
      const { wrapper } = await mountComponent({ hasCatalog: true });

      const spy = spyOn(wrapper.vm.$router, 'push');
      expect(spy).not.toHaveBeenCalled();

      const button = wrapper.findComponent({ ref: 'catalogButton' });
      await button.trigger('click');

      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        path: `/apps/my/${wrapper.vm.appInfo.code}/${wrapper.vm.appInfo.uuid}/catalogs`,
      });
    });

    it('should open connect catalog modal', async () => {
      const { wrapper } = await mountComponent();

      expect(wrapper.vm.showCreateCatalogModal).toBe(false);

      const button = wrapper.findComponent({ ref: 'catalogButton' });
      await button.trigger('click');

      expect(wrapper.vm.showCreateCatalogModal).toBe(true);
    });
  });

  describe('handleCatalogCreateModalContinue', () => {
    it('should start vtex catalog connection', async () => {
      const { wrapper } = await mountComponent();

      const button = wrapper.findComponent({ ref: 'catalogButton' });
      await button.trigger('click');

      expect(wrapper.vm.showConnectCatalogModal).toBe(false);

      const createCatalogModalContent = wrapper.findComponent({ ref: 'createCatalogModalContent' });
      await createCatalogModalContent.vm.$emit('createCatalog', 'vtex');

      expect(wrapper.vm.showConnectCatalogModal).toBe(true);
    });

    it('should start meta catalog connection', async () => {
      const { wrapper } = await mountComponent();

      const button = wrapper.findComponent({ ref: 'catalogButton' });
      await button.trigger('click');

      expect(wrapper.vm.showConnectCatalogModal).toBe(false);

      const createCatalogModalContent = wrapper.findComponent({ ref: 'createCatalogModalContent' });
      await createCatalogModalContent.vm.$emit('createCatalog', 'meta');

      expect(wrapper.vm.showConnectCatalogModal).toBe(false);

      expect(window.open).toHaveBeenCalledTimes(1);

      expect(wrapper.vm.showCreateCatalogModal).toBe(false);
      expect(wrapper.vm.showConnectCatalogModal).toBe(false);
    });

    it('should do nothing if not expected type is given', async () => {
      const { wrapper } = await mountComponent();

      const button = wrapper.findComponent({ ref: 'catalogButton' });
      await button.trigger('click');

      expect(wrapper.vm.showCreateCatalogModal).toBe(true);
      expect(wrapper.vm.showConnectCatalogModal).toBe(false);

      const createCatalogModalContent = wrapper.findComponent({ ref: 'createCatalogModalContent' });
      await createCatalogModalContent.vm.$emit('createCatalog', 'unknown');

      expect(wrapper.vm.showCreateCatalogModal).toBe(true);
      expect(wrapper.vm.showConnectCatalogModal).toBe(false);
    });
  });

  describe('handleCatalogConnect', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call error modal if there is no vtex app', async () => {
      const { wrapper } = await mountComponent({ configuredApps: [] });

      const spy = spyOn(wrapper.vm, 'callAlert');
      expect(spy).not.toHaveBeenCalled();

      await wrapper.vm.handleCatalogConnect();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        type: 'Error',
        text: 'You need to have a VTEX app configured to connect a catalog.',
      });
    });

    it('should call connectVtexCatalog if vtexApp exists', async () => {
      const { wrapper, ecommerceActions } = await mountComponent();

      await wrapper.vm.$nextTick();

      const spy = spyOn(wrapper.vm, 'callAlert');
      expect(spy).not.toHaveBeenCalled();

      await wrapper.vm.handleCatalogConnect({ name: 'test' });

      expect(ecommerceActions.connectVtexCatalog).toHaveBeenCalledTimes(1);
      expect(ecommerceActions.connectVtexCatalog).toHaveBeenCalledWith(expect.any(Object), {
        code: 'vtex',
        appUuid: '123',
        payload: {
          name: 'test',
        },
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        type: 'Success',
        text: 'Successfully connected VTEX catalog',
      });
    });

    it('should call error modal if connectVtexCatalog fails', async () => {
      const { wrapper } = await mountComponent({ errorConnectVtexCatalog: true });

      const spy = spyOn(wrapper.vm, 'callAlert');
      expect(spy).not.toHaveBeenCalled();

      await wrapper.vm.handleCatalogConnect({ name: 'test' });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        type: 'Error',
        text: 'Could not connect VTEX catalog, please try again later',
      });
    });
  });

  describe('fetchVtexApp', () => {
    it('should call getConfiguredApps if there arent any in the store', async () => {
      const { actions } = await mountComponent({ configuredApps: null });

      expect(actions.getConfiguredApps).toHaveBeenCalledTimes(1);
      expect(actions.getConfiguredApps).toHaveBeenCalledWith(expect.any(Object), {
        params: {
          project_uuid: 'project_123',
        },
        skipLoading: true,
      });
    });
  });

  describe('callAlert', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call unnnicCallAlert with Success state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callAlert({ text: 'success', type: 'Success' });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'success',
          title: 'Success',
          icon: 'check-circle-1-1',
          scheme: 'feedback-green',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });

    it('should call unnnicCallAlert with Error state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callAlert({ text: 'error', type: 'Error' });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'error',
          title: 'Error',
          icon: 'alert-circle-1',
          scheme: 'feedback-red',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });
  });
});
