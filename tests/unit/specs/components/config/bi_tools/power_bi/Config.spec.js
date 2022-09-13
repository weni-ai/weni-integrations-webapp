import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import i18n from '@/utils/plugins/i18n';

import powerBiConfig from '@/components/config/bi_tools/power_bi/Config.vue';
import PowerBiIcon from '@/assets/logos/power_bi.png';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = ({
  flowToken = null,
  errorFlowToken = null,
  loadingFlowToken = null,
} = {}) => {
  const state = {
    auth: {
      flowToken,
      errorFlowToken,
      loadingFlowToken,
    },
  };

  const store = new Vuex.Store({
    state,
  });

  const wrapper = mount(powerBiConfig, {
    localVue,
    i18n,
    store,
    propsData: {
      app: {
        code: 'power-bi',
        name: 'Power BI',
        category: 'bi-tools',
        config_design: 'sidebar',
        description: 'PowerBi.data.description',
        summary: 'PowerBi.data.summary',
        icon: null,
      },
    },
    mocks: {
      $t: () => 'some specific text',
    },
  });

  return { wrapper };
};

describe('components/config/bi_tools/power_bi/Config.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('created()', () => {
    it('should not call alert error on flowTokenError', () => {
      const { wrapper } = mountComponent({ errorFlowToken: false });

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
    });

    it('should call alert error on flowTokenError', async () => {
      const { wrapper } = mountComponent({ errorFlowToken: { error: 'failed' } });
      await wrapper.vm.$nextTick();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('documentationLink', () => {
    it('should return link based on locale', () => {
      const { wrapper } = mountComponent();
      wrapper.vm.$i18n.locale = 'pt-br';
      expect(wrapper.vm.documentationLink).toEqual(wrapper.vm.documentations['pt-br']);
    });

    it('should return en-us link as default', () => {
      const { wrapper } = mountComponent();
      wrapper.vm.$i18n.locale = 'unknown';
      expect(wrapper.vm.documentationLink).toEqual(wrapper.vm.documentations['en-us']);
    });
  });

  describe('powerBiICon', () => {
    it('should return Icon', () => {
      const { wrapper } = mountComponent();
      expect(wrapper.vm.powerBiIcon).toEqual(PowerBiIcon);
    });
  });
});
