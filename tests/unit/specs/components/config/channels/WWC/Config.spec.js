import { shallowMount, createLocalVue } from '@vue/test-utils';
import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import wwcSimulator from '@/components/config/channels/WWC/Simulator.vue';
import { singleApp } from '../../../../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('Config.vue', () => {
  let wrapper;
  let handleColorChangeSpy;
  let toggleSimulatorSpy;
  beforeEach(() => {
    handleColorChangeSpy = jest.spyOn(wwcConfig.methods, 'handleColorChange');
    toggleSimulatorSpy = jest.spyOn(wwcConfig.methods, 'toggleSimulator');
    wrapper = shallowMount(wwcConfig, {
      localVue,
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
    expect(wrapper.vm.simulatorColor).not.toEqual(color);
    wrapper.vm.handleColorChange(color);
    expect(wrapper.vm.simulatorColor).toEqual(color);
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

  it('should have default app defined', () => {
    const fn = jest.fn();
    wrapper.vm.app;
    expect(fn).toHaveBeenCalledTimes(0);
  });
});
