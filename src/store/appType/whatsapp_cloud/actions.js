import WhatsAppCloud from '@/api/appType/whatsapp_cloud';

export default {
  async getDebugToken({ commit }, { params }) {
    commit('SET_LOADING_DEBUG_TOKEN', true);
    const { data } = await WhatsAppCloud.getDebugToken(params);
    commit('SET_WPP_CLOUD_WABA_ID', data.waba_id);
    commit('SET_WPP_CLOUD_BUSINESS_ID', data.business_id);
    commit('SET_FETCHED_DEBUG_TOKEN', true);
    commit('SET_LOADING_DEBUG_TOKEN', false);
  },
  async getWhatsAppPhoneNumbers({ commit }, { params }) {
    commit('SET_LOADING_PHONE_NUMBERS', true);
    const { data } = await WhatsAppCloud.getWhatsAppPhoneNumbers(params);
    commit('SET_WPP_CLOUD_PHONE_NUMBERS', data);
    commit('SET_FETCHED_PHONE_NUMBERS', true);
    commit('SET_LOADING_PHONE_NUMBERS', false);
  },
  async configurePhoneNumber({ commit }, { data }) {
    commit('SET_LOADING_WHATSAPP_CLOUD_CONFIGURE', true);
    await WhatsAppCloud.configurePhoneNumber(data);
    commit('SET_LOADING_WHATSAPP_CLOUD_CONFIGURE', false);
  },
  setSelectedPhoneNumber({ commit }, { data }) {
    commit('SET_SELECTED_PHONE_NUMBER', data);
  },
};
