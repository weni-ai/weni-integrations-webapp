import { shallowMount, createLocalVue } from '@vue/test-utils';
import DynamicForm from '@/components/config/DynamicForm.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

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
      localVue,
      i18n,
      propsData: {
        inputs,
      },
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicInput: true,
        UnnnicSelect: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call emitInput on input component event', async () => {
    const spy = spyOn(wrapper.vm, 'emitInput');
    const input = wrapper.findComponent({ ref: 'unnnic-input' });

    expect(spy).not.toHaveBeenCalled();
    input.vm.$emit('input', 'test');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(0, wrapper.props().inputs[0], 'test');
  });

  it('should call emitInput on select component event', async () => {
    const spy = spyOn(wrapper.vm, 'emitInput');
    const input = wrapper.findComponent({ ref: 'unnnic-select' });

    expect(spy).not.toHaveBeenCalled();
    input.vm.$emit('input', 2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, wrapper.props().inputs[1], 2);
  });

  describe('emitInput()', () => {
    it('should emit input value if default type', () => {
      const index = 0;
      const input = wrapper.props().inputs[index];
      const event = 'test';
      expect(wrapper.emitted('input')).toBeFalsy();
      wrapper.vm.emitInput(index, input, event);
      expect(wrapper.emitted('input')).toBeTruthy();
      expect(wrapper.emitted('input')[0]).toEqual([{ index, value: event }]);
    });
    it('should emit option value if input type is select', () => {
      const index = 1;
      const input = wrapper.props().inputs[index];
      const event = 'select2';
      expect(wrapper.emitted('input')).toBeFalsy();
      wrapper.vm.emitInput(index, input, event);
      expect(wrapper.emitted('input')).toBeTruthy();
      expect(wrapper.emitted('input')[0]).toEqual([{ index, value: input.options[1].value }]);
    });
  });
});
