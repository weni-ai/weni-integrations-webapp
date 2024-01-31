import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Insights from '@/views/Insights/index.vue';
import { selectedTemplate, templateAnalytics, templates } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

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
      getTemplates: jest.fn(),
      getTemplateAnalytics: jest.fn(),
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
      actions,
      state,
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

  //computed
  it('should set modelOptions', () => {
    const templateList = [];
    store.state.templates.results.forEach((item) => {
      item.translations.forEach((translation) => {
        const obj = {
          value: translation.message_template_id,
          label: `${item.name} (${translation.language})`,
        };
        templateList.push(obj);
      });
    });
    expect(wrapper.vm.modelOptions).toEqual(templateList);

    wrapper.vm.templates = [];
    expect(wrapper.vm.modelOptions).toEqual([]);
  });

  // fetchTemplateAnalytics()
  describe('fetchTemplateAnalytics()', () => {
    it('should call fetchTemplateAnalytics()', () => {
      const spy = spyOn(wrapper.vm, 'fetchTemplateAnalytics');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchTemplateAnalytics();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call getTemplateAnalytics()', () => {
      const spy = spyOn(wrapper.vm, 'getTemplateAnalytics');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchTemplateAnalytics();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  // fetchTemplates
  describe('fetchTemplates()', () => {
    it('should call fetchTemplates()', () => {
      const spy = spyOn(wrapper.vm, 'fetchTemplates');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchTemplates();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call getTemplates()', () => {
      const spy = spyOn(wrapper.vm, 'getTemplates');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchTemplates();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  // toggleOpenModal
  describe('toggleOpenModal()', () => {
    it('should call toggleOpenModal()', () => {
      const spy = spyOn(wrapper.vm, 'toggleOpenModal');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.toggleOpenModal();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should set showModal state to true', async () => {
      const toggleModalComponent = wrapper.findComponent({ ref: 'modal' });
      await toggleModalComponent.vm.$emit('close');
      expect(wrapper.vm.showModal).toBeTruthy();
    });
  });

  //  setPeriodo
  describe('setPeriodo()', () => {
    it('should call setPeriodo()', () => {
      const spy = spyOn(wrapper.vm, 'setPeriodo');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.setPeriodo({
        start: '1-10-2024',
        end: '1-11-2024',
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call fetchTemplates()', () => {
      const spy = spyOn(wrapper.vm, 'fetchTemplateAnalytics');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.setPeriodo({
        start: '1-10-2024',
        end: '1-11-2024',
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  // formatDate
  describe('formatDate()', () => {
    it('should call formatDate()', () => {
      const spy = spyOn(wrapper.vm, 'formatDate');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.formatDate(new Date());
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  // getChartByType
  describe('getChartByType()', () => {
    it('should call getChartByType()', () => {
      const spy = spyOn(wrapper.vm, 'getChartByType');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.getChartByType('sent');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should set getChartSent', () => {
      store.state.templateAnalytics = [];
      wrapper.vm.getChartByType('sent');
      expect(wrapper.vm.getChartSent).toEqual([]);
    });
    it('should set getChartDelivered', () => {
      store.state.templateAnalytics = [];
      wrapper.vm.getChartByType('delivered');
      expect(wrapper.vm.getChartDelivered).toEqual([]);
    });
    it('should set getChartDelivered', () => {
      store.state.templateAnalytics = [];
      wrapper.vm.getChartByType('read');
      expect(wrapper.vm.getChartRead).toEqual([]);
    });
    it('should set getChartByDay', () => {
      store.state.templateAnalytics = [];
      expect(wrapper.vm.getChartRead).toEqual([]);
    });
  });

  // findMax
  describe('findMax()', () => {
    it('should call findMax()', () => {
      const spy = spyOn(wrapper.vm, 'findMax');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.findMax([]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call findMax()', () => {
      const spy = spyOn(wrapper.vm, 'findMax');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.findMax([
        {
          title: '1',
          value: 1,
        },
        {
          title: '2',
          value: 2,
        },
        {
          title: '3',
          value: 3,
        },
      ]);
      expect(spy).toHaveBeenCalledTimes(1);
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
    it('should call activeTemplate()', async () => {
      const spy = spyOn(wrapper.vm, 'activeTemplate');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.activeTemplate();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call setActiveProject()', async () => {
      const spy = spyOn(wrapper.vm, 'setActiveProject');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.activeTemplate();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should set isActive to true', async () => {
      const toggleActive = wrapper.findComponent({ ref: 'wpp_insights__button__active' });
      const spy = spyOn(wrapper.vm, 'setActiveProject');
      expect(spy).not.toBeCalled();
      await toggleActive.vm.$emit('click');
      expect(spy).toBeCalledTimes(1);
    });
    it('should set showModal to false', async () => {
      const toggleActive = wrapper.findComponent({ ref: 'wpp_insights__button__active' });
      const spy = spyOn(wrapper.vm, 'showModal');
      expect(spy).toBeTruthy();
      await toggleActive.vm.$emit('click');
      expect(wrapper.vm.showModal).toBeFalsy();
    });
  });
});
