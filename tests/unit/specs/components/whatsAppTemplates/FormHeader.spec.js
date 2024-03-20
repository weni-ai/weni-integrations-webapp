import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import FormHeader from '@/components/whatsAppTemplates/FormHeader.vue';
import FormHeaderLoading from '@/components/whatsAppTemplates/loadings/FormHeaderLoading.vue';
import '@weni/unnnic-system';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = ({ loadingCurrentAppType = false, templateStatus = 'APPROVED' } = {}) => {
  const state = {
    appType: {
      currentAppType: {},
      loadingCurrentAppType,
    },
  };

  const actions = {
    getAppType: jest.fn(),
  };

  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return { status: templateStatus };
    }),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        getters,
      },
    },
    actions,
    state,
  });

  const wrapper = mount(FormHeader, {
    localVue,
    store,
    mocks: {
      $t: () => 'some specific text',
      $route: {
        params: {
          appCode: 'code',
        },
      },
    },
    propsData: {
      templateStatus,
    },
  });

  return { wrapper, actions };
};

describe('components/whatsAppTemplates/FormHeader.vue', () => {
  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading', async () => {
    const { wrapper } = mountComponent({ loadingCurrentAppType: true });
    const loadingComponent = wrapper.findComponent(FormHeaderLoading);

    expect(loadingComponent.exists()).toBe(true);
  });

  it('should not render loading', async () => {
    const { wrapper } = mountComponent({ loadingCurrentAppType: false });
    const loadingComponent = wrapper.findComponent(FormHeaderLoading);

    expect(loadingComponent.exists()).toBe(false);
  });

  it('should call getAppType on component creation', async () => {
    const { actions } = mountComponent();

    expect(actions.getAppType).toHaveBeenCalledTimes(1);
    expect(actions.getAppType).toHaveBeenCalledWith(expect.any(Object), {
      code: 'code',
      shouldLoad: true,
    });
  });

  describe('templateStatusScheme', () => {
    it('should return green status on approved', () => {
      const { wrapper } = mountComponent({ templateStatus: 'APPROVED' });
      expect(wrapper.vm.templateStatusScheme).toEqual('feedback-green');
    });

    it('should return red status on rejected', () => {
      const { wrapper } = mountComponent({ templateStatus: 'REJECTED' });
      expect(wrapper.vm.templateStatusScheme).toEqual('feedback-red');
    });

    it('should return yellow status on default', () => {
      const { wrapper } = mountComponent({ templateStatus: 'PENDING' });
      expect(wrapper.vm.templateStatusScheme).toEqual('feedback-yellow');
    });
  });
});
