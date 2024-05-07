import request from '@/api/request.js';

const resource = '/api/v1/apptypes/generic';

export default {
  async getAllGenericTypes() {
    return await request.$http.get(`${resource}/apptypes/`).then((r) => r.data);
  },
  async getAppForm(channelCode) {
    return await request.$http.get(`${resource}/channel-type/${channelCode}/`).then((r) => r.data);
  },
  async getIcons() {
    return await request.$http.get(`${resource}/get-icons/`).then((r) => r.data);
  },
};
