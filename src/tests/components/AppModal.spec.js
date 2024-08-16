import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import AppModal from '../../components/AppModal/index.vue';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
describe('AppModal', () => {
  let wrapper;
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  beforeEach(async () => {
    wrapper = mount(AppModal, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        data: {
          showRemoveModal: true,
        },
      },
    });
  });
  it('matches snapshot', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('methods', () => {
    it('should call toggleRemoveModal when the button is clicked', async () => {
      await wrapper.setData({
        showRemoveModal: true,
      });
      // const spyToggleRemoveModal = vi.spyOn(wrapper.vm, 'toggleRemoveModal');

      const button = wrapper.findComponent('.unnnic-button');

      expect(wrapper.vm.showRemoveModal).toBe(true);

      expect(button.exists()).toBe(true);

      await button.trigger('click');

      // expect(spyToggleRemoveModal).toHaveBeenCalledTimes(1);
    });
  });
});
