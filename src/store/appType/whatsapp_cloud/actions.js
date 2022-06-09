import WhatsAppCloud from '@/api/appType/whatsapp_cloud';

export default {
  async getWabaId({ commit }, { params }) {
    commit('SET_LOADING_WABA_ID', true);
    const { data } = await WhatsAppCloud.getWabaId(params);
    commit('SET_WPP_CLOUD_WABA_ID', data);
    commit('SET_FETCHED_WABA_ID', true);
    commit('SET_LOADING_WABA_ID', false);
  },
  async getWhatsAppPhoneNumbers({ commit }, { params }) {
    commit('SET_LOADING_PHONE_NUMBERS', true);
    const { data } = await WhatsAppCloud.getWhatsAppPhoneNumbers(params);
    commit('SET_WPP_CLOUD_PHONE_NUMBERS', data);
    commit('SET_FETCHED_PHONE_NUMBERS', true);
    commit('SET_LOADING_PHONE_NUMBERS', false);
  },
};
