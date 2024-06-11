import whatsApp from '@/api/appType/whatsapp';
import { captureSentryException } from '@/utils/sentry';

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
      captureSentryException(err);
      commit('CONVERSATIONS_ERROR', err);
    }
  },
  async requestConversationsReport({ commit }, { code, appUuid, params }) {
    commit('CONVERSATIONS_REPORT_REQUEST');
    try {
      const { data } = await whatsApp.requestConversationsReport(code, appUuid, params);
      commit('CONVERSATIONS_REPORT_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('CONVERSATIONS_REPORT_ERROR', err);
    }
  },
  async fetchWppProfile({ commit }, { code, appUuid }) {
    commit('FETCH_WHATSAPP_PROFILE_REQUEST');
    try {
      const { data } = await whatsApp.fetchWppProfile(code, appUuid);
      commit('FETCH_WHATSAPP_PROFILE_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('FETCH_WHATSAPP_PROFILE_ERROR', err);
    }
  },
  async updateWppProfile({ commit }, { code, appUuid, payload }) {
    commit('UPDATE_WHATSAPP_PROFILE_REQUEST');
    try {
      const data = await whatsApp.updateWppProfile(code, appUuid, payload);
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
      captureSentryException(err);
      commit('DELETE_WHATSAPP_PROFILE_PHOTO_ERROR', err);
    }
  },
  async getWhatsAppTemplates({ commit }, { appUuid, params }) {
    commit('GET_WHATSAPP_TEMPLATES_REQUEST');
    try {
      const { data } = await whatsApp.getWhatsAppTemplates(appUuid, params);
      commit('GET_WHATSAPP_TEMPLATES_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('GET_WHATSAPP_TEMPLATES_ERROR', err);
    }
  },

  updateTemplateForm({ commit }, { fieldName, fieldValue }) {
    commit('UPDATE_TEMPLATE_FORM', { fieldName, fieldValue });
  },
  addNewTranslationForm({ commit }, { formName, formData }) {
    commit('ADD_NEW_TRANSLATION_FORM', { formName, formData });
  },
  renameTemplateTranslationForm({ commit }, { currentName, newName }) {
    commit('RENAME_TEMPLATE_TRANSLATION_FORM', { currentName, newName });
    commit('SET_TEMPLATE_TRANSLATION_SELECTED_FORM', { formName: newName });
  },
  updateTemplateTranslationForm({ commit }, { formName, fieldName, fieldValue }) {
    commit('UPDATE_TEMPLATE_TRANSLATION_FORM', { formName, fieldName, fieldValue });
  },
  setTemplateTranslationSelectedForm({ commit }, { formName }) {
    commit('SET_TEMPLATE_TRANSLATION_SELECTED_FORM', { formName });
  },
  clearAllTemplateFormData({ commit }) {
    commit('CLEAR_ALL_TEMPLATE_FORM_DATA');
  },

  clearTemplateData({ commit }) {
    commit('CLEAR_TEMPLATE_DATA');
  },

  async fetchTemplateData({ commit }, { appUuid, templateUuid }) {
    commit('FETCH_WHATSAPP_TEMPLATE_REQUEST');
    try {
      const { data } = await whatsApp.fetchTemplateData(appUuid, templateUuid);
      commit('FETCH_WHATSAPP_TEMPLATE_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('FETCH_WHATSAPP_TEMPLATE_ERROR', err);
    }
  },

  async fetchSelectLanguages({ commit }, { appUuid }) {
    commit('FETCH_WHATSAPP_TEMPLATE_SELECT_LANGUAGES_REQUEST');
    try {
      const { data } = await whatsApp.fetchSelectLanguages(appUuid);
      const formattedData = [];
      for (const language in data) {
        formattedData.push({ value: language, text: data[language] });
      }
      commit('FETCH_WHATSAPP_TEMPLATE_SELECT_LANGUAGES_SUCCESS', formattedData);
    } catch (err) {
      captureSentryException(err);
      commit('FETCH_WHATSAPP_TEMPLATE_SELECT_LANGUAGES_ERROR', err);
    }
  },

  async createTemplate({ commit }, { appUuid, payload }) {
    commit('CREATE_TEMPLATE_REQUEST');
    try {
      const { data } = await whatsApp.createTemplate(appUuid, payload);
      commit('CREATE_TEMPLATE_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      const error = err.response?.data?.error || err;
      commit('CREATE_TEMPLATE_ERROR', error);
    }
  },

  async createTemplateTranslation({ commit }, { appUuid, templateUuid, payload }) {
    commit('CREATE_TEMPLATE_TRANSLATION_REQUEST');
    try {
      const data = await whatsApp.createTemplateTranslation(appUuid, templateUuid, payload);
      commit('CREATE_TEMPLATE_TRANSLATION_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      const error = err.response?.data?.error;
      commit('CREATE_TEMPLATE_TRANSLATION_ERROR', error || err);
    }
  },

  async updateTemplateTranslation({ commit }, { appUuid, templateUuid, payload }) {
    commit('UPDATE_TEMPLATE_TRANSLATION_REQUEST');
    try {
      const { data } = await whatsApp.updateTemplateTranslation(appUuid, templateUuid, payload);
      commit('UPDATE_TEMPLATE_TRANSLATION_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('UPDATE_TEMPLATE_TRANSLATION_ERROR', err);
    }
  },

  async deleteTemplateMessage({ commit }, { appUuid, templateUuid }) {
    commit('DELETE_TEMPLATE_MESSAGE_REQUEST');
    try {
      const { data } = await whatsApp.deleteTemplateMessage(appUuid, templateUuid);
      commit('DELETE_TEMPLATE_MESSAGE_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('DELETE_TEMPLATE_MESSAGE_ERROR', err);
    }
  },

  async updateWppWebhookInfo({ commit }, { code, appUuid, payload }) {
    commit('UPDATE_WEBHOOK_INFO_REQUEST');
    try {
      const { data } = await whatsApp.updateWppWebhookInfo(code, appUuid, payload);
      commit('UPDATE_WEBHOOK_INFO_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('UPDATE_WEBHOOK_INFO_ERROR', err);
    }
  },
};
