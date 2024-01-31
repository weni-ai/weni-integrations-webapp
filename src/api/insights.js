import qs from 'query-string';
import request from './request';
const resource = '/api/v1/apptypes/wpp-cloud/apps';
const base = '/api/v1/apps';
export default {
  get_template_analytics(app_uuid, { start, end, fba_template_ids }) {
    let queryString = qs.stringify({ start, end });
    return request.$http.get(
      `${resource}/${app_uuid}/template-analytics/?${queryString}&fba_template_ids=${fba_template_ids}`,
    );
  },
  async get_templates(app_uuid) {
    const count = await request.$http
      .get(`${base}/${app_uuid}/templates/?page=1&page_size=1`)
      .then((r) => r.data)
      .then((r) => r.count);
    return request.$http.get(`${base}/${app_uuid}/templates/?page=1&page_size=${count}`);
  },
  set_active_project(app_uuid) {
    return request.$http.post(`${resource}/${app_uuid}/enable-template-analytics`);
  },
};
