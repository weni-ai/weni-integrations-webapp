import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import WhatsAppSetup from '@/components/config/channels/whatsapp/Setup.vue';
import ConnectNewWhatsAppAccountModal from '@/components/config/channels/whatsapp/ConnectNewWhatsAppAccountModal.vue';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';

vi.mock('@/utils/plugins/fb', () => ({
  initFacebookSdk: vi.fn(),
}));

vi.mock('@/utils/sentry', () => ({
  captureSentryManualError: vi.fn(),
  captureSentryException: vi.fn(),
}));

vi.mock('@/utils/env', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    getEnv: vi.fn((key) => {
      switch (key) {
        case 'WHATSAPP_FACEBOOK_APP_ID':
          return 'mockFacebookAppId';
        case 'WHATSAPP_FACEBOOK_APP_CONFIG_ID':
          return 'mockConfigId';
        default:
          return null;
      }
    }),
  };
});

describe('WhatsAppSetup.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = mount(WhatsAppSetup, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        stubs: {
          ConnectNewWhatsAppAccountModal: true,
        },
        mocks: {
          $route: { params: { appUuid: '123' } },
          $router: {
            replace: vi.fn(),
          },
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

  it('handles Facebook login correctly', async () => {
    vi.mock('../../../../utils/plugins/fb', () => ({
      initFacebookSdk: vi.fn((appId, callback) => {
        callback();
      }),
    }));

    global.FB = {
      login: vi.fn((callback) => {
        callback({ authResponse: { code: 'mockAuthCode' } });
      }),
    };

    wrapper.vm.startFacebookLogin();

    expect(wrapper.vm.phoneNumberId).toBeNull();
    expect(wrapper.vm.wabaId).toBeNull();
  });

  it('shows error toast when createChannel fails with a generic error', async () => {
    const spy = vi.spyOn(wrapper.vm, 'callErrorModal');
    const store = whatsapp_cloud();

    vi.spyOn(wrapper.vm, 'configurePhoneNumber').mockImplementation(async () => {
      store.errorCloudConfigure = new Error('network');
    });

    await wrapper.vm.createChannel('1234');

    expect(spy).toHaveBeenCalledWith({
      text: 'An error occurred while creating the channel. Try again later.',
    });
    expect(wrapper.vm.showConnectNewAccountModal).toBe(false);
  });

  it('opens ConnectNewWhatsAppAccount modal on Meta credit allocation error', async () => {
    const spy = vi.spyOn(wrapper.vm, 'callErrorModal');
    const store = whatsapp_cloud();

    vi.spyOn(wrapper.vm, 'configurePhoneNumber').mockImplementation(async () => {
      store.errorCloudConfigure = {
        message: 'Fatal',
        type: 'OAuthException',
        error_subcode: '1752246',
      };
    });

    await wrapper.vm.createChannel('1234');
    await wrapper.vm.$nextTick();

    expect(spy).not.toHaveBeenCalled();
    expect(wrapper.vm.showConnectNewAccountModal).toBe(true);

    const connectModal = wrapper.findComponent(ConnectNewWhatsAppAccountModal);
    expect(connectModal.exists()).toBe(true);
    expect(connectModal.props('show')).toBe(true);
  });

  it('opens ConnectNewWhatsAppAccount modal for nested axios Meta errors', async () => {
    const spy = vi.spyOn(wrapper.vm, 'callErrorModal');
    const store = whatsapp_cloud();

    vi.spyOn(wrapper.vm, 'configurePhoneNumber').mockImplementation(async () => {
      store.errorCloudConfigure = {
        response: {
          data: {
            error: {
              error_subcode: 1752246,
            },
          },
        },
      };
    });

    await wrapper.vm.createChannel('1234');

    expect(spy).not.toHaveBeenCalled();
    expect(wrapper.vm.showConnectNewAccountModal).toBe(true);
  });

  it('retries Facebook login from ConnectNewWhatsAppAccount modal', async () => {
    const startSpy = vi.spyOn(wrapper.vm, 'startFacebookLogin').mockImplementation(() => {});
    wrapper.vm.showConnectNewAccountModal = true;
    await wrapper.vm.$nextTick();

    const connectModal = wrapper.findComponent(ConnectNewWhatsAppAccountModal);
    await connectModal.vm.$emit('try-again');

    expect(wrapper.vm.showConnectNewAccountModal).toBe(false);
    expect(startSpy).toHaveBeenCalled();
  });

  it('closes ConnectNewWhatsAppAccount modal on close event', async () => {
    wrapper.vm.showConnectNewAccountModal = true;
    await wrapper.vm.$nextTick();

    const connectModal = wrapper.findComponent(ConnectNewWhatsAppAccountModal);
    await connectModal.vm.$emit('close');

    expect(wrapper.vm.showConnectNewAccountModal).toBe(false);
  });

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
  it('renders the WhatsApp setup modal with correct elements', () => {
    expect(wrapper.find('.whatsapp-setup').exists()).toBe(true);
    expect(wrapper.findComponent({ ref: 'whatsapp-setup-modal' }).exists()).toBe(true);
    expect(wrapper.find('.whatsapp-setup__buttons__cancel').exists()).toBe(true);
    expect(wrapper.find('.whatsapp-setup__buttons__start').exists()).toBe(true);
  });
});
