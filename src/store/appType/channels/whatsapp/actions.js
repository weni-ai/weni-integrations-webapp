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
  async fetchWppProfile({ commit }, { code, appUuid }) {
    commit('FETCH_WHATSAPP_PROFILE_REQUEST');
    try {
      const { data } = await whatsApp.fetchWppProfile(code, appUuid);
      commit('FETCH_WHATSAPP_PROFILE_SUCCESS', data);
    } catch (err) {
      commit('FETCH_WHATSAPP_PROFILE_ERROR', err);
    }
  },
  async updateWppProfile({ commit }, { code, appUuid, payload }) {
    commit('UPDATE_WHATSAPP_PROFILE_REQUEST');
    try {
      const { data } = await whatsApp.updateWppProfile(code, appUuid, payload);
      commit('UPDATE_WHATSAPP_PROFILE_SUCCESS', data);
    } catch (err) {
      commit('UPDATE_WHATSAPP_PROFILE_ERROR', err);
    }
  },
  async deleteWppProfilePhoto({ commit }, { code, appUuid }) {
    commit('DELETE_WHATSAPP_PROFILE_PHOTO_REQUEST');
    try {
      const { data } = await whatsApp.deleteWppProfilePhoto(code, appUuid);
      commit('DELETE_WHATSAPP_PROFILE_PHOTO_SUCCESS', data);
    } catch (err) {
      commit('DELETE_WHATSAPP_PROFILE_PHOTO_ERROR', err);
    }
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
