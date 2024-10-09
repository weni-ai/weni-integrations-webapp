import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppDetails from '@/views/AppDetails/index.vue';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { app_type } from '@/stores/modules/appType/appType.store';

describe('AppDetails.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    stubActions: false,
  });

  beforeEach(() => {
    wrapper = mount(AppDetails, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $route: {
            params: {
              appCode: '1234',
            },
          },
        },
      },
    });
  });

  it('renders skeletonLoading when loadingCurrentAppType is true', async () => {
    const store = app_type();
    store.loadingCurrentAppType = true;
    await wrapper.vm.$nextTick();
    const skeleton = wrapper.findComponent({ ref: 'skeleton' });
    expect(skeleton.exists()).toBe(true);
  });

  it('renders main components when loadingCurrentAppType is false', async () => {
    const store = app_type();
    store.currentAppType = {
      banners: [],
      assets: [],
      metrics: '1K',
    };
    store.loadingCurrentAppType = false;
    await wrapper.vm.$nextTick();

    const navigator = wrapper.findComponent({ ref: 'navigator' });
    expect(navigator.exists()).toBe(true);

    const appImagesBanner = wrapper.findComponent({ ref: 'appImagesBanner' });
    expect(appImagesBanner.exists()).toBe(true);

    const appDetailsHeader = wrapper.findComponent({ ref: 'appDetailsHeader' });
    expect(appDetailsHeader.exists()).toBe(true);

    const appDetailsAbout = wrapper.findComponent({ ref: 'appDetailsAbout' });
    expect(appDetailsAbout.exists()).toBe(true);

    const appDetailsComments = wrapper.findComponent({ ref: 'appDetailsComments' });
    expect(appDetailsComments.exists()).toBe(true);
  });

  it('passes correct props to UnnnicBanner', async () => {
    const store = app_type();
    store.currentAppType = {
      code: '1234',
      banners: [],
      assets: [],
      metrics: 1000,
      integrations_count: 2000,
      rating: {
        average: 4.5,
      },
    };
    store.loadingCurrentAppType = false;
    await wrapper.vm.$nextTick();
    const banner = wrapper.findComponent({ ref: 'banner' });
    expect(banner.exists()).toBe(true);
    expect(banner.props('firstDescription')).toBe('1K');
    expect(banner.props('secondDescription')).toBe('2K');
    expect(banner.props('thirdDescription')).toBe('4.5');
    expect(banner.props('rating')).toBe(4.5);
  });

  it('calls postRating and reloadSection when handleRating is triggered', async () => {
    const store = app_type();
    store.currentAppType = {
      code: '1234',
      banners: [],
      assets: [],
      metrics: 1000,
      integrations_count: 2000,
      rating: {
        average: 4.5,
      },
    };
    const spy = vi.spyOn(wrapper.vm, 'postRating').mockResolvedValue();
    await wrapper.vm.handleRating(5);
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalledWith({
      code: '1234',
      payload: { rate: 5 },
    });
  });
});
