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
};
