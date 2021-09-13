jest.mock('@/api/appType', () => {
  return {
    updateAppConfig: jest.fn(),
  };
});

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import wwcSimulator from '@/components/config/channels/WWC/Simulator.vue';
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

    actions = {
      updateAppConfig: jest.fn(),
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

  it('should return cssVars', () => {
    expect(wrapper.vm.cssVars).toBeDefined();
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

  it('should have default app defined', () => {
    const fn = jest.fn();
    wrapper.vm.app;
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('should set new customCss', () => {
    const css = 'css';
    expect(wrapper.vm.customCss).toEqual(null);
    wrapper.vm.setNewCss(css);
    expect(wrapper.vm.customCss).toEqual(css);
  });

  it('should set new slider value', () => {
    const value = '3';
    expect(wrapper.vm.timeBetweenMessages).toEqual(1);
    wrapper.vm.handleSliderChange(value);
    expect(wrapper.vm.timeBetweenMessages).toEqual(parseInt(value));
  });

  it('should call updateAppConfig on save', async () => {
    expect(actions.updateAppConfig).not.toHaveBeenCalled();
    await wrapper.vm.saveConfig();
    expect(actions.updateAppConfig).toHaveBeenCalledTimes(1);
  });
});
