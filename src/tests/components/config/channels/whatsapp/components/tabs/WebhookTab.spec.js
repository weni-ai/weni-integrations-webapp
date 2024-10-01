import { mount } from '@vue/test-utils';
import WebhookTab from '@/components/config/channels/whatsapp/components/tabs/WebhookTab.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

describe('WebhookTab', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  const mockApp = {
    config: {
      webhook: {
        url: 'https://example.com/webhook',
        method: 'POST',
        headers: {
          Authorization: 'Bearer token',
        },
      },
    },
    code: 'whatsapp',
    uuid: 'app-uuid',
  };

  beforeEach(() => {
    wrapper = mount(WebhookTab, {
      props: { app: mockApp },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
    });
  });

  it('renders with correct initial data from props', () => {
    expect(wrapper.vm.webhookUrl).toBe('https://example.com/webhook');
    expect(wrapper.vm.selectedMethod).toEqual('POST');
    expect(wrapper.vm.headers.length).toBe(2);
    expect(wrapper.vm.headers[0].key).toBe('Authorization');
    expect(wrapper.vm.headers[0].value).toBe('Bearer token');
  });

  it('adds an empty header when mounted if no empty headers exist', () => {
    wrapper.vm.mountHeaders();
    expect(wrapper.vm.headers.length).toBe(1);
    expect(wrapper.vm.headers[0].key).toBe('Authorization');
  });

  it('removes extra empty headers', () => {
    wrapper.vm.createEmptyHeader();
    wrapper.vm.createEmptyHeader();
    wrapper.vm.removeExtraEmptyHeader();
    expect(wrapper.vm.headers.length).toBe(3);
  });

  it('builds the correct headers payload', () => {
    const payload = wrapper.vm.buildHeadersPayload();
    expect(payload).toEqual({ Authorization: 'Bearer token' });
  });

  it('handles header key and value changes correctly', () => {
    wrapper.vm.handleHeaderKeyChange(0, 'New-Key');
    wrapper.vm.handleHeaderValueChange(0, 'New-Value');
    expect(wrapper.vm.headers[0].key).toBe('New-Key');
    expect(wrapper.vm.headers[0].value).toBe('New-Value');
  });

  // it('calls saveWebhookInfo when the save button is clicked and succeeds', async () => {
  //   const saveSpy = vi.spyOn(wrapper.vm, 'saveWebhookInfo');

  //   const saveButton = wrapper.findComponent({ ref: 'save' });
  //   expect(saveButton.exists()).toBe(true);
  //   await saveButton.trigger('click');

  //   expect(saveSpy).toHaveBeenCalled();
  //   expect(wrapper.vm.loadingUpdateWebhookInfo).toBeFalsy();
  // });

  it('displays error modal when URL is invalid on save', async () => {
    const callModalSpy = vi.spyOn(wrapper.vm, 'callModal');

    const urlInput = wrapper.find('.webhook-info__content__url input');
    await urlInput.setValue('invalid-url');

    await wrapper.vm.saveWebhookInfo();

    expect(callModalSpy).toHaveBeenCalledWith({
      type: 'error',
      text: 'Error while trying to update webhook data',
    });
  });

  it('emits close event when cancel button is clicked', async () => {
    const cancelButton = wrapper.findComponent({ ref: 'close' });
    await cancelButton.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('displays error modal when webhook update fails', async () => {
    const callModalSpy = vi.spyOn(wrapper.vm, 'callModal');

    // Simula erro na ação do Pinia
    wrapper.vm.updateWppWebhookInfo = vi.fn().mockResolvedValueOnce(false);
    wrapper.vm.errorUpdateWebhookInfo = { error_user_msg: 'Update Failed' };

    await wrapper.vm.saveWebhookInfo();

    expect(callModalSpy).toHaveBeenCalledWith({
      type: 'error',
      text: 'Error while trying to update webhook data',
    });
  });
});
