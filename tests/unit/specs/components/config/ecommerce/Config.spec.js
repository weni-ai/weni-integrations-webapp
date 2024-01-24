import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Config from '@/components/config/ecommerce/vtex/Config.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../__mocks__/appMock';
import '@weni/unnnic-system';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

const mountComponent = async ({
  errorConnectVtexCatalog = false,
  hasConnectedCatalog = true,
  currentApp = { code: 'wpp-cloud', uuid: '123', config: { title: 'title' } },
  errorCurrentApp = false,
} = {}) => {
  const state = {
    auth: {
      project: '123',
    },
    appType: {
      currentApp,
      loadingCurrentApp: false,
      errorCurrentApp,
    },
  };

  const actions = {
    updateApp: jest.fn(),
    getApp: jest.fn(),
  };

  const ecommerceState = {
    loadingConnectVtexCatalog: false,
    errorConnectVtexCatalog,
  };

  const ecommerceActions = {
    connectVtexCatalog: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      ecommerce: {
        namespaced: true,
        state: ecommerceState,
        actions: ecommerceActions,
      },
    },
    state,
    actions,
  });

  const wrapper = mount(Config, {
    localVue,
    i18n,
    store,
    router,
    propsData: {
      app: {
        ...singleApp,
        code: 'vtex',
        config: {
          api_credentials: {
            domain: 'https://weni.ai',
          },
          wpp_cloud_uuid: 'wpp-123',
          connected_catalog: hasConnectedCatalog,
        },
      },
    },
  });

  await wrapper.vm.$nextTick();

  return { wrapper, state, actions, ecommerceActions, ecommerceState };
};

