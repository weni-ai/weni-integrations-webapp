import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';
jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import {
  getHeightAndWidthFromDataUrl as mockGetHeightAndWidthFromDataUrl,
  toBase64 as mockToBase64,
} from '@/utils/files';
jest.mock('@/utils/files', () => ({
  ...jest.requireActual('@/utils/files'),
  getHeightAndWidthFromDataUrl: jest.fn(),
  toBase64: jest.fn(),
}));

jest.mock('@/api/appType', () => {
  return {
    deleteWppProfilePhoto: jest.fn(),
  };
});

import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ProfileTab from '@/components/config/channels/whatsapp/components/tabs/ProfileTab.vue';
import { singleApp } from '../../../../../../../../__mocks__/appMock';
import storeMock from '../../../../../../store/appType/whatsapp/__mocks__/store.js';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('whatsapp/components/tabs/ProfileTab.vue', () => {
  let wrapper;
  let actions;
  let getters;
  let store;

  beforeEach(() => {
    actions = {
      updateWppProfile: jest.fn(),
      deleteWppProfilePhoto: jest.fn(),
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

    wrapper = shallowMount(ProfileTab, {
      localVue,
      store,
      i18n,
      stubs: {
        DynamicForm: true,
        UnnnicButton: true,
      },
      propsData: {
        app: singleApp,
        profile: {
          photoFile: 'photo',
          status: 'status',
          business: {
            description: 'description',
            vertical: 'option1',
            vertical_choices: ['option1', 'option2'],
          },
        },
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
      wrapper = shallowMount(ProfileTab, {
        localVue,
        i18n,
        store,
        propsData: {
          app: singleApp,
          profile: {
            photoFile: 'photo',
            status: 'status',
            business: {
              description: 'description',
              vertical: 'option1',
              vertical_choices: ['option1', 'option2'],
            },
          },
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

  describe('updateProfileInputs()', () => {
    it('should set profile info input data correctly', async () => {
      const inputData = {
        index: 0,
        value: 'value',
      };
      expect(wrapper.vm.profileInputs[inputData.index].value).not.toEqual(inputData.value);
      wrapper.vm.updateProfileInputs(inputData);
      expect(wrapper.vm.profileInputs[inputData.index].value).toEqual(inputData.value);
    });
  });

  describe('updateContactInfoInputs()', () => {
    it('should set contact info input data correctly', async () => {
      const inputData = {
        index: 0,
        value: 'value',
      };
      expect(wrapper.vm.contactInfoInputs[inputData.index].value).not.toEqual(inputData.value);
      wrapper.vm.updateContactInfoInputs(inputData);
      expect(wrapper.vm.contactInfoInputs[inputData.index].value).toEqual(inputData.value);
    });
  });

  describe('profileInputs', () => {
    it('should set modifiedInitialPhoto as true if profile_image was modified', async () => {
      expect(wrapper.vm.modifiedInitialPhoto).toBeFalsy();
      wrapper.vm.updateProfileInputs({ index: 0, value: [{ lastModified: 123 }] });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.modifiedInitialPhoto).toBeTruthy();
    });

    it('should set modifiedInputs as true if it hadInitialModified', async () => {
      wrapper.vm.hadInitialModified = true;
      wrapper.vm.updateProfileInputs({ index: 0, value: [{ lastModified: 123 }] });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.modifiedInputs).toBeTruthy();
    });
  });

  describe('contactInfoInputs', () => {
    it('should set modifiedInputs as true if it hadInitialModified', async () => {
      wrapper.vm.hadInitialModified = true;
      wrapper.vm.updateContactInfoInputs({ index: 0, value: '123' });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.modifiedInputs).toBeTruthy();
    });
  });

  describe('isValidPhotoSize', () => {
    it('should return false if image height or width <= 192 and initial photo was modified', async () => {
      mockGetHeightAndWidthFromDataUrl.mockImplementation(() => {
        return Promise.resolve({
          width: 100,
          height: 100,
        });
      });
      await wrapper.setData({ modifiedInitialPhoto: true });
      const image = 'image';
      const isValid = await wrapper.vm.isValidPhotoSize(image);
      expect(isValid).toBe(false);
    });

    it('should return true if initial photo was not modified', async () => {
      mockGetHeightAndWidthFromDataUrl.mockImplementation(() => {
        return Promise.resolve({
          width: 100,
          height: 100,
        });
      });
      await wrapper.setData({ modifiedInitialPhoto: false });
      const image = 'image';
      const isValid = await wrapper.vm.isValidPhotoSize(image);
      expect(isValid).toBe(true);
    });

    it('should return true if initial photo was modified and width and height >= 192', async () => {
      mockGetHeightAndWidthFromDataUrl.mockImplementation(() => {
        return Promise.resolve({
          width: 192,
          height: 192,
        });
      });
      await wrapper.setData({ modifiedInitialPhoto: true });
      const image = 'image';
      const isValid = await wrapper.vm.isValidPhotoSize(image);
      expect(isValid).toBe(true);
    });
  });

  describe('handleSave', () => {
    it('should call saveProfile and saveContactInfo', () => {
      wrapper.vm.saveProfile = jest.fn();
      wrapper.vm.saveContactInfo = jest.fn();
      wrapper.vm.handleSave();
      expect(wrapper.vm.saveProfile).toHaveBeenCalled();
      expect(wrapper.vm.saveContactInfo).toHaveBeenCalled();
    });
  });

  describe('saveProfile()', () => {
    it('should call deleteWppProfilePhoto if no photo is provided', async () => {
      wrapper = shallowMount(ProfileTab, {
        localVue,
        store,
        i18n,
        mocks: {
          $t: () => 'some specific text',
        },
        stubs: {
          DynamicForm: true,
          UnnnicButton: true,
        },
        propsData: {
          app: singleApp,
          profile: {
            photoFile: null,
            status: 'status',
            business: {
              description: 'description',
              vertical: 'option1',
              vertical_choices: ['option1', 'option2'],
            },
          },
        },
      });
      expect(actions.deleteWppProfilePhoto).not.toHaveBeenCalled();
      await wrapper.vm.saveProfile();
      expect(actions.deleteWppProfilePhoto).toHaveBeenCalledTimes(1);
    });

    it('should throw error if deleteWppProfilePhoto fails', async () => {
      wrapper = shallowMount(ProfileTab, {
        localVue,
        store,
        i18n,
        stubs: {
          DynamicForm: true,
          UnnnicButton: true,
        },
        propsData: {
          app: singleApp,
          profile: {
            photoFile: null,
            status: 'status',
            business: {
              description: 'description',
              vertical: 'option1',
              vertical_choices: ['option1', 'option2'],
            },
          },
        },
      });
      store.state.WhatsApp.errorDeleteWhatsAppProfilePhoto = true;
      await wrapper.vm.saveProfile();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            title: 'Error',
            text: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });

    describe('getInputValue()', () => {
      it('should return value from contactInfoInputs based on input name', () => {
        const inputName = 'address';
        expect(wrapper.vm.getContactInfoInputValue(inputName)).toEqual(
          storeMock.mockedContactInfo.address,
        );
      });
    });

    describe('saveContactInfo()', () => {
      it('should call updateWppContactInfo action', async () => {
        expect(actions.updateWppContactInfo).not.toHaveBeenCalled();
        await wrapper.vm.saveContactInfo();
        expect(actions.updateWppContactInfo).toHaveBeenCalledTimes(1);
      });

      it('should call unnnicCallAlert on success', async () => {
        expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
        await wrapper.vm.saveContactInfo();
        expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
        expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
          expect.objectContaining({
            props: {
              title: 'Success',
              text: expect.any(String),
              icon: expect.any(String),
              scheme: expect.any(String),
              position: expect.any(String),
              closeText: expect.any(String),
            },
            seconds: expect.any(Number),
          }),
        );
      });

      it('should call unnnicCallAlert on error', async () => {
        actions.updateWppContactInfo.mockImplementation(() => Promise.reject(new Error('error')));
        expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
        await wrapper.vm.saveContactInfo();
        expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
        expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
          expect.objectContaining({
            props: {
              title: 'Error',
              text: expect.any(String),
              icon: expect.any(String),
              scheme: expect.any(String),
              position: expect.any(String),
              closeText: expect.any(String),
            },
            seconds: expect.any(Number),
          }),
        );
      });

      it('should call unnnicCallAlert on input error', async () => {
        expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
        wrapper.vm.updateContactInfoInputs({ index: 2, value: 'invalidemail' });
        await wrapper.vm.saveContactInfo();
        expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
        expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
          expect.objectContaining({
            props: {
              title: 'Error',
              text: expect.any(String),
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

    it('should call toBase64() if photo is provided', async () => {
      wrapper.vm.updateProfileInputs({ index: 0, value: ['photo'] });
      expect(mockToBase64).not.toHaveBeenCalled();
      await wrapper.vm.saveProfile();
      expect(mockToBase64).toHaveBeenCalledTimes(1);
    });

    it('should call isValidPhotoSize() if photo is provided', async () => {
      wrapper.vm.updateProfileInputs({ index: 0, value: ['photo'] });
      mockToBase64.mockImplementation(() => Promise.resolve('b64photo'));
      const spy = spyOn(wrapper.vm, 'isValidPhotoSize');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.saveProfile();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return early if photo has an invalid size', async () => {
      wrapper.vm.updateProfileInputs({ index: 0, value: ['photo'] });
      await wrapper.setData({ modifiedInitialPhoto: true });
      mockGetHeightAndWidthFromDataUrl.mockImplementation(() => {
        return Promise.resolve({
          width: 100,
          height: 100,
        });
      });
      await wrapper.vm.saveProfile();
      expect(actions.updateWppProfile).not.toHaveBeenCalled();
    });

    it('should call updateWppProfile if photo has a valid size', async () => {
      wrapper.vm.updateProfileInputs({ index: 0, value: ['photo'] });
      await wrapper.setData({ modifiedInitialPhoto: true });
      mockGetHeightAndWidthFromDataUrl.mockImplementation(() => {
        return Promise.resolve({
          width: 192,
          height: 192,
        });
      });
      await wrapper.vm.saveProfile();
      expect(actions.updateWppProfile).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert in error state if request fails', async () => {
      wrapper.vm.updateProfileInputs({ index: 0, value: ['photo'] });
      await wrapper.setData({ modifiedInitialPhoto: true });
      mockGetHeightAndWidthFromDataUrl.mockImplementation(() => {
        return Promise.resolve({
          width: 192,
          height: 192,
        });
      });
      store.state.WhatsApp.errorUpdateWhatsAppProfile = true;
      await wrapper.vm.saveProfile();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            title: 'Error',
            text: expect.any(String),
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
