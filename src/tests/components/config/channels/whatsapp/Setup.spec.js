import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import WhatsAppSetup from '@/components/config/channels/whatsapp/Setup.vue';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';

vi.mock('@/utils/plugins/fb', () => ({
  initFacebookSdk: vi.fn(),
}));

vi.mock('@/utils/sentry', () => ({
  captureSentryManualError: vi.fn(),
}));

describe('WhatsAppSetup.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = mount(WhatsAppSetup, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $route: { params: { appUuid: '123' } },
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  it('renders WhatsApp setup modal', () => {
    expect(wrapper.find('.whatsapp-setup').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'unnnic-modal' }).exists()).toBe(true);
  });

  it('calls closePopUp on button click', async () => {
    const button = wrapper.find('.whatsapp-setup__buttons__cancel');
    expect(button.exists()).toBe(true);

    await button.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('closePopUp')).toBeTruthy();
  });

  // it('calls startFacebookLogin on button click', async () => {
  //   await wrapper.setData({ onLogin: false });

  //   const startFacebookLoginSpy = vi.spyOn(wrapper.vm, 'startFacebookLogin');
  //   const button = wrapper.find('.whatsapp-setup__buttons__start');
  //   expect(button.exists()).toBe(true);
  //   expect(wrapper.vm.onLogin).toBe(false);

  //   expect(button.attributes('disabled')).toBe(undefined);

  //   await button.trigger('click');
  //   await wrapper.vm.$nextTick();
  //   expect(startFacebookLoginSpy).toHaveBeenCalled();
  // });

  it('reacts to Pinia state changes', async () => {
    const store = whatsapp_cloud();
    store.loadingWhatsAppCloudConfigure = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.loadingWhatsAppCloudConfigure).toBe(true);
  });

  it('calls sendToSentry on error', async () => {
    const sendToSentrySpy = vi.spyOn(wrapper.vm, 'sendToSentry');

    await wrapper.vm.sendToSentry('Test error', { extra: 'info' });
    expect(sendToSentrySpy).toHaveBeenCalledWith('Test error', { extra: 'info' });
  });
});
