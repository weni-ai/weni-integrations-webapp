import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FacebookConfig from '@/components/config/channels/facebook/Config.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';

describe('Config.vue', () => {
  let wrapper;

  const mockApp = {
    icon: 'https://example.com/facebook-icon.png',
    name: 'Facebook Page',
    config: {
      page_name: 'Mock Page Name',
      page_id: '1234567890',
    },
  };

  beforeEach(() => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
    wrapper = mount(FacebookConfig, {
      props: {
        app: mockApp,
      },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      mocks: {
        $t: (e) => e,
      },
    });
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('renders the component with correct elements', () => {
    expect(wrapper.find('.app-config-facebook__header__title__name').text()).toBe(mockApp.name);
    expect(wrapper.find('img').attributes('src')).toBe(mockApp.icon);
    expect(
      wrapper.find('.app-config-facebook__settings__content__inputs__name input').element.value,
    ).toBe(mockApp.config.page_name);
    expect(
      wrapper.find('.app-config-facebook__settings__content__inputs__id input').element.value,
    ).toBe(`ID: ${mockApp.config.page_id}`);
  });

  it('renders the "Connected Account" label correctly', () => {
    const label = wrapper.findComponent({ name: 'unnnic-label' });
    expect(label.exists()).toBe(true);
    expect(label.props('label')).toBe('Your Facebook account is connected');
  });

  it('disables the inputs', () => {
    const nameInput = wrapper.find('.app-config-facebook__settings__content__inputs__name input');
    const idInput = wrapper.find('.app-config-facebook__settings__content__inputs__id input');

    expect(nameInput.attributes('disabled')).toBeDefined();
    expect(idInput.attributes('disabled')).toBeDefined();
  });

  it('computes the pageId correctly', () => {
    expect(wrapper.vm.pageId).toBe(`ID: ${mockApp.config.page_id}`);
  });
  it('uses default values when app prop is not provided', async () => {
    wrapper = mount(FacebookConfig, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        app: {
          config: {
            page_name: '',
          },
        },
      },
    });

    expect(wrapper.vm.pageName).toBe('');
    expect(wrapper.vm.pageId).toBe('ID: undefined');
  });
});
