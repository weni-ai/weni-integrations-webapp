import request from '@/api/request.js';

const resource = '/api/v1/apptypes';

export default {
  async getAllExternalServicesTypes() {
    return await request.$http.get(`${resource}/?category=external`).then((r) => r.data);
  },
  async createPrompts(code, appUuid, payload) {
    return await request.$http
      .post(`${resource}/${code}/apps/${appUuid}/prompts/`, payload)
      .then((r) => r.data);
  },
  async getPrompts(code, appUuid) {
    return await request.$http
      .get(`${resource}/${code}/apps/${appUuid}/prompts/`)
      .then((r) => r.data);
  },
  async deletePrompts(code, appUuid, payload) {
    return await request.$http
      .delete(`${resource}/${code}/apps/${appUuid}/prompts/`, {
        data: payload,
      })
      .then((r) => r.data);
  },
};
