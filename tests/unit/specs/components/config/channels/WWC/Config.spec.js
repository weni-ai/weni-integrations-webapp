import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import wwcSimulator from '@/components/config/channels/WWC/Simulator.vue';
import FileUpload from '@/components/FileUpload.vue';
import { singleApp } from '../../../../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Config.vue', () => {
  let wrapper;
  let handleColorChangeSpy;
  let toggleSimulatorSpy;

  let actions;
  let store;

  beforeEach(() => {
    handleColorChangeSpy = jest.spyOn(wwcConfig.methods, 'handleColorChange');
    toggleSimulatorSpy = jest.spyOn(wwcConfig.methods, 'toggleSimulator');

    spyOn(wwcConfig.methods, 'createFile');

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
        FileUpload,
        UnnnicTab: true,
        UnnnicInput: true,
        UnnnicSwitch: true,
        UnnnicSlider: true,
        UnnnicButton: true,
        UnnnicToolTip: true,
        UnnnicIconSvg: true,
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

  it('should set new avatar', () => {
    const url = 'https://localhost';
    expect(wrapper.vm.simulatorAvatar).not.toEqual(url);
    wrapper.vm.setNewAvatar(url);
    expect(wrapper.vm.simulatorAvatar).toEqual(url);
  });

  it('should return config tabs', () => {
    expect(wrapper.vm.configTabs).toEqual(['settings', 'script']);
  });

  it('should return valid subtitle if enableSubtitle is true', async () => {
    await wrapper.setData({ enableSubtitle: true, subtitle: 'text' });
    expect(wrapper.vm.chatSubtitle).toEqual('text');
  });

  it('should return blank space subtitle if enableSubtitle is false', async () => {
    await wrapper.setData({ enableSubtitle: false });
    expect(wrapper.vm.chatSubtitle).toEqual(' ');
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
    it('should call updateAppConfig on save', async () => {
      expect(actions.updateAppConfig).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(actions.updateAppConfig).toHaveBeenCalledTimes(1);
    });

    it('should set new app.config on save', async () => {
      await wrapper.setProps({ app: { ...singleApp, config: {} } });
      expect(wrapper.vm.app).not.toMatchObject(singleApp);
      await wrapper.vm.saveConfig();
      expect(wrapper.vm.app).toMatchObject(singleApp);
    });

    it('should call getApp on save', async () => {
      expect(actions.getApp).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(actions.getApp).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
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

  it('should call setPreview from avatarUpload component', () => {
    const spy = spyOn(wrapper.vm.$refs.avatarUpload, 'setPreview');
    expect(spy).not.toHaveBeenCalled();

    wrapper.vm.manuallySetAvatarImage();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setPreview from cssUpload component', () => {
    const spy = spyOn(wrapper.vm.$refs.cssUpload, 'setPreview');
    expect(spy).not.toHaveBeenCalled();

    wrapper.vm.manuallySetCssFile();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('imageForUpload', () => {
    it('should return avatarFile.data if simulatorAvatar not a base64', () => {
      const file = { data: '123' };
      wrapper.setData({ avatarFile: file });
      const imageData = wrapper.vm.imageForUpload;

      expect(imageData).toStrictEqual(file.data);
    });

    it('should return simulatorAvatar if it is a base64', () => {
      const data = 'data:image/png;base64,iVBORw0KGgoAAA';
      wrapper.setData({ simulatorAvatar: data });
      const imageData = wrapper.vm.imageForUpload;

      expect(imageData).toStrictEqual(data);
    });
  });

  describe('closeConfig()', () => {
    it('should call parent closeModal()', () => {
      expect(wrapper.emitted('closeModal')).toBeFalsy();
      wrapper.vm.closeConfig();
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });
  });
});
