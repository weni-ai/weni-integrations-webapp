import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import VtexModal from '@/components/config/ecommerce/vtex/Setup.vue';
import unnnic from '@weni/unnnic-system';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import { setActivePinia } from 'pinia';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import StepIndicator from '@/components/StepIndicator.vue';
import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';

describe('VtexModal.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    const store = ecommerce_store();
    store.generatedVtexAppUuid = {
      uuid: '1234',
    };
    wrapper = mount(VtexModal, {
      props: {
        app: {
          code: 'app-code',
        },
      },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          StepIndicator,
          unnnic,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the first step correctly', async () => {
    wrapper.setData({ currentStep: 0 });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentStep).toBe(0);
    const headerTitle = wrapper.find({ ref: 'headerTitle' });
    expect(headerTitle.exists()).toBe(true);
    expect(headerTitle.text()).toBe(
      'Connect your storeSelect WhatsApp number, enter subdomain, AppKey and AppToken',
    );
    const headerDescription = wrapper.find('.vtex-modal__header__description');
    expect(headerDescription.text()).toBe(
      'Select WhatsApp number, enter subdomain, AppKey and AppToken',
    );
  });

  it('displays WhatsApp channels when not loading', async () => {
    wrapper.setData({
      loadingChannels: false,
      whatsappChannels: [{ label: 'Channel 1', value: '1' }],
    });
    await wrapper.vm.$nextTick();
    const whatsappSelect = wrapper.findComponent({ ref: 'whatsappChannelSelect' });
    expect(whatsappSelect.exists()).toBe(true);
    expect(whatsappSelect.props('options')).toEqual([{ label: 'Channel 1', value: '1' }]);
  });

  it('displays a skeleton loader when loading WhatsApp channels', async () => {
    wrapper.setData({ loadingChannels: true });
    await wrapper.vm.$nextTick();
    const skeletonLoader = wrapper.findComponent({ name: 'unnnic-skeleton-loading' });
    expect(skeletonLoader.exists()).toBe(true);
  });

  it('shows an error message if fields are missing when continuing setup', async () => {
    const spy = vi.spyOn(unnnic, 'unnnicCallAlert');
    wrapper.setData({ currentStep: 0, storeDomain: '', apiDomain: '', appKey: '', appToken: '' });
    await wrapper.vm.continueSetup();
    expect(spy).toHaveBeenCalledWith({
      props: { type: 'error', text: 'All fields are mandatory' },
      seconds: 6,
    });
  });

  it('proceeds to the next step if all fields are filled', async () => {
    const store = ecommerce_store();
    store.generatedVtexAppUuid = {
      uuid: '1234',
    };
    wrapper.setData({
      currentStep: 0,
      storeDomain: 'store.com',
      apiDomain: 'api.com',
      appKey: 'key',
      appToken: 'token',
    });
    await wrapper.vm.continueSetup();
    expect(wrapper.vm.currentStep).toBe(1);
  });

  it('renders the second step correctly', async () => {
    process.env.VITE_APP_API_BASE_URL = 'https://integrations-engine.stg.cloud.weni.ai';
    const store = ecommerce_store();
    store.generatedVtexAppUuid = {
      uuid: '1234',
    };
    wrapper.setData({ currentStep: 1 });
    await wrapper.vm.$nextTick();
    const headerTitle = wrapper.find('.vtex-modal__header__title');
    expect(headerTitle.text()).toBe('Setup an affiliate in VTEX');
    const webhookUrl = wrapper.vm.webhookUrl;
    expect(webhookUrl).toBe(
      'https://integrations-engine.stg.cloud.weni.ai/api/v1/webhook/vtex/1234/products-update/api/notification/',
    );
  });

  it('copies webhook URL to clipboard when copy button is clicked', async () => {
    const store = ecommerce_store();
    store.generatedVtexAppUuid = {
      uuid: '1234',
    };
    const mockClipboard = { writeText: vi.fn() };
    global.navigator.clipboard = mockClipboard;
    wrapper.setData({ currentStep: 1 });
    await wrapper.vm.$nextTick();
    const copyButton = wrapper.findComponent({ ref: 'vtex-copy-button' });
    expect(copyButton.exists()).toBe(true);
    copyButton.trigger('click');
    expect(mockClipboard.writeText).toHaveBeenCalledWith(wrapper.vm.webhookUrl);
    expect(unnnic.unnnicCallAlert).toHaveBeenCalledWith({
      props: { text: 'Successfully copied!', type: 'success' },
      seconds: 3,
    });
  });
});
