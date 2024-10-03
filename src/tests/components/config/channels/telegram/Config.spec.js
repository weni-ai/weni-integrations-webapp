import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Config from '@/components/config/channels/telegram/Config.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import unnnic from '@weni/unnnic-system';
import { app_type } from '@/stores/modules/appType/appType.store';

describe('Config.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });

  const mockApp = {
    icon: 'telegram-icon-url',
    name: 'Telegram App',
    config: {
      token: 'valid-token',
    },
    code: 'telegram-app-code',
    uuid: 'telegram-app-uuid',
  };

  beforeEach(() => {
    wrapper = mount(Config, {
      props: {
        app: mockApp,
      },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          unnnic,
        },
      },
    });
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render the component correctly', () => {
    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe('telegram-icon-url');

    expect(wrapper.find('.app-config-telegram__header__title__name').text()).toBe('Telegram App');

    expect(wrapper.find('.app-config-telegram__header__description').text()).toContain(
      'Learn more about how to integrate Telegram here.',
    );
    expect(wrapper.find('a').attributes('href')).toBe(
      'https://docs.weni.ai/l/en/weni-integrations/adding-a-telegram-channel',
    );
  });

  it('displays the correct documentation link based on locale', () => {
    expect(wrapper.vm.documentationLink).toBe(
      'https://docs.weni.ai/l/en/weni-integrations/adding-a-telegram-channel',
    );

    wrapper.vm.$i18n.locale = 'pt-br';
    expect(wrapper.vm.documentationLink).toBe(
      'https://docs.weni.ai/l/pt/m-dulo-integra-es/como-criar-um-canal-no-telegram',
    );
  });

  it('should correctly bind the token input', async () => {
    const input = wrapper.findComponent({ name: 'unnnic-input' });

    expect(input.props('modelValue')).toBe('valid-token');

    await input.setValue('new-token');
    expect(wrapper.vm.token).toBe('new-token');
  });

  it('should call saveConfig method and handle success', async () => {
    const updateAppConfig = vi.spyOn(wrapper.vm, 'updateAppConfig');
    wrapper.vm.token = 'new-token';
    await wrapper.vm.saveConfig();

    expect(updateAppConfig).toHaveBeenCalled();
    expect(wrapper.vm.invalidToken).toBe(false);
  });

  it('should handle errors in saveConfig method', async () => {
    const updateAppConfig = vi.spyOn(wrapper.vm, 'updateAppConfig');

    wrapper.vm.token = 'invalid-token';
    await wrapper.vm.saveConfig();

    expect(updateAppConfig).toHaveBeenCalled();
    expect(wrapper.vm.invalidToken).toBe(false);
  });

  it('should emit closeModal event on closeConfig method call', async () => {
    await wrapper.vm.closeConfig();
    expect(wrapper.emitted('closeModal')).toBeTruthy();
  });

  it('successfully saves configuration and shows success alert', async () => {
    const store = app_type();
    store.updateAppConfig = vi.fn().mockResolvedValue();
    store.errorUpdateAppConfig = false;
    const updateAppConfigSpy = vi.spyOn(wrapper.vm, 'updateAppConfig').mockResolvedValue();
    const callAlertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');

    await wrapper.vm.saveConfig();

    expect(updateAppConfigSpy).toHaveBeenCalledWith({
      code: mockApp.code,
      appUuid: mockApp.uuid,
      payload: { config: { token: mockApp.config.token } },
    });
    expect(callAlertSpy).toHaveBeenCalledWith({
      props: {
        text: 'Aplicação instalada com sucesso!',
        type: 'success',
      },
      seconds: 3,
    });
    expect(wrapper.vm.invalidToken).toBe(false);
  });

  it('handles invalid token error and shows specific error alert', async () => {
    const updateAppConfigSpy = vi.spyOn(wrapper.vm, 'updateAppConfig').mockRejectedValue({
      response: { status: 400 },
    });
    await wrapper.vm.saveConfig();

    expect(updateAppConfigSpy).toHaveBeenCalled();
    expect(wrapper.vm.invalidToken).toBe(true);
    expect(unnnic.unnnicCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'Token provido não é válido.',
        type: 'error',
      },
      seconds: 3,
    });
  });
});
