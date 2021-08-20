import qs from 'query-string';
import request from './request';

const resource = '/api/v1/apptypes';
export default {
  getAllAppTypes(filter) {
    const queryString = qs.stringify(filter);
    return request.$http.get(`${resource}/?${queryString}`);
  },
  getAppType(code) {
    return request.$http.get(`${resource}/${code}/`);
  },
};
