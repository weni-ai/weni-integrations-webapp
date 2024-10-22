import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Carousel from '@/components/Carousel/index.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import { app_type } from '@/stores/modules/appType/appType.store';

vi.mock('@/stores/modules/appType/appType.store', () => {
  const fetchFeatured = vi.fn();
  return {
    app_type: () => ({
      fetchFeatured,
      featuredApps: [],
      loadingFeaturedApps: true,
    }),
  };
});

describe('Carousel.vue', () => {
  let wrapper;
  const pushMock = vi.fn();
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });

  beforeEach(async () => {
    wrapper = mount(Carousel, {
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

  it('renders skeleton loading when loadingFeaturedApps is true', async () => {
    app_type.loadingFeaturedApps = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ ref: 'skeleton' }).exists()).toBe(true);
  });

  it('renders vueper-slides when loadingFeaturedApps is false', async () => {
    Object.defineProperty(wrapper.vm, 'loadingFeaturedApps', { value: false });
    Object.defineProperty(wrapper.vm, 'featuredApps', {
      value: [{ name: 'App1' }, { name: 'App2' }],
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loadingFeaturedApps).toBe(false);
  });

  it('navigates to the app details page on openAppDetails', () => {
    wrapper.vm.openAppDetails('appCode');
    expect(pushMock).toHaveBeenCalledWith('/appCode/details');
  });

  it('returns the correct image URL from appImageBanner', () => {
    const assets = [{ type: 'IB', url: 'image.jpg' }];
    expect(wrapper.vm.appImageBanner(assets)).toBe('image.jpg');
  });

  it('calculates hasAutoPlay correctly', async () => {
    Object.defineProperty(wrapper.vm, 'featuredApps', {
      value: [{ name: 'App1' }, { name: 'App2' }],
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.hasAutoPlay).toBe(true);
  });
});
