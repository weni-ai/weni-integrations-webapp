import setLocal from '../../utils/storage';

export default {
  SET_SURVEY_STATUS(state, surveyStatus) {
    state.surveyStatus = surveyStatus;
    setLocal('surveyStatus', surveyStatus);
  },

  SUBMIT_SURVEY_ANSWER_REQUEST(state) {
    state.loadingSurveyAnswer = true;
    state.errorSurveyAnswer = null;
    state.surveyAnswerResult = null;
  },
  SUBMIT_SURVEY_ANSWER_SUCCESS(state, data) {
    state.surveyAnswerResult = data;
    state.loadingSurveyAnswer = false;
  },
  SUBMIT_SURVEY_ANSWER_ERROR(state, err) {
    state.errorSurveyAnswer = err;
    state.loadingSurveyAnswer = false;
  },
};
