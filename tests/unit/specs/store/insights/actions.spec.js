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
        app_uuid: '9355df83-dd2f-451e-ad25-1d917a38e48f',
        start: '9-27-2023',
        end: '9-28-2023',
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
    });
  });
});
