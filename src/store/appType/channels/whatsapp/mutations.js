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
};
