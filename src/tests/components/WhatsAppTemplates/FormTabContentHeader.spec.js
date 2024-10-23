import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import FormTabContentHeader from '@/components/whatsAppTemplates/FormTabContentHeader.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

describe('FormTabContentHeader.vue', () => {
  let wrapper;

  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  setActivePinia(pinia);
  const whatsappStore = whatsapp_store();

  const mountComponent = (props = {}) => {
    return mount(FormTabContentHeader, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      props,
    });
  };

  beforeEach(() => {
    whatsappStore.templateTranslationCurrentForm = {
      header: { header_type: 'TEXT', text: 'Initial Header' },
    };
  });

  it('renders the component correctly', () => {
    wrapper = mountComponent();
    expect(wrapper.find('.form-tab-content-header').exists()).toBe(true);
    expect(wrapper.find('.form-tab-content-header__title').text()).toBe('Header');
    expect(wrapper.findComponent({ name: 'unnnic-label' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'unnnic-select-smart' }).exists()).toBe(true);
  });

  it('displays the correct header text when header type is TEXT', () => {
    wrapper = mountComponent();
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.props('modelValue')).toBe('Initial Header');
  });

  it('displays empty input when there is no header text in the store', () => {
    whatsappStore.templateTranslationCurrentForm.header.text = '';
    wrapper = mountComponent();
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.props('modelValue')).toBe(null);
  });

  it('disables inputs when `disableInputs` prop is true', () => {
    wrapper = mountComponent({ disableInputs: true });
    const select = wrapper.findComponent({ name: 'unnnic-select-smart' });
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.exists()).toBe(true);
    expect(select.props('disabled')).toBe(true);
    expect(input.attributes('disabled')).toBe('true');
  });

  it('emits `input-change` event when the header input value changes', async () => {
    wrapper = mountComponent();
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    await input.vm.$emit('update:modelValue', 'New Header Text');
    expect(wrapper.emitted('input-change')).toBeTruthy();
    expect(wrapper.emitted('input-change')[0]).toEqual([
      {
        fieldName: 'header',
        fieldValue: {
          header_type: 'TEXT',
          text: 'Initial Header',
        },
      },
    ]);
  });

  it('displays text input only when header type is TEXT', () => {
    wrapper = mountComponent();
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.exists()).toBe(true);

    whatsappStore.templateTranslationCurrentForm.header.header_type = 'MEDIA';
    wrapper = mountComponent();
    expect(wrapper.findComponent({ name: 'unnnic-input' }).exists()).toBe(false);
  });

  it('limits the input to a maximum length of 60 characters', () => {
    wrapper = mountComponent();
    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.attributes('maxlength')).toBe('60');
  });
});
