import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import InstagramConfig from '@/components/config/channels/instagram/Config.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('InstagramConfig.vue', () => {
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  const factory = (app = {}) => {
    return mount(InstagramConfig, {
      props: { app },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
    });
  };

  it('should render the app name and icon correctly', () => {
    const app = {
      name: 'Instagram',
      icon: 'https://example.com/icon.png',
      config: {
        page_name: 'Test Page',
        page_id: '123456789',
      },
    };

    const wrapper = factory(app);

    expect(wrapper.find('.app-config-instagram__header__title__name').text()).toBe('Instagram');
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/icon.png');
  });

  it('should not render the name and icon if they are not provided', () => {
    const app = {};

    const wrapper = factory(app);

    const titleName = wrapper.find('.app-config-instagram__header__title__name').text();
    expect(titleName).toBe('');
    const image = wrapper.find('img').attributes('src');
    expect(image).toBe(undefined);
  });

  it('should render the page name and formatted ID correctly', () => {
    const app = {
      config: {
        page_name: 'Test Page',
        page_id: '123456789',
      },
    };

    const wrapper = factory(app);

    const pageNameInput = wrapper.find(
      '.app-config-instagram__settings__content__inputs__name input',
    );
    expect(pageNameInput.element.value).toBe('Test Page');

    const pageIdInput = wrapper.find('.app-config-instagram__settings__content__inputs__id input');
    expect(pageIdInput.element.value).toBe('ID: 123456789');
  });

  it('should return empty value if `app.config.page_id` is missing', () => {
    const app = {
      config: {
        page_name: 'Test Page',
      },
    };

    const wrapper = factory(app);
    const pageIdInput = wrapper.find('.app-config-instagram__settings__content__inputs__id input');
    expect(pageIdInput.element.value).toBe('ID: undefined');
  });

  it('should render label correctly', () => {
    const app = {
      config: {
        page_name: 'Test Page',
        page_id: '123456789',
      },
    };

    const wrapper = factory(app);

    const label = wrapper.findComponent({ ref: 'label' });
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Your Instagram account is connected');
  });
});
