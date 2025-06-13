import qs from 'query-string';
import request from '@/api/request.js';

const resource = '/api/v1/apptypes';
const templatesResource = '/api/v1/apps';

export default {
  async fetchWppContactInfo(appCode, appUuid) {
    return await request.$http
      .get(`${resource}/${appCode}/apps/${appUuid}/contact/`)
      .then((r) => r.data);
  },
  updateWppContactInfo(appCode, appUuid, payload) {
    return request.$http.patch(`${resource}/${appCode}/apps/${appUuid}/contact/`, payload);
  },
  getConversations(appCode, appUuid, params) {
    const queryString = qs.stringify(params);
    return request.$http.get(
      `${resource}/${appCode}/apps/${appUuid}/conversations/?${queryString}`,
    );
  },
  fetchWppProfile(appCode, appUuid) {
    return request.$http.get(`${resource}/${appCode}/apps/${appUuid}/profile/`);
  },
  updateWppProfile(appCode, appUuid, data) {
    return request.$http.patch(`${resource}/${appCode}/apps/${appUuid}/profile/`, data);
  },
  deleteWppProfilePhoto(appCode, appUuid) {
    return request.$http.delete(`${resource}/${appCode}/apps/${appUuid}/profile/`);
  },
  async getWhatsAppTemplates(appUuid, params) {
    const queryString = qs.stringify(params);
    return await request.$http
      .get(`${templatesResource}/${appUuid}/templates/?${queryString}`)
      .then((r) => r.data);
  },
  async fetchTemplateData(appUuid, templateUuid) {
    return await request.$http
      .get(`${templatesResource}/${appUuid}/templates/${templateUuid}/`)
      .then((r) => r.data);
  },
  async fetchSelectLanguages(appUuid) {
    return await request.$http
      .get(`${templatesResource}/${appUuid}/templates/languages/`)
      .then((r) => r.data);
  },
  async createTemplate(appUuid, data) {
    return request.$http
      .post(`${templatesResource}/${appUuid}/templates/`, data)
      .then((r) => r.data);
  },
  deleteTemplateMessage(appUuid, templateUuid) {
    return request.$http.delete(`${templatesResource}/${appUuid}/templates/${templateUuid}`);
  },
  async createTemplateTranslation(appUuid, templateUuid, data) {
    return await request.$http
      .post(`${templatesResource}/${appUuid}/templates/${templateUuid}/translations/`, data)
      .then((r) => r.data);
  },
  updateTemplateTranslation(appUuid, templateUuid, data) {
    return request.$http.patch(`${templatesResource}/${appUuid}/templates/${templateUuid}/`, data);
  },
  updateWppWebhookInfo(appCode, appUuid, payload) {
    return request.$http.patch(`${resource}/${appCode}/apps/${appUuid}/update_webhook/`, payload);
  },
  async requestConversationsReport(appCode, appUuid, params) {
    const queryString = qs.stringify(params);
    return await request.$http.get(
      `${resource}/${appCode}/apps/${appUuid}/report_sent_messages/?${queryString}`,
    );
  },
};
