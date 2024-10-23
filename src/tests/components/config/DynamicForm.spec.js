import { shallowMount } from '@vue/test-utils';
import { describe, beforeEach, afterEach, vi, it, expect } from 'vitest';
import DynamicForm from '@/components/config/DynamicForm.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('DynamicForm.vue', () => {
  let wrapper;
  beforeEach(() => {
    const inputs = [
      {
        type: 'input',
        name: 'input',
        label: 'input',
        value: null,
      },
      {
        type: 'select',
        name: 'select',
        label: 'select',
        placeholder: 'select',
        value: null,
        options: [
          { value: 'select1', text: 'select1' },
          { value: 'select2', text: 'select2' },
        ],
      },
    ];

    wrapper = shallowMount(DynamicForm, {
      global: {
        plugins: [i18n, UnnnicSystem],
        stubs: {
          UnnnicInput: true,
          UnnnicSelect: true,
        },
      },
      props: {
        inputs,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should call emitInput on input component event', async () => {
    const spy = vi.spyOn(wrapper.vm, 'emitInput');
    const input = wrapper.findComponent({ ref: 'unnnic-input' });
    expect(input.exists()).toBe(true);

    expect(spy).not.toHaveBeenCalled();
    input.vm.$emit('update:modelValue', 'test');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(0, 'test');
  });

  describe('emitInput()', () => {
    it('should emit input value if default type', () => {
      const index = 0;
      const event = 'test';
      expect(wrapper.emitted('input')).toBeFalsy();
      wrapper.vm.emitInput(index, event);
      expect(wrapper.emitted('input')).toBeTruthy();
      expect(wrapper.emitted('input')[0]).toEqual([{ index, value: event }]);
    });
    it('should emit option value if input type is select', async () => {
      const index = 1;
      const input = wrapper.props().inputs[index];
      const event = ['select2'];
      expect(wrapper.emitted('input')).toBeFalsy();
      wrapper.vm.emitInput(index, event);
      expect(wrapper.emitted('input')).toBeTruthy();
      expect(wrapper.emitted('input')[0]).toEqual([{ index, value: input.options[1].value }]);
    });
  });
});
