import { mount } from '@vue/test-utils';
import DynamicForm from '@/components/config/DynamicForm.vue';
import { describe, it, expect } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

describe('DynamicForm.vue', () => {
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);
  const inputs = [
    {
      type: 'input',
      label: 'input.label',
      placeholder: 'input.placeholder',
      value: '',
      error: false,
    },
    {
      type: 'select',
      label: 'select.label',
      options: [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
      ],
      value: '',
    },
    {
      type: 'upload',
      label: 'upload.label',
      props: {
        files: [],
        acceptMultiple: true,
        supportedFormats: 'pdf',
        maximumUploads: 3,
        maxFileSize: 2,
        filesProgress: {},
        isUploading: false,
        canImport: true,
        canDelete: true,
        shouldReplace: false,
      },
    },
    { type: 'checkbox', label: 'checkbox.label', value: false },
    { type: 'unsupported', label: 'unsupported.label', value: '' },
  ];

  const mountComponent = (propsData = { inputs }) => {
    return mount(DynamicForm, {
      propsData,
      global: {
        plugins: [i18n, UnnnicSystem, pinia],
      },
    });
  };

  it('renders all form elements correctly', () => {
    const wrapper = mountComponent();
    const unnnicInput = wrapper.findComponent({ ref: 'unnnic-input' });
    expect(unnnicInput.exists()).toBe(true);

    const unnnicSelectSmart = wrapper.findComponent({ ref: 'unnnic-select' });
    expect(unnnicSelectSmart.exists()).toBe(true);

    const unnnicUploadArea = wrapper.findComponent({ ref: 'unnnic-upload' });
    expect(unnnicUploadArea.exists()).toBe(true);

    const unnnicCheckbox = wrapper.findComponent({ ref: 'unnnic-checkbox' });
    expect(unnnicCheckbox.exists()).toBe(true);
  });

  it('emits input event correctly for input field', async () => {
    const wrapper = mountComponent();
    const input = wrapper.findComponent({ ref: 'unnnic-input' });
    await input.vm.$emit('update:modelValue', 'new value');
    expect(wrapper.emitted().input[0]).toEqual([{ index: 0, value: 'new value' }]);
  });

  it('emits input event correctly for select field', async () => {
    const wrapper = mountComponent();
    const select = wrapper.findComponent({ ref: 'unnnic-select' });
    expect(select.exists()).toBe(true);
    expect(wrapper.vm.inputs[1].value).toStrictEqual([
      {
        label: 'Option 1',
        value: 'opt1',
      },
    ]);
    await select.vm.$emit('update:modelValue', [
      {
        label: 'Option 2',
        value: 'opt2',
      },
    ]);
    expect(wrapper.vm.inputs[1].value).toEqual([
      {
        label: 'Option 2',
        value: 'opt2',
      },
    ]);
  });

  it('emits input event correctly for upload field', async () => {
    const wrapper = mountComponent();
    const upload = wrapper.findComponent({ ref: 'unnnic-upload' });
    const files = [{ name: 'file1.pdf' }];
    await upload.vm.$emit('fileChange', files);
    expect(wrapper.emitted().input[0]).toEqual([{ index: 2, value: files }]);
  });

  it('emits input event correctly for checkbox', async () => {
    const wrapper = mountComponent();
    const checkbox = wrapper.findComponent({ ref: 'unnnic-checkbox' });
    await checkbox.vm.$emit('change', true);
    expect(wrapper.emitted().input[0]).toEqual([{ index: 3, value: true }]);
  });

  it('handles unsupported input types correctly', async () => {
    const wrapper = mountComponent();
    // Garante que tipos não suportados não emitem eventos
    expect(wrapper.find('.dynamic-form__fields').exists()).toBe(true);
    expect(wrapper.emitted().input).toBeUndefined();
  });

  it('computes input type correctly based on error (error case)', () => {
    const inputsWithError = [
      {
        type: 'input',
        label: 'input.label',
        placeholder: 'input.placeholder',
        value: '',
        error: true,
      },
    ];
    const wrapper = mountComponent({ inputs: inputsWithError });
    const input = wrapper.findComponent({ ref: 'unnnic-input' });
    expect(input.props().type).toBe('error');
  });

  it('computes input type correctly when there is no error', () => {
    const inputsWithoutError = [
      {
        type: 'input',
        label: 'input.label',
        placeholder: 'input.placeholder',
        value: '',
        error: false,
      },
    ];
    const wrapper = mountComponent({ inputs: inputsWithoutError });
    const input = wrapper.findComponent({ ref: 'unnnic-input' });
    expect(input.props().type).toBe('normal');
  });

  it('renders select field with correct options', () => {
    const wrapper = mountComponent();
    const select = wrapper.findComponent({ ref: 'unnnic-select' });
    const options = select.vm.options;
    expect(options).toEqual([
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ]);
  });

  it('renders upload field with correct props', () => {
    const wrapper = mountComponent();
    const upload = wrapper.findComponent({ ref: 'unnnic-upload' });
    expect(upload.props('acceptMultiple')).toBe(true);
    expect(upload.props('supportedFormats')).toEqual('pdf');
    expect(upload.props('maximumUploads')).toBe(3);
    expect(upload.props('maxFileSize')).toBe(2);
  });

  it('returns correct input type in getType method', () => {
    const wrapper = mountComponent({
      inputs: [{ type: 'input', value: '', error: true }],
    });
    expect(wrapper.vm.getType(wrapper.vm.inputs[0])).toBe('error');
  });
});
