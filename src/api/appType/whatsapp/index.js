import request from '@/api/request.js';

const resource = '/api/v1/apptypes';
export default {
  fetchWppContactInfo(appCode, appUuid) {
    return request.$http.get(`${resource}/${appCode}/apps/${appUuid}/contact/`);
  },
  updateWppContactInfo(appCode, appUuid, payload) {
    return request.$http.patch(`${resource}/${appCode}/apps/${appUuid}/contact/`, payload);
  },
  getWhatsAppTemplates(appCode, appUuid) {
    return request.$http.get(`${resource}/${appCode}/apps/${appUuid}/template/`);
  },
};
