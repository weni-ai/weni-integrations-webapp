import qs from 'query-string';
import request from './request';

const resource = '/api/v1/apptypes';
export default {
  getAllAppTypes(filter) {
    const queryString = qs.stringify(filter);
    return request.$http.get(`${resource}/?${queryString}`);
  },
  getAppType(code) {
    return request.$http.get(`${resource}/${code}/`);
  },
  listComments(appCode) {
    return request.$http.get(`${resource}/${appCode}/comments/`);
  },
  createComment(appCode, payload) {
    return request.$http.post(`${resource}/${appCode}/comments/`, payload);
  },
  updateComment(appCode, commentId, data) {
    return request.$http.put(`${resource}/${appCode}/comments/${commentId}/`, data);
  },
  deleteComment(appCode, commentUuid) {
    return request.$http.delete(`${resource}/${appCode}/comments/${commentUuid}/`);
  },
  postRating(appCode, payload) {
    return request.$http.post(`${resource}/${appCode}/ratings/`, payload);
  },
  getApp(appCode, appUuid) {
    return request.$http.get(`${resource}/${appCode}/apps/${appUuid}/`);
  },
  createApp(appCode, data) {
    return request.$http.post(`${resource}/${appCode}/apps/`, data);
  },
  deleteApp(appCode, appUuid) {
    return request.$http.delete(`${resource}/${appCode}/apps/${appUuid}/`);
  },
  async fetchFeatured() {
    return await request.$http.get(`${resource}/featureds/`).then((r) => r.data);
  },
  updateAppConfig(appCode, appUuid, data) {
    return request.$http.patch(`${resource}/${appCode}/apps/${appUuid}/configure/`, data);
  },
  updateApp(appCode, appUuid, data) {
    return request.$http.patch(`${resource}/${appCode}/apps/${appUuid}/`, data);
  },
};
