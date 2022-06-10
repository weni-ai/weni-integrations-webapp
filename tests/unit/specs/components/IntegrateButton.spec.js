jest.mock('@/api/appType', () => {
  return {
    createApp: jest.fn(),
    getSharedWabas: jest.fn(),
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
  let wrapper, actions, getters, store, whatsAppCloudActions, whatsAppCloudGetters;

  beforeEach(() => {
    actions = {
      createApp: jest.fn(() => {}),
      getSharedWabas: jest.fn(() => []),
    };

    getters = {
      getSelectedProject: jest.fn(() => {
        return '123';
      }),
    };

    whatsAppCloudActions = {
      getDebugToken: jest.fn(() =>
        Promise.resolve({
          data: {
            waba_id: 'waba_id_123',
            business_id: 'business_id_123',
          },
        }),
      ),
      getWhatsAppPhoneNumbers: jest.fn(() =>
        Promise.resolve({
          data: [{ id: 1 }, { id: 2 }],
        }),
      ),
    };

    whatsAppCloudGetters = {
      wabaId: jest.fn(() => 'waba_id_123'),
      whatsAppPhoneNumbers: jest.fn(() => [{ id: 1 }, { id: 2 }]),
    };

    store = new Vuex.Store({
      modules: {
        WhatsAppCloud: {
          namespaced: true,
          actions: whatsAppCloudActions,
          getters: whatsAppCloudGetters,
        },
      },
      actions,
      getters,
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
    button.vm.$emit('click', { stopPropagation: () => {} });

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

    it('should call getSelectedProject getter', async () => {
      expect(getters.getSelectedProject).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(getters.getSelectedProject).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      actions.createApp.mockImplementation(() => {
        throw new Error('error fetching');
      });
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
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
      actions.createApp.mockImplementation(() => {
        return Promise.resolve({
          data: {
            config: {
              redirect_url: 'https://url.com',
            },
          },
        });
      });
      expect(spy).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'popup',
      };
      await wrapper.vm.addApp(app);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchDebugToken', () => {
    it('should call fetchDebugToken action', async () => {
      const token = '123';

      expect(whatsAppCloudActions.getDebugToken).not.toHaveBeenCalled();
      await wrapper.vm.fetchDebugToken(token);
      expect(whatsAppCloudActions.getDebugToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchPhoneNumbers', () => {
    it('should call getWhatsAppPhoneNumbers action', async () => {
      const token = '123';

      expect(whatsAppCloudActions.getWhatsAppPhoneNumbers).not.toHaveBeenCalled();
      await wrapper.vm.fetchPhoneNumbers(token);
      expect(whatsAppCloudActions.getWhatsAppPhoneNumbers).toHaveBeenCalledTimes(1);
    });
  });
});
