import getEnv from '@/utils/env';

export default function routes() {
  this.urlPrefix = getEnv('VUE_APP_API_BASE_URL');
  this.namespace = '/api/v1';
  this.timing = 1500;

  this.resource('templates', { path: '/apptypes/:appCode/apps/:appUuid/template/' });

  this.passthrough(`${getEnv('VUE_APP_API_BASE_URL')}/**`);
}
