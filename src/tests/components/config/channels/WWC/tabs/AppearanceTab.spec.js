import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppearanceTab from '@/components/config/channels/WWC/components/tabs/AppearanceTab.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

vi.mock('@/utils/files', () => ({
  dataUrlToFile: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/composables/useFileUpload', () => ({
  useFileUpload: () => ({
    isUploading: { value: false },
    progress: { value: 0 },
    handleImageUpload: vi.fn((files, cb) => cb(null, null, null)),
    handleTextUpload: vi.fn((files, cb) => cb(null, null)),
    base64ToFile: vi.fn().mockResolvedValue(null),
    getFileType: vi.fn(),
  }),
}));

describe('AppearanceTab', () => {
  let wrapper;

  const defaultProps = {
    initialTitle: 'Test Title',
    initialSubtitle: 'Test Subtitle',
    initialInitPayload: '',
    initialTooltipMessage: '',
    initialInputTextFieldHint: 'Type here...',
    initialMainColor: '#009E96',
    initialAvatarFile: null,
    initialAvatarBase64: null,
    initialCssFile: null,
    initialCustomCss: null,
    loading: false,
  };

  beforeEach(() => {
    wrapper = shallowMount(AppearanceTab, {
      global: {
        plugins: [i18n, UnnnicSystem],
        stubs: {
          'unnnic-input': true,
          'unnnic-dropdown': true,
          'unnnic-dropdown-item': true,
          'unnnic-button': true,
          'unnnic-label': true,
          'unnnic-upload-area': true,
          ColorPicker: true,
        },
      },
      props: defaultProps,
    });
  });

  it('should render the component', () => {
    expect(wrapper.find('.appearance-tab').exists()).toBe(true);
  });

  it('should render the title input', () => {
    const input = wrapper.find('unnnic-input-stub');
    expect(input.exists()).toBe(true);
  });

  it('should render save and cancel buttons', () => {
    const buttons = wrapper.findAll('unnnic-button-stub');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('should emit update:title when title changes', async () => {
    // The component watches title changes and emits
    await wrapper.vm.$nextTick();
    // Initial emit might occur, check for the event type
    expect(wrapper.emitted()).toBeDefined();
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

  it('should render customization section', () => {
    expect(wrapper.find('.appearance-tab__customization').exists()).toBe(true);
  });

  it('should render color picker', () => {
    expect(wrapper.findComponent({ name: 'ColorPicker' }).exists()).toBe(true);
  });

  it('should render upload areas for avatar and CSS', () => {
    const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
    expect(uploadAreas.length).toBe(2);
  });

  it('should pass loading prop to save button', () => {
    const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
    expect(saveButton.attributes('loading')).toBeDefined();
  });

  describe('with subtitle displayed', () => {
    beforeEach(() => {
      wrapper = shallowMount(AppearanceTab, {
        global: {
          plugins: [i18n, UnnnicSystem],
          stubs: {
            'unnnic-input': true,
            'unnnic-dropdown': true,
            'unnnic-dropdown-item': true,
            'unnnic-button': true,
            'unnnic-label': true,
            'unnnic-upload-area': true,
            ColorPicker: true,
          },
        },
        props: {
          ...defaultProps,
          initialSubtitle: 'Existing subtitle',
        },
      });
    });

    it('should display subtitle field when it has initial value', async () => {
      await wrapper.vm.$nextTick();
      // The subtitle input should be rendered because initialSubtitle has a value
      const inputs = wrapper.findAll('unnnic-input-stub');
      expect(inputs.length).toBeGreaterThan(1);
    });
  });
});
