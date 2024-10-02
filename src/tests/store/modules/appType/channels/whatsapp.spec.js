import { setActivePinia, createPinia } from 'pinia';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import whatsApp from '@/api/appType/whatsapp';
import { captureSentryException } from '@/utils/sentry';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mockando os módulos
vi.mock('@/api/appType/whatsapp');
vi.mock('@/utils/sentry');

describe('whatsapp_store actions', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = whatsapp_store();
  });

  describe('Fetch contact info', () => {
    it('should fetch WhatsApp contact info successfully', async () => {
      const mockData = { name: 'Test Contact' };
      whatsApp.fetchWppContactInfo.mockResolvedValueOnce(mockData);

      await store.fetchWppContactInfo({ code: '123', appUuid: 'abc' });

      expect(store.contactInfo).toEqual(mockData);
      expect(store.fetchedContactInfo).toBe(true);
      expect(store.loadingContactInfo).toBe(false);
    });

    it('should handle error when fetching WhatsApp contact info', async () => {
      const mockError = new Error('Failed to fetch');
      whatsApp.fetchWppContactInfo.mockRejectedValueOnce(mockError);

      await store.fetchWppContactInfo({ code: '123', appUuid: 'abc' });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.fetchedContactInfo).toBe(false);
      expect(store.loadingContactInfo).toBe(false);
    });

    it('should successfully update WhatsApp contact info', async () => {
      const mockUpdatedContactInfo = { name: 'Updated Contact' };
      whatsApp.updateWppContactInfo.mockResolvedValueOnce({ data: mockUpdatedContactInfo });

      await store.updateWppContactInfo({ code: '123', appUuid: 'abc', payload: {} });

      expect(store.contactInfo).toEqual(mockUpdatedContactInfo);
    });
  });

  describe('Update profile', () => {
    it('should update WhatsApp profile successfully', async () => {
      const mockProfile = { name: 'Updated Profile' };
      whatsApp.updateWppProfile.mockResolvedValueOnce({ data: mockProfile });

      await store.updateWppProfile({ code: '123', appUuid: 'abc', payload: {} });

      expect(store.updateWhatsAppProfileResult).toEqual(mockProfile);
      expect(store.loadingUpdateWhatsAppProfile).toBe(false);
    });

    it('should handle error when updating WhatsApp profile', async () => {
      const mockError = new Error('Failed to update');
      whatsApp.updateWppProfile.mockRejectedValueOnce(mockError);

      await store.updateWppProfile({ code: '123', appUuid: 'abc', payload: {} });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.errorUpdateWhatsAppProfile).toBe(mockError);
      expect(store.loadingUpdateWhatsAppProfile).toBe(false);
    });
  });

  describe('Fetch templates', () => {
    it('should fetch WhatsApp templates successfully', async () => {
      const mockTemplates = [{ name: 'Template 1' }];
      whatsApp.getWhatsAppTemplates.mockResolvedValueOnce(mockTemplates);

      await store.getWhatsAppTemplates({ appUuid: 'abc', params: {} });

      expect(store.whatsAppTemplates).toEqual(mockTemplates);
      expect(store.loadingWhatsAppTemplates).toBe(false);
    });

    it('should handle error when fetching WhatsApp templates', async () => {
      const mockError = new Error('Failed to fetch templates');
      whatsApp.getWhatsAppTemplates.mockRejectedValueOnce(mockError);

      await store.getWhatsAppTemplates({ appUuid: 'abc', params: {} });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.errorWhatsAppTemplates).toBe(mockError);
      expect(store.loadingWhatsAppTemplates).toBe(false);
    });

    it('should successfully create a WhatsApp template', async () => {
      const mockTemplateData = { id: 'template123' };
      whatsApp.createTemplate.mockResolvedValueOnce(mockTemplateData);

      await store.createTemplate({ appUuid: 'abc', payload: {} });

      expect(store.createdTemplateData).toEqual(mockTemplateData);
      expect(store.loadingCreateTemplate).toBe(false);
    });

    it('should handle error when creating a WhatsApp template', async () => {
      const mockError = new Error('Failed to create template');
      whatsApp.createTemplate.mockRejectedValueOnce(mockError);

      await store.createTemplate({ appUuid: 'abc', payload: {} });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.errorCreateTemplate).toEqual(mockError);
      expect(store.loadingCreateTemplate).toBe(false);
    });

    it('should update the template translation form correctly', () => {
      store.templateTranslationForms = {
        form1: { field: 'value' },
      };

      store.updateTemplateTranslationForm({
        formName: 'form1',
        fieldName: 'field',
        fieldValue: 'new value',
      });

      expect(store.templateTranslationForms.form1.field).toBe('new value');
    });
    it('should return undefined for non-existent template', () => {
      store.templateTranslationSelectedForm = 'nonExistentForm';
      expect(store.templateTranslationCurrentForm).toStrictEqual({});
    });
  });

  describe('Fetch conversations', () => {
    it('should successfully fetch WhatsApp conversations', async () => {
      const mockConversations = { business_initiated: 2, user_initiated: 3, total: 5 };
      whatsApp.getConversations.mockResolvedValueOnce({ data: mockConversations });

      await store.getConversations({ code: '123', appUuid: 'abc', params: {} });

      expect(store.whatsAppConversations).toEqual(mockConversations);
      expect(store.loadingConversations).toBe(false);
    });

    it('should handle error when fetching WhatsApp conversations', async () => {
      const mockError = new Error('Failed to fetch conversations');
      whatsApp.getConversations.mockRejectedValueOnce(mockError);

      await store.getConversations({ code: '123', appUuid: 'abc', params: {} });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.errorConversations).toEqual(mockError);
      expect(store.loadingConversations).toBe(false);
    });
  });

  describe('Template translations', () => {
    it('should return the correct template translation current form', () => {
      store.templateTranslationForms = {
        form1: { name: 'Translation Form 1' },
      };
      store.templateTranslationSelectedForm = 'form1';

      expect(store.templateTranslationCurrentForm).toEqual({ name: 'Translation Form 1' });
    });
  });

  describe('Contact info', () => {
    it('should return the correct contact info', () => {
      store.contactInfo = { name: 'Test Contact' };

      expect(store.getContactInfo).toEqual({ name: 'Test Contact' });
    });

    it('should reset fetchedContactInfo', () => {
      store.fetchedContactInfo = true;

      store.resetWppFetchResults();

      expect(store.fetchedContactInfo).toBe(false);
    });

    it('should not fetch contact info if the parameters are invalid', async () => {
      await store.fetchWppContactInfo({ code: null, appUuid: null });

      expect(captureSentryException).toHaveBeenCalled();
      expect(store.loadingContactInfo).toBe(false);
    });
  });

  describe('Webhook info', () => {
    it('should successfully update webhook info', async () => {
      const mockResponse = { data: { success: true } };
      const code = '123';
      const appUuid = 'abc';
      const payload = { url: 'https://example.com/webhook' };

      // Simula a resposta bem-sucedida da API
      whatsApp.updateWppWebhookInfo.mockResolvedValueOnce(mockResponse);

      await store.updateWppWebhookInfo({ code, appUuid, payload });

      expect(store.loadingUpdateWebhookInfo).toBe(false);
      expect(store.updateWebhookInfoData).toEqual(mockResponse.data);
      expect(store.errorUpdateWebhookInfo).toBe(null);
      expect(whatsApp.updateWppWebhookInfo).toHaveBeenCalledWith(code, appUuid, payload);
    });

    it('should handle error when updating webhook info', async () => {
      const mockError = { response: { data: { error: 'Failed to update' } } };
      const code = '123';
      const appUuid = 'abc';
      const payload = { url: 'https://example.com/webhook' };

      // Simula a rejeição da API
      whatsApp.updateWppWebhookInfo.mockRejectedValueOnce(mockError);

      await store.updateWppWebhookInfo({ code, appUuid, payload });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingUpdateWebhookInfo).toBe(false);
      expect(store.errorUpdateWebhookInfo).toEqual('Failed to update');
      expect(store.updateWebhookInfoData).toBe(null);
    });

    it('should handle generic error when updating webhook info', async () => {
      const mockError = new Error('Failed to fetch');
      const code = '123';
      const appUuid = 'abc';
      const payload = { url: 'https://example.com/webhook' };

      // Simula a rejeição da API
      whatsApp.updateWppWebhookInfo.mockRejectedValueOnce(mockError);

      await store.updateWppWebhookInfo({ code, appUuid, payload });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingUpdateWebhookInfo).toBe(false);
      expect(store.errorUpdateWebhookInfo).toEqual(mockError);
      expect(store.updateWebhookInfoData).toBe(null);
    });
    it('should set loading state correctly during update', async () => {
      const code = '123';
      const appUuid = 'abc';
      const payload = { url: 'https://example.com/webhook' };

      const promise = store.updateWppWebhookInfo({ code, appUuid, payload });

      expect(store.loadingUpdateWebhookInfo).toBe(true);

      await promise;

      expect(store.loadingUpdateWebhookInfo).toBe(false);
    });
  });

  describe('Delete template message', () => {
    it('should successfully delete a template message', async () => {
      const mockResponse = { data: { success: true } };
      const appUuid = 'app123';
      const templateUuid = 'template123';

      // Simula uma resposta bem-sucedida da API
      whatsApp.deleteTemplateMessage.mockResolvedValueOnce(mockResponse);

      await store.deleteTemplateMessage({ appUuid, templateUuid });

      expect(store.loadingDeleteTemplateMessage).toBe(false);
      expect(store.deletedTemplateMessageData).toEqual(mockResponse.data);
      expect(store.errorDeleteTemplateMessage).toBe(null);
      expect(whatsApp.deleteTemplateMessage).toHaveBeenCalledWith(appUuid, templateUuid);
    });

    it('should handle error when deleting a template message', async () => {
      const mockError = { response: { data: { error: 'Failed to delete' } } };
      const appUuid = 'app123';
      const templateUuid = 'template123';

      // Simula uma rejeição da API
      whatsApp.deleteTemplateMessage.mockRejectedValueOnce(mockError);

      await store.deleteTemplateMessage({ appUuid, templateUuid });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingDeleteTemplateMessage).toBe(false);
      expect(store.errorDeleteTemplateMessage).toEqual('Failed to delete');
      expect(store.deletedTemplateMessageData).toBe(null);
    });

    it('should handle generic error when deleting a template message', async () => {
      const mockError = new Error('Failed to fetch');
      const appUuid = 'app123';
      const templateUuid = 'template123';

      // Simula uma rejeição da API
      whatsApp.deleteTemplateMessage.mockRejectedValueOnce(mockError);

      await store.deleteTemplateMessage({ appUuid, templateUuid });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingDeleteTemplateMessage).toBe(false);
      expect(store.errorDeleteTemplateMessage).toEqual(mockError);
      expect(store.deletedTemplateMessageData).toBe(null);
    });

    it('should set loading state correctly during deletion', async () => {
      const appUuid = 'app123';
      const templateUuid = 'template123';

      const promise = store.deleteTemplateMessage({ appUuid, templateUuid });

      expect(store.loadingDeleteTemplateMessage).toBe(true);

      await promise;

      expect(store.loadingDeleteTemplateMessage).toBe(false);
    });
  });

  describe('Update template translation', () => {
    it('should successfully update template translation', async () => {
      const mockResponse = { data: { success: true } };
      const appUuid = 'app123';
      const templateUuid = 'template123';
      const payload = { translation: 'New translation' };

      whatsApp.updateTemplateTranslation.mockResolvedValueOnce(mockResponse);

      await store.updateTemplateTranslation({ appUuid, templateUuid, payload });

      expect(store.loadingUpdateTemplateTranslation).toBe(false);
      expect(store.updatedTemplateTranslationData).toEqual(mockResponse.data);
      expect(store.errorUpdateTemplateTranslation).toBe(null);
      expect(whatsApp.updateTemplateTranslation).toHaveBeenCalledWith(
        appUuid,
        templateUuid,
        payload,
      );
    });

    it('should handle error when updating template translation', async () => {
      const mockError = { response: { data: { error: 'Failed to update translation' } } };
      const appUuid = 'app123';
      const templateUuid = 'template123';
      const payload = { translation: 'New translation' };

      whatsApp.updateTemplateTranslation.mockRejectedValueOnce(mockError);

      await store.updateTemplateTranslation({ appUuid, templateUuid, payload });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingUpdateTemplateTranslation).toBe(false);
      expect(store.errorUpdateTemplateTranslation).toEqual('Failed to update translation');
      expect(store.updatedTemplateTranslationData).toBe(null);
    });

    it('should handle generic error when updating template translation', async () => {
      const mockError = new Error('Failed to fetch');
      const appUuid = 'app123';
      const templateUuid = 'template123';
      const payload = { translation: 'New translation' };

      whatsApp.updateTemplateTranslation.mockRejectedValueOnce(mockError);

      await store.updateTemplateTranslation({ appUuid, templateUuid, payload });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingUpdateTemplateTranslation).toBe(false);
      expect(store.errorUpdateTemplateTranslation).toEqual(mockError);
      expect(store.updatedTemplateTranslationData).toBe(null);
    });

    it('should set loading state correctly during update', async () => {
      const appUuid = 'app123';
      const templateUuid = 'template123';
      const payload = { translation: 'New translation' };

      const promise = store.updateTemplateTranslation({ appUuid, templateUuid, payload });

      expect(store.loadingUpdateTemplateTranslation).toBe(true);

      await promise;

      expect(store.loadingUpdateTemplateTranslation).toBe(false);
    });
  });

  describe('Create template translation', () => {
    it('should successfully create template translation', async () => {
      const mockResponse = { success: true };
      const appUuid = 'app123';
      const templateUuid = 'template123';
      const payload = { translation: 'New translation' };

      // Simula uma resposta bem-sucedida da API
      whatsApp.createTemplateTranslation.mockResolvedValueOnce(mockResponse);

      await store.createTemplateTranslation({ appUuid, templateUuid, payload });

      expect(store.loadingCreateTemplateTranslation).toBe(false);
      expect(store.createdTemplateTranslationData).toEqual(mockResponse);
      expect(store.errorCreateTemplateTranslation).toBe(null);
      expect(whatsApp.createTemplateTranslation).toHaveBeenCalledWith(
        appUuid,
        templateUuid,
        payload,
      );
    });

    it('should handle error when creating template translation', async () => {
      const mockError = { response: { data: { error: 'Failed to create translation' } } };
      const appUuid = 'app123';
      const templateUuid = 'template123';
      const payload = { translation: 'New translation' };

      // Simula uma rejeição da API
      whatsApp.createTemplateTranslation.mockRejectedValueOnce(mockError);

      await store.createTemplateTranslation({ appUuid, templateUuid, payload });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingCreateTemplateTranslation).toBe(false);
      expect(store.errorCreateTemplateTranslation).toEqual('Failed to create translation');
      expect(store.createdTemplateTranslationData).toBe(null);
    });

    it('should handle generic error when creating template translation', async () => {
      const mockError = new Error('Failed to fetch');
      const appUuid = 'app123';
      const templateUuid = 'template123';
      const payload = { translation: 'New translation' };

      // Simula uma rejeição da API
      whatsApp.createTemplateTranslation.mockRejectedValueOnce(mockError);

      await store.createTemplateTranslation({ appUuid, templateUuid, payload });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingCreateTemplateTranslation).toBe(false);
      expect(store.errorCreateTemplateTranslation).toEqual(mockError);
      expect(store.createdTemplateTranslationData).toBe(null);
    });
  });

  describe('Select languages', () => {
    it('should successfully fetch and format WhatsApp template select languages', async () => {
      const mockResponse = {
        en: 'English',
        pt: 'Portuguese',
      };
      const appUuid = 'app123';

      // Simula uma resposta bem-sucedida da API
      whatsApp.fetchSelectLanguages.mockResolvedValueOnce(mockResponse);

      await store.fetchSelectLanguages({ appUuid });

      expect(store.loadingFetchWhatsAppTemplateSelectLanguages).toBe(false);
      expect(store.whatsAppTemplateSelectLanguages).toEqual([
        { value: 'en', text: 'English' },
        { value: 'pt', text: 'Portuguese' },
      ]);
      expect(store.errorFetchWhatsAppTemplateSelectLanguages).toBe(null);
      expect(whatsApp.fetchSelectLanguages).toHaveBeenCalledWith(appUuid);
    });

    it('should handle error when fetching WhatsApp template select languages', async () => {
      const mockError = { response: { data: { error: 'Failed to fetch languages' } } };
      const appUuid = 'app123';

      // Simula uma rejeição da API
      whatsApp.fetchSelectLanguages.mockRejectedValueOnce(mockError);

      await store.fetchSelectLanguages({ appUuid });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingFetchWhatsAppTemplateSelectLanguages).toBe(false);
      expect(store.errorFetchWhatsAppTemplateSelectLanguages).toEqual('Failed to fetch languages');
      expect(store.whatsAppTemplateSelectLanguages).toEqual(null);
    });

    it('should handle generic error when fetching WhatsApp template select languages', async () => {
      const mockError = new Error('Network error');
      const appUuid = 'app123';

      // Simula uma rejeição da API
      whatsApp.fetchSelectLanguages.mockRejectedValueOnce(mockError);

      await store.fetchSelectLanguages({ appUuid });

      expect(captureSentryException).toHaveBeenCalledWith(mockError);
      expect(store.loadingFetchWhatsAppTemplateSelectLanguages).toBe(false);
      expect(store.errorFetchWhatsAppTemplateSelectLanguages).toEqual(mockError);
      expect(store.whatsAppTemplateSelectLanguages).toEqual(null);
    });

    it('should set loading state correctly during fetching', async () => {
      const appUuid = 'app123';

      const promise = store.fetchSelectLanguages({ appUuid });

      expect(store.loadingFetchWhatsAppTemplateSelectLanguages).toBe(true);

      await promise;

      expect(store.loadingFetchWhatsAppTemplateSelectLanguages).toBe(false);
    });
  });
});
