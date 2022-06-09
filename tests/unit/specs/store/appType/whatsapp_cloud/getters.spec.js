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

  it('should return state.whatsAppPhoneNumbers', () => {
    expect(store.getters['WhatsAppCloud/whatsAppPhoneNumbers']).toEqual(state.whatsAppPhoneNumbers);
  });

  it('should return state.fetchedWabaId', () => {
    expect(store.getters['WhatsAppCloud/fetchedWabaId']).toEqual(state.fetchedWabaId);
  });

  it('should return state.loadingWabaId', () => {
    expect(store.getters['WhatsAppCloud/loadingWabaId']).toEqual(state.loadingWabaId);
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
});
