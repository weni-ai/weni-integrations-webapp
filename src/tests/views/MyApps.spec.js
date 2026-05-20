import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import MyApps from '../../views/MyApps/index.vue';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import { app_type } from '@/stores/modules/appType/appType.store';

const mockApp = {
  uuid: 'app-uuid-123',
  code: 'wwc',
  name: 'Weni Web Chat',
  generic: false,
  icon: null,
  summary: 'weniWebChat.data.summary',
  config: { title: 'My Chat' },
  rating: { average: null },
  comments_count: 0,
};

const mockRoute = (params = {}) => ({ params });
const mockRouter = () => ({ replace: vi.fn(), back: vi.fn(), push: vi.fn() });

describe('MyApps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('matches snapshot', () => {
    const wrapper = mount(MyApps, {
      global: {
        plugins: [createTestingPinia(), i18n],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('mounted', () => {
    it('should call fetchCategories', async () => {
      const spy = vi.spyOn(MyApps.methods, 'fetchCategories');
      const wrapper = mount(MyApps, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
        },
      });
      await wrapper.vm.$nextTick();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('methods', () => {
    it('should call fetchInstalled', async () => {
      const fetchInstalledMock = vi
        .spyOn(MyApps.methods, 'fetchInstalled')
        .mockImplementation(() => {});
      const fetchConfiguredMock = vi
        .spyOn(MyApps.methods, 'fetchConfigured')
        .mockImplementation(() => {});

      const wrapper = mount(MyApps, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
        },
      });

      wrapper.vm.fetchCategories();
      expect(fetchInstalledMock).toHaveBeenCalledTimes(2);

      fetchInstalledMock.mockRestore();
      fetchConfiguredMock.mockRestore();
    });

    it('should call getConfiguredApps', async () => {
      const getConfiguredApps = vi
        .spyOn(MyApps.methods, 'getConfiguredApps')
        .mockImplementation(() => {});

      const wrapper = mount(MyApps, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
        },
      });

      wrapper.vm.fetchConfigured();
      expect(getConfiguredApps).toHaveBeenCalledTimes(2);

      getConfiguredApps.mockRestore();
    });

    it('should call getInstalledApps', async () => {
      const getInstalledApps = vi
        .spyOn(MyApps.methods, 'getInstalledApps')
        .mockImplementation(() => {});

      const wrapper = mount(MyApps, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
        },
      });

      wrapper.vm.fetchInstalled();
      expect(getInstalledApps).toHaveBeenCalledTimes(2);

      getInstalledApps.mockRestore();
    });

    it('should change route', async () => {
      const replaceMock = vi.fn();
      const wrapper = mount(MyApps, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
          mocks: {
            $router: { replace: replaceMock },
            $route: mockRoute(),
          },
        },
      });

      wrapper.vm.navigateToDiscovery();
      expect(replaceMock).toHaveBeenCalledWith('/apps/discovery');
    });

    describe('openConfigFromRoute', () => {
      it('calls directConfigModal.openModal via $nextTick', async () => {
        const wrapper = mount(MyApps, {
          global: {
            plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
            mocks: { $router: mockRouter(), $route: mockRoute() },
          },
        });
        await wrapper.vm.$nextTick();

        const openModalSpy = vi
          .spyOn(wrapper.vm.$refs.directConfigModal, 'openModal')
          .mockImplementation(() => {});

        wrapper.vm.openConfigFromRoute(mockApp);
        await wrapper.vm.$nextTick();

        expect(openModalSpy).toHaveBeenCalledWith({ app: mockApp, isConfigured: true });
      });

      it('does not throw if directConfigModal ref is unavailable', async () => {
        const wrapper = mount(MyApps, {
          global: {
            plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
            mocks: { $router: mockRouter(), $route: mockRoute() },
          },
        });
        wrapper.vm.$refs.directConfigModal = undefined;
        expect(() => wrapper.vm.openConfigFromRoute(mockApp)).not.toThrow();
      });
    });

    describe('fetchAppFromRoute', () => {
      const mountForFetch = (params = { appCode: 'wwc', appUuid: 'app-uuid-123' }) => {
        const pinia = createTestingPinia({ createSpy: vi.fn });
        const wrapper = mount(MyApps, {
          global: {
            plugins: [pinia, i18n],
            mocks: { $router: mockRouter(), $route: mockRoute(params) },
          },
        });
        const store = app_type();
        // Reset state left by the immediate watcher that fired during mount
        wrapper.vm.isFetchingApp = false;
        store.getApp.mockClear();
        return { wrapper, store };
      };

      it('calls getApp with appCode and appUuid from route params', async () => {
        const { wrapper, store } = mountForFetch();
        store.$patch({ currentApp: mockApp, errorCurrentApp: null });

        const openModalSpy = vi
          .spyOn(wrapper.vm.$refs.directConfigModal, 'openModal')
          .mockImplementation(() => {});

        await wrapper.vm.fetchAppFromRoute();

        expect(store.getApp).toHaveBeenCalledWith({ code: 'wwc', appUuid: 'app-uuid-123' });
        expect(openModalSpy).toHaveBeenCalledWith({ app: mockApp, isConfigured: true });
      });

      it('shows error alert and does not open modal when getApp fails', async () => {
        const { wrapper, store } = mountForFetch();
        store.$patch({ currentApp: null, errorCurrentApp: new Error('Not found') });

        const openModalSpy = vi
          .spyOn(wrapper.vm.$refs.directConfigModal, 'openModal')
          .mockImplementation(() => {});

        await wrapper.vm.fetchAppFromRoute();

        expect(openModalSpy).not.toHaveBeenCalled();
      });

      it('guards against duplicate concurrent calls with isFetchingApp', async () => {
        const { wrapper, store } = mountForFetch();
        store.$patch({ errorCurrentApp: null });

        const firstCall = wrapper.vm.fetchAppFromRoute();
        const secondCall = wrapper.vm.fetchAppFromRoute();
        await Promise.all([firstCall, secondCall]);

        expect(store.getApp).toHaveBeenCalledTimes(1);
      });

      it('does nothing when appCode or appUuid are missing', async () => {
        const { wrapper, store } = mountForFetch({});

        await wrapper.vm.fetchAppFromRoute();

        expect(store.getApp).not.toHaveBeenCalled();
      });
    });

    describe('onDirectConfigModalClose', () => {
      it('calls $router.back() when window.history.state.back is set', () => {
        const router = mockRouter();
        const wrapper = mount(MyApps, {
          global: {
            plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
            mocks: { $router: router, $route: mockRoute() },
          },
        });

        window.history.pushState({ back: '/apps/my' }, '');
        wrapper.vm.onDirectConfigModalClose();
        expect(router.back).toHaveBeenCalled();
        expect(router.replace).not.toHaveBeenCalled();
      });

      it('calls $router.replace("/apps/my") when there is no history.back', () => {
        const router = mockRouter();
        const wrapper = mount(MyApps, {
          global: {
            plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
            mocks: { $router: router, $route: mockRoute() },
          },
        });

        window.history.replaceState({}, '');
        wrapper.vm.onDirectConfigModalClose();
        expect(router.replace).toHaveBeenCalledWith('/apps/my');
        expect(router.back).not.toHaveBeenCalled();
      });
    });

    describe('route watcher', () => {
      it('calls openConfigFromRoute when appUuid is in route and app is in configuredApps', async () => {
        const openSpy = vi
          .spyOn(MyApps.methods, 'openConfigFromRoute')
          .mockImplementation(() => {});

        const pinia = createTestingPinia({
          createSpy: vi.fn,
          initialState: { myApps: { configuredApps: [mockApp] } },
        });

        mount(MyApps, {
          global: {
            plugins: [pinia, i18n],
            mocks: {
              $router: mockRouter(),
              $route: mockRoute({ appUuid: mockApp.uuid, appCode: mockApp.code }),
              $t: (msg) => msg,
            },
          },
        });

        await Promise.resolve();
        expect(openSpy).toHaveBeenCalledWith(mockApp);
        openSpy.mockRestore();
      });

      it('calls fetchAppFromRoute when appUuid is in route but app is not in configuredApps', async () => {
        const fetchSpy = vi
          .spyOn(MyApps.methods, 'fetchAppFromRoute')
          .mockImplementation(() => {});

        mount(MyApps, {
          global: {
            plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
            mocks: {
              $router: mockRouter(),
              $route: mockRoute({ appUuid: 'unknown-uuid', appCode: 'wwc' }),
              $t: (msg) => msg,
            },
          },
        });

        await Promise.resolve();
        expect(fetchSpy).toHaveBeenCalled();
        fetchSpy.mockRestore();
      });
    });
  });

  describe('template', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it('should render the autocomplete component with the correct props', async () => {
      const pinia = createTestingPinia({
        stubActions: false,
        createSpy: vi.fn,
      });
      const wrapper = mount(MyApps, {
        global: {
          plugins: [pinia, i18n],
        },
      });
      await wrapper.vm.$nextTick();
      const autocomplete = wrapper.find('#search');
      expect(wrapper.vm.hasApps).toBe(true);
      expect(autocomplete.exists()).toBe(true);
    });
  });
});
