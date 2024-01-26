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
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  // fetchTemplateAnalytics()
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

  // fetchTemplates
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

  // toggleOpenModal
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

  //  setPeriodo
  it('should call setPeriodo()', () => {
    const spy = spyOn(wrapper.vm, 'setPeriodo');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.setPeriodo({
      start: '1-10-2024',
      end: '1-11-2024',
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // formatDate
  it('should call formatDate()', () => {
    const spy = spyOn(wrapper.vm, 'formatDate');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.formatDate(new Date());
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // getChartByType
  it('should call getChartByType()', () => {
    const spy = spyOn(wrapper.vm, 'getChartByType');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.getChartByType('sent');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // findMax
  it('should call findMax()', () => {
    const spy = spyOn(wrapper.vm, 'findMax');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.findMax([]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // redirectTo
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

  // activeTemplate
  it('should call activeTemplate()', () => {
    const spy = spyOn(wrapper.vm, 'activeTemplate');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.activeTemplate();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
