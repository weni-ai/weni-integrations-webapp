import ecommerce from '@/api/appType/ecommerce';

export default {
  async getEcommerceTypes({ commit }) {
    commit('GET_ECOMMERCE_APPS_REQUEST');
    try {
      const { data } = await ecommerce.getAllEcommerceTypes();
      commit('GET_ECOMMERCE_APPS_SUCCESS', data);
    } catch (err) {
      commit('GET_ECOMMERCE_APPS_ERROR', err);
    }
  },
  // Received code and appUuid are from the related WhatsApp Cloud Channel
  async connectVtexCatalog({ commit }, { code, appUuid, payload }) {
    commit('CONNECT_VTEX_CATALOG_REQUEST');
    try {
      const { data } = await ecommerce.connectVtexCatalog(code, appUuid, payload);
      commit('CONNECT_VTEX_CATALOG_SUCCESS', data);
    } catch (err) {
      commit('CONNECT_VTEX_CATALOG_ERROR', err);
    }
  },
};
