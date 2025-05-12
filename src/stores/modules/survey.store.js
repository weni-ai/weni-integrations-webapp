import { defineStore } from 'pinia';
import surveyApi from '@/api/survey';
import window from 'global/window.js';
import setLocal from '@/utils/storage';

export const survey_store = defineStore('survey', {
  state() {
    return {
      surveyStatus: 'TO_ANSWER',

      loadingSurveyAnswer: false,
      errorSurveyAnswer: null,
      surveyAnswerResult: null,
    };
  },
  actions: {
    setSurveyStatus({ status }) {
      this.surveyStatus = status;
      setLocal('surveyStatus', status);
    },
    retrieveSurveyStatus() {
      if (window.localStorage) {
        this.surveyStatus = window.localStorage.getItem('surveyStatus') || 'TO_ANSWER';
        setLocal('surveyStatus', window.localStorage.getItem('surveyStatus') || 'TO_ANSWER');
      }
    },
    async submitSurveyAnswer({ payload }) {
      this.loadingSurveyAnswer = true;
      this.errorSurveyAnswer = null;
      this.surveyAnswerResult = null;
      try {
        const { data } = await surveyApi.submitSurveyAnswer(payload);

        this.surveyAnswerResult = data;
        this.loadingSurveyAnswer = false;
      } catch (err) {
        this.errorSurveyAnswer = err;
        this.loadingSurveyAnswer = false;
      }
    },
  },
});
