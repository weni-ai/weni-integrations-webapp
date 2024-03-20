import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import CatalogCard from '@/components/whatsAppCatalogs/CatalogCard.vue';
import '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  errorDisableCatalog = false,
  enabledCart = false,
  catalog = {},
} = {}) => {
  const state = {
    errorDisableCatalog,
  };

  const actions = {
    disableWhatsAppCloudCatalogs: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsAppCloud: {
        namespaced: true,
        actions,
        state,
      },
    },
  });

  const wrapper = mount(CatalogCard, {
    localVue,
    store,
    i18n,
    propsData: {
      catalog,
      enabledCart,
    },
  });

  return { wrapper, actions, state };
};

describe('components/whatsAppCatalog/CatalogCard.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('catalog connect emits', () => {
    it('should emit enable on toggle catalog connect', async () => {
      const { wrapper } = await mountComponent();
      const toggle = wrapper.findComponent({ ref: 'catalogConnectSwitch' });
      toggle.vm.$emit('input', true);
      expect(wrapper.emitted().enable).toBeTruthy();
    });

    it('should emit disable on toggle catalog connect', async () => {
      const { wrapper } = await mountComponent();
      const toggle = wrapper.findComponent({ ref: 'catalogConnectSwitch' });
      toggle.vm.$emit('input', false);
      expect(wrapper.emitted().disable).toBeTruthy();
    });
  });

  describe('toggleCart emit', () => {
    it('should emit toggleCart on switch click', async () => {
      const { wrapper } = await mountComponent({ catalog: { is_connected: true } });
      const toggle = wrapper.findComponent({ ref: 'cartEnableSwitch' });
      toggle.trigger('click');
      expect(wrapper.emitted().toggleCart).toBeTruthy();
    });
  });
});
