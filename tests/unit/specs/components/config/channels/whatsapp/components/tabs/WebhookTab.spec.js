import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import WebhookTab from '@/components/config/channels/whatsapp/components/tabs/WebhookTab.vue';
import '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

import { singleApp } from '../../../../../../../../__mocks__/appMock';
singleApp.code = 'wpp-cloud';
singleApp.config.webhook = {};
singleApp.config.webhook.headers = {
  Authorization: 'Token 123',
};

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  loadingUpdateWebhookInfo = false,
  errorUpdateWebhookInfo = false,
} = {}) => {
  const state = {
    loadingUpdateWebhookInfo,
    errorUpdateWebhookInfo,
  };

  const actions = {
    updateWppWebhookInfo: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        actions,
        state,
      },
    },
  });

  const wrapper = mount(WebhookTab, {
    localVue,
    store,
    i18n,
    propsData: {
      app: singleApp,
    },
  });

  await wrapper.vm.$nextTick();
  await jest.runAllTimers();

  return { wrapper, actions, state };
};

describe('components/config/channels/whatsapp/components/tabs/WebhookTab.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call updateAppConfig with desired fields', async () => {
    const { wrapper, actions } = await mountComponent();

    const methodSelect = wrapper.find('.webhook-info__content__method');
    const urlInput = wrapper.find('.webhook-info__content__url');
    const headerKeyInput = wrapper.findAll('.webhook-info__content__headers-element--key').at(1);
    const headerValueInput = wrapper
      .findAll('.webhook-info__content__headers-element--value')
      .at(1);

    methodSelect.vm.$emit('input', 'POST');
    urlInput.vm.$emit('input', 'https://url.com');
    headerKeyInput.vm.$emit('input', 'Content-Type');
    headerValueInput.vm.$emit('input', 'application/json');

    await wrapper.vm.$nextTick();

    expect(actions.updateWppWebhookInfo).not.toHaveBeenCalled();
    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

    const saveButton = wrapper.find('.webhook-info__buttons__save');
    saveButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(actions.updateWppWebhookInfo).toHaveBeenCalledWith(expect.any(Object), {
      code: 'wpp-cloud',
      appUuid: singleApp.uuid,
      payload: {
        config: {
          webhook: {
            url: 'https://url.com',
            method: 'POST',
            headers: {
              Authorization: 'Token 123',
              'Content-Type': 'application/json',
            },
          },
        },
      },
    });
    expect(mockUnnnicCallAlert).toMatchSnapshot();
  });

  it('should call errorModal if update fails', async () => {
    const { wrapper, actions } = await mountComponent({ errorUpdateWebhookInfo: true });

    const methodSelect = wrapper.find('.webhook-info__content__method');
    const urlInput = wrapper.find('.webhook-info__content__url');
    const headerKeyInput = wrapper.findAll('.webhook-info__content__headers-element--key').at(1);
    const headerValueInput = wrapper
      .findAll('.webhook-info__content__headers-element--value')
      .at(1);

    methodSelect.vm.$emit('input', 'POST');
    urlInput.vm.$emit('input', 'https://url.com');
    headerKeyInput.vm.$emit('input', 'Content-Type');
    headerValueInput.vm.$emit('input', 'application/json');

    await wrapper.vm.$nextTick();

    expect(actions.updateWppWebhookInfo).not.toHaveBeenCalled();
    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

    const saveButton = wrapper.find('.webhook-info__buttons__save');
    saveButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(actions.updateWppWebhookInfo).toHaveBeenCalledWith(expect.any(Object), {
      code: 'wpp-cloud',
      appUuid: singleApp.uuid,
      payload: {
        config: {
          webhook: {
            url: 'https://url.com',
            method: 'POST',
            headers: {
              Authorization: 'Token 123',
              'Content-Type': 'application/json',
            },
          },
        },
      },
    });
    expect(mockUnnnicCallAlert).toMatchSnapshot();
  });

  it('should not call errorModal if url is empty', async () => {
    const { wrapper, actions } = await mountComponent();

    const urlInput = wrapper.find('.webhook-info__content__url');

    urlInput.vm.$emit('input', '');
    await wrapper.vm.$nextTick();

    expect(actions.updateWppWebhookInfo).not.toHaveBeenCalled();
    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

    const saveButton = wrapper.find('.webhook-info__buttons__save');

    saveButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(actions.updateWppWebhookInfo).toHaveBeenCalled();
    expect(mockUnnnicCallAlert).toMatchSnapshot();
  });

  it('should call errorModal if url is invalid', async () => {
    const { wrapper, actions } = await mountComponent({ errorUpdateWebhookInfo: true });

    const urlInput = wrapper.find('.webhook-info__content__url');

    urlInput.vm.$emit('input', 'https://invalid-url');
    await wrapper.vm.$nextTick();

    expect(actions.updateWppWebhookInfo).not.toHaveBeenCalled();
    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

    const saveButton = wrapper.find('.webhook-info__buttons__save');

    saveButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(actions.updateWppWebhookInfo).not.toHaveBeenCalled();
    expect(mockUnnnicCallAlert).toMatchSnapshot();
  });

  it('should ensure that only one empty header exists at a time', async () => {
    const { wrapper } = await mountComponent({ errorUpdateWebhookInfo: true });

    // let headerKeyInput = wrapper.findAll('.webhook-info__content__headers-element--key').at(0);
    // let headerValueInput = wrapper.findAll('.webhook-info__content__headers-element--value').at(0);

    // headerKeyInput.vm.$emit('input', 'Authorization');
    // headerValueInput.vm.$emit('input', 'Token 123');

    // await wrapper.vm.$nextTick();
    expect(wrapper.vm.headers.length).toEqual(2);

    let headerKeyInput = wrapper.findAll('.webhook-info__content__headers-element--key').at(1);
    let headerValueInput = wrapper.findAll('.webhook-info__content__headers-element--value').at(1);

    headerKeyInput.vm.$emit('input', 'Content-Type');
    headerValueInput.vm.$emit('input', 'application/json');

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.headers.length).toEqual(3);

    headerKeyInput = wrapper.findAll('.webhook-info__content__headers-element--key').at(0);
    headerValueInput = wrapper.findAll('.webhook-info__content__headers-element--value').at(0);

    headerKeyInput.vm.$emit('input', '');
    headerValueInput.vm.$emit('input', '');

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.headers.length).toEqual(2);

    expect(wrapper.vm.headers).toMatchSnapshot();
  });

  // describe('close configModal', () => {
  //   it('should emit a close event', async () => {
  //     const { wrapper } = await mountComponent({ errorUpdateAppConfig: true });

  //     const closeButton = wrapper.find('.app-config-omie__settings__buttons__cancel');
  //     closeButton.trigger('click');

  //     const event = wrapper.emitted('closeModal');

  //     expect(event).toBeTruthy();
  //     expect(event.length).toBe(1);
  //   });
  // });
});
