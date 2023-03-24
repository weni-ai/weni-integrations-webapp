jest.mock('@/api/appType/whatsapp', () => {
  return {
    fetchWppContactInfo: jest.fn(),
    updateWppContactInfo: jest.fn(),
    getConversations: jest.fn(),
    fetchWppProfile: jest.fn(),
    updateWppProfile: jest.fn(),
    deleteWppProfilePhoto: jest.fn(),
    getWhatsAppTemplates: jest.fn(),
    fetchTemplateData: jest.fn(),
    fetchSelectLanguages: jest.fn(),
    createTemplate: jest.fn(),
    createTemplateTranslation: jest.fn(),
    deleteTemplateMessage: jest.fn(),
    updateWppWebhookInfo: jest.fn(),
  };
});
import WhatsAppApi from '@/api/appType/whatsapp';

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/channels/whatsapp/actions';
import mutations from '@/store/appType/channels/whatsapp/mutations';
import state from '@/store/appType/channels/whatsapp/state';

import storeMock from './__mocks__/store';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/whatsapp/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        WhatsApp: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('resetWppFetchResults()', () => {
    it('should set fetchedContactInfo to false', async () => {
      store.state.WhatsApp.fetchedContactInfo = true;
      expect(store.state.WhatsApp.fetchedContactInfo).toBe(true);
      await store.dispatch('WhatsApp/resetWppFetchResults');
      expect(store.state.WhatsApp.fetchedContactInfo).toBe(false);
    });
  });

  describe('fetchWppContactInfo', () => {
    const data = {
      code: 'code',
      commentUuid: '123',
    };

    beforeEach(() => {
      WhatsAppApi.fetchWppContactInfo.mockImplementation(() => {
        return Promise.resolve({ data: storeMock.mockedContactInfo });
      });
    });

    it('should call fetchWppContactInfo from API', async () => {
      await store.dispatch('WhatsApp/fetchWppContactInfo', data);
      expect(WhatsAppApi.fetchWppContactInfo).toHaveBeenCalledTimes(1);
    });

    it('should set fetchedContactInfo to true', async () => {
      store.state.WhatsApp.fetchedContactInfo = false;
      expect(store.state.WhatsApp.fetchedContactInfo).toBe(false);
      await store.dispatch('WhatsApp/fetchWppContactInfo', data);
      expect(store.state.WhatsApp.fetchedContactInfo).toBe(true);
    });

    it('should set loadingContactInfo to false', async () => {
      store.state.WhatsApp.loadingContactInfo = true;
      expect(store.state.WhatsApp.loadingContactInfo).toBe(true);
      await store.dispatch('WhatsApp/fetchWppContactInfo', data);
      expect(store.state.WhatsApp.loadingContactInfo).toBe(false);
    });
  });

  describe('updateWppContactInfo', () => {
    const data = {
      code: 'code',
      commentUuid: '123',
      payload: {
        foo: 'bar',
      },
    };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.updateWppContactInfo.mockImplementation(() => {
        return Promise.resolve({ data: storeMock.mockedContactInfo });
      });
    });

    it('should call updateWppContactInfo from API', async () => {
      expect(WhatsAppApi.updateWppContactInfo).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/updateWppContactInfo', data);
      expect(WhatsAppApi.updateWppContactInfo).toHaveBeenCalledTimes(1);
    });

    it('should set contactInfo as result data', async () => {
      store.state.WhatsApp.contactInfo = {};
      expect(store.state.WhatsApp.contactInfo).not.toEqual(storeMock.mockedContactInfo);
      await store.dispatch('WhatsApp/updateWppContactInfo', data);
      expect(store.state.WhatsApp.contactInfo).toEqual(storeMock.mockedContactInfo);
    });
  });

  describe('getConversations()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      params: {},
    };

    const mockConversations = {
      business_initiated: 1,
      user_initiated: 2,
      total: 3,
    };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.getConversations.mockImplementation(() => {
        return Promise.resolve({
          data: mockConversations,
        });
      });
    });

    it('should call getConversations from API', async () => {
      expect(WhatsAppApi.getConversations).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/getConversations', data);
      expect(WhatsAppApi.getConversations).toHaveBeenCalledTimes(1);
    });

    it('should set whatsAppConversations as result data', async () => {
      store.state.WhatsApp.whatsAppConversations = {};
      expect(store.state.WhatsApp.whatsAppConversations).not.toEqual(mockConversations);
      await store.dispatch('WhatsApp/getConversations', data);
      expect(store.state.WhatsApp.whatsAppConversations).toEqual(mockConversations);
    });

    it('should set loadingConversations to false', async () => {
      store.state.WhatsApp.loadingConversations = true;
      expect(store.state.WhatsApp.loadingConversations).toBe(true);
      await store.dispatch('WhatsApp/getConversations', data);
      expect(store.state.WhatsApp.loadingConversations).toBe(false);
    });

    it('should set errorConversations as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.getConversations.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorConversations = {};
      expect(store.state.WhatsApp.errorConversations).not.toEqual(error);
      await store.dispatch('WhatsApp/getConversations', data);
      expect(store.state.WhatsApp.errorConversations).toEqual(error);
    });
  });

  describe('fetchWppProfile()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
    };

    const mockProfileResult = {
      photo_url: 'url',
    };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.fetchWppProfile.mockImplementation(() => {
        return Promise.resolve({
          data: mockProfileResult,
        });
      });
    });

    it('should call fetchWppProfile from API', async () => {
      expect(WhatsAppApi.fetchWppProfile).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/fetchWppProfile', data);
      expect(WhatsAppApi.fetchWppProfile).toHaveBeenCalledTimes(1);
    });

    it('should set whatsAppProfile as result data', async () => {
      store.state.WhatsApp.whatsAppProfile = {};
      expect(store.state.WhatsApp.whatsAppProfile).not.toEqual(mockProfileResult);
      await store.dispatch('WhatsApp/fetchWppProfile', data);
      expect(store.state.WhatsApp.whatsAppProfile).toEqual(mockProfileResult);
    });

    it('should set loadingWhatsAppProfile to false', async () => {
      store.state.WhatsApp.loadingWhatsAppProfile = true;
      expect(store.state.WhatsApp.loadingWhatsAppProfile).toBe(true);
      await store.dispatch('WhatsApp/fetchWppProfile', data);
      expect(store.state.WhatsApp.loadingWhatsAppProfile).toBe(false);
    });

    it('should set errorWhatsAppProfile as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.fetchWppProfile.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorWhatsAppProfile = {};
      expect(store.state.WhatsApp.errorWhatsAppProfile).not.toEqual(error);
      await store.dispatch('WhatsApp/fetchWppProfile', data);
      expect(store.state.WhatsApp.errorWhatsAppProfile).toEqual(error);
    });
  });

  describe('updateWppProfile', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      payload: {
        foo: 'bar',
      },
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.updateWppProfile.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call updateWppProfile from API', async () => {
      expect(WhatsAppApi.updateWppProfile).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/updateWppProfile', data);
      expect(WhatsAppApi.updateWppProfile).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.updateWppProfile).toHaveBeenCalledWith(
        data.code,
        data.appUuid,
        data.payload,
      );
    });

    it('should set updateWhatsAppProfileResult as result data', async () => {
      store.state.WhatsApp.updateWhatsAppProfileResult = {};
      expect(store.state.WhatsApp.updateWhatsAppProfileResult).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/updateWppProfile', data);
      expect(store.state.WhatsApp.updateWhatsAppProfileResult).toEqual(mockedResult);
    });

    it('should set loadingUpdateWhatsAppProfile to false', async () => {
      store.state.WhatsApp.loadingUpdateWhatsAppProfile = true;
      expect(store.state.WhatsApp.loadingUpdateWhatsAppProfile).toBe(true);
      await store.dispatch('WhatsApp/updateWppProfile', data);
      expect(store.state.WhatsApp.loadingUpdateWhatsAppProfile).toBe(false);
    });

    it('should set errorUpdateWhatsAppProfile as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.updateWppProfile.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorUpdateWhatsAppProfile = {};
      expect(store.state.WhatsApp.errorUpdateWhatsAppProfile).not.toEqual(error);
      await store.dispatch('WhatsApp/updateWppProfile', data);
      expect(store.state.WhatsApp.errorUpdateWhatsAppProfile).toEqual(error);
    });
  });

  describe('deleteWppProfilePhoto()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.deleteWppProfilePhoto.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call deleteWppProfilePhoto from API', async () => {
      expect(WhatsAppApi.deleteWppProfilePhoto).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/deleteWppProfilePhoto', data);
      expect(WhatsAppApi.deleteWppProfilePhoto).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.deleteWppProfilePhoto).toHaveBeenCalledWith(data.code, data.appUuid);
    });

    it('should set deleteWhatsAppProfilePhotoResult as result data', async () => {
      store.state.WhatsApp.deleteWhatsAppProfilePhotoResult = {};
      expect(store.state.WhatsApp.deleteWhatsAppProfilePhotoResult).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/deleteWppProfilePhoto', data);
      expect(store.state.WhatsApp.deleteWhatsAppProfilePhotoResult).toEqual(mockedResult);
    });

    it('should set loadingDeleteWhatsAppProfilePhoto to false', async () => {
      store.state.WhatsApp.loadingDeleteWhatsAppProfilePhoto = true;
      expect(store.state.WhatsApp.loadingDeleteWhatsAppProfilePhoto).toBe(true);
      await store.dispatch('WhatsApp/deleteWppProfilePhoto', data);
      expect(store.state.WhatsApp.loadingDeleteWhatsAppProfilePhoto).toBe(false);
    });

    it('should set errorDeleteWhatsAppProfilePhoto as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.deleteWppProfilePhoto.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorDeleteWhatsAppProfilePhoto = {};
      expect(store.state.WhatsApp.errorDeleteWhatsAppProfilePhoto).not.toEqual(error);
      await store.dispatch('WhatsApp/deleteWppProfilePhoto', data);
      expect(store.state.WhatsApp.errorDeleteWhatsAppProfilePhoto).toEqual(error);
    });
  });

  describe('getWhatsAppTemplates()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      params: {
        page: 1,
        limit: 12,
      },
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.getWhatsAppTemplates.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call getWhatsAppTemplates from API', async () => {
      expect(WhatsAppApi.getWhatsAppTemplates).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/getWhatsAppTemplates', data);
      expect(WhatsAppApi.getWhatsAppTemplates).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.getWhatsAppTemplates).toHaveBeenCalledWith(data.appUuid, data.params);
    });

    it('should set whatsAppTemplates as result data', async () => {
      store.state.WhatsApp.whatsAppTemplates = {};
      expect(store.state.WhatsApp.whatsAppTemplates).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/getWhatsAppTemplates', data);
      expect(store.state.WhatsApp.whatsAppTemplates).toEqual(mockedResult);
    });

    it('should set loadingWhatsAppTemplates to false', async () => {
      store.state.WhatsApp.loadingWhatsAppTemplates = true;
      expect(store.state.WhatsApp.loadingWhatsAppTemplates).toBe(true);
      await store.dispatch('WhatsApp/getWhatsAppTemplates', data);
      expect(store.state.WhatsApp.loadingWhatsAppTemplates).toBe(false);
    });

    it('should set errorWhatsAppTemplates as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.getWhatsAppTemplates.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorWhatsAppTemplates = {};
      expect(store.state.WhatsApp.errorWhatsAppTemplates).not.toEqual(error);
      await store.dispatch('WhatsApp/getWhatsAppTemplates', data);
      expect(store.state.WhatsApp.errorWhatsAppTemplates).toEqual(error);
    });
  });

  describe('updateTemplateForm()', () => {
    it('should set template field correctly', async () => {
      expect(store.state.WhatsApp.templateForm.newField).not.toEqual('field_value');
      await store.dispatch('WhatsApp/updateTemplateForm', {
        fieldName: 'newField',
        fieldValue: 'field_value',
      });
      expect(store.state.WhatsApp.templateForm.newField).toEqual('field_value');
    });
  });

  describe('addNewTranslationForm()', () => {
    it('should create a new translation form', async () => {
      expect(store.state.WhatsApp.templateTranslationForms).toEqual(
        expect.not.objectContaining({ new_form: { name: 'John' } }),
      );
      await store.dispatch('WhatsApp/addNewTranslationForm', {
        formName: 'new_form',
        formData: { name: 'John' },
      });
      expect(store.state.WhatsApp.templateTranslationForms).toEqual(
        expect.objectContaining({ new_form: { name: 'John' } }),
      );
    });

    it('should create a new empty translation form when no form data is provided', async () => {
      expect(store.state.WhatsApp.templateTranslationForms).toEqual(
        expect.not.objectContaining({ new_form: {} }),
      );
      await store.dispatch('WhatsApp/addNewTranslationForm', {
        formName: 'new_form',
      });
      expect(store.state.WhatsApp.templateTranslationForms).toEqual(
        expect.objectContaining({ new_form: {} }),
      );
    });
  });

  describe('renameTemplateTranslationForm()', () => {
    beforeEach(() => {
      store.state.WhatsApp.templateTranslationForms = {
        form_1: {
          name: 'John',
        },
      };
    });

    it('should remove current form', async () => {
      expect(store.state.WhatsApp.templateTranslationForms).toEqual(
        expect.objectContaining({ form_1: { name: 'John' } }),
      );
      await store.dispatch('WhatsApp/renameTemplateTranslationForm', {
        currentName: 'form_1',
        newName: 'new_form',
      });
      expect(store.state.WhatsApp.templateTranslationForms).toEqual(
        expect.not.objectContaining({ form_1: { name: 'John' } }),
      );
    });

    it('should have a new one with the same data', async () => {
      expect(store.state.WhatsApp.templateTranslationForms).toEqual(
        expect.objectContaining({ form_1: { name: 'John' } }),
      );
      await store.dispatch('WhatsApp/renameTemplateTranslationForm', {
        currentName: 'form_1',
        newName: 'new_form',
      });
      expect(store.state.WhatsApp.templateTranslationForms).toEqual(
        expect.objectContaining({ new_form: { name: 'John' } }),
      );
    });
  });

  describe('updateTemplateTranslationForm()', () => {
    it('should update specific translation form field with a new basic value', async () => {
      store.state.WhatsApp.templateTranslationForms = {
        form_1: {
          name: 'John',
        },
      };

      expect(store.state.WhatsApp.templateTranslationForms.form_1).toEqual(
        expect.objectContaining({ name: 'John' }),
      );
      await store.dispatch('WhatsApp/updateTemplateTranslationForm', {
        formName: 'form_1',
        fieldName: 'name',
        fieldValue: 'Mary',
      });
      expect(store.state.WhatsApp.templateTranslationForms.form_1).toEqual(
        expect.objectContaining({ name: 'Mary' }),
      );
    });

    it('should update specific translation form field with a new array value', async () => {
      store.state.WhatsApp.templateTranslationForms = {
        form_1: {
          pets: ['dog'],
        },
      };

      expect(store.state.WhatsApp.templateTranslationForms.form_1).toEqual(
        expect.objectContaining({
          pets: ['dog'],
        }),
      );
      await store.dispatch('WhatsApp/updateTemplateTranslationForm', {
        formName: 'form_1',
        fieldName: 'pets',
        fieldValue: ['dog', 'cat'],
      });
      expect(store.state.WhatsApp.templateTranslationForms.form_1).toEqual(
        expect.objectContaining({
          pets: ['dog', 'cat'],
        }),
      );
    });

    it('should update specific translation form field with a new object value', async () => {
      store.state.WhatsApp.templateTranslationForms = {
        form_1: {
          pets: { dog: true },
        },
      };

      expect(store.state.WhatsApp.templateTranslationForms.form_1).toEqual(
        expect.objectContaining({
          pets: { dog: true },
        }),
      );
      await store.dispatch('WhatsApp/updateTemplateTranslationForm', {
        formName: 'form_1',
        fieldName: 'pets',
        fieldValue: { dog: true, cat: true },
      });
      expect(store.state.WhatsApp.templateTranslationForms.form_1).toEqual(
        expect.objectContaining({
          pets: { dog: true, cat: true },
        }),
      );
    });

    it('should update specific translation form field with a new value with preventRerender', async () => {
      store.state.WhatsApp.templateTranslationForms = {
        form_1: {
          name: 'John',
        },
      };

      expect(store.state.WhatsApp.templateTranslationForms.form_1).toEqual(
        expect.objectContaining({ name: 'John' }),
      );
      await store.dispatch('WhatsApp/updateTemplateTranslationForm', {
        formName: 'form_1',
        fieldName: 'name',
        fieldValue: 'Mary',
        preventRerender: true,
      });
      expect(store.state.WhatsApp.templateTranslationForms.form_1).toEqual(
        expect.objectContaining({ name: 'Mary' }),
      );
    });
  });

  describe('setTemplateTranslationSelectedForm()', () => {
    it('should set current selected form', async () => {
      expect(store.state.WhatsApp.templateTranslationSelectedForm).not.toEqual('form_1');
      await store.dispatch('WhatsApp/setTemplateTranslationSelectedForm', { formName: 'form_1' });
      expect(store.state.WhatsApp.templateTranslationSelectedForm).toEqual('form_1');
    });
  });

  describe('clearAllTemplateFormData()', () => {
    it('should set all template form data as an empy object', async () => {
      expect(store.state.WhatsApp.templateForm).not.toEqual({});
      expect(store.state.WhatsApp.templateTranslationForms).not.toEqual({});
      expect(store.state.WhatsApp.templateTranslationSelectedForm).not.toEqual(null);
      await store.dispatch('WhatsApp/clearAllTemplateFormData');
      expect(store.state.WhatsApp.templateForm).toEqual({});
      expect(store.state.WhatsApp.templateTranslationForms).toEqual({});
      expect(store.state.WhatsApp.templateTranslationSelectedForm).toEqual(null);
    });
  });

  describe('fetchTemplateData()', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      templateUuid: '456',
    };

    const mockedResult = { template: {} };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.fetchTemplateData.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call fetchTemplateData from API', async () => {
      expect(WhatsAppApi.fetchTemplateData).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/fetchTemplateData', data);
      expect(WhatsAppApi.fetchTemplateData).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.fetchTemplateData).toHaveBeenCalledWith(data.appUuid, data.templateUuid);
    });

    it('should set whatsAppTemplate as result data', async () => {
      store.state.WhatsApp.whatsAppTemplate = {};
      expect(store.state.WhatsApp.whatsAppTemplate).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/fetchTemplateData', data);
      expect(store.state.WhatsApp.whatsAppTemplate).toEqual(mockedResult);
    });

    it('should set loadingFetchWhatsAppTemplate to false', async () => {
      store.state.WhatsApp.loadingFetchWhatsAppTemplate = true;
      expect(store.state.WhatsApp.loadingFetchWhatsAppTemplate).toBe(true);
      await store.dispatch('WhatsApp/fetchTemplateData', data);
      expect(store.state.WhatsApp.loadingFetchWhatsAppTemplate).toBe(false);
    });

    it('should set errorFetchWhatsAppTemplate as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.fetchTemplateData.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorFetchWhatsAppTemplate = {};
      expect(store.state.WhatsApp.errorFetchWhatsAppTemplate).not.toEqual(error);
      await store.dispatch('WhatsApp/fetchTemplateData', data);
      expect(store.state.WhatsApp.errorFetchWhatsAppTemplate).toEqual(error);
    });
  });

  describe('fetchSelectLanguages()', () => {
    const data = {
      appUuid: '123',
    };

    const mockedResult = { en_US: 'English (US)', pt_BR: 'Portuguese (BR)' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.fetchSelectLanguages.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call fetchSelectLanguages from API', async () => {
      expect(WhatsAppApi.fetchSelectLanguages).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/fetchSelectLanguages', data);
      expect(WhatsAppApi.fetchSelectLanguages).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.fetchSelectLanguages).toHaveBeenCalledWith(data.appUuid);
    });

    it('should set formatted whatsAppTemplateSelectLanguages as result data', async () => {
      store.state.WhatsApp.whatsAppTemplateSelectLanguages = [];
      const expectedResult = [
        { value: 'en_US', text: 'English (US)' },
        { value: 'pt_BR', text: 'Portuguese (BR)' },
      ];
      expect(store.state.WhatsApp.whatsAppTemplateSelectLanguages).not.toEqual(expectedResult);
      await store.dispatch('WhatsApp/fetchSelectLanguages', data);
      expect(store.state.WhatsApp.whatsAppTemplateSelectLanguages).toEqual(expectedResult);
    });

    it('should set loadingFetchWhatsAppTemplateSelectLanguages to false', async () => {
      store.state.WhatsApp.loadingFetchWhatsAppTemplateSelectLanguages = true;
      expect(store.state.WhatsApp.loadingFetchWhatsAppTemplateSelectLanguages).toBe(true);
      await store.dispatch('WhatsApp/fetchSelectLanguages', data);
      expect(store.state.WhatsApp.loadingFetchWhatsAppTemplateSelectLanguages).toBe(false);
    });

    it('should set errorFetchWhatsAppTemplateSelectLanguages as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.fetchSelectLanguages.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorFetchWhatsAppTemplateSelectLanguages = {};
      expect(store.state.WhatsApp.errorFetchWhatsAppTemplateSelectLanguages).not.toEqual(error);
      await store.dispatch('WhatsApp/fetchSelectLanguages', data);
      expect(store.state.WhatsApp.errorFetchWhatsAppTemplateSelectLanguages).toEqual(error);
    });
  });

  describe('createTemplate()', () => {
    const data = {
      appUuid: '123',
      payload: {},
    };

    const mockedResult = {};

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.createTemplate.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call createTemplate from API', async () => {
      expect(WhatsAppApi.createTemplate).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/createTemplate', data);
      expect(WhatsAppApi.createTemplate).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.createTemplate).toHaveBeenCalledWith(data.appUuid, data.payload);
    });

    it('should set createdTemplateData as result data', async () => {
      store.state.WhatsApp.createdTemplateData = null;
      expect(store.state.WhatsApp.createdTemplateData).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/createTemplate', data);
      expect(store.state.WhatsApp.createdTemplateData).toEqual(mockedResult);
    });

    it('should set loadingCreateTemplate to false', async () => {
      store.state.WhatsApp.loadingCreateTemplate = true;
      expect(store.state.WhatsApp.loadingCreateTemplate).toBe(true);
      await store.dispatch('WhatsApp/createTemplate', data);
      expect(store.state.WhatsApp.loadingCreateTemplate).toBe(false);
    });

    it('should set errorCreateTemplate as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.createTemplate.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorCreateTemplate = {};
      expect(store.state.WhatsApp.errorCreateTemplate).not.toEqual(error);
      await store.dispatch('WhatsApp/createTemplate', data);
      expect(store.state.WhatsApp.errorCreateTemplate).toEqual(error);
    });
  });

  describe('createTemplateTranslation()', () => {
    const data = {
      appUuid: '123',
      templateUuid: '456',
      payload: {},
    };

    const mockedResult = {};

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.createTemplateTranslation.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call createTemplateTranslation from API', async () => {
      expect(WhatsAppApi.createTemplateTranslation).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/createTemplateTranslation', data);
      expect(WhatsAppApi.createTemplateTranslation).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.createTemplateTranslation).toHaveBeenCalledWith(
        data.appUuid,
        data.templateUuid,
        data.payload,
      );
    });

    it('should set createdTemplateTranslationData as result data', async () => {
      store.state.WhatsApp.createdTemplateTranslationData = null;
      expect(store.state.WhatsApp.createdTemplateTranslationData).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/createTemplateTranslation', data);
      expect(store.state.WhatsApp.createdTemplateTranslationData).toEqual(mockedResult);
    });

    it('should set loadingCreateTemplateTranslation to false', async () => {
      store.state.WhatsApp.loadingCreateTemplateTranslation = true;
      expect(store.state.WhatsApp.loadingCreateTemplateTranslation).toBe(true);
      await store.dispatch('WhatsApp/createTemplateTranslation', data);
      expect(store.state.WhatsApp.loadingCreateTemplateTranslation).toBe(false);
    });

    it('should set errorCreateTemplateTranslation as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.createTemplateTranslation.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorCreateTemplateTranslation = {};
      expect(store.state.WhatsApp.errorCreateTemplateTranslation).not.toEqual(error);
      await store.dispatch('WhatsApp/createTemplateTranslation', data);
      expect(store.state.WhatsApp.errorCreateTemplateTranslation).toEqual(error);
    });
  });

  describe('deleteTemplateMessage()', () => {
    const data = {
      appUuid: '123',
      templateUuid: '456',
    };

    const mockedResult = {};

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.deleteTemplateMessage.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call deleteTemplateMessage from API', async () => {
      expect(WhatsAppApi.deleteTemplateMessage).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/deleteTemplateMessage', data);
      expect(WhatsAppApi.deleteTemplateMessage).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.deleteTemplateMessage).toHaveBeenCalledWith(
        data.appUuid,
        data.templateUuid,
      );
    });

    it('should set deletedTemplateMessageData as result data', async () => {
      store.state.WhatsApp.deletedTemplateMessageData = null;
      expect(store.state.WhatsApp.deletedTemplateMessageData).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/deleteTemplateMessage', data);
      expect(store.state.WhatsApp.deletedTemplateMessageData).toEqual(mockedResult);
    });

    it('should set loadingDeleteTemplateMessage to false', async () => {
      store.state.WhatsApp.loadingDeleteTemplateMessage = true;
      expect(store.state.WhatsApp.loadingDeleteTemplateMessage).toBe(true);
      await store.dispatch('WhatsApp/deleteTemplateMessage', data);
      expect(store.state.WhatsApp.loadingDeleteTemplateMessage).toBe(false);
    });

    it('should set errorDeleteTemplateMessage as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.deleteTemplateMessage.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorDeleteTemplateMessage = {};
      expect(store.state.WhatsApp.errorDeleteTemplateMessage).not.toEqual(error);
      await store.dispatch('WhatsApp/deleteTemplateMessage', data);
      expect(store.state.WhatsApp.errorDeleteTemplateMessage).toEqual(error);
    });
  });

  describe('updateWppWebhookInfo', () => {
    const data = {
      code: 'code',
      appUuid: '123',
      payload: {
        foo: 'bar',
      },
    };

    const mockedResult = { status: 'ok' };

    beforeEach(() => {
      jest.resetAllMocks();

      WhatsAppApi.updateWppWebhookInfo.mockImplementation(() => {
        return Promise.resolve({ data: mockedResult });
      });
    });

    it('should call updateWppWebhookInfo from API', async () => {
      expect(WhatsAppApi.updateWppWebhookInfo).not.toHaveBeenCalled();
      await store.dispatch('WhatsApp/updateWppWebhookInfo', data);
      expect(WhatsAppApi.updateWppWebhookInfo).toHaveBeenCalledTimes(1);
      expect(WhatsAppApi.updateWppWebhookInfo).toHaveBeenCalledWith(
        data.code,
        data.appUuid,
        data.payload,
      );
    });

    it('should set updateWebhookInfoData as result data', async () => {
      store.state.WhatsApp.updateWebhookInfoData = {};
      expect(store.state.WhatsApp.updateWebhookInfoData).not.toEqual(mockedResult);
      await store.dispatch('WhatsApp/updateWppWebhookInfo', data);
      expect(store.state.WhatsApp.updateWebhookInfoData).toEqual(mockedResult);
    });

    it('should set loadingUpdateWebhookInfo to false', async () => {
      store.state.WhatsApp.loadingUpdateWebhookInfo = true;
      expect(store.state.WhatsApp.loadingUpdateWebhookInfo).toBe(true);
      await store.dispatch('WhatsApp/updateWppWebhookInfo', data);
      expect(store.state.WhatsApp.loadingUpdateWebhookInfo).toBe(false);
    });

    it('should set errorUpdateWebhookInfo as result data', async () => {
      const error = { error: 'failed' };
      WhatsAppApi.updateWppWebhookInfo.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.WhatsApp.errorUpdateWebhookInfo = {};
      expect(store.state.WhatsApp.errorUpdateWebhookInfo).not.toEqual(error);
      await store.dispatch('WhatsApp/updateWppWebhookInfo', data);
      expect(store.state.WhatsApp.errorUpdateWebhookInfo).toEqual(error);
    });
  });
});
