import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FormTabContentButtons from '@/components/whatsAppTemplates/FormTabContentButtons.vue';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';

describe('FormTabContentButtons.vue', () => {
  let wrapper;
  const mockTemplateTranslationCurrentForm = {
    buttons: [{ button_type: 'QUICK_REPLY', text: '' }],
  };
  const pinia = createTestingPinia({
    initialState: {
      whatsapp_store: {
        templateTranslationCurrentForm: mockTemplateTranslationCurrentForm,
      },
    },
  });

  const createWrapper = (props = {}) => {
    return mount(FormTabContentButtons, {
      props: {
        disableInputs: false,
        ...props,
      },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      methods: {
        addButton: vi.fn(),
      },
    });
  };

  beforeEach(() => {
    wrapper = createWrapper();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the correct title', () => {
    const title = wrapper.find('.form-tab-content-buttons__title');
    expect(title.text()).toBe('Buttons');
  });

  it('should render the button options select', () => {
    const select = wrapper.findComponent({ name: 'unnnic-select-smart' });
    expect(select.exists()).toBe(true);
  });

  it('should update button type when selected', async () => {
    const select = wrapper.findComponent({ name: 'unnnic-select-smart' });
    const options = [{ value: 'quick_reply', label: 'Quick Reply' }];

    await select.vm.$emit('update:modelValue', options);
    expect(wrapper.vm.currentButtonType).toEqual(options);
  });

  it('should render quick reply input fields when button type is "quick_reply"', async () => {
    const store = whatsapp_store();
    store.templateTranslationCurrentForm = {
      buttons: [{ button_type: 'QUICK_REPLY', text: '' }],
    };

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.buttonsType).toBe('quick_reply');

    const repliesWrapper = wrapper.find({ ref: 'replies-wrapper' });
    expect(repliesWrapper.exists()).toBe(true);

    const inputFields = wrapper.findAllComponents({ name: 'unnnic-input' });
    expect(inputFields.length).toBe(mockTemplateTranslationCurrentForm.buttons.length);
  });

  it('should render call to action input fields when button type is "call_to_action"', async () => {
    const callActionWrapper = wrapper.find({ ref: 'replies-wrapper' });
    expect(callActionWrapper.exists()).toBe(true);

    const inputFields = wrapper.findAllComponents({ name: 'unnnic-input' });
    expect(inputFields.length).toBe(mockTemplateTranslationCurrentForm.buttons.length);
  });

  it('should call removeButton when the remove button is clicked', async () => {
    const removeButtonSpy = vi.spyOn(wrapper.vm, 'removeButton');
    const removeButton = wrapper.find('.form-tab-content-buttons__replies__remove-button');

    await removeButton.trigger('click');
    expect(removeButtonSpy).toHaveBeenCalled();
  });

  it('should handle call-to-action type change', async () => {
    const select = wrapper.findComponent({ name: 'unnnic-select-smart' });
    expect(wrapper.vm.disableInputs).toBe(false);
    expect(select.exists()).toBe(true);
    const options = [{ value: 'call_to_action', label: 'Call to action' }];

    await select.vm.$emit('update:modelValue', options);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentButtonType).toEqual(options);
  });
});
