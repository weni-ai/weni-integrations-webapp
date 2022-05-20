import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';
jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ContactInfoTab from '@/components/config/channels/whatsapp/components/tabs/ContactInfoTab.vue';
import i18n from '@/utils/plugins/i18n';

import { singleApp } from '../../../../../../../../__mocks__/appMock';
import storeMock from '../../../../../../store/appType/whatsapp/__mocks__/store.js';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('whatsapp/components/tabs/ContactInfoTab.vue', () => {
  let wrapper;
  let actions;
  let getters;
  let store;

  beforeEach(() => {
    actions = {
      fetchWppContactInfo: jest.fn(),
      updateWppContactInfo: jest.fn(),
    };

    getters = {
      loadingContactInfo: jest.fn(),
      fetchedContactInfo: jest.fn(),
      contactInfo: jest.fn(() => storeMock.mockedContactInfo),
    };

    store = new Vuex.Store({
      modules: {
        WhatsApp: {
          namespaced: true,
          getters,
          actions,
        },
      },
    });

    wrapper = shallowMount(ContactInfoTab, {
      localVue,
      i18n,
      store,
      propsData: {
        app: singleApp,
      },
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        DynamicForm: true,
        UnnnicButton: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('mounted()', () => {
    it('should call unnnicCallAlert if fetchWppContactInfo fails', () => {
      actions.fetchWppContactInfo.mockImplementation(() => {
        throw new Error('error');
      });
      wrapper = shallowMount(ContactInfoTab, {
        localVue,
        i18n,
        store,
        propsData: {
          app: singleApp,
        },
        mocks: {
          $t: () => 'some specific text',
        },
        stubs: {
          DynamicForm: true,
          UnnnicButton: true,
        },
      });
      expect(mockUnnnicCallAlert).toHaveBeenCalled();
    });
  });

  describe('updateInputs()', () => {
    it('should set contact info input data correctly', async () => {
      const inputData = {
        index: 0,
        value: 'value',
      };
      expect(wrapper.vm.contactInfoInputs[inputData.index].value).not.toEqual(inputData.value);
      wrapper.vm.updateInputs(inputData);
      expect(wrapper.vm.contactInfoInputs[inputData.index].value).toEqual(inputData.value);
    });
  });

  describe('getInputValue()', () => {
    it('should return value from contactInfoInputs based on input name', () => {
      const inputName = 'address';
      expect(wrapper.vm.getInputValue(inputName)).toEqual(storeMock.mockedContactInfo.address);
    });
  });

  describe('saveContactInfo()', () => {
    it('should call updateWppContactInfo action', async () => {
      expect(actions.updateWppContactInfo).not.toHaveBeenCalled();
      await wrapper.vm.saveContactInfo();
      expect(actions.updateWppContactInfo).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      actions.updateWppContactInfo.mockImplementation(() => Promise.reject(new Error('error')));
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.saveContactInfo();
      expect(mockUnnnicCallAlert).toHaveBeenCalled();
    });
  });
});
