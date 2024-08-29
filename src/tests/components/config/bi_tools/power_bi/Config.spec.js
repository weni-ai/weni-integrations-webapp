import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import PowerBiConfig from '@/components/config/bi_tools/power_bi/Config.vue';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { auth_store } from '@/stores/modules/auth.store';


describe('PowerBiConfig.vue', () => {
  let wrapper;

  const mockApp = {
    icon: 'https://example.com/icon.png',
  };

  const mockGetFlowToken = vi.fn();

  beforeEach(() => {
    wrapper = mount(PowerBiConfig, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth_store: {
                flowToken: 'mock-token',
                errorFlowToken: false,
                loadingFlowToken: false,
              },
            },
            actions: {
              getFlowToken: mockGetFlowToken,
            },
          }),
          i18n,
          UnnnicSystem
        ],
        mocks: {
          $t: (msg) => msg,  // Mock de internacionalização
          $i18n: {
            locale: 'en-us',
          },
        },
      },
      props: {
        app: mockApp,
      },
    });
  });

  it('renders the component with correct elements', () => {
    expect(wrapper.find('.app-config-power-bi__header__title__name').text()).toBe('Power BI');
    expect(wrapper.find('.app-config-power-bi__header__description').text()).toContain(`With the URL below you can connect the Weni platform to Power BI and start monitoring your project's metrics and growth more closely. Just follow the documentation at How to Install and Use Weni Data Connector for Power BI`);
    expect(wrapper.find('img').attributes('src')).toBe(mockApp.icon);
  });

  it('calls getFlowToken on mount', () => {
    const store = auth_store()
    expect(store.getFlowToken).toHaveBeenCalled();
  });

  it('copies the token to clipboard when copyToken is called', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
    const store = auth_store()
    store.flowToken = '1234'
    wrapper.vm.flowToken = '1234'
    await wrapper.vm.copyToken();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1234');
  });

  it('downloads the connector when downloadConnector is called', async () => {
    const mockCreateDownload = vi.spyOn(wrapper.vm, 'createDownload');

    await wrapper.vm.downloadConnector();

    expect(mockCreateDownload).toHaveBeenCalledWith({
      name: 'WeniFluxos.mez',
      link: 'https://github.com/Ilhasoft/custom-connector-powerbi/releases/download/v1.0.1/WeniFluxos.mez',
    });
  });

  it('downloads the model when downloadModel is called', async () => {
    const mockCreateDownload = vi.spyOn(wrapper.vm, 'createDownload');

    await wrapper.vm.downloadModel();

    expect(mockCreateDownload).toHaveBeenCalledWith({
      name: 'base_dashboard.pbix',
      link: 'https://github.com/Ilhasoft/custom-connector-powerbi/releases/download/v1.0.1/base_dashboard.pbix',
    });
  });
});
