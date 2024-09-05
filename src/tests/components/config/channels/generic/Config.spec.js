import { mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import GenericConfig from '@/components/config/channels/generic/Config.vue';
import DynamicForm from '@/components/config/DynamicForm.vue';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { generic_store } from '@/stores/modules/appType/channels/generic.store';

describe('GenericConfig.vue', () => {
  let wrapper;
  const mockGenericAppForm = [
    { type: 'text', label: 'Name' },
    { type: 'email', label: 'Email' },
  ];
  const pinia = createTestingPinia({
    initialState: {
      app_type: {
        currentApp: {
          config: {
            channelUuid: '1234',
          },
        },
        loadingCurrentApp: false,
        loadingUpdateAppConfig: false,
      },
      generic_store: {
        genericAppForm: 'dhweuihd',
        errorAppForm: null,
      },
    },
  });

  const genericStore = generic_store();
  genericStore.genericAppForm = [];
  const appMock = {
    code: 'test_code',
    uuid: 'test_uuid',
    config: {
      channelUuid: '1234',
      channel_code: 'SL',
      channel_icon_url: 'https://example.com/icon.png',
      channel_name: 'Test Channel',
      channel_claim_blurb: `<span data-v-1332ec68="" class="app-config-generic__header__description">You can connect a <a href="https://slack.com/app" target="_blank">Slack Bot</a> to your workspace to automate sending and receiving messages.<br><br>To do it, you will need to create a new slack app and configure it.<br><ol><li>You'll need to create a <a href="https://api.slack.com/apps" target="_blank">Slack app</a> if you haven't already, setup a bot to it, add the needed scopes and install app on your slack workspace. If you need help how to do this, read this guide <a href="https://api.slack.com/bot-users" target="_blank">here</a>.</li></ol></span>`,
    },
  };

  const createComponent = (props = {}, options = {}) => {
    wrapper = shallowMount(GenericConfig, {
      props: {
        app: appMock,
        isConfigured: false,
        ...props,
      },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      ...options,
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct channel name and icon', () => {
    const icon = wrapper.find('img');
    const channelName = wrapper.find('.app-config-generic__header__title__name');

    expect(icon.attributes('src')).toBe(appMock.config.channel_icon_url);
    expect(channelName.text()).toBe(appMock.config.channel_name);
  });

  it('renders the app description correctly', () => {
    const description = wrapper.find('.app-config-generic__header__description');
    expect(description.html()).toContain(appMock.config.channel_claim_blurb);
  });

  it('shows callback URL when channel_code matches callbackChannels and isConfigured is true', async () => {
    createComponent({ isConfigured: true });
    await wrapper.setData({ showCallback: true });
    const callbackUrl = wrapper.find('.highlight');
    expect(callbackUrl.exists()).toBe(true);
    expect(callbackUrl.text()).toContain('https://flows.weni.ai/c/sl/1234/receive');
  });

  it('renders DynamicForm component when loadingCurrentApp and loadingFormBuild are false', async () => {
    await wrapper.setData({ loadingCurrentApp: false, loadingFormBuild: false });

    const dynamicForm = wrapper.findComponent(DynamicForm);
    expect(dynamicForm.exists()).toBe(true);
  });

  it('shows skeleton loader when loadingCurrentApp or loadingFormBuild is true', async () => {
    await wrapper.setData({ loadingCurrentApp: true, loadingFormBuild: true });

    const skeletonLoader = wrapper.findComponent({ name: 'unnnic-skeleton-loading' });
    expect(skeletonLoader.exists()).toBe(true);
  });

  // it('calls closeConfig when the cancel button is clicked', async () => {
  //   const closeConfigSpy = vi.spyOn(wrapper.vm, 'closeConfig');
  //   const cancelButton = wrapper.find('.app-config-generic__settings__buttons__cancel');

  //   await cancelButton.trigger('click');
  //   await wrapper.vm.$nextTick();
  //   expect(closeConfigSpy).toHaveBeenCalled();
  // });

  // it('calls saveConfig when the save button is clicked', async () => {
  //   const saveConfigSpy = vi.spyOn(wrapper.vm, 'saveConfig');
  //   const saveButton = wrapper.find('.app-config-generic__settings__buttons__save');

  //   await saveButton.trigger('click');
  //   expect(saveConfigSpy).toHaveBeenCalled();
  // });

  // it('renders save button with loading state when loadingUpdateAppConfig is true', async () => {
  //   createComponent(
  //     {},
  //     {
  //       global: {
  //         plugins: [
  //           createTestingPinia({
  //             initialState: {
  //               app_type: {
  //                 loadingUpdateAppConfig: true,
  //               },
  //             },
  //           }),
  //         ],
  //       },
  //     },
  //   );

  //   const saveButton = wrapper.find('.app-config-generic__settings__buttons__save');
  //   expect(saveButton.attributes('loading')).toBe('true');
  // });
});
