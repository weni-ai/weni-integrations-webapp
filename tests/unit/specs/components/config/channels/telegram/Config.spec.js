import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { singleApp } from '../../../../../../__mocks__/appMock.js';
import i18n from '@/utils/plugins/i18n';

import telegramConfig from '@/components/config/channels/telegram/Config.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('TelegramConfig.vue', () => {
  let wrapper;

  let actions;
  let store;

  beforeEach(() => {
    actions = {
      updateAppConfig: jest.fn(),
      getApp: jest.fn(() => {
        return { data: singleApp };
      }),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(telegramConfig, {
      localVue,
      i18n,
      store,
      propsData: {
        app: singleApp,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('saveConfig()', () => {
    it('should call updateAppConfig', async () => {
      const spy = spyOn(wrapper.vm, 'updateAppConfig');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call success alert on success', async () => {
      actions.updateAppConfig.mockImplementation(() => {
        return true;
      });

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            title: 'Success',
            text: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });

    it('should call error alert on error', async () => {
      actions.updateAppConfig.mockImplementation(() => {
        throw new Error('error fetching');
      });

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            title: 'Error',
            text: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });
  });

  describe('closeConfig()', () => {
    it('should emit closeModal', () => {
      expect(wrapper.emitted('closeModal')).toBeFalsy();
      wrapper.vm.closeConfig();
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });
  });
});
