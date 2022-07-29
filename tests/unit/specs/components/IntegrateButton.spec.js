jest.mock('@/api/appType', () => {
  return {
    createApp: jest.fn(),
  };
});

import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import IntegrateButton from '@/components/IntegrateButton.vue';
import addModal from '@/components/AddModal.vue';
import ConfigPopUp from '@/components/config/ConfigPopUp.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('IntegrateButton.vue', () => {
  let wrapper, actions, getters, state, store;

  beforeEach(() => {
    actions = {
      createApp: jest.fn(() => {}),
    };

    getters = {
      getSelectedProject: jest.fn(() => {
        return '123';
      }),
    };

    state = {
      appType: {
        createAppResponse: null,
        errorCreateApp: false,
      },
    };

    store = new Vuex.Store({
      actions,
      getters,
      state,
    });

    wrapper = mount(IntegrateButton, {
      localVue,
      store,
      i18n,
      router,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
        UnnnicModal: true,
        ConfigPopUp,
        addModal,
      },
      propsData: {
        app: singleApp,
        icon: 'add-1',
        disabled: false,
        text: 'Add',
        size: 'large',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call addApp on button click', async () => {
    const spy = spyOn(wrapper.vm, 'addApp');
    expect(spy).not.toHaveBeenCalled();

    const button = wrapper.findComponent({ ref: 'button' });
    button.vm.$emit('clicked', { stopPropagation: () => {} });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(wrapper.props('app'));
  });

  describe('created()', () => {
    it('should add fetchDebugToken into DOM', async () => {
      expect(window.fetchDebugToken).toEqual(wrapper.vm.fetchDebugToken);
    });

    it('should add fetchPhoneNumbers into DOM', async () => {
      expect(window.fetchPhoneNumbers).toEqual(wrapper.vm.fetchPhoneNumbers);
    });
  });

  describe('addApp()', () => {
    it('should call facebookLogin if app code is wpp-cloud', async () => {
      const spy = spyOn(wrapper.vm, 'facebookLoginAppCreation');
      expect(spy).not.toHaveBeenCalled();
      const app = {
        code: 'wpp-cloud',
      };
      await wrapper.vm.addApp(app);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call createApp method', async () => {
      expect(actions.createApp).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(actions.createApp).toHaveBeenCalledTimes(1);
      expect(actions.createApp).toHaveBeenCalledWith(expect.any(Object), {
        code: app.code,
        payload: expect.any(Object),
      });
    });

    it('should call unnnicCallAlert on error', async () => {
      store.state.appType.errorCreateApp = true;
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      expect(spy).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call toggleModal if design not popup', async () => {
      const spy = spyOn(wrapper.vm.$refs.addModal, 'toggleModal');
      expect(spy).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call openPopUp if design is popup', async () => {
      const spy = spyOn(wrapper.vm.$refs.configPopUp, 'openPopUp');
      const appConfig = {
        config: {
          redirect_url: 'https://url.com',
        },
      };
      actions.createApp.mockImplementation(() => {
        return Promise.resolve({
          data: appConfig,
        });
      });
      store.state.appType.createAppResponse = appConfig;
      expect(spy).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'popup',
      };
      await wrapper.vm.addApp(app);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('openWACloudPopUp()', () => {
    it('should call openPopUp with parameter token', () => {
      const spy = spyOn(wrapper.vm.$refs.configPopUp, 'openPopUp');
      expect(spy).not.toHaveBeenCalled();
      const token = '123';
      wrapper.vm.openWACloudPopUp(wrapper.vm.app, token);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(wrapper.vm.app, { input_token: token });
    });
  });

  describe('callErrorModal', () => {
    it('should call unnnicCallAlert', () => {
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      wrapper.vm.callErrorModal({ text: 'error text' });
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'error text',
            title: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });
  });
});
