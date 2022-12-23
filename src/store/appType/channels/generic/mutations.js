export default {
  GET_APP_FORM_REQUEST(state) {
    state.loadingAppForm = true;
    state.genericAppForm = null;
    state.genericAppAttributes = null;
    state.errorAppForm = null;
  },
  GET_APP_FORM_SUCCESS(state, data) {
    state.genericAppForm = data.form;
    state.genericAppAttributes = data.attributes;
    state.loadingAppForm = false;
  },
  GET_APP_FORM_ERROR(state, data) {
    state.errorAppForm = data;
    state.loadingAppForm = false;
  },
};
