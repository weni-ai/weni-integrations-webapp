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
          $t: (e) => e,
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

    describe('openAppModal', () => {
      const configuredApp = {
        uuid: 'app-uuid-123',
        code: 'wwc',
        name: 'Weni Web Chat',
        generic: false,
        icon: null,
        summary: 'weniWebChat.data.summary',
        config: {},
        rating: { average: null },
        comments_count: 0,
      };

      const mountForOpenAppModal = (type) =>
        mount(AppGrid, {
          props: { section: 'configured', type, apps: [configuredApp] },
          global: {
            plugins: [pinia, i18n],
            mocks: {
              $router: { push: pushMock },
              $t: (e) => e,
            },
          },
        });

      it('pushes route to configured app URL when type is "edit"', async () => {
        pushMock.mockClear();
        const w = mountForOpenAppModal('edit');
        await w.vm.openAppModal(configuredApp);
        expect(pushMock).toHaveBeenCalledWith(
          `/apps/my/configured/${configuredApp.code}/${configuredApp.uuid}`,
        );
      });

      it('calls configModal.openModal when type is "config"', async () => {
        pushMock.mockClear();
        const w = mountForOpenAppModal('config');
        await w.vm.$nextTick();

        const openModalSpy = vi
          .spyOn(w.vm.$refs.configModal, 'openModal')
          .mockImplementation(() => {});

        await w.vm.openAppModal(configuredApp);

        expect(openModalSpy).toHaveBeenCalledWith({ app: configuredApp, isConfigured: false });
        expect(pushMock).not.toHaveBeenCalledWith(
          expect.stringContaining('/apps/my/configured/'),
        );
      });

      it('does nothing when type is "add" and app is generic', async () => {
        pushMock.mockClear();
        const genericApp = { ...configuredApp, generic: true };
        const w = mount(AppGrid, {
          props: { section: 'configured', type: 'add', apps: [genericApp] },
          global: {
            plugins: [pinia, i18n],
            mocks: { $router: { push: pushMock }, $t: (e) => e },
          },
        });
        await w.vm.openAppModal(genericApp);
        expect(pushMock).not.toHaveBeenCalled();
      });
    });
  });
});
