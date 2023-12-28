// import qs from 'query-string';
import request from './request';
const resource = '/api/v1/apptypes/wpp-cloud/apps';
export default {
  get_template_analytics(app_uuid, filters) {
    let fba_template_ids = filters.fba_template_ids;
    if (filters.fba_template_ids === 'Todos') {
      fba_template_ids = '831797345020910,%201515371305882507,%20768404021753348';
    }
    return request.$http.get(
      `${resource}/${app_uuid}/template-analytics/?start=${filters.start}&end=${filters.end}&fba_template_ids=${fba_template_ids}`,
    );
  },
};
