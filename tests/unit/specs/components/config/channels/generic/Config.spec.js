import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import GenericConfig from '@/components/config/channels/generic/Config.vue';
import '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

import { singleApp } from '../../../../../../__mocks__/appMock.js';
singleApp.code = 'generic';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  loadingCurrentApp = false,
  errorCurrentApp = false,
  loadingAppForm = false,
  errorAppForm = false,
  loadingUpdateAppConfig = false,
  errorUpdateAppConfig = false,
  genericAppForm = [],
  channelCode = 'SL',
} = {}) => {
  singleApp.config.channel_code = channelCode;

  const state = {
    appType: {
      currentApp: singleApp,
      loadingCurrentApp,
      errorCurrentApp,
      loadingUpdateAppConfig,
      errorUpdateAppConfig,
    },
  };

  const actions = {
    getApp: jest.fn(),
    updateAppConfig: jest.fn(),
  };

  const genericState = {
    loadingAppForm,
    errorAppForm,
    genericAppForm,
  };

  const genericActions = {
    getAppForm: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      Generic: {
        namespaced: true,
        state: genericState,
        actions: genericActions,
      },
    },
    actions,
    state,
  });

  const wrapper = mount(GenericConfig, {
    localVue,
    store,
    i18n,
    propsData: {
      app: singleApp,
    },
  });

  await wrapper.vm.$nextTick();
  await jest.runAllTimers();

  return { wrapper, actions, state, genericState, genericActions };
};

