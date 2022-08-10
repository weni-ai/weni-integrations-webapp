import whatsApp from '@/api/appType/whatsapp';

export default {
  resetWppFetchResults({ commit }) {
    commit('SET_FETCHED_CONTACT_INFO', false);
  },
  async fetchWppContactInfo({ commit }, { code, appUuid }) {
    commit('SET_LOADING_CONTACT_INFO', true);
    const { data } = await whatsApp.fetchWppContactInfo(code, appUuid);
    commit('SET_WPP_CONTACT_INFO', data);
    commit('SET_FETCHED_CONTACT_INFO', true);
    commit('SET_LOADING_CONTACT_INFO', false);
  },
  async updateWppContactInfo({ commit }, { code, appUuid, payload }) {
    const { data } = await whatsApp.updateWppContactInfo(code, appUuid, payload);
    commit('SET_WPP_CONTACT_INFO', data);
  },
  async getWhatsAppTemplates({ commit }, { code, appUuid }) {
    commit('GET_WHATSAPP_TEMPLATES_REQUEST');
    try {
      const { data } = await whatsApp.getWhatsAppTemplates(code, appUuid);
      commit('GET_WHATSAPP_TEMPLATES_SUCCESS', data);
    } catch (err) {
      // captureSentryException(err);
      commit('GET_WHATSAPP_TEMPLATES_ERROR', err);
    }
  },
};
