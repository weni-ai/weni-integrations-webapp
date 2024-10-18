import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
import ecommerce from '@/api/appType/ecommerce';

vi.mock('@/api/appType/ecommerce', () => ({
  default: {
    getAllEcommerceTypes: vi.fn(),
    connectVtexCatalog: vi.fn(),
    getVtexAppUuid: vi.fn(),
    getSellers: vi.fn(),
    checkSellers: vi.fn(),
    syncSellers: vi.fn(),
  },
}));

describe('ecommerce_store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const store = ecommerce_store();
    expect(store.loadingEcommerceApps).toBe(true);
    expect(store.errorEcommerceApps).toBeNull();
    expect(store.ecommerceAppsList).toBeNull();

    expect(store.loadingConnectVtexCatalog).toBe(false);
    expect(store.errorConnectVtexCatalog).toBeNull();
    expect(store.connectVtexCatalogData).toBeNull();

    expect(store.loadingVtexAppUuid).toBe(false);
    expect(store.errorVtexAppUuid).toBeNull();
    expect(store.generatedVtexAppUuid).toBeNull();

    expect(store.loadingSellersList).toBe(false);
    expect(store.sellersList).toEqual([]);
    expect(store.errorSellersList).toBeNull();

    expect(store.loadingSyncSellers).toBe(false);
    expect(store.errorSyncSellers).toBeNull();

    expect(store.checkSellers).toBeNull();
  });

  it('should get ecommerce types and update state', async () => {
    const store = ecommerce_store();
    const mockEcommerceTypes = [
      { id: 1, name: 'Type 1' },
      { id: 2, name: 'Type 2' },
    ];
    ecommerce.getAllEcommerceTypes.mockResolvedValue(mockEcommerceTypes);

    await store.getEcommerceTypes();

    expect(store.ecommerceAppsList).toEqual(mockEcommerceTypes);
    expect(store.loadingEcommerceApps).toBe(false);
    expect(store.errorEcommerceApps).toBeNull();
    expect(ecommerce.getAllEcommerceTypes).toHaveBeenCalled();
  });

  it('should handle error when getting ecommerce types', async () => {
    const store = ecommerce_store();
    const mockError = new Error('Test Error');
    ecommerce.getAllEcommerceTypes.mockRejectedValue(mockError);

    await store.getEcommerceTypes();

    expect(store.ecommerceAppsList).toBeNull();
    expect(store.loadingEcommerceApps).toBe(false);
    expect(store.errorEcommerceApps).toBe(mockError);
  });

  it('should connect to Vtex catalog and update state', async () => {
    const store = ecommerce_store();
    const mockData = { result: 'success' };
    ecommerce.connectVtexCatalog.mockResolvedValue({ data: mockData });

    await store.connectVtexCatalog({ code: 'code', appUuid: 'uuid', payload: {} });

    expect(store.connectVtexCatalogData).toEqual(mockData);
    expect(store.loadingConnectVtexCatalog).toBe(false);
    expect(store.errorConnectVtexCatalog).toBeNull();
  });

  it('should handle error when connecting to Vtex catalog', async () => {
    const store = ecommerce_store();
    const mockError = new Error('Test Error');
    ecommerce.connectVtexCatalog.mockRejectedValue(mockError);

    await store.connectVtexCatalog({ code: 'code', appUuid: 'uuid', payload: {} });

    expect(store.connectVtexCatalogData).toBeNull();
    expect(store.loadingConnectVtexCatalog).toBe(false);
    expect(store.errorConnectVtexCatalog).toBe(mockError);
  });

  it('should get Vtex app UUID and update state', async () => {
    const store = ecommerce_store();
    const mockUuid = 'mock-uuid';
    ecommerce.getVtexAppUuid.mockResolvedValue(mockUuid);

    await store.getVtexAppUuid({ code: 'code' });

    expect(store.generatedVtexAppUuid).toEqual(mockUuid);
    expect(store.loadingVtexAppUuid).toBe(false);
    expect(store.errorVtexAppUuid).toBeNull();
  });

  it('should handle error when getting Vtex app UUID', async () => {
    const store = ecommerce_store();
    const mockError = new Error('Test Error');
    ecommerce.getVtexAppUuid.mockRejectedValue(mockError);

    await store.getVtexAppUuid({ code: 'code' });

    expect(store.generatedVtexAppUuid).toBeNull();
    expect(store.loadingVtexAppUuid).toBe(false);
    expect(store.errorVtexAppUuid).toBe(mockError);
  });

  it('should get sellers list and update state', async () => {
    const store = ecommerce_store();
    const mockSellers = [
      { id: 1, name: 'Seller 1' },
      { id: 2, name: 'Seller 2' },
    ];
    ecommerce.getSellers.mockResolvedValue(mockSellers);

    await store.getSellersList({ uuid: 'uuid' });

    expect(store.sellersList).toEqual(mockSellers);
    expect(store.loadingSellersList).toBe(false);
    expect(store.errorSellersList).toBeNull();
  });

  it('should handle error when getting sellers list', async () => {
    const store = ecommerce_store();
    const mockError = new Error('Test Error');
    ecommerce.getSellers.mockRejectedValue(mockError);

    await store.getSellersList({ uuid: 'uuid' });

    expect(store.sellersList).toEqual([]);
    expect(store.loadingSellersList).toBe(false);
    expect(store.errorSellersList).toBe(mockError);
  });

  it('should check sellers without updating state', async () => {
    const store = ecommerce_store();
    ecommerce.checkSellers.mockResolvedValue();

    await store.checkSyncSellers({ uuid: 'uuid' });

    expect(store.checkSellers).toBeNull();
  });

  it('should handle error when checking sellers', async () => {
    const store = ecommerce_store();
    const mockError = new Error('Test Error');
    ecommerce.checkSellers.mockRejectedValue(mockError);

    await store.checkSyncSellers({ uuid: 'uuid' });

    expect(store.checkSellers).toBe(mockError);
  });

  it('should sync sellers and update state', async () => {
    const store = ecommerce_store();
    ecommerce.syncSellers.mockResolvedValue();

    await store.syncSellers({ uuid: 'uuid', payload: {} });

    expect(store.loadingSyncSellers).toBe(false);
    expect(store.errorSyncSellers).toBeNull();
  });

  it('should handle error when syncing sellers', async () => {
    const store = ecommerce_store();
    const mockError = new Error('Test Error');
    ecommerce.syncSellers.mockRejectedValue(mockError);

    await store.syncSellers({ uuid: 'uuid', payload: {} });

    expect(store.loadingSyncSellers).toBe(false);
    expect(store.errorSyncSellers).toBe(mockError);
  });
});
