export default {
  GET_ALL_APP_TYPES_REQUEST(state) {
    state.loadingAllAppTypes = true;
    state.errorAllAppTypes = null;
    state.allAppTypes = null;
  },
  GET_ALL_APP_TYPES_SUCCESS(state, data) {
    state.allAppTypes = data;
    state.loadingAllAppTypes = false;
  },
  GET_ALL_APP_TYPES_ERROR(state, err) {
    state.errorAllAppTypes = err;
  },

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
