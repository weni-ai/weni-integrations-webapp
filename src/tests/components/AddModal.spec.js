import { mount } from '@vue/test-utils';
import AddModal from '../../components/AddModal/index.vue';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import i18n from '@/utils/plugins/i18n';
describe('AddModal', () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = mount(AddModal, {
      global: {
        plugins: [i18n],
        mocks: {
          $router: {
            replace: vi.fn(),
          },
        },
      },
    });
    await wrapper.vm.$nextTick();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('methods', () => {
    it('should change showModal', async () => {
      expect(wrapper.vm.showAddModal).toBe(false);
      await wrapper.vm.toggleModal();
      expect(wrapper.vm.showAddModal).toBe(true);
    });

    it('should navigate to myApps', async () => {
      await wrapper.vm.navigateToMyApps();
      expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/apps/my');
    });
  });
});
