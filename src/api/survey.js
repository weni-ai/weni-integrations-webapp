import request from './request';

const resource = '/api/v1/feedbacks/';
export default {
  submitSurveyAnswer(payload) {
    return request.$http.post(`${resource}`, payload);
  },
};
