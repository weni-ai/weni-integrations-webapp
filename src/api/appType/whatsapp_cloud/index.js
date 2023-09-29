import qs from 'query-string';
import request from '@/api/request.js';

const resource = '/api/v1/apptypes/wpp-cloud/apps';
const catalogsResource = '/api/v1/apptypes/wpp-cloud';

export default {
  getDebugToken(params) {
    const queryString = qs.stringify(params);
    return request.$http.get(`${resource}/debug_token/?${queryString}`);
  },
  getWhatsAppPhoneNumbers(params) {
    const queryString = qs.stringify(params);
    return request.$http.get(`${resource}/phone_numbers/?${queryString}`);
  },
  configurePhoneNumber(data) {
    return request.$http.post(`${resource}/`, data);
  },
  getWhatsAppCloudCatalogs(appUuid, params) {
    const queryString = qs.stringify(params);
    return request.$http.get(`${catalogsResource}/${appUuid}/catalogs/?${queryString}`);
  },
  fetchCatalogData(appUuid, catalogUuid) {
    return request.$http.get(`${catalogsResource}/${appUuid}/catalogs/${catalogUuid}/`);
  },
};