describe('components/config/ecommerce/vtex/Config.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should close modal', async () => {
    const { wrapper } = await mountComponent();

    const closeButton = wrapper.findComponent({ ref: 'closeButton' });
    await closeButton.trigger('click');

    expect(wrapper.emitted('closeModal')).toBeTruthy();
  });

  it('should render view catalog if it has a connected catalog', async () => {
    const { wrapper } = await mountComponent();

    const viewCatalogButton = wrapper.findComponent({ ref: 'viewButton' });
    const connectCatalogButton = wrapper.findComponent({ ref: 'connectButton' });

    expect(viewCatalogButton.exists()).toBeTruthy();
    expect(connectCatalogButton.exists()).toBeFalsy();
  });

  it('should render connect catalog if it does not have a connected catalog', async () => {
    const { wrapper } = await mountComponent({ hasConnectedCatalog: false });

    const viewCatalogButton = wrapper.findComponent({ ref: 'viewButton' });
    const connectCatalogButton = wrapper.findComponent({ ref: 'connectButton' });

    expect(connectCatalogButton.exists()).toBeTruthy();
    expect(viewCatalogButton.exists()).toBeFalsy();
  });

  it('should open connect catalog modal', async () => {
    const { wrapper } = await mountComponent({ hasConnectedCatalog: false });

    expect(wrapper.vm.showConnectModal).toBeFalsy();

    const connectCatalogButton = wrapper.findComponent({ ref: 'connectButton' });
    await connectCatalogButton.trigger('click');

    expect(wrapper.vm.showConnectModal).toBeTruthy();
  });

  it('should call connectVtexCatalog action', async () => {
    const { wrapper, actions, ecommerceActions } = await mountComponent({
      hasConnectedCatalog: false,
    });

    const connectCatalogButton = wrapper.findComponent({ ref: 'connectButton' });
    await connectCatalogButton.trigger('click');

    expect(ecommerceActions.connectVtexCatalog).not.toHaveBeenCalled();

    const connectCatalogModalContent = wrapper.findComponent({ ref: 'connectCatalogModalContent' });
    connectCatalogModalContent.vm.$emit('connectCatalog', {
      name: 'test',
      businessType: 'other',
    });

    await wrapper.vm.$nextTick();

    expect(ecommerceActions.connectVtexCatalog).toHaveBeenCalled();
    expect(ecommerceActions.connectVtexCatalog).toHaveBeenCalledWith(expect.anything(), {
      code: 'wpp-cloud',
      appUuid: 'wpp-123',
      payload: {
        name: 'test',
      },
    });

    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

    expect(actions.getApp).toHaveBeenCalled();
    expect(actions.getApp).toHaveBeenCalledWith(expect.anything(), {
      code: 'vtex',
      appUuid: '123',
    });
  });

  it('should call alert if get app fails action', async () => {
    const { wrapper, actions } = await mountComponent({
      hasConnectedCatalog: false,
      errorCurrentApp: true,
    });

    const connectCatalogButton = wrapper.findComponent({ ref: 'connectButton' });
    await connectCatalogButton.trigger('click');

    const connectCatalogModalContent = wrapper.findComponent({ ref: 'connectCatalogModalContent' });
    connectCatalogModalContent.vm.$emit('connectCatalog', {
      name: 'test',
      businessType: 'other',
    });

    await wrapper.vm.$nextTick();

    expect(actions.getApp).toHaveBeenCalled();
    expect(actions.getApp).toHaveBeenCalledWith(expect.anything(), {
      code: 'vtex',
      appUuid: '123',
    });

    await wrapper.vm.$nextTick();

    expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'Failed to fetch catalog status, please try again later.',
        title: 'Error',
        icon: 'alert-circle-1',
        scheme: 'feedback-red',
        closeText: 'Close',
        position: 'bottom-right',
      },
      seconds: 6,
    });
  });

  it('should call error modal on connect error', async () => {
    const { wrapper } = await mountComponent({
      hasConnectedCatalog: false,
      errorConnectVtexCatalog: true,
    });

    const connectCatalogButton = wrapper.findComponent({ ref: 'connectButton' });
    await connectCatalogButton.trigger('click');

    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

    const connectCatalogModalContent = wrapper.findComponent({ ref: 'connectCatalogModalContent' });
    connectCatalogModalContent.vm.$emit('connectCatalog', {
      name: 'test',
      businessType: 'other',
    });

    await wrapper.vm.$nextTick();

    expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'Could not connect VTEX catalog, please try again later',
        title: 'Error',
        icon: 'alert-circle-1',
        scheme: 'feedback-red',
        closeText: 'Close',
        position: 'bottom-right',
      },
      seconds: 6,
    });
  });

  describe('fetchRelatedWppData', () => {
    it('should fetch related wpp data and store its uuid and title', async () => {
      const { wrapper } = await mountComponent();

      await wrapper.vm.fetchRelatedWppData();

      expect(wrapper.vm.wpp_uuid).toBe('123');
      expect(wrapper.vm.wpp_number).toBe('title');
    });

    it('should not set wpp_uuid and wpp_number if there is an error', async () => {
      const { wrapper } = await mountComponent({
        errorCurrentApp: true,
      });

      await wrapper.vm.fetchRelatedWppData();

      expect(wrapper.vm.wpp_uuid).toBeNull();
      expect(wrapper.vm.wpp_number).toBeNull();

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'Failed to fetch related WhatsApp Number information',
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

  describe('redirectToWppCatalog', () => {
    it('redirects to the correct path when wpp_uuid is present', async () => {
      const { wrapper } = await mountComponent();

      await wrapper.vm.$nextTick();

      wrapper.vm.redirectToWppCatalog();
      expect(wrapper.vm.$route.path).toBe('/apps/my/wpp-cloud/123/catalogs');
    });

    it('calls callModal when wpp_uuid is not present', async () => {
      const { wrapper } = await mountComponent({ errorCurrentApp: true });

      await wrapper.vm.$nextTick();

      wrapper.vm.redirectToWppCatalog();
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'Failed to redirect to catalog, please refresh the page and try again',
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

  describe('callModal', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call unnnicCallAlert with Success state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callModal({ text: 'success', type: 'Success' });

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

      wrapper.vm.callModal({ text: 'error', type: 'Error' });

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
