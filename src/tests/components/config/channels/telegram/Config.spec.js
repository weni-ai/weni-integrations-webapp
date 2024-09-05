import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Config from '@/components/config/channels/telegram/Config.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';

describe('Config.vue', () => {
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  it('should render the component correctly', () => {
    const app = {
      config: {
        token: 'test-token',
      },
      icon: 'test-icon.png',
      name: 'Test App',
    };

    const wrapper = mount(Config, {
      props: { app },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (key) => key,
          $i18n: {
            locale: 'en-us',
          },
        },
      },
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe(app.icon);

    expect(wrapper.find('.app-config-telegram__header__title__name').text()).toBe(app.name);

    expect(wrapper.find('.app-config-telegram__header__description').text()).toContain(
      'Learn more about how to integrate Telegram here.',
    );
    expect(wrapper.find('a').attributes('href')).toBe(
      'https://docs.weni.ai/l/en/weni-integrations/adding-a-telegram-channel',
    );
  });

  it('should correctly bind the token input', async () => {
    const app = {
      config: {
        token: 'test-token',
      },
    };

    const wrapper = mount(Config, {
      props: { app },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (key) => key,
          $i18n: {
            locale: 'en-us',
          },
        },
      },
    });

    const input = wrapper.findComponent({ name: 'unnnic-input' });

    expect(input.props('modelValue')).toBe('test-token');

    await input.setValue('new-token');
    expect(wrapper.vm.token).toBe('new-token');
  });

  it('should call saveConfig method and handle success', async () => {
    const app = {
      config: {
        token: null,
      },
    };

    const wrapper = mount(Config, {
      props: { app },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
    });

    const updateAppConfig = vi.spyOn(wrapper.vm, 'updateAppConfig');
    wrapper.vm.token = 'new-token';
    await wrapper.vm.saveConfig();

    expect(updateAppConfig).toHaveBeenCalled();
    expect(wrapper.vm.invalidToken).toBe(false);
  });

  it('should handle errors in saveConfig method', async () => {
    const app = {
      config: {
        token: null,
      },
    };

    const wrapper = mount(Config, {
      props: { app },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
    });
    const updateAppConfig = vi.spyOn(wrapper.vm, 'updateAppConfig');

    wrapper.vm.token = 'invalid-token';
    await wrapper.vm.saveConfig();

    expect(updateAppConfig).toHaveBeenCalled();
    expect(wrapper.vm.invalidToken).toBe(false);
  });

  it('should emit closeModal event on closeConfig method call', async () => {
    const app = {
      config: {
        token: 'test-token',
      },
    };

    const wrapper = mount(Config, {
      props: { app },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (key) => key,
          $i18n: {
            locale: 'en-us',
          },
        },
      },
    });

    await wrapper.vm.closeConfig();
    expect(wrapper.emitted('closeModal')).toBeTruthy();
  });
});
