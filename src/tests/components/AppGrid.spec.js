import { mount } from '@vue/test-utils';
import AppGrid from '../../components/AppGrid/index.vue';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import { createTestingPinia } from '@pinia/testing';
import { app_type } from '@/stores/modules/appType/appType.store';
import { avatarIcons } from '@/views/data/icons';
describe('AppGrid', () => {
  let wrapper;
  const pushMock = vi.fn();
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  beforeEach(async () => {
    wrapper = mount(AppGrid, {
      global: {
        plugins: [pinia, i18n],
        mocks: {
          $router: {
            push: pushMock,
          },
          props: {
            apps: [
              {
                code: 'vtex',
                name: 'Vtex',
                description: 'vtex.data.description',
                summary: 'vtex.data.summary',
                category: 'ecommerce',
                icon: null,
                bg_color: null,
                config_design: 'pre-popup',
                rating: { average: null, mine: null },
                comments_count: 0,
                integrations_count: 3,
                metrics: 58602143,
                can_add: false,
                assets: [],
              },
            ],
            avatar: avatarIcons.channel,
          },
        },
      },
    });
    await wrapper.vm.$nextTick();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('mounted', () => {
    it('should call updateGridSize', async () => {
      const spy = vi.spyOn(AppGrid.methods, 'updateGridSize');
      await wrapper.vm.$nextTick();
      expect(spy).toBeDefined;
    });
  });

  describe('methods', () => {
    it('should reset currentRemoval and showRemoval', async () => {
      const showRemoveModal = wrapper.vm.showRemoveModal;
      await wrapper.vm.toggleRemoveModal();
      expect(wrapper.vm.currentRemoval).toBe(null);
      expect(wrapper.vm.showRemoveModal).toBe(!showRemoveModal);
    });

    it('calls removeApp and toggles remove modal', async () => {
      const store = app_type();
      store.errorDeleteApp = false;

      const spyToggleRemoveModal = vi.spyOn(wrapper.vm, 'toggleRemoveModal');
      const spyDeleteApp = vi.spyOn(store, 'deleteApp').mockResolvedValue();

      await wrapper.vm.removeApp('1234', '5678');

      expect(spyDeleteApp).toHaveBeenCalledWith({ code: '1234', appUuid: '5678' });
      expect(spyToggleRemoveModal).toHaveBeenCalledTimes(1);
    });

    it('should call openAppDetails', async () => {
      await wrapper.vm.openAppDetails('1234');
      expect(pushMock).toHaveBeenCalledWith('/1234/details');
    });
  });
});
