import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from '@/components/BaseInput/index.vue';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import i18n from '@/utils/plugins/i18n';

describe('BaseInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(BaseInput, {
      global: {
        plugins: [i18n, UnnnicSystem],
        data: {
          showRemoveModal: true,
        },
      },
      props: {
        disabled: false,
        value: '',
        label: '',
        placeholder: '',
        maxlength: 25,
        message: null,
        type: 'normal',
        replaceRegex: null,
      },
    });
  });

  it('renders with default props', () => {
    expect(wrapper.props('disabled')).toBe(false);
    expect(wrapper.props('value')).toBe('');
    expect(wrapper.props('label')).toBe('');
    expect(wrapper.props('placeholder')).toBe('');
    expect(wrapper.props('maxlength')).toBe(25);
    expect(wrapper.props('message')).toBeNull();
    expect(wrapper.props('type')).toBe('normal');
    expect(wrapper.props('replaceRegex')).toBeNull();
  });

  it('renders input with correct attributes', () => {
    const inputWrapper = wrapper.findComponent({ ref: 'input' });

    expect(inputWrapper.exists()).toBe(true);

    const input = inputWrapper.find('input');
    expect(input.exists()).toBe(true);

    expect(input.attributes('disabled')).toBeUndefined();
    expect(input.attributes('maxlength')).toBe('25');
    expect(input.attributes('placeholder')).toBe('');
    expect(input.attributes('type')).toBe('text');
  });

  it('emits input event with correct value on input', async () => {
    wrapper = mount(BaseInput, {
      global: {
        plugins: [i18n, UnnnicSystem],
        data: {
          showRemoveModal: true,
        },
      },
      props: {
        disabled: false,
        value: '',
        label: '',
        placeholder: '',
        maxlength: 25,
        message: null,
        type: 'normal',
        replaceRegex: null,
      },
    });

    const inputWrapper = wrapper.findComponent({ ref: 'input' });
    expect(inputWrapper.exists()).toBe(true);

    const input = inputWrapper.find('input');
    expect(input.exists()).toBe(true);

    // Trigger input event
    await input.setValue('test');
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toEqual(['test']);
  });

  it('emits input event with correct value on paste', async () => {
    // Re-mount the component to ensure the latest props are used
    wrapper = mount(BaseInput, {
      global: {
        plugins: [i18n, UnnnicSystem],
        data: {
          showRemoveModal: true,
        },
      },
      props: {
        disabled: false,
        value: '',
        label: '',
        placeholder: '',
        maxlength: 25,
        message: null,
        type: 'normal',
        replaceRegex: null,
      },
    });

    const inputWrapper = wrapper.findComponent({ ref: 'input' });
    expect(inputWrapper.exists()).toBe(true);

    const input = inputWrapper.find('input');
    expect(input.exists()).toBe(true);

    // Trigger paste event
    await input.trigger('paste');
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('disables the input when disabled prop is true', async () => {
    await wrapper.setProps({ disabled: true });
    const inputWrapper = wrapper.findComponent({ ref: 'input' });
    expect(inputWrapper.exists()).toBe(true);

    const input = inputWrapper.find('input');
    expect(input.attributes('disabled')).toBe('');
  });

  it('handles replaceRegex prop correctly', async () => {
    const replaceRegex = /[^a-zA-Z]/g;
    await wrapper.setProps({ replaceRegex });
    const inputWrapper = wrapper.findComponent({ ref: 'input' });
    expect(inputWrapper.exists()).toBe(true);

    const input = inputWrapper.find('input');
    await input.setValue('test123');
    expect(wrapper.emitted().input[0]).toEqual(['test']);

    await input.trigger('paste');
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('does not modify input value when replaceRegex is null', async () => {
    await wrapper.setProps({ replaceRegex: null });
    const inputWrapper = wrapper.findComponent({ ref: 'input' });
    expect(inputWrapper.exists()).toBe(true);

    const input = inputWrapper.find('input');
    await input.setValue('test123');
    expect(wrapper.emitted().input[0]).toEqual(['test123']);
  });

  it('mounts component and sets event listeners', () => {
    const inputWrapper = wrapper.findComponent({ ref: 'input' });
    expect(inputWrapper.exists()).toBe(true);
  });
});
