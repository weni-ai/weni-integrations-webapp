import WhatsAppCloud from '@/api/appType/whatsapp_cloud';

export default {
  async getDebugToken({ commit }, { params }) {
    commit('DEBUG_TOKEN_REQUEST');
    try {
      const { data } = await WhatsAppCloud.getDebugToken(params);
      commit('DEBUG_TOKEN_SUCCESS', data);
    } catch (err) {
      commit('DEBUG_TOKEN_ERROR', err);
    }
  },
  async getWhatsAppPhoneNumbers({ commit }, { params }) {
    commit('PHONE_NUMBERS_REQUEST');
    try {
      const { data } = await WhatsAppCloud.getWhatsAppPhoneNumbers(params);
      commit('PHONE_NUMBERS_SUCCESS', data);
    } catch (err) {
      commit('PHONE_NUMBERS_ERROR', err);
    }
  },
  async configurePhoneNumber({ commit }, { data }) {
    commit('CLOUD_CONFIGURE_REQUEST');
    try {
      await WhatsAppCloud.configurePhoneNumber(data);
      commit('CLOUD_CONFIGURE_SUCCESS');
    } catch (err) {
      commit('CLOUD_CONFIGURE_ERROR', err);
    }
  },
  setSelectedPhoneNumber({ commit }, { data }) {
    commit('SET_SELECTED_PHONE_NUMBER', data);
  },
};
