import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import wppCloudSetup from '@/components/config/channels/whatsapp/Setup.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('whatsapp/Setup.vue', () => {
  let wrapper;
  let state;
  let wppCloudState;
  let wppCloudActions;
  let store;

  beforeEach(() => {
    const customData = {
      input_token: '123',
    };

    state = {
      auth: {
        project: '123',
      },
    };

    wppCloudState = {
      wabaId: null,
      businessId: null,
      whatsAppPhoneNumbers: [{ display_phone_number: '123', verified_name: 'number', id: 1 }],
      selectedPhoneNumber: null,

      loadingDebugToken: false,
      errorDebugToken: false,

      loadingPhoneNumbers: false,
      errorPhoneNumbers: false,

      loadingWhatsAppCloudConfigure: false,
      errorCloudConfigure: false,
    };

    wppCloudActions = {
      setSelectedPhoneNumber: jest.fn(),
      configurePhoneNumber: jest.fn(),
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

    store = new Vuex.Store({
      modules: {
        WhatsAppCloud: {
          namespaced: true,
          actions: wppCloudActions,
          state: wppCloudState,
        },
      },
      state,
    });

    wrapper = shallowMount(wppCloudSetup, {
      localVue,
      i18n,
      store,
      propsData: {
        app: singleApp,
        customData,
      },
      mocks: {
        $t: () => 'some specific text',
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('closePopUp()', () => {
    it('should call parent closePopUp()', () => {
      expect(wrapper.emitted('closePopUp')).toBeFalsy();
      wrapper.vm.closePopUp();
      expect(wrapper.emitted('closePopUp')).toBeTruthy();
    });
  });

  describe('changeLoginState', () => {
    it('should set onLogin to desired state', () => {
      expect(wrapper.vm.onLogin).toEqual(false);
      wrapper.vm.changeLoginState(true);
      expect(wrapper.vm.onLogin).toEqual(true);
    });
  });

  describe('createChannel()', () => {
    it('should change url into /apps/my', async () => {
      const spy = spyOn(wrapper.vm.$router, 'replace');
      await wrapper.vm.createChannel();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(`/apps/my`);
    });

    it('should call configurePhoneNumber', async () => {
      expect(wppCloudActions.configurePhoneNumber).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(wppCloudActions.configurePhoneNumber).toHaveBeenCalledTimes(1);
    });

    it('should call callErrorModal on error', async () => {
      store.state.WhatsAppCloud.errorCloudConfigure = true;
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call configurePhoneNumber if loadingWhatsAppCloudConfigure is defined', async () => {
      store.state.WhatsAppCloud.loadingWhatsAppCloudConfigure = true;
      expect(wppCloudActions.configurePhoneNumber).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(wppCloudActions.configurePhoneNumber).not.toHaveBeenCalled();
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
