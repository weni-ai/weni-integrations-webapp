import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IntegrateButton from '@/components/IntegrateButton/index.vue';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

vi.mock('@/stores/modules/appType/appType.store', () => ({
  app_type: () => ({
    createApp: vi.fn(),
    createAppResponse: { config: {} },
    errorCreateApp: null,
  }),
}));

vi.mock('@/stores/modules/auth.store', () => ({
  auth_store: () => ({
    project: 'test-project',
  }),
}));

describe('IntegrateButton.vue', () => {
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });

  let wrapper;

  beforeEach(() => {
    wrapper = mount(IntegrateButton, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      props: {
        app: { code: 'wpp-cloud' },
      },
      methods: {
        unnnicCallAlert: vi.fn(),
      },
      mocks: {
        $t: (e) => e,
      },
    });
  });

  it('renders LoadingButton component', () => {
    expect(wrapper.findComponent({ name: 'LoadingButton' }).exists()).toBe(true);
  });

  it('opens the config pop-up when app is in hasFBLoginList', async () => {
    const configPopUp = wrapper.vm.$refs.configPopUp;
    const openPopUpSpy = vi.spyOn(configPopUp, 'openPopUp');

    await wrapper.vm.addApp({ code: 'wpp-cloud', config_design: 'popup' });
    expect(openPopUpSpy).toHaveBeenCalled();
  });

  it('calls createApp and handles errors correctly', async () => {
    const createAppSpy = vi.spyOn(wrapper.vm, 'createApp').mockResolvedValue({});

    await wrapper.vm.addApp({ code: 'generic', config_design: 'popup' });
    expect(createAppSpy).toHaveBeenCalledWith({
      code: 'generic',
      payload: { project_uuid: 'test-project' },
    });
    expect(wrapper.vm.loadingCreateApp).toBe(false);
  });

  it('calls callErrorModal when errorCreateApp is present', async () => {
    const errorModalSpy = vi.spyOn(wrapper.vm, 'callErrorModal');
    Object.defineProperty(wrapper.vm, 'errorCreateApp', {
      value: 'Some error',
    });

    await wrapper.vm.addApp({ code: 'generic', config_design: 'popup' });

    expect(errorModalSpy).toHaveBeenCalled();

    expect(errorModalSpy).toHaveBeenCalledWith({
      text: 'Unable to complete this action, please try again',
    });
  });

  it('emits "update" event after successful app addition', async () => {
    await wrapper.vm.addApp({ code: 'generic', config_design: 'popup' });
    const emittedEvents = wrapper.emitted('update');
    expect(emittedEvents).toBeTruthy();
    expect(emittedEvents.length).toBe(1);
  });

  it('calls openWACloudPopUp method', () => {
    const openWACloudPopUpSpy = vi.spyOn(wrapper.vm, 'openWACloudPopUp');
    wrapper.vm.openWACloudPopUp({ code: 'wpp-cloud' }, 'some-token');
    expect(openWACloudPopUpSpy).toHaveBeenCalledWith({ code: 'wpp-cloud' }, 'some-token');
  });
});
