import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import FormTabContentFooter from '@/components/whatsAppTemplates/FormTabContentFooter.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

describe('FormTabContentFooter.vue', () => {
  let wrapper;

  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  setActivePinia(pinia);
  const whatsappStore = whatsapp_store();

  const mountComponent = (props = {}) => {
    return mount(FormTabContentFooter, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      props,
    });
  };

  beforeEach(() => {
    whatsappStore.templateTranslationCurrentForm = {
      footer: 'Initial Footer',
    };
  });

  it('renders the component correctly', () => {
    wrapper = mountComponent();
    expect(wrapper.find('.form-tab-content-footer').exists()).toBe(true);
    expect(wrapper.find('.form-tab-content-footer__title').text()).toBe('Footer Text');
    expect(wrapper.findComponent({ name: 'unnnic-input' }).exists()).toBe(true);
  });

  it('displays the correct footer text from the store', () => {
    wrapper = mountComponent();
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.props('modelValue')).toBe('Initial Footer');
  });

  it('displays an empty string when there is no footer in the store', () => {
    whatsappStore.templateTranslationCurrentForm.footer = '';
    wrapper = mountComponent();
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.props('modelValue')).toBe('');
  });

  it('disables the input when `disableInputs` prop is true', () => {
    wrapper = mountComponent({ disableInputs: true });
    const input = wrapper.find('.form-tab-content-footer__input__disabled');
    expect(input.exists()).toBe(true);
  });

  it('emits `input-change` event when the input value changes', async () => {
    wrapper = mountComponent();
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    await input.vm.$emit('update:modelValue', 'New Footer Text');
    expect(wrapper.emitted('input-change')).toBeTruthy();
    expect(wrapper.emitted('input-change')[0]).toEqual([
      { fieldName: 'footer', fieldValue: 'New Footer Text' },
    ]);
  });
});
