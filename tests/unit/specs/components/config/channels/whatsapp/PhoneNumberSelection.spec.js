import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import PhoneNumberSelection from '@/components/config/channels/whatsapp/PhoneNumberSelection.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('whatsapp/PhoneNumberSelection.vue', () => {
  let wrapper;
  let actions;
  let wppCloudGetters;
  let wppCloudActions;
  let store;

  beforeEach(() => {
    const customData = {
      pages: [
        { id: 1, name: 'page1' },
        { id: 2, name: 'page2' },
      ],
    };

    actions = {
      getApp: jest.fn(() => {
        return { data: singleApp };
      }),
      fetchWppProfile: jest.fn(() => {
        return { data: { photo_url: 'photo' } };
      }),
    };

    wppCloudGetters = {
      whatsAppPhoneNumbers: jest.fn(() => {
        return [];
      }),
      selectedPhoneNumber: jest.fn(() => {
        return { data: {} };
      }),
      wabaId: jest.fn(() => {
        return { data: {} };
      }),
      businessId: jest.fn(() => {
        return { data: {} };
      }),
    };

    wppCloudActions = {
      setSelectedPhoneNumber: jest.fn(),
      configurePhoneNumber: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        WhatsAppCloud: {
          namespaced: true,
          actions: wppCloudActions,
          getters: wppCloudGetters,
        },
      },
      actions,
    });

    wrapper = shallowMount(PhoneNumberSelection, {
      localVue,
      i18n,
      router,
      store,
      propsData: {
        app: singleApp,
        customData,
      },
      mocks: {
        $t: () => 'some specific text',
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('closePopUp()', () => {
    it('should set showModal opposite', () => {
      wrapper.setData({ showModal: true });
      expect(wrapper.vm.showModal).toBeTruthy();
      wrapper.vm.closePopUp();
      expect(wrapper.vm.showModal).toBeFalsy();
    });

    it('should call parent closePopUp()', () => {
      expect(wrapper.emitted('closePopUp')).toBeFalsy();
      wrapper.vm.closePopUp();
      expect(wrapper.emitted('closePopUp')).toBeTruthy();
    });
  });

  describe('selectedNumberWatcher', () => {
    it('should call setSelectedPhoneNumber', async () => {
      expect(wppCloudActions.setSelectedPhoneNumber).not.toHaveBeenCalled();
      await wrapper.setData({ selectedNumber: 'number ~ (123)' });
      expect(wppCloudActions.setSelectedPhoneNumber).toHaveBeenCalledTimes(1);
    });
  });

  describe('beforeDestroy()', () => {
    it('should call setSelectedPhoneNumber', async () => {
      expect(wppCloudActions.setSelectedPhoneNumber).not.toHaveBeenCalled();
      await wrapper.destroy();
      expect(wppCloudActions.setSelectedPhoneNumber).toHaveBeenCalledTimes(1);
    });
  });

  describe('createChannel()', () => {
    it('should change url into /apps/my', async () => {
      expect(wrapper.vm.$route.path).not.toEqual('/apps/my');
      await wrapper.vm.createChannel();
      expect(wrapper.vm.$route.path).toEqual('/apps/my');
    });

    it('should call configurePhoneNumber', async () => {
      expect(wppCloudActions.configurePhoneNumber).not.toHaveBeenCalled();
      await wrapper.vm.createChannel();
      expect(wppCloudActions.configurePhoneNumber).toHaveBeenCalledTimes(1);
    });
  });
});
