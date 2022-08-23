import qs from 'query-string';
import request from '@/api/request.js';

const resource = '/api/v1/apptypes';
export default {
  fetchWppContactInfo(appCode, appUuid) {
    return request.$http.get(`${resource}/${appCode}/apps/${appUuid}/contact/`);
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
  getWhatsAppTemplates(appCode, appUuid, params) {
    const queryString = qs.stringify(params);
    return request.$http.get(`${resource}/${appCode}/apps/${appUuid}/template/?${queryString}`);
  },
};
