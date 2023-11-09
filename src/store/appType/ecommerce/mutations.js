export default {
  GET_ECOMMERCE_APPS_REQUEST(state) {
    state.loadingEcommerceApps = true;
    state.errorEcommerceApps = null;
    state.ecommerceAppsList = null;
  },
  GET_ECOMMERCE_APPS_SUCCESS(state, data) {
    state.ecommerceAppsList = data;
    state.loadingEcommerceApps = false;
  },
  GET_ECOMMERCE_APPS_ERROR(state, err) {
    state.errorEcommerceApps = err;
    state.loadingEcommerceApps = false;
  },
};
