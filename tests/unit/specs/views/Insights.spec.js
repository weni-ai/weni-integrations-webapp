import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Insights from '@/views/Insights/index.vue';

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
      isActive: false,
      templateAnalytics: [],
      loadingTemplateAnalytics: false,
      errorTemplateAnalytics: null,
      selectedTemplate: null,
      appUuid: null,
      templates: [],
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
  });

  // findMax
  describe('findMax()', () => {
    it('should call findMax()', () => {
      const spy = spyOn(wrapper.vm, 'findMax');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.findMax([]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should return max value', () => {
      const spy = spyOn(wrapper.vm, 'findMax');
      const array = [
        {
          title: 1,
          value: 1,
        },
        {
          title: 2,
          value: 2,
        },
      ];
      expect(spy).not.toHaveBeenCalled();
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
    it('should call activeTemplate()', async () => {
      const spy = spyOn(wrapper.vm, 'activeTemplate');
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
