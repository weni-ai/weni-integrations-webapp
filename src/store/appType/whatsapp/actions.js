import WhatsApp from '@/api/appType/whatsapp';

export default {
  resetWppFetchResults({ commit }) {
    commit('SET_FETCHED_CONTACT_INFO', false);
  },
  async fetchWppContactInfo({ commit }, { code, appUuid }) {
    commit('SET_LOADING_CONTACT_INFO', true);
    const { data } = await WhatsApp.fetchWppContactInfo(code, appUuid);
    commit('SET_WPP_CONTACT_INFO', data);
    commit('SET_FETCHED_CONTACT_INFO', true);
    commit('SET_LOADING_CONTACT_INFO', false);
  },
  async updateWppContactInfo({ commit }, { code, appUuid, payload }) {
    const { data } = await WhatsApp.updateWppContactInfo(code, appUuid, payload);
    commit('SET_WPP_CONTACT_INFO', data);
  },
};
