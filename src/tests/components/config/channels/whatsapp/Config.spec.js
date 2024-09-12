// src/tests/components/WhatsappConfig.spec.js

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WhatsappConfig from '@/components/config/channels/whatsapp/Config.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

describe('WhatsappConfig.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  const app = {
    icon: 'icon-url',
    name: 'App Name',
    code: 'app-code',
    uuid: 'app-uuid',
  };

  beforeEach(() => {
    wrapper = mount(WhatsappConfig, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
        },
      },
      props: { app },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  it('renders the component and its elements', () => {
    const titleName = wrapper.find('.config-whatsapp__header__title__name');
    expect(titleName.exists()).toBe(true);
    expect(titleName.text()).toBe('App Name');
    const closeButton = wrapper.findComponent({ ref: 'close' });
    expect(closeButton.exists()).toBe(true);

    expect(closeButton.props('iconCenter')).toBe('close-1');
    expect(wrapper.find('.config-whatsapp__header__description a').attributes('href')).toBe(
      'https://docs.weni.ai/l/en/channels/how-to-verify-my-business',
    );
  });

  it('calls closeConfig method on close button click', async () => {
    const closeButton = wrapper.findComponent({ ref: 'close' });
    expect(closeButton.exists()).toBe(true);
    await closeButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('closeModal')).toBeTruthy();
  });

  it('renders tabs correctly', async () => {
    await wrapper.setData({ skipLoad: true });

    const tabComponent = wrapper.findComponent({ ref: 'tab' });
    expect(tabComponent.exists()).toBe(true);

    expect(wrapper.findAll('.tab-head').length).toBe(4);
  });

  it('calls fetchData on mount and handles errors', async () => {
    const wrapper = mount(WhatsappConfig, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      props: { app },
    });
    const fetchAppInfoSpy = vi.spyOn(wrapper.vm, 'fetchAppInfo').mockResolvedValue();
    const fetchProfileSpy = vi.spyOn(wrapper.vm, 'fetchProfile').mockResolvedValue();
    const getWhatsAppCloudCatalogsSpy = vi.spyOn(wrapper.vm, 'getWhatsAppCloudCatalogs');

    await wrapper.vm.fetchData();
    await wrapper.vm.$nextTick();

    expect(fetchAppInfoSpy).toHaveBeenCalled();
    expect(fetchProfileSpy).toHaveBeenCalled();
    expect(getWhatsAppCloudCatalogsSpy).toHaveBeenCalled();
  });

  // it('shows error alert on fetchData error', async () => {
  //   vi.spyOn(wrapper.vm, 'fetchData').mockRejectedValue({
  //     response: { data: { error: { error_user_msg: 'Fetch Error' } } },
  //   });

  //   await expect(wrapper.vm.fetchData()).rejects.toEqual({
  //     response: { data: { error: { error_user_msg: 'Fetch Error' } } },
  //   });

  //   await wrapper.vm.$nextTick();
  //   expect(unnnic.unnnicCallAlert).toHaveBeenCalledWith({
  //     text: 'Fetch Error',
  //     type: 'error',
  //   });
  // });
});
