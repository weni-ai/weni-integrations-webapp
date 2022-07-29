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
};
