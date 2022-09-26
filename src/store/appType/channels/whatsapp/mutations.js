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

  DELETE_WHATSAPP_PROFILE_PHOTO_REQUEST(state) {
    state.loadingDeleteWhatsAppProfilePhoto = true;
    state.deleteWhatsAppProfilePhotoResult = null;
    state.errorDeleteWhatsAppProfilePhoto = null;
  },
  DELETE_WHATSAPP_PROFILE_PHOTO_SUCCESS(state, data) {
    state.deleteWhatsAppProfilePhotoResult = data;
    state.loadingDeleteWhatsAppProfilePhoto = false;
  },
  DELETE_WHATSAPP_PROFILE_PHOTO_ERROR(state, data) {
    state.errorDeleteWhatsAppProfilePhoto = data;
    state.loadingDeleteWhatsAppProfilePhoto = false;
  },

  GET_WHATSAPP_TEMPLATES_REQUEST(state) {
    state.loadingWhatsAppTemplates = true;
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

  UPDATE_TEMPLATE_FORM(state, { fieldName, fieldValue }) {
    const updatedForm = state.templateForm;
    updatedForm[fieldName] = fieldValue;
    state.templateForm = { ...updatedForm };
  },
  ADD_NEW_TRANSLATION_FORM(state, { formName, formData = {} }) {
    state.templateTranslationForms[formName] = formData;
  },
  RENAME_TEMPLATE_TRANSLATION_FORM(state, { currentName, newName }) {
    state.templateTranslationForms[newName] = state.templateTranslationForms[currentName];
    delete state.templateTranslationForms[currentName];
  },
  UPDATE_TEMPLATE_TRANSLATION_FORM(state, { formName, fieldName, fieldValue }) {
    const updatedForms = state.templateTranslationForms;

    if (Array.isArray(fieldValue)) {
      updatedForms[formName][fieldName] = [...fieldValue];
    } else if (typeof fieldValue === 'object' && fieldValue !== null) {
      updatedForms[formName][fieldName] = { ...fieldValue };
    } else {
      updatedForms[formName][fieldName] = fieldValue;
    }

    state.templateTranslationForms = { ...updatedForms };
  },
  UPDATE_TEMPLATE_TRANSLATION_FORM_STATIC(state, { formName, fieldName, fieldValue }) {
    state.templateTranslationForms[formName][fieldName] = fieldValue;
  },
  SET_TEMPLATE_TRANSLATION_SELECTED_FORM(state, { formName }) {
    state.templateTranslationSelectedForm = formName;
  },

  CLEAR_ALL_TEMPLATE_FORM_DATA(state) {
    state.templateForm = {};
    state.templateTranslationForms = {};
    state.templateTranslationSelectedForm = null;
  },

  FETCH_WHATSAPP_TEMPLATE_REQUEST(state) {
    state.loadingFetchWhatsAppTemplate = true;
    state.errorFetchWhatsAppTemplate = null;
  },
  FETCH_WHATSAPP_TEMPLATE_SUCCESS(state, data) {
    state.whatsAppTemplate = data;
    state.loadingFetchWhatsAppTemplate = false;
  },
  FETCH_WHATSAPP_TEMPLATE_ERROR(state, data) {
    state.errorFetchWhatsAppTemplate = data;
    state.loadingFetchWhatsAppTemplate = false;
  },

  FETCH_WHATSAPP_TEMPLATE_SELECT_LANGUAGES_REQUEST(state) {
    state.loadingFetchWhatsAppTemplateSelectLanguages = true;
    state.errorFetchWhatsAppTemplateSelectLanguages = null;
  },
  FETCH_WHATSAPP_TEMPLATE_SELECT_LANGUAGES_SUCCESS(state, data) {
    state.whatsAppTemplateSelectLanguages = data;
    state.loadingFetchWhatsAppTemplateSelectLanguages = false;
  },
  FETCH_WHATSAPP_TEMPLATE_SELECT_LANGUAGES_ERROR(state, data) {
    state.errorFetchWhatsAppTemplateSelectLanguages = data;
    state.loadingFetchWhatsAppTemplateSelectLanguages = false;
  },

  CREATE_TEMPLATE_REQUEST(state) {
    state.loadingCreateTemplate = true;
    state.createdTemplateData = null;
    state.errorCreateTemplate = null;
  },
  CREATE_TEMPLATE_SUCCESS(state, data) {
    state.createdTemplateData = data;
    state.loadingCreateTemplate = false;
  },
  CREATE_TEMPLATE_ERROR(state, data) {
    state.errorCreateTemplate = data;
    state.loadingCreateTemplate = false;
  },

  CREATE_TEMPLATE_TRANSLATION_REQUEST(state) {
    state.loadingCreateTemplateTranslation = true;
    state.createdTemplateTranslationData = null;
    state.errorCreateTemplateTranslation = null;
  },
  CREATE_TEMPLATE_TRANSLATION_SUCCESS(state, data) {
    state.createdTemplateTranslationData = data;
    state.loadingCreateTemplateTranslation = false;
  },
  CREATE_TEMPLATE_TRANSLATION_ERROR(state, data) {
    state.errorCreateTemplateTranslation = data;
    state.loadingCreateTemplateTranslation = false;
  },

  DELETE_TEMPLATE_MESSAGE_REQUEST(state) {
    state.loadingDeleteTemplateMessage = true;
    state.deletedTemplateMessageData = null;
    state.errorDeleteTemplateMessage = null;
  },
  DELETE_TEMPLATE_MESSAGE_SUCCESS(state, data) {
    state.deletedTemplateMessageData = data;
    state.loadingDeleteTemplateMessage = false;
  },
  DELETE_TEMPLATE_MESSAGE_ERROR(state, data) {
    state.errorDeleteTemplateMessage = data;
    state.loadingDeleteTemplateMessage = false;
  },
};
