import request from '@/api/request.js';

const resource = '/api/v1/apptypes';

export default {
  getAllExternalServicesTypes() {
    return request.$http.get(`${resource}/?category=external`);
  },
};
