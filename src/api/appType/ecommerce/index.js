import request from '@/api/request.js';

const resource = '/api/v1/apptypes';

export default {
  getAllEcommerceTypes() {
    return request.$http.get(`${resource}/?category=ecommerce`);
  },
  connectVtexCatalog(code, appUuid, payload) {
    return request.$http.post(`${resource}/${code}/${appUuid}/connect-vtex-catalog`, payload);
  },
};
