export default {
  SET_WPP_CONTACT_INFO(state, data) {
    state.contactInfo = data;
  },
  SET_FETCHED_CONTACT_INFO(state, data) {
    state.fetchedContactInfo = data;
  },
  SET_LOADING_CONTACT_INFO(state, data) {
    state.loadingContactInfo = data;
  },

  GET_WHATSAPP_TEMPLATES_REQUEST(state) {
    state.loadingWhatsAppTemplates = true;
    state.whatsAppTemplates = null;
    state.errorWhatsAppTemplates = null;
  },
  GET_WHATSAPP_TEMPLATES_SUCCESS(state, data) {
    state.whatsAppTemplates = data;
    state.loadingWhatsAppTemplates = false;
  },
  GET_WHATSAPP_TEMPLATES_ERROR(state, data) {
    state.errorWhatsAppTemplates = data;
    state.loadingWhatsAppTemplates = false;
  },
};
