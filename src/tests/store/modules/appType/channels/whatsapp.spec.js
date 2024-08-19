import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import whatsApp from '@/api/appType/whatsapp';
import { captureSentryException } from '@/utils/sentry';

// Mock das funções do API e Sentry
vi.mock('@/api/appType/whatsapp', () => ({
  default: {
    fetchWppContactInfo: vi.fn(),
    updateWppContactInfo: vi.fn(),
    getConversations: vi.fn(),
    requestConversationsReport: vi.fn(),
    fetchWppProfile: vi.fn(),
    updateWppProfile: vi.fn(),
    deleteWppProfilePhoto: vi.fn(),
    getWhatsAppTemplates: vi.fn(),
    createTemplate: vi.fn(),
    createTemplateTranslation: vi.fn(),
    updateTemplateTranslation: vi.fn(),
    deleteTemplateMessage: vi.fn(),
    updateWppWebhookInfo: vi.fn(),
    fetchTemplateData: vi.fn(),
    fetchSelectLanguages: vi.fn(),
  },
}));

vi.mock('@/utils/sentry', () => ({
  captureSentryException: vi.fn(),
}));

function createError(text) {
  return new Error(text);
}

describe('whatsapp_store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const store = whatsapp_store();
    expect(store.contactInfo).toEqual({});
    expect(store.fetchedContactInfo).toBe(false);
    expect(store.loadingContactInfo).toBe(false);
    expect(store.whatsAppConversations).toEqual({
      business_initiated: 0,
      user_initiated: 0,
      total: 0,
    });
    expect(store.loadingConversations).toBe(false);
    expect(store.errorConversations).toBe(false);
    expect(store.whatsAppProfile).toBeNull();
    expect(store.loadingWhatsAppProfile).toBe(false);
    expect(store.errorWhatsAppProfile).toBe(false);
    expect(store.updateWhatsAppProfileResult).toBeNull();
    expect(store.loadingUpdateWhatsAppProfile).toBe(false);
    expect(store.errorUpdateWhatsAppProfile).toBe(false);
    expect(store.deleteWhatsAppProfilePhotoResult).toBeNull();
    expect(store.loadingDeleteWhatsAppProfilePhoto).toBe(false);
    expect(store.errorDeleteWhatsAppProfilePhoto).toBe(false);
    expect(store.whatsAppTemplates).toBeNull();
    expect(store.loadingWhatsAppTemplates).toBe(false);
    expect(store.errorWhatsAppTemplates).toBe(false);
    expect(store.templateForm).toEqual({ name: null, category: null });
    expect(store.templateTranslationForms).toEqual({});
    expect(store.templateTranslationSelectedForm).toBeNull();
    expect(store.whatsAppTemplate).toBeNull();
    expect(store.loadingFetchWhatsAppTemplate).toBe(false);
    expect(store.errorFetchWhatsAppTemplate).toBe(false);
    expect(store.whatsAppTemplateSelectLanguages).toBeNull();
    expect(store.loadingFetchWhatsAppTemplateSelectLanguages).toBe(false);
    expect(store.errorFetchWhatsAppTemplateSelectLanguages).toBe(false);
    expect(store.createdTemplateData).toBeNull();
    expect(store.loadingCreateTemplate).toBe(false);
    expect(store.errorCreateTemplate).toBe(false);
    expect(store.createdTemplateTranslationData).toBeNull();
    expect(store.loadingCreateTemplateTranslation).toBe(false);
    expect(store.errorCreateTemplateTranslation).toBe(false);
    expect(store.updatedTemplateTranslationData).toBeNull();
    expect(store.loadingUpdateTemplateTranslation).toBe(false);
    expect(store.errorUpdateTemplateTranslation).toBe(false);
    expect(store.loadingUpdateWebhookInfo).toBe(false);
    expect(store.errorUpdateWebhookInfo).toBeNull();
    expect(store.updateWebhookInfoData).toBeNull();
  });

  it('should fetch WhatsApp contact info and update state', async () => {
    const store = whatsapp_store();
    const mockData = { data: { contact: 'info' } };
    whatsApp.fetchWppContactInfo.mockResolvedValue(mockData);

    await store.fetchWppContactInfo({ code: 'code', appUuid: 'appUuid' });

    expect(store.contactInfo).toEqual(mockData);
    expect(store.fetchedContactInfo).toBe(true);
    expect(store.loadingContactInfo).toBe(false);
    expect(whatsApp.fetchWppContactInfo).toHaveBeenCalledWith('code', 'appUuid');
  });

  it('should handle error when fetching WhatsApp contact info', async () => {
    const store = whatsapp_store();
    const mockError = createError('new Error');
    whatsApp.fetchWppContactInfo.mockRejectedValue(mockError);

    try {
      await store.fetchWppContactInfo({ code: 'code', appUuid: 'appUuid' });
    } catch (err) {
      expect(err.message).toBe('new Error');
      expect(store.contactInfo).toEqual({});
      expect(store.fetchedContactInfo).toBe(false);
      expect(store.loadingContactInfo).toBe(true);
    }
  });

  it('should update WhatsApp contact info', async () => {
    const store = whatsapp_store();
    const mockData = { data: { contact: 'updated info' } };
    whatsApp.updateWppContactInfo.mockResolvedValue(mockData);

    await store.updateWppContactInfo({ code: 'code', appUuid: 'appUuid', payload: {} });

    expect(store.contactInfo).toEqual(mockData.data);
    expect(whatsApp.updateWppContactInfo).toHaveBeenCalledWith('code', 'appUuid', {});
  });

  it('should fetch WhatsApp profile and update state', async () => {
    const store = whatsapp_store();
    const mockProfile = { data: { profile: 'info' } };
    whatsApp.fetchWppProfile.mockResolvedValue(mockProfile);

    await store.fetchWppProfile({ code: 'code', appUuid: 'appUuid' });

    expect(store.whatsAppProfile).toEqual(mockProfile.data);
    expect(store.loadingWhatsAppProfile).toBe(false);
    expect(whatsApp.fetchWppProfile).toHaveBeenCalledWith('code', 'appUuid');
  });

  it('should handle error when fetching WhatsApp profile', async () => {
    const store = whatsapp_store();
    const mockError = new Error('Test Error');
    mockError.response = { data: { error: 'Some error' } };
    whatsApp.fetchWppProfile.mockRejectedValue(mockError);

    await store.fetchWppProfile({ code: 'code', appUuid: 'appUuid' });

    expect(store.whatsAppProfile).toBeNull();
    expect(store.loadingWhatsAppProfile).toBe(false);
    expect(store.errorWhatsAppProfile).toBe('Some error');
    expect(captureSentryException).toHaveBeenCalledWith(mockError);
  });

  it('should update WhatsApp profile', async () => {
    const store = whatsapp_store();
    const mockResult = { data: { result: 'updated' } };
    whatsApp.updateWppProfile.mockResolvedValue(mockResult);

    await store.updateWppProfile({ code: 'code', appUuid: 'appUuid', payload: {} });

    expect(store.updateWhatsAppProfileResult).toEqual(mockResult.data);
    expect(store.loadingUpdateWhatsAppProfile).toBe(false);
    expect(whatsApp.updateWppProfile).toHaveBeenCalledWith('code', 'appUuid', {});
  });
});
