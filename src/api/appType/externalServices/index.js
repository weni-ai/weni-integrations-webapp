import request from '@/api/request.js';

const resource = '/api/v1/apptypes';

export default {
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
  },
};
