import request from '@/api/request.js';

const resource = '/api/v1/apptypes';

export default {
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
  },
  async getSellers(uuid) {
    return await request.$http
      .get(`${resource}/vtex/apps/${uuid}/active-vtex-sellers/`)
      .then((r) => r.data);
  },
  async syncSellers(uuid, payload) {
    return await request.$http
      .post(`${resource}/vtex/apps/${uuid}/sync-vtex-sellers/`, payload)
      .then((r) => r.data);
  },
  async checkSellers(uuid) {
    return await request.$http
      .get(`${resource}/vtex/apps/${uuid}/check-sync-sellers/`)
      .then((r) => r.data);
  },
  async syncADS(uuid, payload) {
    return await request.$http
      .post(`${resource}/vtex/apps/${uuid}/update-vtex-ads/`, payload)
      .then((r) => r.data);
  },
};
