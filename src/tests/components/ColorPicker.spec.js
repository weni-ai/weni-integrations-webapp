import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ColorPicker from '@/components/ColorPicker/index.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';

vi.mock('@/components/UnnnicIconSvg.vue', () => ({
  name: 'unnnic-icon-svg',
  props: ['icon', 'size'],
  template: '<svg />',
}));

describe('ColorPicker.vue', () => {
  let wrapper;
  const pushMock = vi.fn();
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });

  beforeEach(async () => {
    wrapper = mount(ColorPicker, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $router: {
            push: pushMock,
          },
        },
        methods: {
          fetchFeatured: vi.fn(),
        },
      },
    });
    await wrapper.vm.$nextTick();
  });

  it('renders initial colors correctly', () => {
    const colorDivs = wrapper.findAll('.color-picker__color');
    expect(colorDivs).toHaveLength(4);
    expect(colorDivs[0].attributes('style')).toContain('background-color: rgb(0, 158, 150)');
    expect(colorDivs[1].attributes('style')).toContain('background-color: rgb(38, 38, 38)');
    expect(colorDivs[2].attributes('style')).toContain('background-color: rgb(196, 234, 245)');
  });

  it('adds a new color and emits colorChange event', async () => {
    const newColor = '#ffff00';
    const emitColorSpy = vi.spyOn(wrapper.vm, 'emitColor');
    const colorInput = wrapper.find('input[type="color"]');

    await colorInput.setValue(newColor);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.colors).toContain(newColor);

    expect(emitColorSpy).toHaveBeenCalledWith(newColor);
  });

  it('renders unnnic-icon-svg correctly', () => {
    const icon = wrapper.findComponent({ ref: 'icon' });
    expect(icon.exists()).toBe(true);
  });
});
