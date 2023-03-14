export default {
  GET_EXTERNAL_SERVICES_REQUEST(state) {
    state.loadingExternalServices = true;
    state.errorExternalServices = null;
    state.externalServicesList = null;
  },
  GET_EXTERNAL_SERVICES_SUCCESS(state, data) {
    state.externalServicesList = data;
    state.loadingExternalServices = false;
  },
  GET_EXTERNAL_SERVICES_ERROR(state, err) {
    state.errorExternalServices = err;
    state.loadingExternalServices = false;
  },
};
