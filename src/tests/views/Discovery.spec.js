// __tests__/HelloWorld.spec.js
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Discovery from '../../views/Discovery/index.vue';
import { describe, expect, it, vi } from 'vitest';
import i18n from '@/utils/plugins/i18n';

describe('Discovery', () => {
  it('matches snapshot', () => {
    const wrapper = mount(Discovery, {
      global: {
        plugins: [createTestingPinia(), i18n],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('mounted', () => {
    it('should call fetchChannels', async () => {
      const spy = vi.spyOn(Discovery.methods, 'fetchChannels');
      const wrapper = mount(Discovery, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
        },
      });
      await wrapper.vm.$nextTick();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call fetchExternalServices', async () => {
      const spy = vi.spyOn(Discovery.methods, 'fetchExternalServices');
      const wrapper = mount(Discovery, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
        },
      });
      await wrapper.vm.$nextTick();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call fetchEcommerceApps', async () => {
      const spy = vi.spyOn(Discovery.methods, 'fetchEcommerceApps');
      const wrapper = mount(Discovery, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
        },
      });
      await wrapper.vm.$nextTick();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call fetchFeatured', async () => {
      const spy = vi.spyOn(Discovery.methods, 'fetchFeatured');
      const wrapper = mount(Discovery, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
        },
      });
      await wrapper.vm.$nextTick();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call callManuallyCreateApp if createAppCode isn`t null', async () => {
      const spy = vi.spyOn(Discovery.methods, 'callManuallyCreateApp');
      const wrapper = mount(Discovery, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
          mocks: {
            $route: {
              query: { create_app: 'tg' },
            },
          },
        },
      });
      await wrapper.vm.$nextTick();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
