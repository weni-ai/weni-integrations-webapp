import { mount } from '@vue/test-utils';
import VtexConfig from '@/components/config/ecommerce/vtex/Config.vue';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import unnnic from '@weni/unnnic-system';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

describe('vtex-config Component', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  const mockApp = {
    icon: 'https://example.com/icon.png',
    name: 'VTEX App',
    config: {
      api_credentials: {
        domain: 'https://api.example.com',
      },
      connected_catalog: true,
      wpp_cloud_uuid: '1234-5678',
    },
  };

  beforeEach(() => {
    global.navigator.clipboard = {
      writeText: vi.fn(),
    };
    wrapper = mount(VtexConfig, {
      props: {
        app: mockApp,
      },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          unnnic,
          $router: {
            push: vi.fn(),
          },
          $t: (e) => e,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render app name and icon correctly', () => {
    expect(wrapper.find('img').attributes('src')).toBe(mockApp.icon);
    expect(wrapper.find('.config-vtex__header__title__name').text()).toBe(mockApp.name);
  });

  it('should render the description correctly', () => {
    expect(wrapper.find('.config-vtex__header__description').html()).toContain(
      '<span data-v-7d90e9f3="" class="config-vtex__header__description">Connect your VTEX catalog to send products via Whatsapp</span>',
    );
  });

  it('should display the connected catalog button when hasConnectedCatalog is true', () => {
    const viewButton = wrapper.findComponent({ ref: 'viewButton' });
    const connectButton = wrapper.findComponent({ ref: 'connectButton' });
    expect(viewButton.exists()).toBe(true);
    expect(connectButton.exists()).toBe(false);
  });

  it('should emit closeModal when closeConfig method is called', async () => {
    await wrapper.vm.closeConfig();

    expect(wrapper.emitted().closeModal).toBeTruthy();
  });

  it('should call connectCatalog when connect button is clicked', async () => {
    wrapper.vm.hasConnectedCatalog = false;
    await wrapper.vm.$nextTick();

    const connectButton = wrapper.findComponent({ ref: 'connectButton' });
    expect(connectButton.exists()).toBe(true);
    expect(wrapper.vm.showConnectModal).toBe(false);
    await connectButton.trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.showConnectModal).toBe(true);
  });

  it('should call redirectToWppCatalog when the view button is clicked', async () => {
    wrapper.vm.wpp_uuid = '1234-5678';
    const viewButton = wrapper.findComponent({ ref: 'viewButton' });
    expect(viewButton.exists()).toBe(true);
    await viewButton.trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      path: `/apps/my/wpp-cloud/${mockApp.config.wpp_cloud_uuid}/catalogs`,
    });
  });

  it('should render sellers list correctly when hasConnectedCatalog is true', async () => {
    wrapper.vm.sellersList = ['Seller 1', 'Seller 2'];
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.config-vtex__settings__content__sellers__options').length).toBe(1);
  });

  it('should disable save button when no sellers are selected', () => {
    expect(wrapper.vm.disableSave).toBe(true);
  });

  it('should allow saving when sellers are selected', async () => {
    wrapper.vm.selectedSellers = [{ value: 'Seller 1' }];
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.disableSave).toBe(false);
  });

  it('renders view button when there is a connected catalog', async () => {
    const app = {
      icon: 'icon.png',
      name: 'App Name',
      config: {
        name: 'Test Config',
        api_credentials: { domain: 'test.domain' },
        connected_catalog: false,
        wpp_cloud_uuid: 'uuid-test',
      },
    };
    const wrapper = mount(VtexConfig, {
      props: { app },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      mocks: {
        $t: (e) => e,
      },
    });

    const viewButton = wrapper.findComponent({ ref: 'viewButton' });
    const connectButton = wrapper.findComponent({ ref: 'connectButton' });

    expect(viewButton.exists()).toBe(false);
    expect(connectButton.exists()).toBe(true);
  });
});
