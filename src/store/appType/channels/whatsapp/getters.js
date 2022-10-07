export default {
  contactInfo(state) {
    return state.contactInfo;
  },
  fetchedContactInfo(state) {
    return state.fetchedContactInfo;
  },
  loadingContactInfo(state) {
    return state.loadingContactInfo;
  },
  templateTranslationCurrentForm(state) {
    return state.templateTranslationForms[state.templateTranslationSelectedForm] || {};
  },
};