describe('components/config/channels/generic/Config.vue', () => {
  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('computed', () => {
    describe('appDescription', () => {
      it('should return empty description if channel does not have a description translation', async () => {
        const { wrapper } = await mountComponent({ channelCode: 'TG' });

        expect(wrapper.vm.appDescription).not.toBeDefined();
      });

      it('should return description if channel have a description translation', async () => {
        const { wrapper } = await mountComponent({ channelCode: 'TW' });

        expect(wrapper.vm.appDescription).toEqual(
          'You can add a TwiML REST API as a channel using your TwiML instance.',
        );
      });
    });
  });

  describe('fetchAppData()', () => {
    it('should call errorModal if errorCurrentApp is defined', async () => {
      const { wrapper, state } = await mountComponent();
      await jest.clearAllMocks();

      const spy = spyOn(wrapper.vm, 'callModal');
      expect(spy).not.toHaveBeenCalled();

      state.appType.errorCurrentApp = true;

      await wrapper.vm.fetchAppData();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        type: 'Error',
        text: 'An error occured while trying to fetch application data, please try again later.',
      });
    });

    it('should call errorModal if errorAppForm is defined', async () => {
      const { wrapper, genericState } = await mountComponent();
      await jest.clearAllMocks();

      const spy = spyOn(wrapper.vm, 'callModal');
      expect(spy).not.toHaveBeenCalled();

      genericState.errorAppForm = true;

      await wrapper.vm.fetchAppData();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        type: 'Error',
        text: 'An error occured while trying to fetch application data, please try again later.',
      });
    });

    it('should set appFormInputs correctly', async () => {
      const { wrapper, genericState } = await mountComponent();

      genericState.genericAppForm = [
        {
          type: 'unknown',
          name: 'unknown input',
          label: 'unknown label',
          placeholder: 'unknown help text',
          value: null,
        },
        {
          type: 'text',
          name: 'text input',
          label: 'text label',
          help_text: 'text help text',
        },
        {
          type: 'text',
          name: 'text input without label',
          label: null,
          help_text: 'text help text without label',
        },
        {
          type: 'text',
          name: 'text input without label and help_text',
          label: null,
          help_text: null,
        },
        {
          type: 'number',
          name: 'number input',
          label: 'number label',
          help_text: 'number help text',
        },
        {
          type: 'url',
          name: 'url input',
          label: 'url label',
          help_text: 'url help text',
        },
        {
          type: 'checkbox',
          name: 'checkbox input',
          label: 'checkbox label',
          help_text: 'checkbox help text',
        },
        {
          type: 'select',
          name: 'choice input',
          label: 'choice label',
          help_text: 'choice help text',
          choices: [
            ['C1', 'choice 1'],
            ['C2', 'choide 2'],
          ],
        },
      ];

      expect(wrapper.vm.appFormInputs).toEqual([]);
      await wrapper.vm.fetchAppData();
      expect(wrapper.vm.appFormInputs).toEqual([
        {
          type: 'input',
          name: 'text input',
          label: 'text label',
          message: 'text help text',
          value: null,
        },
        {
          type: 'input',
          name: 'text input without label',
          label: 'text help text without label',
          message: null,
          value: null,
        },
        {
          type: 'input',
          name: 'text input without label and help_text',
          label: 'text input without label and help_text',
          message: null,
          value: null,
        },
        {
          type: 'input',
          name: 'number input',
          label: 'number label',
          message: 'number help text',
          value: null,
        },
        {
          type: 'input',
          name: 'url input',
          label: 'url label',
          message: 'url help text',
          value: null,
        },
        {
          type: 'checkbox',
          name: 'checkbox input',
          label: 'checkbox label',
          message: 'checkbox help text',
          value: null,
        },
        {
          type: 'select',
          name: 'choice input',
          label: 'choice label',
          message: 'choice help text',
          options: [
            { value: 'C1', text: 'choice 1' },
            { value: 'C2', text: 'choide 2' },
          ],
          value: null,
        },
      ]);
    });
  });

  describe('saveConfig()', () => {
    it('should call updateAppConfig with filled payload data based on appFormInputs', async () => {
      const { wrapper, actions } = await mountComponent();

      await wrapper.setData({
        appFormInputs: [
          { name: 'name', value: 'foo' },
          { name: 'category', value: 'category 1' },
        ],
      });

      expect(actions.updateAppConfig).not.toHaveBeenCalled();

      await wrapper.vm.saveConfig();

      expect(actions.updateAppConfig).toHaveBeenCalled();
      expect(actions.updateAppConfig).toHaveBeenCalledWith(expect.any(Object), {
        code: 'generic',
        appUuid: '123',
        payload: {
          config: {
            name: 'foo',
            category: 'category 1',
          },
          channel_code: 'SL',
        },
      });
    });

    it('should call callModal with error if errorUpdateAppConfig is set', async () => {
      const { wrapper, state } = await mountComponent();

      const spy = spyOn(wrapper.vm, 'callModal');
      expect(spy).not.toHaveBeenCalled();

      state.appType.errorUpdateAppConfig = true;

      await wrapper.vm.saveConfig();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        type: 'Error',
        text: 'Unable to complete this action, please try again',
      });
    });

    it('should call callModal without error if errorUpdateAppConfig is NOT set', async () => {
      const { wrapper, state } = await mountComponent();

      const spy = spyOn(wrapper.vm, 'callModal');
      expect(spy).not.toHaveBeenCalled();

      state.appType.errorUpdateAppConfig = false;

      await wrapper.vm.saveConfig();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        type: 'Success',
        text: 'Successfully updated application',
      });
    });
  });

  describe('closeConfig()', () => {
    it('should emit closeModal', async () => {
      const { wrapper } = await mountComponent();

      expect(wrapper.emitted('closeModal')).toBeFalsy();
      wrapper.vm.closeConfig();
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });
  });

  describe('updateInputs()', () => {
    it('should should set appFormInputs new values', async () => {
      const { wrapper } = await mountComponent();

      await wrapper.setData({
        appFormInputs: [
          { name: 'name', value: 'foo' },
          { name: 'category', value: 'category 1' },
        ],
      });

      wrapper.vm.updateInputs({ index: 0, value: 'bar' });
      wrapper.vm.updateInputs({ index: 1, value: 'category 2' });

      expect(wrapper.vm.appFormInputs).toEqual([
        { name: 'name', value: 'bar' },
        { name: 'category', value: 'category 2' },
      ]);
    });
  });

  describe('callModal', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call unnnicCallAlert with Success state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callModal({ text: 'success', type: 'Success' });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'success',
          title: 'Success',
          icon: 'check-circle-1-1',
          scheme: 'feedback-green',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });

    it('should call unnnicCallAlert with Error state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callModal({ text: 'error', type: 'Error' });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'error',
          title: 'Error',
          icon: 'alert-circle-1',
          scheme: 'feedback-red',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });
  });
});
