import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import MyApps from '../../views/MyApps/index.vue';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import { defineStore, setActivePinia, createPinia } from 'pinia';
import { my_apps } from '@/stores/modules/myApps.store';
import { wrap } from '@sentry/vue';

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
            $router: {
              replace: replaceMock,
            },
          },
        },
      });

      wrapper.vm.navigateToDiscovery();
      expect(replaceMock).toHaveBeenCalledWith('/apps/discovery');
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
