import qs from 'query-string';
import request from '@/api/request.js';

const resource = '/api/v1/apptypes/wpp-cloud/apps';
export default {
  getWabaId(params) {
    const queryString = qs.stringify(params);
    return request.$http.get(`${resource}/waba_id/?${queryString}`);
  },
  getWhatsAppPhoneNumbers(params) {
    const queryString = qs.stringify(params);
    return request.$http.get(`${resource}/phone_numbers/?${queryString}`);
  },
};
