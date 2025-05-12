import getEnv from '@/utils/env';

export default function routes() {
  this.urlPrefix = getEnv('API_BASE_URL');
  this.namespace = '/api/v1';
  this.timing = 1500;

  this.get('/apptypes/:appCode/apps/:appUuid/template/', function (schema, request) {
    let qp = request.queryParams;
    let page = parseInt(qp.page) - 1;
    let limit = parseInt(qp.limit);
    let start = page * limit;
    let end = start + limit;
    let templates = schema.templates.all();
    let count = templates.length;
    let filtered = this.serialize(templates.slice(start, end), 'template');

    return {
      count,
      templates: filtered.templates,
    };
  });

  this.passthrough(`${getEnv('API_BASE_URL')}/**`);
}
