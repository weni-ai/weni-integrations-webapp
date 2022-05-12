import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';
import { toBase64 as mockToBase64 } from '@/utils/files';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

jest.mock('@/utils/files', () => ({
  ...jest.requireActual('@/utils/files'),
  toBase64: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import wwcSimulator from '@/components/config/channels/WWC/Simulator.vue';
import { singleApp } from '../../../../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('wwc/Config.vue', () => {
  let wrapper;
  let handleColorChangeSpy;
  let toggleSimulatorSpy;

  let actions;
  let store;

  beforeEach(() => {
    fetch.resetMocks();

    handleColorChangeSpy = jest.spyOn(wwcConfig.methods, 'handleColorChange');
    toggleSimulatorSpy = jest.spyOn(wwcConfig.methods, 'toggleSimulator');

    actions = {
      updateAppConfig: jest.fn(),
      getApp: jest.fn(() => {
        return { data: singleApp };
      }),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(wwcConfig, {
      localVue,
      store,
      i18n,
      propsData: {
        app: singleApp,
      },
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        wwcSimulator,
        UnnnicTab: true,
        UnnnicInput: true,
        UnnnicSwitch: true,
        UnnnicSlider: true,
        UnnnicButton: true,
        UnnnicToolTip: true,
        UnnnicIconSvg: true,
        UnnnicUploadArea: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set simulator color', () => {
    const color = '#FF00FF';
    expect(wrapper.vm.mainColor).not.toEqual(color);
    wrapper.vm.handleColorChange(color);
    expect(wrapper.vm.mainColor).toEqual(color);
  });

  it('should call handleColorChange', async () => {
    const colorPickerComponent = wrapper.findComponent({ ref: 'color-picker' });

    expect(handleColorChangeSpy).not.toHaveBeenCalled();
    await colorPickerComponent.vm.$emit('colorChange', '#FF00FF');
    expect(handleColorChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('should toggle simulator', async () => {
    const simulatorSwitchComponent = wrapper.findComponent({ ref: 'simulator-switch' });
    const simulatorComponent = wrapper.findComponent({ ref: 'simulator' });
    const simulatorToggleSpy = spyOn(simulatorComponent.vm, 'toggleChat');

    expect(toggleSimulatorSpy).not.toHaveBeenCalled();
    expect(simulatorToggleSpy).not.toHaveBeenCalled();

    await simulatorSwitchComponent.trigger('click');

    expect(toggleSimulatorSpy).toHaveBeenCalledTimes(1);
    expect(simulatorToggleSpy).toHaveBeenCalledTimes(1);
  });

  describe('setNewAvatar()', () => {
    it('should set avatarFile and simulatorAvatar as null if undefined parameter', () => {
      const avatar = undefined;
      wrapper.setData({ avatarFile: '123', simulatorAvatar: '456' });

      expect(wrapper.vm.avatarFile).not.toEqual(null);
      expect(wrapper.vm.simulatorAvatar).not.toEqual(null);
      wrapper.vm.setNewAvatar(avatar);
      expect(wrapper.vm.avatarFile).toEqual(null);
      expect(wrapper.vm.simulatorAvatar).toEqual(null);
    });
  });

  it('should return config tabs', () => {
    expect(wrapper.vm.configTabs).toEqual(['settings', 'appearance', 'script']);
  });

  it('should return valid subtitle if enableSubtitle is true', async () => {
    await wrapper.setData({ enableSubtitle: true, subtitle: 'text' });
    expect(wrapper.vm.chatSubtitle).toEqual('text');
  });

  it('should return blank space subtitle if enableSubtitle is false', async () => {
    await wrapper.setData({ enableSubtitle: false });
    expect(wrapper.vm.chatSubtitle).toEqual(' ');
  });

  describe('computed: chatInitPayload', () => {
    it('should return valid initPayload if enableInitPayload is true', async () => {
      await wrapper.setData({ enableInitPayload: true, initPayload: 'text' });
      expect(wrapper.vm.chatInitPayload).toEqual('text');
    });

    it('should return null if enableInitPayload is false', async () => {
      await wrapper.setData({ enableInitPayload: false });
      expect(wrapper.vm.chatInitPayload).toBeNull();
    });
  });

  describe('computed: chatTooltipMessage', () => {
    it('should return valid tooltipMessage if enableTooltipMessage is true', async () => {
      await wrapper.setData({ enableTooltipMessage: true, tooltipMessage: 'text' });
      expect(wrapper.vm.chatTooltipMessage).toEqual('text');
    });

    it('should return null if enableTooltipMessage is false', async () => {
      await wrapper.setData({ enableTooltipMessage: false });
      expect(wrapper.vm.chatTooltipMessage).toBeNull();
    });
  });

  it('should return valid subtitle if enableSubtitle is true', async () => {
    await wrapper.setData({ enableSubtitle: true, subtitle: 'text' });
    expect(wrapper.vm.chatSubtitle).toEqual('text');
  });

  describe('scriptCode()', () => {
    it('should return empty string if config script is not present', async () => {
      await wrapper.setProps({ app: { ...singleApp, config: { script: undefined } } });
      expect(wrapper.vm.scriptCode).toEqual('');
    });

    it('should return not an empy string if config script is present', async () => {
      await wrapper.setProps({ app: { ...singleApp, config: { script: 'url' } } });
      expect(wrapper.vm.scriptCode).not.toEqual('');
    });
  });

  it('should have default app defined', () => {
    const fn = jest.fn();
    wrapper.vm.app;
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('should set new customCss', () => {
    const css = 'css';
    expect(wrapper.vm.customCss).not.toEqual(css);
    wrapper.vm.setNewCss(css);
    expect(wrapper.vm.customCss).toEqual(css);
  });

  it('should set new slider value', () => {
    const value = '3';
    expect(wrapper.vm.timeBetweenMessages).toEqual(1);
    wrapper.vm.handleSliderChange(value);
    expect(wrapper.vm.timeBetweenMessages).toEqual(parseInt(value));
  });

  describe('saveConfig()', () => {
    it('should not call updateAppConfig if not valid', async () => {
      spyOn(wrapper.vm, 'validConfig').and.returnValue(false);
      expect(actions.updateAppConfig).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(actions.updateAppConfig).not.toHaveBeenCalled();
    });

    it('should call updateAppConfig on save if config is valid', async () => {
      spyOn(wrapper.vm, 'validConfig').and.returnValue(true);
      expect(actions.updateAppConfig).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(actions.updateAppConfig).toHaveBeenCalledTimes(1);
    });

    it('should set new app.config on save', async () => {
      spyOn(wrapper.vm, 'validConfig').and.returnValue(true);
      await wrapper.setProps({ app: { ...singleApp, config: {} } });
      expect(wrapper.vm.app).not.toMatchObject(singleApp);
      await wrapper.vm.saveConfig();
      expect(wrapper.vm.app).toMatchObject(singleApp);
    });

    it('should call getApp on save', async () => {
      spyOn(wrapper.vm, 'validConfig').and.returnValue(true);
      expect(actions.getApp).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(actions.getApp).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      spyOn(wrapper.vm, 'validConfig').and.returnValue(true);
      actions.updateAppConfig.mockImplementation(() => {
        throw new Error('error fetching');
      });
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });

  it('should call toggleChat on unreadCount watch if chat is open', async () => {
    const spy = spyOn(wrapper.vm.$refs.simulator, 'toggleChat');
    expect(spy).not.toHaveBeenCalled();
    expect(wrapper.vm.$refs.simulator.isOpen).toBeTruthy();
    await wrapper.setData({ displayUnreadCount: true });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call toggleChat on unreadCount watch if chat is open', async () => {
    const spy = spyOn(wrapper.vm.$refs.simulator, 'toggleChat');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.$refs.simulator.isOpen = false;
    expect(wrapper.vm.$refs.simulator.isOpen).toBeFalsy();
    await wrapper.setData({ displayUnreadCount: true });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should clear avatar related variables', () => {
    wrapper.setData({ simulatorAvatar: 'text', avatarFile: { info: {}, data: 'text' } });
    expect(wrapper.vm.simulatorAvatar).not.toBeNull();
    expect(wrapper.vm.avatarFile).not.toStrictEqual({});

    wrapper.vm.clearAvatars();

    expect(wrapper.vm.simulatorAvatar).toBeNull();
    expect(wrapper.vm.avatarFile).toStrictEqual({});
  });

  it('should clear custom css related variables', () => {
    wrapper.setData({ customCss: 'text', customCssFile: { info: {}, data: 'text' } });
    expect(wrapper.vm.customCss).not.toBeNull();
    expect(wrapper.vm.customCssFile).not.toStrictEqual({});

    wrapper.vm.clearCssFile();

    expect(wrapper.vm.customCss).toBeNull();
    expect(wrapper.vm.customCssFile).toStrictEqual({});
  });

  describe('imageForUpload', () => {
    it('should call toBase64 with avatarFile', async () => {
      const file = { data: '123' };
      wrapper.setData({ avatarFile: file });
      expect(mockToBase64).not.toHaveBeenCalled();

      await wrapper.vm.imageForUpload(file);

      expect(mockToBase64).toHaveBeenCalledTimes(1);
      expect(mockToBase64).toHaveBeenCalledWith(wrapper.vm.avatarFile);
    });
  });

  describe('closeConfig()', () => {
    it('should call parent closeModal()', () => {
      expect(wrapper.emitted('closeModal')).toBeFalsy();
      wrapper.vm.closeConfig();
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });
  });

  describe('validConfig()', () => {
    it('should return true if no errors are found', async () => {
      await wrapper.setData({ initPayload: 'payload' });
      await wrapper.setData({ title: 'title' });
      const isValid = wrapper.vm.validConfig();
      expect(isValid).toBeTruthy();
    });

    it('should return false if an error is found', async () => {
      await wrapper.setData({ title: '' });
      const isValid = wrapper.vm.validConfig();
      expect(isValid).toBeFalsy();
    });
  });

  describe('getFileType()', () => {
    it('should return file type from base64 string', () => {
      const b64String = 'base64:image/png;Ak1bBTG6jBGQ';
      const type = wrapper.vm.getFileType(b64String);
      expect(type).toEqual('image/png');
    });
  });

  describe('setNewAvatar()', () => {
    it('should call stopAvatarUploadProgress()', async () => {
      const b64String = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP';
      const spy = spyOn(wrapper.vm, 'stopAvatarUploadProgress');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.setNewAvatar(b64String, 'file.png');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('stopAvatarUploadProgress()', () => {
    it('should set uploadState to false and progress to 0', async () => {
      await wrapper.setData({ avatarUploadState: true, avatarUploadProgress: 100 });
      expect(wrapper.vm.avatarUploadState).toBeTruthy();
      expect(wrapper.vm.avatarUploadProgress).not.toEqual(0);
      wrapper.vm.stopAvatarUploadProgress();
      expect(wrapper.vm.avatarUploadState).toBeFalsy();
      expect(wrapper.vm.avatarUploadProgress).toEqual(0);
    });
  });

  describe('updateAvatarUploadProgress()', () => {
    it('should return progress percentage', () => {
      const event = {
        loaded: 2,
        total: 4,
      };
      expect(wrapper.vm.avatarUploadProgress).not.toEqual(50);
      wrapper.vm.updateAvatarUploadProgress(event);
      expect(wrapper.vm.avatarUploadProgress).toEqual(50);
    });
  });

  describe('startAvatarUploadProgress()', () => {
    it('should set uploadState to true and progress to 0', async () => {
      await wrapper.setData({ avatarUploadState: false, avatarUploadProgress: 100 });
      expect(wrapper.vm.avatarUploadState).toBeFalsy();
      expect(wrapper.vm.avatarUploadProgress).not.toEqual(0);
      wrapper.vm.startAvatarUploadProgress();
      expect(wrapper.vm.avatarUploadState).toBeTruthy();
      expect(wrapper.vm.avatarUploadProgress).toEqual(0);
    });
  });

  describe('stopCssUploadProgress()', () => {
    it('should set uploadState to false and progress to 0', async () => {
      await wrapper.setData({ cssUploadState: true, cssUploadProgress: 100 });
      expect(wrapper.vm.cssUploadState).toBeTruthy();
      expect(wrapper.vm.cssUploadProgress).not.toEqual(0);
      wrapper.vm.stopCssUploadProgress();
      expect(wrapper.vm.cssUploadState).toBeFalsy();
      expect(wrapper.vm.cssUploadProgress).toEqual(0);
    });
  });

  describe('updateCssUploadProgress()', () => {
    it('should return progress percentage', () => {
      const event = {
        loaded: 2,
        total: 4,
      };
      expect(wrapper.vm.cssUploadProgress).not.toEqual(50);
      wrapper.vm.updateCssUploadProgress(event);
      expect(wrapper.vm.cssUploadProgress).toEqual(50);
    });
  });

  describe('startCssUploadProgress()', () => {
    it('should set uploadState to true and progress to 0', async () => {
      await wrapper.setData({ cssUploadState: false, cssUploadProgress: 100 });
      expect(wrapper.vm.cssUploadState).toBeFalsy();
      expect(wrapper.vm.cssUploadProgress).not.toEqual(0);
      wrapper.vm.startCssUploadProgress();
      expect(wrapper.vm.cssUploadState).toBeTruthy();
      expect(wrapper.vm.cssUploadProgress).toEqual(0);
    });
  });

  describe('avatarFiles computed setter', () => {
    it('should call handleNewAvatar', () => {
      const spy = spyOn(wrapper.vm, 'handleNewAvatar');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.avatarFiles = [];
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('customCssFiles computed setter', () => {
    it('should call handleNewCss', () => {
      const spy = spyOn(wrapper.vm, 'handleNewCss');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.customCssFiles = [];
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
