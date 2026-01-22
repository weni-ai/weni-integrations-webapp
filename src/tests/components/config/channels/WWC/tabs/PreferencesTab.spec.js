import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  const createWrapper = (props = {}) => {
    return shallowMount(PreferencesTab, {
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
      props: { ...defaultProps, ...props },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      expect(wrapper.find('.preferences-tab').exists()).toBe(true);
    });

    it('should render behavior section', () => {
      expect(wrapper.find('.preferences-tab__section').exists()).toBe(true);
    });

    it('should render all behavior switches', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      // embedded, showFullScreenButton, startFullScreen, displayUnreadCount, useConnectionOptimization, keepHistory, enableContactTimeout
      expect(switches.length).toBe(8);
    });

    it('should render form element for time between messages', () => {
      expect(wrapper.find('unnnic-form-element-stub').exists()).toBe(true);
    });

    it('should render save and cancel buttons', () => {
      const buttons = wrapper.findAll('unnnic-button-stub');
      expect(buttons.length).toBe(2);
    });

    it('should render scroll container', () => {
      expect(wrapper.find('.preferences-tab__scroll').exists()).toBe(true);
    });

    it('should render buttons container', () => {
      expect(wrapper.find('.preferences-tab__buttons').exists()).toBe(true);
    });

    it('should render switches container', () => {
      expect(wrapper.find('.preferences-tab__switches').exists()).toBe(true);
    });

    it('should render three sections (behavior, media and history)', () => {
      const sections = wrapper.findAll('.preferences-tab__section');
      expect(sections.length).toBe(3);
    });

    it('should render section titles', () => {
      const sectionTitles = wrapper.findAll('.preferences-tab__section-title');
      expect(sectionTitles.length).toBe(3);
    });

    it('should render contact timeout section', () => {
      expect(wrapper.find('.preferences-tab__contact-timeout').exists()).toBe(true);
    });

    it('should render contact timeout tooltip', () => {
      expect(
        wrapper.find('unnnic-tooltip-stub').exists() ||
          wrapper.find('.preferences-tab__contact-timeout-tooltip').exists(),
      ).toBe(true);
    });
  });

  describe('button events', () => {
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
  });

  describe('embedded mode', () => {
    it('should disable fullscreen switches when embedded is true', () => {
      wrapper = createWrapper({ initialEmbedded: true });
      const switches = wrapper.findAll('unnnic-switch-stub');
      const fullscreenSwitch = switches[2];
      const startFullscreenSwitch = switches[3];
      expect(fullscreenSwitch.attributes('disabled')).toBeDefined();
      expect(startFullscreenSwitch.attributes('disabled')).toBeDefined();
    });

    it('should have disabled attribute on fullscreen switches with embedded enabled', () => {
      wrapper = createWrapper({ initialEmbedded: true });
      const switches = wrapper.findAll('unnnic-switch-stub');
      // The disabled attribute will be set (even if as "true" string)
      expect(switches[2].attributes('disabled')).toBe('true');
      expect(switches[3].attributes('disabled')).toBe('true');
    });
  });

  describe('contact timeout', () => {
    it('should show contact timeout input when enabled', () => {
      wrapper = createWrapper({
        initialEnableContactTimeout: true,
        initialContactTimeout: '12:30',
      });
      const input = wrapper.find('.preferences-tab__contact-timeout-input');
      expect(input.exists()).toBe(true);
    });

    it('should disable save button when contact timeout is invalid (00:00)', () => {
      wrapper = createWrapper({
        initialEnableContactTimeout: true,
        initialContactTimeout: '00:00',
      });
      const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
      expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('should show error type input when contact timeout is invalid', () => {
      wrapper = createWrapper({
        initialEnableContactTimeout: true,
        initialContactTimeout: '00:00',
      });
      const input = wrapper.find('.preferences-tab__contact-timeout-input');
      expect(input.attributes('type')).toBe('error');
    });

    it('should show normal type input when contact timeout is valid', () => {
      wrapper = createWrapper({
        initialEnableContactTimeout: true,
        initialContactTimeout: '23:59',
      });
      const input = wrapper.find('.preferences-tab__contact-timeout-input');
      expect(input.attributes('type')).toBe('normal');
    });

    it('should have mask attribute on contact timeout input', () => {
      wrapper = createWrapper({
        initialEnableContactTimeout: true,
      });
      const input = wrapper.find('.preferences-tab__contact-timeout-input');
      expect(input.attributes('mask')).toBe('##:##');
    });
  });

  describe('props', () => {
    it('should show loading state when loading is true', () => {
      wrapper = createWrapper({ loading: true });
      const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
      expect(saveButton.attributes('loading')).toBe('true');
    });

    it('should accept initialEmbedded prop', () => {
      wrapper = createWrapper({ initialEmbedded: true });
      expect(wrapper.props('initialEmbedded')).toBe(true);
    });

    it('should accept initialShowFullScreenButton prop', () => {
      wrapper = createWrapper({ initialShowFullScreenButton: true });
      expect(wrapper.props('initialShowFullScreenButton')).toBe(true);
    });

    it('should accept initialStartFullScreen prop', () => {
      wrapper = createWrapper({ initialStartFullScreen: true });
      expect(wrapper.props('initialStartFullScreen')).toBe(true);
    });

    it('should accept initialDisplayUnreadCount prop', () => {
      wrapper = createWrapper({ initialDisplayUnreadCount: true });
      expect(wrapper.props('initialDisplayUnreadCount')).toBe(true);
    });

    it('should accept initialUseConnectionOptimization prop', () => {
      wrapper = createWrapper({ initialUseConnectionOptimization: true });
      expect(wrapper.props('initialUseConnectionOptimization')).toBe(true);
    });

    it('should accept initialKeepHistory prop', () => {
      wrapper = createWrapper({ initialKeepHistory: true });
      expect(wrapper.props('initialKeepHistory')).toBe(true);
    });

    it('should accept initialEnableContactTimeout prop', () => {
      wrapper = createWrapper({ initialEnableContactTimeout: true });
      expect(wrapper.props('initialEnableContactTimeout')).toBe(true);
    });

    it('should accept initialContactTimeout prop', () => {
      wrapper = createWrapper({ initialContactTimeout: '12:30' });
      expect(wrapper.props('initialContactTimeout')).toBe('12:30');
    });

    it('should accept initialTimeBetweenMessages prop', () => {
      wrapper = createWrapper({ initialTimeBetweenMessages: 2 });
      expect(wrapper.props('initialTimeBetweenMessages')).toBe(2);
    });

    it('should accept loading prop', () => {
      wrapper = createWrapper({ loading: true });
      expect(wrapper.props('loading')).toBe(true);
    });
  });

  describe('button states', () => {
    it('should have tertiary type for cancel button', () => {
      const cancelButton = wrapper.findAll('unnnic-button-stub').at(0);
      expect(cancelButton.attributes('type')).toBe('tertiary');
    });

    it('should have primary type for save button', () => {
      const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
      expect(saveButton.attributes('type')).toBe('primary');
    });

    it('should have large size for both buttons', () => {
      const buttons = wrapper.findAll('unnnic-button-stub');
      expect(buttons[0].attributes('size')).toBe('large');
      expect(buttons[1].attributes('size')).toBe('large');
    });
  });

  describe('invalid time validation', () => {
    it('should show error for 25:00', async () => {
      wrapper = createWrapper({
        initialEnableContactTimeout: true,
        initialContactTimeout: '25:00',
      });
      await wrapper.vm.$nextTick();
      const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
      expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('should show error for 12:60', async () => {
      wrapper = createWrapper({
        initialEnableContactTimeout: true,
        initialContactTimeout: '12:60',
      });
      await wrapper.vm.$nextTick();
      const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
      expect(saveButton.attributes('disabled')).toBeDefined();
    });
  });

  describe('switch configuration', () => {
    it('should render switch for embedded mode', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      expect(switches[0].exists()).toBe(true);
    });

    it('should render switch for showFullScreenButton', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      expect(switches[1].exists()).toBe(true);
    });

    it('should render switch for startFullScreen', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      expect(switches[2].exists()).toBe(true);
    });

    it('should render switch for displayUnreadCount', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      expect(switches[3].exists()).toBe(true);
    });

    it('should render switch for useConnectionOptimization', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      expect(switches[4].exists()).toBe(true);
    });

    it('should render switch for keepHistory', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      expect(switches[5].exists()).toBe(true);
    });

    it('should render switch for enableContactTimeout', () => {
      const switches = wrapper.findAll('unnnic-switch-stub');
      expect(switches[6].exists()).toBe(true);
    });
  });

  describe('contact timeout header', () => {
    it('should render contact timeout header', () => {
      expect(wrapper.find('.preferences-tab__contact-timeout-header').exists()).toBe(true);
    });
  });
});
