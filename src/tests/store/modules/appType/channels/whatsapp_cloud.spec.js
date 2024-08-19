import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';
import whatsAppCloud from '@/api/appType/whatsapp_cloud/index';
import { captureSentryException } from '@/utils/sentry';

vi.mock('@/api/appType/whatsapp_cloud/index', () => ({
  default: {
    getDebugToken: vi.fn(),
    getWhatsAppPhoneNumbers: vi.fn(),
    configurePhoneNumber: vi.fn(),
    getWhatsAppCloudCatalogs: vi.fn(),
    fetchCatalogData: vi.fn(),
    disableWhatsAppCloudCatalogs: vi.fn(),
    enableWhatsAppCloudCatalogs: vi.fn(),
    toggleCartVisibility: vi.fn(),
    toggleCatalogVisibility: vi.fn(),
    getCommerceSettings: vi.fn(),
    getCatalogProducts: vi.fn(),
  },
}));

vi.mock('@/utils/sentry', () => ({
  captureSentryException: vi.fn(),
}));

describe('whatsapp_cloud store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const store = whatsapp_cloud();
    expect(store.wabaId).toBeNull();
    expect(store.businessId).toBeNull();
    expect(store.whatsAppPhoneNumbers).toBeNull();
    expect(store.selectedPhoneNumber).toBeNull();
  });

  it('should fetch debug token and update state', async () => {
    const store = whatsapp_cloud();
    const mockData = { data: { waba_id: '123', business_id: '456' } };
    whatsAppCloud.getDebugToken.mockResolvedValue(mockData);

    await store.getDebugToken({ params: {} });

    expect(store.wabaId).toBe('123');
    expect(store.businessId).toBe('456');
    expect(store.loadingDebugToken).toBe(false);
    expect(store.errorDebugToken).toBeNull();
    expect(whatsAppCloud.getDebugToken).toHaveBeenCalledWith({});
  });

  it('should handle error when fetching debug token', async () => {
    const store = whatsapp_cloud();
    const mockError = new Error('Test Error');
    mockError.response = { data: { error: 'Some error' } };
    whatsAppCloud.getDebugToken.mockRejectedValue(mockError);

    await store.getDebugToken({ params: {} });

    expect(store.wabaId).toBeNull();
    expect(store.businessId).toBeNull();
    expect(store.loadingDebugToken).toBe(false);
    expect(store.errorDebugToken).toBe('Some error');
    expect(captureSentryException).toHaveBeenCalledWith(mockError);
  });

  it('should fetch WhatsApp phone numbers and update state', async () => {
    const store = whatsapp_cloud();
    const mockPhoneNumbers = ['+123456789'];
    whatsAppCloud.getWhatsAppPhoneNumbers.mockResolvedValue({ data: mockPhoneNumbers });

    await store.getWhatsAppPhoneNumbers({ params: {} });

    expect(store.whatsAppPhoneNumbers).toEqual(mockPhoneNumbers);
    expect(store.loadingPhoneNumbers).toBe(false);
    expect(store.errorPhoneNumbers).toBeNull();
    expect(whatsAppCloud.getWhatsAppPhoneNumbers).toHaveBeenCalledWith({});
  });

  it('should handle error when fetching WhatsApp phone numbers', async () => {
    const store = whatsapp_cloud();
    const mockError = new Error('Test Error');
    mockError.response = { data: { error: 'Some error' } };
    whatsAppCloud.getWhatsAppPhoneNumbers.mockRejectedValue(mockError);

    await store.getWhatsAppPhoneNumbers({ params: {} });

    expect(store.whatsAppPhoneNumbers).toBeNull();
    expect(store.loadingPhoneNumbers).toBe(false);
    expect(store.errorPhoneNumbers).toBe('Some error');
    expect(captureSentryException).toHaveBeenCalledWith(mockError);
  });
});
