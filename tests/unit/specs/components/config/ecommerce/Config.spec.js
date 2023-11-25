import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Config from '@/components/config/ecommerce/vtex/Config.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../__mocks__/appMock';
import '@weni/unnnic-system';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  errorConnectVtexCatalog = false,
  hasConnectedCatalog = true,
} = {}) => {
  const state = {
    auth: {
      project: '123',
    },
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
  });

  const wrapper = mount(Config, {
    localVue,
    i18n,
    store,
    propsData: {
      app: {
        ...singleApp,
        code: 'vtex',
        config: {
          api_credentials: {
            domain: 'https://weni.ai',
          },
        },
        hasConnectedCatalog,
      },
    },
  });

  return { wrapper, state, ecommerceActions, ecommerceState };
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
    const { wrapper, ecommerceActions } = await mountComponent({ hasConnectedCatalog: false });

    const connectCatalogButton = wrapper.findComponent({ ref: 'connectButton' });
    await connectCatalogButton.trigger('click');

    expect(ecommerceActions.connectVtexCatalog).not.toHaveBeenCalled();

    const connectCatalogModalContent = wrapper.findComponent({ ref: 'connectCatalogModalContent' });
    connectCatalogModalContent.vm.$emit('connectCatalog', {
      name: 'test',
      businessType: 'other',
    });

    expect(ecommerceActions.connectVtexCatalog).toHaveBeenCalled();
    expect(ecommerceActions.connectVtexCatalog).toHaveBeenCalledWith(expect.anything(), {
      code: 'vtex',
      appUuid: '123',
      payload: {
        name: 'test',
        businessType: 'other',
      },
    });

    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
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
