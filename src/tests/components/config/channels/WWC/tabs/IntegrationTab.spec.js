import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IntegrationTab from '@/components/config/channels/WWC/components/tabs/IntegrationTab.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('IntegrationTab', () => {
  let wrapper;

  const defaultProps = {
    appConfig: {
      script: 'https://test.script.url',
      version: '1',
    },
    title: 'Test App',
  };

  beforeEach(() => {
    wrapper = shallowMount(IntegrationTab, {
      global: {
        plugins: [i18n, UnnnicSystem],
        stubs: {
          'unnnic-disclaimer': true,
          'unnnic-text-area': true,
          'unnnic-button': true,
        },
      },
      props: defaultProps,
    });
  });

  it('should render the component', () => {
    expect(wrapper.find('.integration-tab').exists()).toBe(true);
  });

  it('should render the title', () => {
    expect(wrapper.find('.integration-tab__title').exists()).toBe(true);
  });

  it('should render text area for script', () => {
    expect(wrapper.find('unnnic-text-area-stub').exists()).toBe(true);
  });

  it('should render copy button', () => {
    expect(wrapper.find('unnnic-button-stub').exists()).toBe(true);
  });

  it('should not render disclaimer when script exists', () => {
    expect(wrapper.find('unnnic-disclaimer-stub').exists()).toBe(false);
  });

  it('should enable copy button when script exists', () => {
    const button = wrapper.find('unnnic-button-stub');
    // When not disabled, the attribute should be 'false' or undefined
    expect(['false', undefined]).toContain(button.attributes('disabled'));
  });

  describe('without script', () => {
    beforeEach(() => {
      wrapper = shallowMount(IntegrationTab, {
        global: {
          plugins: [i18n, UnnnicSystem],
          stubs: {
            'unnnic-disclaimer': true,
            'unnnic-text-area': true,
            'unnnic-button': true,
          },
        },
        props: {
          appConfig: {},
          title: 'Test App',
        },
      });
    });

    it('should render disclaimer when no script', () => {
      expect(wrapper.find('unnnic-disclaimer-stub').exists()).toBe(true);
    });

    it('should disable copy button when no script', () => {
      const button = wrapper.find('unnnic-button-stub');
      expect(button.attributes('disabled')).toBeDefined();
    });

    it('should disable text area when no script', () => {
      const textarea = wrapper.find('unnnic-text-area-stub');
      expect(textarea.attributes('disabled')).toBeDefined();
    });
  });

  describe('copy script functionality', () => {
    it('should create download link when copy button is clicked', async () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

      const button = wrapper.find('unnnic-button-stub');
      await button.trigger('click');

      expect(createElementSpy).toHaveBeenCalledWith('a');

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('with v2 config', () => {
    beforeEach(() => {
      wrapper = shallowMount(IntegrationTab, {
        global: {
          plugins: [i18n, UnnnicSystem],
          stubs: {
            'unnnic-disclaimer': true,
            'unnnic-text-area': true,
            'unnnic-button': true,
          },
        },
        props: {
          appConfig: {
            script: 'https://test.script.url',
            version: '2',
          },
          title: 'Test App',
        },
      });
    });

    it('should render component with v2 config', () => {
      expect(wrapper.find('.integration-tab').exists()).toBe(true);
    });
  });
});
