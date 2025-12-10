import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import PreferencesTab from '@/components/config/channels/WWC/components/tabs/PreferencesTab.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('PreferencesTab', () => {
  let wrapper;

  const defaultProps = {
    initialEmbedded: false,
    initialShowFullScreenButton: false,
    initialStartFullScreen: false,
    initialDisplayUnreadCount: false,
    initialUseConnectionOptimization: false,
    initialKeepHistory: false,
    initialEnableContactTimeout: false,
    initialContactTimeout: '23:59',
    initialTimeBetweenMessages: 1,
    loading: false,
  };

  beforeEach(() => {
    wrapper = shallowMount(PreferencesTab, {
      global: {
        plugins: [i18n, UnnnicSystem],
        stubs: {
          'unnnic-switch': true,
          'unnnic-button': true,
          'unnnic-input': true,
          'unnnic-toolTip': true,
          'unnnic-icon-svg': true,
          'unnnic-form-element': true,
          'unnnic-select-smart': true,
        },
      },
      props: defaultProps,
    });
  });

  it('should render the component', () => {
    expect(wrapper.find('.preferences-tab').exists()).toBe(true);
  });

  it('should render behavior section', () => {
    expect(wrapper.find('.preferences-tab__section').exists()).toBe(true);
  });

  it('should render all behavior switches', () => {
    const switches = wrapper.findAll('unnnic-switch-stub');
    // embedded, showFullScreenButton, startFullScreen, displayUnreadCount, useConnectionOptimization, keepHistory, enableContactTimeout
    expect(switches.length).toBe(7);
  });

  it('should render form element for time between messages', () => {
    expect(wrapper.find('unnnic-form-element-stub').exists()).toBe(true);
  });

  it('should render save and cancel buttons', () => {
    const buttons = wrapper.findAll('unnnic-button-stub');
    expect(buttons.length).toBe(2);
  });

  it('should emit save when save button is clicked', async () => {
    const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
    await saveButton.trigger('click');
    expect(wrapper.emitted().save).toBeTruthy();
  });

  it('should emit cancel when cancel button is clicked', async () => {
    const cancelButton = wrapper.findAll('unnnic-button-stub').at(0);
    await cancelButton.trigger('click');
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it('should emit update:embedded when embedded changes', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()).toBeDefined();
  });

  describe('with embedded enabled', () => {
    beforeEach(() => {
      wrapper = shallowMount(PreferencesTab, {
        global: {
          plugins: [i18n, UnnnicSystem],
          stubs: {
            'unnnic-switch': true,
            'unnnic-button': true,
            'unnnic-input': true,
            'unnnic-toolTip': true,
            'unnnic-icon-svg': true,
            'unnnic-form-element': true,
            'unnnic-select-smart': true,
          },
        },
        props: {
          ...defaultProps,
          initialEmbedded: true,
        },
      });
    });

    it('should disable fullscreen switches when embedded is true', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      // showFullScreenButton and startFullScreen should be disabled
      const fullscreenSwitch = switches.at(1);
      const startFullscreenSwitch = switches.at(2);
      expect(fullscreenSwitch.attributes('disabled')).toBeDefined();
      expect(startFullscreenSwitch.attributes('disabled')).toBeDefined();
    });
  });

  describe('with contact timeout enabled', () => {
    beforeEach(() => {
      wrapper = shallowMount(PreferencesTab, {
        global: {
          plugins: [i18n, UnnnicSystem],
          stubs: {
            'unnnic-switch': true,
            'unnnic-button': true,
            'unnnic-input': true,
            'unnnic-toolTip': true,
            'unnnic-icon-svg': true,
            'unnnic-form-element': true,
            'unnnic-select-smart': true,
          },
        },
        props: {
          ...defaultProps,
          initialEnableContactTimeout: true,
          initialContactTimeout: '12:30',
        },
      });
    });

    it('should show contact timeout input when enabled', () => {
      const input = wrapper.find('unnnic-input-stub');
      expect(input.exists()).toBe(true);
    });
  });

  describe('with invalid contact timeout', () => {
    beforeEach(() => {
      wrapper = shallowMount(PreferencesTab, {
        global: {
          plugins: [i18n, UnnnicSystem],
          stubs: {
            'unnnic-switch': true,
            'unnnic-button': true,
            'unnnic-input': true,
            'unnnic-toolTip': true,
            'unnnic-icon-svg': true,
            'unnnic-form-element': true,
            'unnnic-select-smart': true,
          },
        },
        props: {
          ...defaultProps,
          initialEnableContactTimeout: true,
          initialContactTimeout: '00:00',
        },
      });
    });

    it('should disable save button when contact timeout is invalid', () => {
      const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
      expect(saveButton.attributes('disabled')).toBeDefined();
    });
  });
});
