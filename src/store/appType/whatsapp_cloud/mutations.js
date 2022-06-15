export default {
  DEBUG_TOKEN_REQUEST(state) {
    state.loadingDebugToken = true;
  },
  DEBUG_TOKEN_SUCCESS(state, data) {
    state.wabaId = data.waba_id;
    state.businessId = data.business_id;
    state.loadingDebugToken = false;
  },
  DEBUG_TOKEN_ERROR(state, data) {
    state.errorDebugToken = data;
    state.loadingDebugToken = false;
  },

  PHONE_NUMBERS_REQUEST(state) {
    state.loadingPhoneNumbers = true;
  },
  PHONE_NUMBERS_SUCCESS(state, data) {
    state.whatsAppPhoneNumbers = data;
    state.loadingPhoneNumbers = false;
  },
  PHONE_NUMBERS_ERROR(state, data) {
    state.errorPhoneNumbers = data;
    state.loadingPhoneNumbers = false;
  },

  CLOUD_CONFIGURE_REQUEST(state) {
    state.loadingWhatsAppCloudConfigure = true;
  },
  CLOUD_CONFIGURE_SUCCESS(state) {
    state.loadingWhatsAppCloudConfigure = false;
  },
  CLOUD_CONFIGURE_ERROR(state, data) {
    state.errorCloudConfigure = data;
    state.loadingWhatsAppCloudConfigure = false;
  },

  SET_SELECTED_PHONE_NUMBER(state, data) {
    state.selectedPhoneNumber = data;
  },
};
