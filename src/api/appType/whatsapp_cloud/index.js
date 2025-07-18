import qs from 'query-string';
import request from '@/api/request.js';

const resource = '/api/v1/apptypes/wpp-cloud/apps';
const appResource = '/api/v1/apptypes/wpp-cloud';

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
    return request.$http.get(`${appResource}/${appUuid}/catalogs/?${queryString}`);
  },
  fetchCatalogData(appUuid, catalogUuid) {
    return request.$http.get(`${appResource}/${appUuid}/catalogs/${catalogUuid}/`);
  },
  disableWhatsAppCloudCatalogs(appUuid, catalogUuid) {
    return request.$http.post(`${appResource}/${appUuid}/catalogs/${catalogUuid}/disable/`);
  },
  enableWhatsAppCloudCatalogs(appUuid, catalogUuid) {
    return request.$http.post(`${appResource}/${appUuid}/catalogs/${catalogUuid}/enable/`);
  },
  toggleCartVisibility(appUuid, data) {
    return request.$http.post(`${appResource}/${appUuid}/toggle-cart-visibility/`, data);
  },
  toggleCatalogVisibility(appUuid, data) {
    return request.$http.post(`${appResource}/${appUuid}/toggle-catalog-visibility/`, data);
  },
  getCommerceSettings(appUuid) {
    return request.$http.get(`${appResource}/${appUuid}/commerce-settings/`);
  },
  getCatalogProducts(appUuid, catalogUuid, params) {
    const queryString = qs.stringify(params);
    return request.$http.get(
      `${appResource}/${appUuid}/catalogs/${catalogUuid}/products/?${queryString}`,
    );
  },
  updateMMLiteStatus(appUuid, data) {
    return request.$http.patch(`${resource}/${appUuid}/update_mmlite_status/`, data);
  },
};
