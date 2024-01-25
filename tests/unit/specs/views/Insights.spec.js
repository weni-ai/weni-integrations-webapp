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
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set showModal state to true', async () => {
    const toggleModalComponent = wrapper.findComponent({ ref: 'modal' });
    await toggleModalComponent.vm.$emit('close');
    expect(wrapper.vm.showModal).toBeTruthy();
  });

  it('should call fetchTemplateAnalytics()', () => {
    const spy = spyOn(wrapper.vm, 'fetchTemplateAnalytics');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.fetchTemplateAnalytics();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call fetchTemplates()', () => {
    const spy = spyOn(wrapper.vm, 'fetchTemplates');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.fetchTemplates();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call setPeriodo()', () => {
    const spy = spyOn(wrapper.vm, 'setPeriodo');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.setPeriodo({
      start: '1-10-2024',
      end: '1-11-2024',
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call formatDate()', () => {
    const spy = spyOn(wrapper.vm, 'formatDate');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.formatDate(new Date());
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call getChartByType()', () => {
    const spy = spyOn(wrapper.vm, 'getChartByType');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.getChartByType('sent');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
