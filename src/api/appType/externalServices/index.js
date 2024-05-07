import request from '@/api/request.js';

const resource = '/api/v1/apptypes';

export default {
<<<<<<< HEAD
  getAllExternalServicesTypes() {
    return request.$http.get(`${resource}/?category=external`);
  },
  createPrompts(code, appUuid, payload) {
    return request.$http.post(`${resource}/${code}/apps/${appUuid}/prompts/`, payload);
  },
  getPrompts(code, appUuid) {
    return request.$http.get(`${resource}/${code}/apps/${appUuid}/prompts/`);
  },
  deletePrompts(code, appUuid, payload) {
    return request.$http.delete(`${resource}/${code}/apps/${appUuid}/prompts/`, { data: payload });
=======
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
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
  },
};
