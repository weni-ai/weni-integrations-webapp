import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Insights from '@/views/Insights/index.vue';
import { selectedTemplate, templateAnalytics, templates } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/api/insights', () => {
  return {
    get_template_analytics: jest.fn(),
    get_templates: jest.fn(),
  };
});

describe('Insights/index.vue', () => {
  let wrapper;
  let actions;
  let state;
  let store;
  const crumb = {
    name: 'my apps',
    path: '/apps/my',
    meta: 'my apps',
  };

  beforeEach(() => {
    actions = {
      getTemplates: jest.fn(() => templates),
      getTemplateAnalytics: jest.fn(() => templateAnalytics),
      setActiveProject: jest.fn(),
    };

    state = {
      isActive: true,
      templateAnalytics: templateAnalytics,
      loadingTemplateAnalytics: false,
      errorTemplateAnalytics: null,
      selectedTemplate: selectedTemplate,
      appUuid: '8e876af8-a59d-4eef-aeb4-61689d2d382b',
      templates: templates,
      errorTemplates: null,
    };

    store = new Vuex.Store({
      modules: {
        insights: {
          namespaced: true,
          actions,
          state,
        },
      },
    });

    wrapper = shallowMount(Insights, {
      localVue,
      store,
      mocks: {
        $t: () => 'some specific text',
        $router: {
          push: jest.fn(),
        },
        $route: {
          path: '/template-details',
          hash: 'd9019398-e5df-421f-98d5-8cfa711e7b20',
        },
      },
      stubs: {
        unnnicChartMultiLine: true,
        unnnicBreadCrumb: true,
        unnnicButton: true,
        unnnicInputDatePicker: true,
        unnnicSelectSmart: true,
        unnnicModal: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set data', () => {
    expect(wrapper.vm.selectedTemplate).toBe(selectedTemplate);
    expect(wrapper.vm.errorTemplates).toBe(null);
    expect(wrapper.vm.errorTemplateAnalytics).toBe(null);
    expect(wrapper.vm.model).not.toEqual([]);
  });

  //computed
  it('should set modelOptions', () => {
    expect(wrapper.vm.templates).toEqual(templates.results.map((item) => item));
    expect(wrapper.vm.modelOptions).not.toEqual([]);
    store.state.insights.templates = [];
    expect(wrapper.vm.modelOptions).toEqual([]);
  });

  //watch
  describe('watch', () => {
    it('should call fetchTemplateAnalytics()', async () => {
      const spy = spyOn(wrapper.vm, 'fetchTemplateAnalytics');
      await wrapper.setData({
        model: [
          {
            label: 'aaaa',
            value: 'aaaaa',
          },
        ],
      });
      jest.advanceTimersByTime(500);
      expect(spy).toBeCalled();
    });
    it('should trim model array', async () => {
      await wrapper.setData({
        model: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      });
      expect(wrapper.vm.model).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  // fetchTemplateAnalytics()
  describe('fetchTemplateAnalytics()', () => {
    it('should call fetchTemplateAnalytics()', () => {
      const spy = spyOn(wrapper.vm, 'fetchTemplateAnalytics');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchTemplateAnalytics();
      expect(spy).toHaveBeenCalledTimes(1);
    }); //ok
    it('should call getTemplateAnalytics()', () => {
      const spy = spyOn(wrapper.vm, 'getTemplateAnalytics');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchTemplateAnalytics();
      expect(spy).toHaveBeenCalledTimes(1);
    }); //ok
  });

  // fetchTemplates
  describe('fetchTemplates()', () => {
    it('should call fetchTemplates()', () => {
      const spy = spyOn(wrapper.vm, 'fetchTemplates');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchTemplates();
      expect(spy).toHaveBeenCalledTimes(1);
    }); //ok
    it('should call getTemplates()', () => {
      const spy = spyOn(wrapper.vm, 'getTemplates');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchTemplates();
      expect(spy).toHaveBeenCalledTimes(1);
    }); //ok
  });

  // toggleOpenModal
  describe('toggleOpenModal()', () => {
    it('should call toggleOpenModal()', () => {
      const spy = spyOn(wrapper.vm, 'toggleOpenModal');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.toggleOpenModal();
      expect(spy).toHaveBeenCalledTimes(1);
    }); //ok
    it('should set showModal state to true', () => {
      const toggleModalComponent = wrapper.findComponent({ ref: 'modal' });
      toggleModalComponent.vm.$emit('close');
      expect(wrapper.vm.showModal).toBeTruthy();
    }); //ok
  });

  //  setPeriod
  describe('setPeriod()', () => {
    it('should call setPeriod()', () => {
      const spy = spyOn(wrapper.vm, 'setPeriod');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.setPeriod({
        start: '1-10-2024',
        end: '1-11-2024',
      });
      expect(spy).toHaveBeenCalledTimes(1);
    }); //ok
    it('should call fetchTemplates()', () => {
      const spy = spyOn(wrapper.vm, 'fetchTemplateAnalytics');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.setPeriod({
        start: '1-10-2024',
        end: '1-11-2024',
      });
      expect(spy).toHaveBeenCalledTimes(1);
    }); //ok
  });

  // formatDate
  describe('formatDate()', () => {
    it('should call formatDate()', () => {
      const spy = spyOn(wrapper.vm, 'formatDate');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.formatDate(new Date());
      expect(spy).toHaveBeenCalledTimes(1);
    }); //ok
  });

  // getChartByType
  describe('getChartByType()', () => {
    it('should call getChartByType()', () => {
      const spy = spyOn(wrapper.vm, 'getChartByType');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.getChartByType('sent');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should return empty array if templateAnalytics is empty', () => {
      state.templateAnalytics = null;
      expect(wrapper.vm.getChartByType('sent')).toEqual([]);
    });

    it('should set getChartSent', () => {
      wrapper.vm.getChartByType('sent');
      expect(wrapper.vm.getChartSent).not.toEqual([]);
    });
    it('should set getChartDelivered', () => {
      wrapper.vm.getChartByType('delivered');
      expect(wrapper.vm.getChartDelivered).not.toEqual([]);
    });
    it('should set getChartRead', () => {
      wrapper.vm.getChartByType('read');
      expect(wrapper.vm.getChartRead).toEqual([
        {
          data: [
            {
              title: '2024-01-05',
              value: 5,
            },
            {
              title: '2024-01-06',
              value: 1,
            },
            {
              title: '2024-01-07',
              value: 4,
            },
          ],
          title: '730081812069736',
        },
      ]);
    });
    it('should set getChartByDay', () => {
      expect(wrapper.vm.getChartByDay).not.toEqual([]);
    });
  });

  // findMax
  describe('findMax()', () => {
    it('should call findMax()', () => {
      const spy = spyOn(wrapper.vm, 'findMax');
      expect(spy).not.toHaveBeenCalled();
      const array = [
        {
          title: '1',
          value: 1,
        },
      ];
      wrapper.vm.findMax(array);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(array);
    });
  });

  // redirectTo
  describe('redirectTo()', () => {
    it('should call redirectTo()', () => {
      const spy = spyOn(wrapper.vm, 'redirectTo');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.redirectTo(crumb);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should change route to my apps', () => {
      const spy = spyOn(wrapper.vm.$router, 'push');
      wrapper.vm.redirectTo(crumb);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(`/apps/my`);
    });
  });

  // activeTemplate
  describe('activeTemplate()', () => {
    it('should call activeTemplate()', () => {
      const spy = spyOn(wrapper.vm, 'activeTemplate');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.activeTemplate();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call setActiveProject()', () => {
      const spy = spyOn(wrapper.vm, 'setActiveProject');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.activeTemplate();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should set isActive to true', () => {
      const toggleActive = wrapper.findComponent({ ref: 'wpp_insights__button__active' });
      const spy = spyOn(wrapper.vm, 'setActiveProject');
      expect(spy).not.toBeCalled();
      toggleActive.vm.$emit('click');
      expect(spy).toBeCalledTimes(1);
    });
    it('should set showModal to false', () => {
      const toggleActive = wrapper.findComponent({ ref: 'wpp_insights__button__active' });
      const spy = spyOn(wrapper.vm, 'showModal');
      expect(spy).toBeTruthy();
      toggleActive.vm.$emit('click');
      expect(wrapper.vm.showModal).toBeFalsy();
    });
  });
});
