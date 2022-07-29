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

  CONVERSATIONS_REQUEST(state) {
    state.loadingConversations = true;
    state.whatsAppConversations = null;
    state.errorConversations = null;
  },
  CONVERSATIONS_SUCCESS(state, data) {
    state.whatsAppConversations = data;
    state.loadingConversations = false;
  },
  CONVERSATIONS_ERROR(state, data) {
    state.errorConversations = data;
    state.loadingConversations = false;
  },

  FETCH_WHATSAPP_PROFILE_REQUEST(state) {
    state.loadingWhatsAppProfile = true;
    state.whatsAppProfile = null;
    state.errorWhatsAppProfile = null;
  },
  FETCH_WHATSAPP_PROFILE_SUCCESS(state, data) {
    state.whatsAppProfile = data;
    state.loadingWhatsAppProfile = false;
  },
  FETCH_WHATSAPP_PROFILE_ERROR(state, data) {
    state.errorWhatsAppProfile = data;
    state.loadingWhatsAppProfile = false;
  },

  UPDATE_WHATSAPP_PROFILE_REQUEST(state) {
    state.loadingUpdateWhatsAppProfile = true;
    state.updateWhatsAppProfileResult = null;
    state.errorUpdateWhatsAppProfile = null;
  },
  UPDATE_WHATSAPP_PROFILE_SUCCESS(state, data) {
    state.updateWhatsAppProfileResult = data;
    state.loadingUpdateWhatsAppProfile = false;
  },
  UPDATE_WHATSAPP_PROFILE_ERROR(state, data) {
    state.errorUpdateWhatsAppProfile = data;
    state.loadingUpdateWhatsAppProfile = false;
  },
};
