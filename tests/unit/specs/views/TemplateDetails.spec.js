import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Insights from '@/views/TemplateDetails/index.vue';
import { singleApp } from '../../../__mocks__/appMock';

const genericApp = {
  ...singleApp,
  name: 'generic',
  code: 'generic',
  generic: true,
  config: { channel_name: 'A random generic' },
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('TemplateDetails/index.vue', () => {
  let wrapper;
  let actions;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      getTemplates: jest.fn(),
      getTemplateAnalytics: jest.fn(),
    };

    state = {
      myApps: {
        configuredApps: [singleApp, genericApp],
        loadingConfiguredApps: false,
        errorConfiguredApps: null,
        installedApps: [singleApp, genericApp],
        loadingInstalledApps: false,
        errorInstalledApps: null,
      },
      insights: {
        isActive: false,
        templateAnalytics: {
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
        },
        loadingTemplateAnalytics: false,
        errorTemplateAnalytics: null,
        selectedTemplate: {
          uuid: 'd9019398-e5df-421f-98d5-8cfa711e7b20',
          name: 'testeana2',
          created_on: '2024-01-10 17:10:01.952251+00:00',
          category: 'MARKETING',
          translations: [],
        },
        appUuid: null,
        templates: {
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              uuid: 'd9019398-e5df-421f-98d5-8cfa711e7b20',
              name: 'testeana2',
              created_on: '2024-01-10 17:10:01.952251+00:00',
              category: 'MARKETING',
              translations: [],
            },
          ],
        },
        errorTemplates: null,
      },
    };

    store = new Vuex.Store({
      actions,
      state,
    });

    wrapper = shallowMount(Insights, {
      localVue,
      store,
      mocks: {
        $t: () => 'some specific text',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should call fetchTemplateAnalytics()', () => {
    const spy = spyOn(wrapper.vm, 'fetchTemplateAnalytics');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.fetchTemplateAnalytics();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call formatDate()', () => {
    const spy = spyOn(wrapper.vm, 'formatDate');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.formatDate(new Date());
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return default value if selectedTemplate is null', () => {
    store.state.insights.selectedTemplate.translations = [];
    expect(wrapper.vm.templateId).toEqual('720749078794724');
  });
});
