import { mount } from '@vue/test-utils';
import BaseInput from '@/components/BaseInput/index.vue';
import '@weni/unnnic-system';

describe('BaseInput.vue', () => {
  let wrapper;
  let inputElement;

  beforeEach(() => {
    wrapper = mount(BaseInput, {
      propsData: {
        type: 'normal',
      },
    });
    inputElement = wrapper.find('input');
  });

  it('renders an input element', () => {
    expect(inputElement.exists()).toBe(true);
  });

  it('emits an input event when typing in the input', () => {
    inputElement.setValue('test');
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toEqual(['test']);
  });

  it('replaces input value based on replaceRegex prop', async () => {
    await wrapper.setProps({ replaceRegex: /test/g });
    inputElement.setValue('test');
    expect(inputElement.element.value).toBe('');
  });

  it('emits an input event when pasting in the input', async () => {
    await inputElement.trigger('paste');
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('replaces input value based on replaceRegex prop when pasting', async () => {
    await wrapper.setProps({ replaceRegex: /test/g });
    inputElement.element.value = 'test';
    await inputElement.trigger('paste');
    expect(inputElement.element.value).toBe('');
  });
});
