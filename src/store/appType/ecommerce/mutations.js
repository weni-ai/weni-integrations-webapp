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

  CONNECT_VTEX_CATALOG_REQUEST(state) {
    state.loadingConnectVtexCatalog = true;
    state.errorConnectVtexCatalog = null;
    state.connectVtexCatalogData = null;
  },
  CONNECT_VTEX_CATALOG_SUCCESS(state, data) {
    state.connectVtexCatalogData = data;
    state.loadingConnectVtexCatalog = false;
  },
  CONNECT_VTEX_CATALOG_ERROR(state, err) {
    state.errorConnectVtexCatalog = err;
    state.loadingConnectVtexCatalog = false;
  },
};
