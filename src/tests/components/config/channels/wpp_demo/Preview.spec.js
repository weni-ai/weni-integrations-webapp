import { mount } from '@vue/test-utils';
import wppDemoPreview from '@/components/config/channels/wpp_demo/Preview.vue';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import unnnic from '@weni/unnnic-system';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

describe('wpp-demo-preview Component', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  const mockApp = {
    icon: 'https://example.com/icon.png',
    name: 'Demo App',
    config: {
      redirect_url: 'https://example.com',
    },
  };

  beforeEach(() => {
    global.navigator.clipboard = {
      writeText: vi.fn(),
    };
    wrapper = mount(wppDemoPreview, {
      props: {
        app: mockApp,
      },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          unnnic,
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
    expect(wrapper.find('.app-preview-wpp_demo__header__title__name').text()).toBe(mockApp.name);
  });

  it('should display the QR code URL', () => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURI(mockApp.config.redirect_url)}`;
    expect(wrapper.find('img[src^="https://api.qrserver.com"]').attributes('src')).toBe(qrCodeUrl);
  });

  it('should emit closeModal when closePreview method is called', async () => {
    await wrapper.vm.closePreview();

    expect(wrapper.emitted().closeModal).toBeTruthy();
  });

  it('should call navigator.clipboard.writeText and show alert on copyUrl method', async () => {
    const unnnicCallAlertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');

    await wrapper.vm.copyUrl();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockApp.config.redirect_url);
    expect(unnnicCallAlertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          text: 'Successfully copied!',
          type: 'success',
        },
        seconds: 3,
      }),
    );
  });

  it('should call window.open when openWppLink is called', async () => {
    const openSpy = vi.spyOn(window, 'open');

    await wrapper
      .find('.app-preview-wpp_demo__settings__content__input__buttons--open')
      .trigger('click');

    expect(openSpy).toHaveBeenCalledWith(mockApp.config.redirect_url, '_blank');
  });

  it('should render the description correctly', () => {
    expect(wrapper.find('.app-preview-wpp_demo__header__description').text()).toBe(
      'With the URL below you can use WhatsApp Demo, test it on your project, or even share it with others.',
    );
  });

  it('should render the description correctly', () => {
    expect(wrapper.find('.app-preview-wpp_demo__header__description').text()).toBe(
      'With the URL below you can use WhatsApp Demo, test it on your project, or even share it with others.',
    );
  });
});
