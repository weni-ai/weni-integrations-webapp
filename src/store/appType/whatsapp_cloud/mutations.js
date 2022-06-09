export default {
  SET_WPP_CLOUD_WABA_ID(state, data) {
    state.wabaId = data;
  },
  SET_FETCHED_WABA_ID(state, data) {
    state.fetchedWabaId = data;
  },
  SET_LOADING_WABA_ID(state, data) {
    state.loadingWabaId = data;
  },
  SET_WPP_CLOUD_PHONE_NUMBERS(state, data) {
    state.whatsAppPhoneNumbers = data;
  },
  SET_FETCHED_PHONE_NUMBERS(state, data) {
    state.fetchedPhoneNumbers = data;
  },
  SET_LOADING_PHONE_NUMBERS(state, data) {
    state.loadingPhoneNumbers = data;
  },
  SET_SELECTED_PHONE_NUMBER(state, data) {
    state.selectedPhoneNumber = data;
  },
};
