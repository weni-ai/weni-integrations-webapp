jest.mock('@/api/survey', () => {
  return {
    submitSurveyAnswer: jest.fn(),
  };
});
import surveyApi from '@/api/survey';

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/survey/actions';
import mutations from '@/store/survey/mutations';
import state from '@/store/survey/state';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/survey/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        survey: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('setSurveyStatus', () => {
    it('should set survey status', () => {
      store.state.survey.surveyStatus = 'TO_ANSWER';
      expect(store.state.survey.surveyStatus).not.toEqual('CLOSED');
      store.dispatch('survey/setSurveyStatus', { status: 'CLOSED' });
      expect(store.state.survey.surveyStatus).toEqual('CLOSED');
    });
  });

  describe('submitSurveyAnswer', () => {
    const data = {
      payload: {
        answer: 'answer content',
      },
    };

    beforeEach(() => {
      surveyApi.submitSurveyAnswer.mockImplementation(() => {
        return Promise.resolve({
          data: {
            success: true,
          },
        });
      });
    });

    it('should call submitSurveyAnswer from API', async () => {
      await store.dispatch('survey/submitSurveyAnswer', data);
      expect(surveyApi.submitSurveyAnswer).toHaveBeenCalledTimes(1);
    });

    it('should set surveyAnswerResult as result data', async () => {
      store.state.survey.surveyAnswerResult = {};
      expect(store.state.survey.surveyAnswerResult).not.toEqual({ success: true });
      await store.dispatch('survey/submitSurveyAnswer', data);
      expect(store.state.survey.surveyAnswerResult).toEqual({ success: true });
    });

    it('should set loadingSurveyAnswer to false', async () => {
      store.state.survey.loadingSurveyAnswer = true;
      expect(store.state.survey.loadingSurveyAnswer).toBe(true);
      await store.dispatch('survey/submitSurveyAnswer', data);
      expect(store.state.survey.loadingSurveyAnswer).toBe(false);
    });

    it('should set errorSurveyAnswer as result data', async () => {
      const error = { error: 'failed' };
      surveyApi.submitSurveyAnswer.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.survey.errorSurveyAnswer = {};
      expect(store.state.survey.errorSurveyAnswer).not.toEqual(error);
      await store.dispatch('survey/submitSurveyAnswer', data);
      expect(store.state.survey.errorSurveyAnswer).toEqual(error);
    });
  });
});
