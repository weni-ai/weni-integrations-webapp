import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import FacebookSetup from '@/components/config/channels/facebook/Setup.vue';
import axios from 'axios';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import { app_type } from '@/stores/modules/appType/appType.store';

vi.mock('axios');
vi.mock('@/utils/plugins/fb', () => ({
  initFacebookSdk: vi.fn(),
}));

describe('FacebookSetup.vue', () => {
  let wrapper;
  const mockApp = { code: 'fba' };
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = mount(FacebookSetup, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $router: { replace: vi.fn() },
          $t: (e) => e,
        },
      },
      props: { app: mockApp },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  it('renders correctly when stage is login', async () => {
    expect(wrapper.find('.facebook-setup').exists()).toBe(true);
    expect(wrapper.findComponent({ ref: 'facebook-setup-modal' }).exists()).toBe(true);
  });

  it('changes stage to select-page and loads pages on successful login', async () => {
    wrapper.vm.startPageSelectionStage('mockAccessToken');

    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ ref: 'page-selection-modal' }).exists()).toBe(true);

    axios.get.mockResolvedValue({
      data: {
        data: [{ id: '123', name: 'Test Page' }],
      },
    });

    await wrapper.vm.startPageSelectionStage('mockAccessToken');
    expect(wrapper.vm.pageList.length).toBe(1);
    expect(wrapper.vm.pageList[0].name).toBe('Test Page');
  });

  it('calls unnnicCallAlert with error message if API request fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const spy = vi.spyOn(wrapper.vm, 'callModal');
    await wrapper.vm.startPageSelectionStage('mockAccessToken');

    expect(spy).toHaveBeenCalledWith({
      text: 'Failed to fetch Facebook pages data, please try again later.',
      type: 'error',
    });
  });

  it('calls createChannel and handles success correctly', async () => {
    const replaceMock = vi.fn();
    const store = app_type();
    global.FB = {
      getUserID: vi.fn().mockReturnValue('mocked-user-id'),
    };
    store.errorCreateApp = false;
    store.createAppResponse = { uuid: 'mocked-uuid' };
    wrapper = mount(FacebookSetup, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $router: { replace: replaceMock },
        },
      },
      props: { app: mockApp },
    });
    wrapper.vm.pageList = [{ id: '123', name: 'Test Page', access_token: 'mockAccessToken' }];
    wrapper.vm.selectedPage = [{ value: '123' }];
    const spyCreateApp = vi.spyOn(wrapper.vm, 'createApp').mockResolvedValue();
    const spyUpdateAppConfig = vi.spyOn(wrapper.vm, 'updateAppConfig').mockResolvedValue();

    await wrapper.vm.createChannel();
    await wrapper.vm.$nextTick();

    expect(spyCreateApp).toHaveBeenCalledWith({
      code: 'fba',
      payload: {
        project_uuid: null,
      },
    });
    expect(spyUpdateAppConfig).toHaveBeenCalled();
    expect(replaceMock).toHaveBeenCalledWith('/apps/my');
  });

  it('handles error in createChannel correctly', async () => {
    const store = app_type();
    store.errorCreateApp = { error: 'Teste' };
    const alertSpy = vi.spyOn(wrapper.vm, 'callModal');

    const spyCreateApp = vi.spyOn(wrapper.vm, 'createApp').mockResolvedValue();

    wrapper.vm.pageList = [{ id: '123', name: 'Test Page', access_token: 'mockAccessToken' }];
    wrapper.vm.selectedPage = [{ value: '123' }];

    await wrapper.vm.createChannel();
    wrapper.vm.$nextTick();
    expect(alertSpy).toHaveBeenCalledWith({
      text: 'Failed to create application, please try again later',
      type: 'error',
    });

    spyCreateApp.mockRestore();
    alertSpy.mockRestore();
  });
});
