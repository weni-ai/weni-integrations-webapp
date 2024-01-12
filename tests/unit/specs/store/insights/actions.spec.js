jest.mock('@/api/insights', () => {
  return {
    get_template_analytics: jest.fn(),
    get_templates: jest.fn(),
  };
});

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/insights/actions';
import state from '@/store/insights/state';
import mutations from '@/store/insights/mutations';
import { templateAnalytics, templates } from '../../../../__mocks__/appMock';
import insightsApi from '@/api/insights';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/insights/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        insights: {
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
        app_uuid: 'b23c38d9-9d7d-44ad-9257-c3aef1279e86',
        start: '1-5-2024',
        end: '1-12-2024',
        fba_template_ids: ['730081812069736'],
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
      it('should set TemplateAnalytics as result data', async () => {
        store.state.insights.templateAnalytics = null;
        expect(store.state.insights.templateAnalytics).toEqual(null);
        await store.dispatch('getTemplateAnalytics', params);
        expect(store.state.insights.templateAnalytics).toEqual([templateAnalytics]);
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

  describe('getTemplates()', () => {
    const params = {
      app_uuid: 'b23c38d9-9d7d-44ad-9257-c3aef1279e86',
      start: '1-5-2024',
      end: '1-12-2024',
      fba_template_ids: ['730081812069736'],
    };
    beforeEach(() => {
      jest.resetAllMocks();

      insightsApi.get_templates.mockImplementation(() => {
        return Promise.resolve({ data: [templates] });
      });
    });
    it('should call getTemplates from API', async () => {
      expect(insightsApi.get_templates).not.toHaveBeenCalled();
      await store.dispatch('getTemplates', params.app_uuid);
      expect(insightsApi.get_templates).toHaveBeenCalledTimes(1);
    });
    it('should set Templates as result data', async () => {
      store.state.insights.templates = null;
      expect(store.state.insights.templates).toEqual(null);
      await store.dispatch('getTemplates', params.app_uuid);
      expect(store.state.insights.templates).toEqual([templates]);
    });
    it('should set errorTemplates as result data', async () => {
      const error = { error: 'failed' };
      insightsApi.get_templates.mockImplementation(() => {
        return Promise.reject(error);
      });
      store.state.insights.errorTemplates = {};
      expect(store.state.insights.errorTemplates).not.toEqual(error);
      await store.dispatch('getTemplates', params.app_uuid);
      expect(store.state.insights.errorTemplates).toEqual(error);
    });
  });

  describe('setSelectedTemplate()', () => {
    it('should call setSelectedTemplate', () => {
      store.state.insights.selectedTemplate = {};
      expect(store.state.insights.selectedTemplate).toEqual({});
      store.dispatch('setSelectedTemplate', { template: '123' });
      expect(store.state.insights.selectedTemplate).toEqual('123');
    });
  });

  describe('setAppUuid()', () => {
    it('should call setAppUuid', () => {
      store.state.insights.appUuid = null;
      expect(store.state.insights.appUuid).toEqual(null);
      store.dispatch('setAppUuid', { appUuid: '123' });
      expect(store.state.insights.appUuid).toEqual('123');
    });
  });
});
