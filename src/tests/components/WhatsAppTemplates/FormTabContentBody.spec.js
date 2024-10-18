import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import FormTabContentBody from '@/components/whatsAppTemplates/FormTabContentBody.vue';
import InputEditor from '@/components/whatsAppTemplates/InputEditor.vue';
import { describe, beforeEach, it, expect } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('FormTabContentBody.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    initialState: {
      whatsapp_store: {
        templateTranslationCurrentForm: {
          body: '',
        },
      },
    },
    stubActions: false,
  });

  beforeEach(() => {
    wrapper = shallowMount(FormTabContentBody, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        components: { InputEditor },
      },
      props: {
        disableInputs: false,
      },
    });
  });

  it('renders the component correctly', () => {
    expect(wrapper.find('.form-tab-content-body').exists()).toBe(true);
  });

  it('displays the correct title', () => {
    const title = wrapper.find('.form-tab-content-body__title');
    expect(title.text()).toBe('Body Text');
  });

  it('disables the text area when disableInputs is true', async () => {
    await wrapper.setProps({ disableInputs: true });
    expect(wrapper.findComponent({ ref: 'bodyText' }).props('disabled')).toBe(true);
  });

  it('emits input-change event when onInput is called', async () => {
    const mockEvent = 'New input';
    await wrapper.vm.onInput(mockEvent);

    expect(wrapper.emitted('input-change')).toBeTruthy();
    expect(wrapper.emitted('input-change')[0]).toEqual([
      { fieldName: 'body', fieldValue: mockEvent },
    ]);
  });

  it('adds variable correctly', async () => {
    await wrapper.vm.addVariable();

    expect(wrapper.emitted('input-change')).toBeTruthy();
    expect(wrapper.emitted('input-change')[0][0].fieldName).toBe('body');
    expect(wrapper.emitted('input-change')[0][0].fieldValue).toContain('{{1}}');
  });

  it('calculates word count correctly', () => {
    const text = 'Hello world';
    const wordCount = wrapper.vm.countWords(text);

    expect(wordCount).toBe(2);
  });
});
