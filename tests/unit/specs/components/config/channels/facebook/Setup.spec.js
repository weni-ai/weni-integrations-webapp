import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import instagramSetup from '@/components/config/channels/facebook/Setup.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../../__mocks__/appMock';

singleApp.code = 'fba';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({ errorUpdateAppConfig = false, errorCreateApp = false } = {}) => {
  window.FB = {
    getUserID: jest.fn(),
  };

  const state = {
    auth: {
      project: '123',
    },
    appType: {
      errorUpdateAppConfig,
      errorCreateApp,
      createAppResponse: { uuid: '123' },
    },
  };

  const actions = {
    createApp: jest.fn(),
    updateAppConfig: jest.fn(),
  };

  const store = new Vuex.Store({
    actions,
    state,
  });

  const wrapper = shallowMount(instagramSetup, {
    localVue,
    i18n,
    store,
    propsData: {
      app: singleApp,
    },
    mocks: {
      $router: {
        replace: jest.fn(),
      },
      $route: {
        path: '/apps/1/details',
      },
    },
    stubs: {
      UnnnicModal: true,
      UnnnicButton: true,
      UnnnicSelect: true,
    },
  });

  return { wrapper, actions, state };
};

describe('components/config/channels/facebook/Setup.vue', () => {
  beforeEach(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should be rendered properly on page selections stage', async () => {
    const { wrapper } = await mountComponent();
    wrapper.vm.stage = 'select-page';
    await wrapper.vm.$nextTick();
    expect(wrapper).toMatchSnapshot();
  });

  describe(' ()', () => {
    it('should call parent closePopUp()', async () => {
      const { wrapper } = await mountComponent();
      expect(wrapper.emitted('closePopUp')).toBeFalsy();
      wrapper.vm.closePopUp();
      expect(wrapper.emitted('closePopUp')).toBeTruthy();
    });
  });

  describe('changeLoginState', () => {
    it('should set onLogin to desired state', async () => {
      const { wrapper } = await mountComponent();
      expect(wrapper.vm.onLogin).toEqual(false);
      wrapper.vm.changeLoginState(true);
      expect(wrapper.vm.onLogin).toEqual(true);
    });
  });

  describe('handlePageSelection', () => {
    it('should set selected page and increase select key', async () => {
      const { wrapper } = await mountComponent();
      expect(wrapper.vm.selectedPage).not.toEqual(2);
      expect(wrapper.vm.selectKey).not.toEqual(1);
      wrapper.vm.handlePageSelection(2);
      expect(wrapper.vm.selectedPage).toEqual(2);
      expect(wrapper.vm.selectKey).toEqual(1);
    });
  });

  describe('createChannel()', () => {
    it('should call callModal if page was not found', async () => {
      const { wrapper } = await mountComponent();
      wrapper.vm.pageList = [{ id: 1 }, { id: 2 }];
      wrapper.vm.selectedPage = 3;
      const spy = spyOn(wrapper.vm, 'callModal');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call createApp if page was not found', async () => {
      const { wrapper, actions } = await mountComponent();
      wrapper.vm.pageList = [{ id: 1 }, { id: 2 }];
      wrapper.vm.selectedPage = 3;
      expect(actions.createApp).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(actions.createApp).not.toHaveBeenCalled();
    });

    it('should call createApp if page was found', async () => {
      const { wrapper, actions } = await mountComponent();
      wrapper.vm.pageList = [{ id: 1 }, { id: 2 }];
      wrapper.vm.selectedPage = 2;
      expect(actions.createApp).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(actions.createApp).toHaveBeenCalled();
    });

    it('should call callModal on errorCreateApp', async () => {
      const { wrapper } = await mountComponent({ errorCreateApp: true });
      wrapper.vm.pageList = [{ id: 1 }, { id: 2 }];
      wrapper.vm.selectedPage = 2;
      const spy = spyOn(wrapper.vm, 'callModal');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call updateAppConfig if failed to create app', async () => {
      const { wrapper, actions } = await mountComponent({ errorCreateApp: true });
      wrapper.vm.pageList = [{ id: 1 }, { id: 2 }];
      wrapper.vm.selectedPage = 2;
      expect(actions.updateAppConfig).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(actions.updateAppConfig).not.toHaveBeenCalled();
    });

    it('should call updateAppConfig', async () => {
      const { wrapper, actions } = await mountComponent();
      wrapper.vm.pageList = [{ id: 1 }, { id: 2 }];
      wrapper.vm.selectedPage = 2;
      expect(actions.updateAppConfig).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(actions.updateAppConfig).toHaveBeenCalledTimes(1);
    });

    it('should call callModal on errorUpdateAppConfig', async () => {
      const { wrapper } = await mountComponent({ errorUpdateAppConfig: true });
      wrapper.vm.pageList = [{ id: 1 }, { id: 2 }];
      wrapper.vm.selectedPage = 2;
      const spy = spyOn(wrapper.vm, 'callModal');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should change url into /apps/my', async () => {
      const { wrapper } = await mountComponent();
      wrapper.vm.pageList = [{ id: 1 }, { id: 2 }];
      wrapper.vm.selectedPage = 2;
      const spy = spyOn(wrapper.vm.$router, 'replace');
      await wrapper.vm.createChannel();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(`/apps/my`);
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
