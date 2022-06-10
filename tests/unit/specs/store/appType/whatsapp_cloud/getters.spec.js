import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import getters from '@/store/appType/whatsapp_cloud/getters';
import state from '@/store/appType/whatsapp_cloud/state';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/whatsapp_cloud/getters.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        WhatsAppCloud: {
          namespaced: true,
          state,
          getters,
        },
      },
    });

    jest.resetAllMocks();
  });
  it('should return state.wabaId', () => {
    expect(store.getters['WhatsAppCloud/wabaId']).toEqual(state.wabaId);
  });

  it('should return state.businessId', () => {
    expect(store.getters['WhatsAppCloud/businessId']).toEqual(state.businessId);
  });

  it('should return state.whatsAppPhoneNumbers', () => {
    expect(store.getters['WhatsAppCloud/whatsAppPhoneNumbers']).toEqual(state.whatsAppPhoneNumbers);
  });

  it('should return state.fetchedDebugToken', () => {
    expect(store.getters['WhatsAppCloud/fetchedDebugToken']).toEqual(state.fetchedDebugToken);
  });

  it('should return state.loadingDebugToken', () => {
    expect(store.getters['WhatsAppCloud/loadingDebugToken']).toEqual(state.loadingDebugToken);
  });

  it('should return state.fetchedPhoneNumbers', () => {
    expect(store.getters['WhatsAppCloud/fetchedPhoneNumbers']).toEqual(state.fetchedPhoneNumbers);
  });

  it('should return state.loadingPhoneNumbers', () => {
    expect(store.getters['WhatsAppCloud/loadingPhoneNumbers']).toEqual(state.loadingPhoneNumbers);
  });

  it('should return state.selectedPhoneNumber', () => {
    expect(store.getters['WhatsAppCloud/selectedPhoneNumber']).toEqual(state.selectedPhoneNumber);
  });

  it('should return state.loadingWhatsAppCloudConfigure', () => {
    expect(store.getters['WhatsAppCloud/loadingWhatsAppCloudConfigure']).toEqual(
      state.loadingWhatsAppCloudConfigure,
    );
  });
});
