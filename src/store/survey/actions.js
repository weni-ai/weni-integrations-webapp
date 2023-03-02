import surveyApi from '@/api/survey';
import window from 'global/window';

export default {
  setSurveyStatus({ commit }, { status }) {
    commit('SET_SURVEY_STATUS', status);
  },
  /* istanbul ignore next */
  retrieveSurveyStatus({ commit }) {
    if (window.localStorage) {
      commit('SET_SURVEY_STATUS', window.localStorage.getItem('surveyStatus') || 'TO_ANSWER');
    }
  },
  async submitSurveyAnswer({ commit }, { payload }) {
    commit('SUBMIT_SURVEY_ANSWER_REQUEST');
    try {
      const { data } = await surveyApi.submitSurveyAnswer(payload);

      commit('SUBMIT_SURVEY_ANSWER_SUCCESS', data);
    } catch (err) {
      commit('SUBMIT_SURVEY_ANSWER_ERROR', err);
    }
  },
};
