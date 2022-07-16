export default {
  DELETE_APP_REQUEST(state) {
    state.loadingDeleteApp = true;
    state.errorDeleteApp = null;
  },
  DELETE_APP_SUCCESS(state) {
    state.loadingDeleteApp = false;
  },
  DELETE_APP_ERROR(state, err) {
    state.errorDeleteApp = err;
    state.loadingDeleteApp = false;
  },

  CREATE_APP_REQUEST(state) {
    state.loadingCreateApp = true;
    state.errorCreateApp = null;
    state.createAppResponse = null;
  },
  CREATE_APP_SUCCESS(state, data) {
    state.createAppResponse = data;
    state.loadingCreateApp = false;
  },
  CREATE_APP_ERROR(state, err) {
    state.errorCreateApp = err;
    state.loadingCreateApp = false;
  },
};
