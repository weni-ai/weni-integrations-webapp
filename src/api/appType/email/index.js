import request from '../../request';

const resource = '/api/v1/apptypes';

export default {
  async getAllEmailTypes() {
    return await request.$http.get(`${resource}/?category=email`).then((r) => r.data);
  },
  async getTokens(code) {
    return await request.$http
      .post(`${resource}/gmail/apps/authenticate-google/`, { code })
      .then((r) => r.data);
  },
};
