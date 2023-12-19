import { mount, createLocalVue } from '@vue/test-utils';
import ColorPicker from '@/components/ColorPicker/index.vue';

const localVue = createLocalVue();

describe('ColorPicker.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ColorPicker, {
      localVue,
      stubs: {
        UnnnicIconSvg: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should add a new color', () => {
    const event = {
      target: { value: '#ff00ff' },
    };
    expect(wrapper.vm.colors).toHaveLength(4);

    wrapper.vm.addColor(event);
    expect(wrapper.vm.colors).toHaveLength(5);
    expect(wrapper.vm.colors.pop()).toEqual(event.target.value);
  });

  it('should emit new color', () => {
    const color = '#ff00ff';
    wrapper.vm.emitColor(color);
    expect(wrapper.emitted('colorChange')).toBeTruthy();
    expect(wrapper.emitted('colorChange')[0]).toEqual([color]);
  });
});
