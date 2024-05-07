import request from './request';
const resource = '/api/v1/apptypes/wpp-cloud/apps';
const base = '/api/v1/apps';
export default {
<<<<<<< HEAD
  get_template_analytics(app_uuid, { start, end, fba_template_ids }) {
    return request.$http.post(`${resource}/${app_uuid}/template-analytics/`, {
      start: start,
      end: end,
      fba_template_ids: fba_template_ids.map((item) => Number(item)),
    });
=======
  async get_template_analytics(app_uuid, { start, end, fba_template_ids }) {
    return await request.$http
      .post(`${resource}/${app_uuid}/template-analytics/`, {
        start: start,
        end: end,
        fba_template_ids: fba_template_ids.map((item) => Number(item)),
      })
      .then((r) => r.data);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
  },
  async get_templates(app_uuid) {
    const count = await request.$http
      .get(`${base}/${app_uuid}/templates/?page=1&page_size=1`)
      .then((r) => r.data)
      .then((r) => r.count);
<<<<<<< HEAD
    return request.$http.get(`${base}/${app_uuid}/templates/?page=1&page_size=${count}`);
=======
    return await request.$http
      .get(`${base}/${app_uuid}/templates/?page=1&page_size=${count}`)
      .then((r) => r.data);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
  },
  set_active_project(app_uuid) {
    return request.$http.post(`${resource}/${app_uuid}/enable-template-analytics/`);
  },
};
