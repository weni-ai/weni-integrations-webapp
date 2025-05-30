import qs from 'query-string';
import request from '@/api/request';

const resource = '/api/v1/apptypes';
export default {
  async getAllAppTypes(filter) {
    const queryString = qs.stringify(filter);
    return await request.$http.get(`${resource}/?${queryString}`).then((r) => r.data);
  },
  async getAppType(code) {
    return await request.$http.get(`${resource}/${code}/`);
  },
  async listComments(appCode) {
    return await request.$http.get(`${resource}/${appCode}/comments/`).then((r) => r.data);
  },
  async createComment(appCode, payload) {
    return await request.$http
      .post(`${resource}/${appCode}/comments/`, payload)
      .then((r) => r.data);
  },
  async updateComment(appCode, commentId, data) {
    return await request.$http.put(`${resource}/${appCode}/comments/${commentId}/`, data);
  },
  async deleteComment(appCode, commentUuid) {
    return await request.$http.delete(`${resource}/${appCode}/comments/${commentUuid}/`);
  },
  async postRating(appCode, payload) {
    return await request.$http.post(`${resource}/${appCode}/ratings/`, payload);
  },
  async getApp(appCode, appUuid) {
    return await request.$http.get(`${resource}/${appCode}/apps/${appUuid}/`).then((r) => r.data);
  },
  async createApp(appCode, data) {
    return await request.$http.post(`${resource}/${appCode}/apps/`, data);
  },
  async deleteApp(appCode, appUuid) {
    return await request.$http.delete(`${resource}/${appCode}/apps/${appUuid}/`);
  },
  fetchFeatured() {
    return request.$http.get(`${resource}/featureds/`).then((r) => r.data);
  },
  async updateAppConfig(appCode, appUuid, data) {
    return await request.$http.patch(`${resource}/${appCode}/apps/${appUuid}/configure/`, data);
  },
  async updateApp(appCode, appUuid, data) {
    return await request.$http.patch(`${resource}/${appCode}/apps/${appUuid}/`, data);
  },
};
