import externalServices from '@/api/appType/externalServices';

export default {
  async getExternalServicesTypes({ commit }) {
    commit('GET_EXTERNAL_SERVICES_REQUEST');
    try {
      const { data } = await externalServices.getAllExternalServicesTypes();
      commit('GET_EXTERNAL_SERVICES_SUCCESS', data);
    } catch (err) {
      commit('GET_EXTERNAL_SERVICES_ERROR', err);
    }
  },
};
