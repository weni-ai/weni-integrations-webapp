import { auth_store } from '@/stores/modules/auth.store';
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
  async integrateGmail({ accessToken, refreshToken }) {
    return await request.$http.post(`${resource}/gmail/apps/`, {
      project_uuid: auth_store().project,
      token: accessToken,
      refresh_token: refreshToken,
    });
  },
};
