import { mount } from '@vue/test-utils';
import WppDemoModal from '@/components/config/channels/wpp_demo/Config.vue';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

describe('Config.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = mount(WppDemoModal, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      props: {
        app: {
          config: {
            redirect_url: 'https://example.com',
          },
        },
      },
      mocks: {
        $t: (e) => e,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should emit closePopUp when closePopUp method is called', async () => {
    const closePopUpSpy = vi.spyOn(wrapper.vm, 'closePopUp');
    await wrapper.vm.closePopUp();

    expect(closePopUpSpy).toHaveBeenCalled();
    expect(wrapper.emitted().closePopUp).toBeTruthy();
  });

  it('should call window.open and emit closePopUp when openWppLink is called', async () => {
    const openSpy = vi.spyOn(window, 'open');
    const closePopUpSpy = vi.spyOn(wrapper.vm, 'closePopUp');

    await wrapper.vm.openWppLink();

    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    expect(closePopUpSpy).toHaveBeenCalled();
  });

  it('should correctly render modal title and description', () => {
    expect(wrapper.find('.wpp-demo-modal').exists()).toBe(true);
    expect(wrapper.find('.wpp-demo-modal').text()).toContain(
      wrapper.vm.$t('To be able to use WhatsApp Demo you will be directed to a link.'),
    );
    expect(wrapper.find('.wpp-demo-modal').text()).toContain(
      wrapper.vm.$t('WhatsAppDemo.config.description'),
    );
  });

  it('should have buttons that trigger correct methods on click', async () => {
    const closeButton = wrapper.findComponent({ ref: 'unnnic-wpp-demo-modal-close-button' });
    const navigateButton = wrapper.findComponent({ ref: 'unnnic-wpp-demo-modal-navigate-button' });

    await closeButton.trigger('click');
    expect(wrapper.emitted().closePopUp).toBeTruthy();

    await navigateButton.trigger('click');
    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
  });
});
