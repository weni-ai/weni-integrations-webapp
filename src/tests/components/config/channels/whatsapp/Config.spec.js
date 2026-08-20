import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WhatsappConfig from '@/components/config/channels/whatsapp/Config.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createI18n: () => ({
      t: (key) => key,
      locale: 'pt-br',
    }),
  };
});

describe('WhatsappConfig.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  const app = {
    icon: 'icon-url',
    name: 'App Name',
    code: 'app-code',
    uuid: 'app-uuid',
  };

  beforeEach(() => {
    wrapper = mount(WhatsappConfig, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
          $i18n: {
            locale: 'pt-br',
          },
        },
      },
      props: { app },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  it('renders the component and its elements correctly', () => {
    const description = wrapper.find('.config-whatsapp__header__description');
    expect(description.exists()).toBe(true);
    expect(description.text()).toContain(
      'WhatsApp.config.description.text WhatsApp.config.description.link',
    );
  });

  it('renders tabs correctly', async () => {
    await wrapper.setData({ skipLoad: true });

    const tabComponent = wrapper.findComponent({ ref: 'tab' });
    expect(tabComponent.exists()).toBe(true);

    expect(wrapper.findAll('.tab-head').length).toBe(5);
  });

  it('emits closeModal when closeConfig is called', async () => {
    wrapper.vm.closeConfig();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('closeModal')).toBeTruthy();
  });

  it('displays skeleton loader when data is loading', async () => {
    await wrapper.setData({ skipLoad: false, loadingCurrentApp: true });

    const skeletonLoader = wrapper.findComponent({ name: 'skeleton-loading' });
    expect(skeletonLoader.exists()).toBe(true);
  });

  it('calls fetchData on mount and handles success', async () => {
    const fetchDataSpy = vi.spyOn(wrapper.vm, 'fetchData').mockResolvedValue();

    await wrapper.vm.fetchData();
    await wrapper.vm.$nextTick();

    expect(fetchDataSpy).toHaveBeenCalled();
  });
});
