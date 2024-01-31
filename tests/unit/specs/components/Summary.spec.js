import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Summary from '@/components/TemplateDetails/Summary.vue';
import i18n from '@/utils/plugins/i18n';
import { selectedTemplate, templateAnalytics, templates } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/api/insights', () => {
  return {
    get_template_analytics: jest.fn(),
    get_templates: jest.fn(),
  };
});

describe('components/TemplateDetails/Summary.vue', () => {
  let wrapper;
  let actions;
  let state;
  let store;
  beforeEach(() => {
    actions = {
      getTemplates: jest.fn(),
      getTemplateAnalytics: jest.fn(() => {
        return {
          data: [
            {
              template_id: '730081812069736',
              template_name: null,
              totals: { sent: 51, delivered: 51, read: 30 },
              dates: [
                { start: '2024-01-04', sent: 11, delivered: 10, read: 6 },
                { start: '2024-01-05', sent: 7, delivered: 7, read: 5 },
                { start: '2024-01-06', sent: 6, delivered: 5, read: 1 },
                { start: '2024-01-07', sent: 4, delivered: 5, read: 4 },
                { start: '2024-01-08', sent: 1, delivered: 2, read: 2 },
                { start: '2024-01-09', sent: 0, delivered: 0, read: 0 },
                { start: '2024-01-10', sent: 11, delivered: 11, read: 5 },
                { start: '2024-01-11', sent: 11, delivered: 11, read: 7 },
              ],
            },
          ],
          grand_totals: { sent: 51, delivered: 51, read: 30 },
        };
      }),
    };

    state = {
      insights: {
        isActive: true,
        templateAnalytics: templateAnalytics,
        loadingTemplateAnalytics: false,
        errorTemplateAnalytics: null,
        selectedTemplate: selectedTemplate,
        appUuid: '8e876af8-a59d-4eef-aeb4-61689d2d382b',
        templates: templates,
        errorTemplates: null,
      },
    };
    store = new Vuex.Store({
      actions,
      state,
    });

    wrapper = mount(Summary, {
      localVue,
      i18n,
      store,
      mocks: {
        $t: () => 'some specific text',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should set weekValues', () => {
    expect(wrapper.vm.weekValues).toEqual(templateAnalytics.grand_totals);
    wrapper.vm.templateAnalytics.grand_totals = null;
    expect(wrapper.vm.weekValues).toEqual({
      sent: 0,
      delivered: 0,
      read: 0,
    });
  });
  it('should call fetchTemplateAnalyticsWeek', () => {
    const spy = spyOn(wrapper.vm, 'fetchTemplateAnalyticsWeek');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.fetchTemplateAnalyticsWeek();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call getTemplateAnalytics()', () => {
    const spy = spyOn(wrapper.vm, 'getTemplateAnalytics');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.fetchTemplateAnalyticsWeek();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call formatDate()', () => {
    const spy = spyOn(wrapper.vm, 'formatDate');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.formatDate(new Date());
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
