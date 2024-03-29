import request from '@/api/request.js';

const resource = '/api/v1/apptypes/generic';

export default {
  getAllGenericTypes() {
    return request.$http.get(`${resource}/apptypes/`);
  },
  getAppForm(channelCode) {
    return request.$http.get(`${resource}/channel-type/${channelCode}/`);
  },
  getIcons() {
    return request.$http.get(`${resource}/get-icons/`);
  },
};
