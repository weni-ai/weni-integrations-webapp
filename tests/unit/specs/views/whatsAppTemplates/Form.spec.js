import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Form from '@/views/whatsAppTemplates/Form.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = (routeParams = {}) => {
  const actions = {
    clearAllTemplateFormData: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        actions,
      },
    },
  });

  const wrapper = mount(Form, {
    localVue,
    store,
    stubs: {
      FormHeader: true,
      FormTabs: true,
      TemplatePreview: true,
    },
    mocks: {
      $route: {
        params: routeParams,
      },
    },
  });

  return { wrapper, actions };
};

describe('views/whatsAppTemplates/Form.vue', () => {
  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should set formMode to edit if templateUuid is provided in route', async () => {
    const { wrapper } = mountComponent({ templateUuid: '123' });
    expect(wrapper.vm.formMode).toEqual('edit');
  });

  it('should leave formMode as create edit if templateUuid is not provided in route', async () => {
    const { wrapper } = mountComponent();
    expect(wrapper.vm.formMode).toEqual('create');
  });

  describe('destroyed()', () => {
    it('should call clearAllTemplateFormData', async () => {
      const { wrapper, actions } = mountComponent();

      expect(actions.clearAllTemplateFormData).not.toHaveBeenCalled();
      wrapper.destroy();
      expect(actions.clearAllTemplateFormData).toHaveBeenCalledTimes(1);
    });
  });
});
