jest.mock('@/api/insights', () => {
  return {
    get_template_analytics: jest.fn(),
  };
});

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/insights/actions';
import state from '@/store/insights/state';
import mutations from '@/store/insights/mutations';
import { templateAnalytics } from '../../../../__mocks__/appMock';
import insightsApi from '@/api/insights';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/insights/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        myApps: {
          actions,
          state,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('insights', () => {
    describe('getTemplateAnalytics()', () => {
      const params = {
        start: '2023-09-27',
        end: '2023-09-28',
        fba_template_ids: '831797345020910',
      };

      beforeEach(() => {
        jest.resetAllMocks();

        insightsApi.get_template_analytics.mockImplementation(() => {
          return Promise.resolve({ data: [templateAnalytics] });
        });
      });

      it('should call getTemplateAnalytics from API', async () => {
        expect(insightsApi.get_template_analytics).not.toHaveBeenCalled();
        await store.dispatch('getTemplateAnalytics', params);
        expect(insightsApi.get_template_analytics).toHaveBeenCalledTimes(1);
      });

      it('should set templateAnalytics as result data', async () => {
        store.state.insights.templateAnalytics = {};
        expect(store.state.insights.templateAnalytics).not.toEqual([templateAnalytics]);
        await store.dispatch('getTemplateAnalytics', params);
        expect(store.state.insights.templateAnalytics).toEqual([templateAnalytics]);
      });

      it('should set loadingTemplateAnalytics to false', async () => {
        store.state.insights.loadingTemplateAnalytics = true;
        expect(store.state.insights.loadingTemplateAnalytics).toBe(true);
        await store.dispatch('getTemplateAnalytics', params);
        expect(store.state.insights.loadingTemplateAnalytics).toBe(false);
      });

      it('should set errorTemplateAnalytics as result data', async () => {
        const error = { error: 'failed' };
        insightsApi.get_template_analytics.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.insights.errorTemplateAnalytics = {};
        expect(store.state.insights.errorTemplateAnalytics).not.toEqual(error);
        await store.dispatch('getTemplateAnalytics', params);
        expect(store.state.insights.errorTemplateAnalytics).toEqual(error);
      });
    });
  });
});
