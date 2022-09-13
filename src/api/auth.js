import request from './request';

const resource = '/api/v1';
export default {
  getFlowToken() {
    return request.$http.get(`${resource}/internal/user-api-token/`);
  },
};
