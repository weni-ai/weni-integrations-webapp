import request from '@/api/request.js';

const resource = '/api/v1/apptypes';

export default {
<<<<<<< HEAD
  getAllEcommerceTypes() {
    return request.$http.get(`${resource}/?category=ecommerce`);
  },
  connectVtexCatalog(code, appUuid, payload) {
    return request.$http.post(`${resource}/${code}/${appUuid}/catalogs/`, payload);
  },
  getVtexAppUuid(code) {
    return request.$http.get(`${resource}/${code}/apps/get-app-uuid/`);
=======
  async getAllEcommerceTypes() {
    return await request.$http.get(`${resource}/?category=ecommerce`).then((r) => r.data);
  },
  connectVtexCatalog(code, appUuid, payload) {
    return request.$http
      .post(`${resource}/${code}/${appUuid}/catalogs/`, payload)
      .then((r) => r.data);
  },
  async getVtexAppUuid(code) {
    return await request.$http.get(`${resource}/${code}/apps/get-app-uuid/`).then((r) => r.data);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
  },
};
