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
  async getConversations({ commit }, { code, appUuid, params }) {
    commit('CONVERSATIONS_REQUEST');
    try {
      const { data } = await whatsApp.getConversations(code, appUuid, params);
      commit('CONVERSATIONS_SUCCESS', data);
    } catch (err) {
      commit('CONVERSATIONS_ERROR', err);
    }
  },
  async fetchWppProfile(store, { code, appUuid }) {
    return await whatsApp.fetchWppProfile(code, appUuid);
  },
  async updateWppProfile(store, { code, appUuid, payload }) {
    return await whatsApp.updateWppProfile(code, appUuid, payload);
  },
  async deleteWppProfilePhoto(store, { code, appUuid }) {
    return await whatsApp.deleteWppProfilePhoto(code, appUuid);
  },
};
