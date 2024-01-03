import qs from 'query-string';
import request from './request';
const resource = '/api/v1/apptypes/wpp-cloud/apps';
export default {
  get_template_analytics(app_uuid, filters) {
    let queryString = qs.stringify(filters);
    return request.$http.get(`${resource}/${app_uuid}/template-analytics/?${queryString}`);
  },
};
