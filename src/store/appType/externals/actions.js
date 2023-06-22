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
  async createPrompts({ commit }, { code, appUuid, payload }) {
    commit('CREATE_PROMPTS_REQUEST');
    try {
      const { data } = await externalServices.createPrompts(code, appUuid, payload);
      commit('CREATE_PROMPTS_SUCCESS', data);
    } catch (err) {
      commit('CREATE_PROMPTS_ERROR', err);
    }
  },
  async getPrompts({ commit }, { code, appUuid }) {
    commit('GET_PROMPTS_REQUEST');
    try {
      const { data } = await externalServices.getPrompts(code, appUuid);
      commit('GET_PROMPTS_SUCCESS', data);
    } catch (err) {
      commit('GET_PROMPTS_ERROR', err);
    }
  },
  async deletePrompts({ commit }, { code, appUuid, payload }) {
    commit('DELETE_PROMPTS_REQUEST');
    try {
      const { data } = await externalServices.deletePrompts(code, appUuid, payload);
      commit('DELETE_PROMPTS_SUCCESS', data);
    } catch (err) {
      commit('DELETE_PROMPTS_ERROR', err);
    }
  },
};
