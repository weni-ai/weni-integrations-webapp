import qs from 'query-string';
import request from '@/api/request';

const resource = '/api/v1/my-apps';
export default {
  getConfiguredApps(project_uuid) {
    const queryString = qs.stringify(project_uuid);
    return request.$http.get(`${resource}/?configured=true&${queryString}`);
  },
  getInstalledApps(project_uuid) {
    const queryString = qs.stringify(project_uuid);
    return request.$http.get(`${resource}/?configured=false&${queryString}`);
  },
};
