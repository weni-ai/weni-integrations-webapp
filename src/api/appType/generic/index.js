import request from '@/api/request.js';

const resource = '/api/v1/apptypes/generic';

export default {
<<<<<<< HEAD
  getAllGenericTypes() {
    return request.$http.get(`${resource}/apptypes/`);
  },
  getAppForm(channelCode) {
    return request.$http.get(`${resource}/channel-type/${channelCode}/`);
  },
  getIcons() {
    return request.$http.get(`${resource}/get-icons/`);
=======
  async getAllGenericTypes() {
    return await request.$http.get(`${resource}/apptypes/`).then((r) => r.data);
  },
  async getAppForm(channelCode) {
    return await request.$http.get(`${resource}/channel-type/${channelCode}/`).then((r) => r.data);
  },
  async getIcons() {
    return await request.$http.get(`${resource}/get-icons/`).then((r) => r.data);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
  },
};
