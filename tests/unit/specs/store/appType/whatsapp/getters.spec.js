import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import getters from '@/store/appType/channels/whatsapp/getters';
import state from '@/store/appType/channels/whatsapp/state';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/whatsapp/getters.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        WhatsApp: {
          namespaced: true,
          state,
          getters,
        },
      },
    });

    jest.resetAllMocks();
  });
  it('should return state.contactInfo', () => {
    expect(store.getters['WhatsApp/contactInfo']).toEqual(state.contactInfo);
  });

  it('should return state.fetchedContactInfo', () => {
    expect(store.getters['WhatsApp/fetchedContactInfo']).toEqual(state.fetchedContactInfo);
  });

  it('should return state.loadingContactInfo', () => {
    expect(store.getters['WhatsApp/loadingContactInfo']).toEqual(state.loadingContactInfo);
  });

  it('should return state.templateTranslationCurrentForm', () => {
    state.templateTranslationForms[state.templateTranslationSelectedForm] = {
      foo: 'bar',
    };

    expect(store.getters['WhatsApp/templateTranslationCurrentForm']).toEqual(
      state.templateTranslationForms[state.templateTranslationSelectedForm],
    );
  });

  it('should return state.templateTranslationCurrentForm default as empty object', () => {
    state.templateTranslationForms[state.templateTranslationSelectedForm] = null;
    expect(store.getters['WhatsApp/templateTranslationCurrentForm']).toEqual({});
  });
});
