import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import OmieConfig from '@/components/config/external/omie/Config.vue';
import '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

import { singleApp } from '../../../../../../__mocks__/appMock.js';
singleApp.code = 'omie';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  loadingUpdateAppConfig = false,
  errorUpdateAppConfig = false,
} = {}) => {
  const state = {
    appType: {
      loadingUpdateAppConfig,
      errorUpdateAppConfig,
    },
  };

  const actions = {
    updateAppConfig: jest.fn(),
  };

  const store = new Vuex.Store({
    actions,
    state,
  });

  const wrapper = mount(OmieConfig, {
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

describe('components/config/external/omie/Config.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call updateAppConfig with desired fields', async () => {
    const { wrapper, actions } = await mountComponent();

    const nameInput = wrapper.find('.app-config-omie__settings__content__inputs__name');
    const keyInput = wrapper.find('.app-config-omie__settings__content__inputs__key');
    const secretInput = wrapper.find('.app-config-omie__settings__content__inputs__secret');

    nameInput.vm.$emit('input', 'service name');
    keyInput.vm.$emit('input', 'service key');
    secretInput.vm.$emit('input', 'service secret');

    await wrapper.vm.$nextTick();

    expect(actions.updateAppConfig).not.toHaveBeenCalled();
    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

    const saveButton = wrapper.find('.app-config-omie__settings__buttons__save');
    saveButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(actions.updateAppConfig).toHaveBeenCalledWith(expect.any(Object), {
      code: 'omie',
      appUuid: singleApp.uuid,
      payload: {
        config: {
          name: 'service name',
          app_key: 'service key',
          app_secret: 'service secret',
        },
      },
    });
    expect(mockUnnnicCallAlert).toMatchSnapshot();
  });

  it('should call errorModal if update fails', async () => {
    const { wrapper, actions } = await mountComponent({ errorUpdateAppConfig: true });

    const nameInput = wrapper.find('.app-config-omie__settings__content__inputs__name');
    const keyInput = wrapper.find('.app-config-omie__settings__content__inputs__key');
    const secretInput = wrapper.find('.app-config-omie__settings__content__inputs__secret');

    nameInput.vm.$emit('input', 'service name');
    keyInput.vm.$emit('input', 'service key');
    secretInput.vm.$emit('input', 'service secret');

    await wrapper.vm.$nextTick();

    expect(actions.updateAppConfig).not.toHaveBeenCalled();
    expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

    const saveButton = wrapper.find('.app-config-omie__settings__buttons__save');
    saveButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(actions.updateAppConfig).toHaveBeenCalledWith(expect.any(Object), {
      code: 'omie',
      appUuid: singleApp.uuid,
      payload: {
        config: {
          name: 'service name',
          app_key: 'service key',
          app_secret: 'service secret',
        },
      },
    });
    expect(mockUnnnicCallAlert).toMatchSnapshot();
  });

  describe('close configModal', () => {
    it('should emit a close event', async () => {
      const { wrapper } = await mountComponent({ errorUpdateAppConfig: true });

      const closeButton = wrapper.find('.app-config-omie__settings__buttons__cancel');
      closeButton.trigger('click');

      const event = wrapper.emitted('closeModal');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
    });
  });
});
