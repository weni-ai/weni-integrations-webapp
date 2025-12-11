import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppearanceTab from '@/components/config/channels/WWC/components/tabs/AppearanceTab.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

vi.mock('@/utils/files', () => ({
  dataUrlToFile: vi.fn().mockResolvedValue(new File(['test'], 'avatar.png', { type: 'image/png' })),
}));

const mockHandleImageUpload = vi.fn((files, cb) => cb(null, null, null));
const mockHandleTextUpload = vi.fn((files, cb) => cb(null, null));
const mockBase64ToFile = vi.fn().mockResolvedValue(null);

vi.mock('@/composables/useFileUpload', () => ({
  useFileUpload: () => ({
    isUploading: { value: false },
    progress: { value: 0 },
    handleImageUpload: mockHandleImageUpload,
    handleTextUpload: mockHandleTextUpload,
    base64ToFile: mockBase64ToFile,
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

  const createWrapper = (props = {}) => {
    return shallowMount(AppearanceTab, {
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
      props: { ...defaultProps, ...props },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('rendering', () => {
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

    it('should render fields section', () => {
      expect(wrapper.find('.appearance-tab__fields').exists()).toBe(true);
    });

    it('should render scroll container', () => {
      expect(wrapper.find('.appearance-tab__scroll').exists()).toBe(true);
    });

    it('should render buttons container', () => {
      expect(wrapper.find('.appearance-tab__buttons').exists()).toBe(true);
    });

    it('should render customization title', () => {
      expect(wrapper.find('.appearance-tab__customization-title').exists()).toBe(true);
    });
  });

  describe('props', () => {
    it('should pass loading prop to save button', () => {
      const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
      expect(saveButton.attributes('loading')).toBeDefined();
    });

    it('should show loading state when loading is true', () => {
      wrapper = createWrapper({ loading: true });
      const saveButton = wrapper.findAll('unnnic-button-stub').at(1);
      expect(saveButton.attributes('loading')).toBe('true');
    });

    it('should use initialMainColor as default color', () => {
      wrapper = createWrapper({ initialMainColor: '#FF0000' });
      expect(wrapper.props('initialMainColor')).toBe('#FF0000');
    });

    it('should use default color when initialMainColor is not provided', () => {
      wrapper = createWrapper({});
      expect(wrapper.props('initialMainColor')).toBe('#009E96');
    });
  });

  describe('events', () => {
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

    it('should emit update:title when title changes', async () => {
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted()).toBeDefined();
    });

    it('should emit update:mainColor when color picker changes', async () => {
      const colorPicker = wrapper.findComponent({ name: 'ColorPicker' });
      await colorPicker.vm.$emit('colorChange', '#FF0000');
      expect(wrapper.emitted()['update:mainColor']).toBeTruthy();
      expect(wrapper.emitted()['update:mainColor'][0]).toEqual(['#FF0000']);
    });
  });

  describe('title validation', () => {
    it('should show error for empty title', async () => {
      wrapper = createWrapper({ initialTitle: '' });
      await wrapper.vm.$nextTick();
      const input = wrapper.find('unnnic-input-stub');
      expect(input.attributes('type')).toBe('error');
    });

    it('should show error for whitespace-only title', async () => {
      wrapper = createWrapper({ initialTitle: '   ' });
      await wrapper.vm.$nextTick();
      const input = wrapper.find('unnnic-input-stub');
      expect(input.attributes('type')).toBe('error');
    });

    it('should show error for title exceeding 20 characters', async () => {
      wrapper = createWrapper({ initialTitle: 'This is a very long title exceeding limit' });
      await wrapper.vm.$nextTick();
      const input = wrapper.find('unnnic-input-stub');
      expect(input.attributes('type')).toBe('error');
    });

    it('should show normal type for valid title', async () => {
      wrapper = createWrapper({ initialTitle: 'Valid Title' });
      await wrapper.vm.$nextTick();
      const input = wrapper.find('unnnic-input-stub');
      expect(input.attributes('type')).toBe('normal');
    });

    it('should show normal type for title with exactly 20 characters', async () => {
      wrapper = createWrapper({ initialTitle: '12345678901234567890' });
      await wrapper.vm.$nextTick();
      const input = wrapper.find('unnnic-input-stub');
      expect(input.attributes('type')).toBe('normal');
    });
  });

  describe('displayed fields', () => {
    it('should display subtitle field when it has initial value', async () => {
      wrapper = createWrapper({ initialSubtitle: 'Existing subtitle' });
      await wrapper.vm.$nextTick();
      const inputs = wrapper.findAll('unnnic-input-stub');
      expect(inputs.length).toBeGreaterThan(1);
    });

    it('should display initPayload field when it has initial value', async () => {
      wrapper = createWrapper({ initialInitPayload: '/start' });
      await wrapper.vm.$nextTick();
      const inputs = wrapper.findAll('unnnic-input-stub');
      expect(inputs.length).toBeGreaterThan(1);
    });

    it('should display tooltipMessage field when it has initial value', async () => {
      wrapper = createWrapper({ initialTooltipMessage: 'Hello!' });
      await wrapper.vm.$nextTick();
      const inputs = wrapper.findAll('unnnic-input-stub');
      expect(inputs.length).toBeGreaterThan(1);
    });

    it('should display inputTextFieldHint field when it has initial value', async () => {
      wrapper = createWrapper({ initialInputTextFieldHint: 'Type here...' });
      await wrapper.vm.$nextTick();
      const inputs = wrapper.findAll('unnnic-input-stub');
      expect(inputs.length).toBeGreaterThan(1);
    });

    it('should not display empty optional fields', async () => {
      wrapper = createWrapper({
        initialSubtitle: '',
        initialInitPayload: '',
        initialTooltipMessage: '',
        initialInputTextFieldHint: '',
      });
      await wrapper.vm.$nextTick();
      const inputs = wrapper.findAll('unnnic-input-stub');
      // Only title should be displayed
      expect(inputs.length).toBe(1);
    });

    it('should show add field dropdown when not all fields are displayed', async () => {
      wrapper = createWrapper({
        initialSubtitle: '',
        initialInitPayload: '',
        initialTooltipMessage: '',
        initialInputTextFieldHint: '',
      });
      await wrapper.vm.$nextTick();
      const dropdown = wrapper.find('unnnic-dropdown-stub');
      expect(dropdown.exists()).toBe(true);
    });

    it('should display multiple fields when they have initial values', async () => {
      wrapper = createWrapper({
        initialSubtitle: 'Subtitle',
        initialInitPayload: '/start',
        initialTooltipMessage: 'Hello!',
        initialInputTextFieldHint: 'Type here...',
      });
      await wrapper.vm.$nextTick();
      const inputs = wrapper.findAll('unnnic-input-stub');
      expect(inputs.length).toBe(5); // title + 4 optional fields
    });
  });

  describe('dropdown', () => {
    it('should render dropdown when not all fields are displayed', async () => {
      wrapper = createWrapper({
        initialSubtitle: '',
        initialInitPayload: '',
        initialTooltipMessage: '',
        initialInputTextFieldHint: '',
      });
      await wrapper.vm.$nextTick();
      const dropdown = wrapper.find('unnnic-dropdown-stub');
      expect(dropdown.exists()).toBe(true);
    });

    it('should hide dropdown when all fields are displayed', async () => {
      wrapper = createWrapper({
        initialSubtitle: 'Subtitle',
        initialInitPayload: '/start',
        initialTooltipMessage: 'Hello!',
        initialInputTextFieldHint: 'Type here...',
      });
      await wrapper.vm.$nextTick();
      const dropdown = wrapper.find('.appearance-tab__add-field');
      expect(dropdown.exists()).toBe(false);
    });
  });

  describe('avatar upload', () => {
    it('should render avatar upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const avatarUpload = uploadAreas[0];
      expect(avatarUpload.exists()).toBe(true);
      expect(avatarUpload.attributes('supportedformats')).toBe('.png,.jpg,.jpeg');
    });

    it('should pass maxFileSize to avatar upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const avatarUpload = uploadAreas[0];
      expect(avatarUpload.attributes('maxfilesize')).toBe('10');
    });

    it('should pass maximumUploads to avatar upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const avatarUpload = uploadAreas[0];
      expect(avatarUpload.attributes('maximumuploads')).toBe('1');
    });

    it('should pass acceptMultiple false to avatar upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const avatarUpload = uploadAreas[0];
      expect(avatarUpload.attributes('acceptmultiple')).toBe('false');
    });

    it('should pass canImport to avatar upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const avatarUpload = uploadAreas[0];
      expect(avatarUpload.attributes('canimport')).toBe('true');
    });

    it('should pass canDelete to avatar upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const avatarUpload = uploadAreas[0];
      expect(avatarUpload.attributes('candelete')).toBe('true');
    });
  });

  describe('CSS upload', () => {
    it('should render CSS upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const cssUpload = uploadAreas[1];
      expect(cssUpload.exists()).toBe(true);
      expect(cssUpload.attributes('supportedformats')).toBe('.css');
    });

    it('should pass maxFileSize to CSS upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const cssUpload = uploadAreas[1];
      expect(cssUpload.attributes('maxfilesize')).toBe('2');
    });

    it('should pass maximumUploads to CSS upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const cssUpload = uploadAreas[1];
      expect(cssUpload.attributes('maximumuploads')).toBe('1');
    });

    it('should pass acceptMultiple false to CSS upload area', () => {
      const uploadAreas = wrapper.findAll('unnnic-upload-area-stub');
      const cssUpload = uploadAreas[1];
      expect(cssUpload.attributes('acceptmultiple')).toBe('false');
    });
  });

  describe('field initialization', () => {
    it('should initialize with subtitle when provided', () => {
      wrapper = createWrapper({ initialSubtitle: 'Initial Subtitle' });
      expect(wrapper.props('initialSubtitle')).toBe('Initial Subtitle');
    });

    it('should initialize with initPayload when provided', () => {
      wrapper = createWrapper({ initialInitPayload: '/start' });
      expect(wrapper.props('initialInitPayload')).toBe('/start');
    });

    it('should initialize with tooltipMessage when provided', () => {
      wrapper = createWrapper({ initialTooltipMessage: 'Hello!' });
      expect(wrapper.props('initialTooltipMessage')).toBe('Hello!');
    });

    it('should initialize with inputTextFieldHint when provided', () => {
      wrapper = createWrapper({ initialInputTextFieldHint: 'Type here...' });
      expect(wrapper.props('initialInputTextFieldHint')).toBe('Type here...');
    });
  });

  describe('color picker', () => {
    it('should render color picker in color section', () => {
      expect(wrapper.find('.appearance-tab__color-section').exists()).toBe(true);
      expect(wrapper.find('.appearance-tab__color-picker').exists()).toBe(true);
    });

    it('should have color label', () => {
      const colorSection = wrapper.find('.appearance-tab__color-section');
      const label = colorSection.find('unnnic-label-stub');
      expect(label.exists()).toBe(true);
    });
  });

  describe('upload section', () => {
    it('should render upload sections', () => {
      const uploadSections = wrapper.findAll('.appearance-tab__upload-section');
      expect(uploadSections.length).toBe(2);
    });

    it('should have labels for upload sections', () => {
      const uploadSections = wrapper.findAll('.appearance-tab__upload-section');
      uploadSections.forEach((section) => {
        expect(section.find('unnnic-label-stub').exists()).toBe(true);
      });
    });
  });

  describe('add field functionality', () => {
    it('should show add field dropdown when no optional fields are displayed', async () => {
      wrapper = createWrapper({
        initialSubtitle: '',
        initialInitPayload: '',
        initialTooltipMessage: '',
        initialInputTextFieldHint: '',
      });
      await wrapper.vm.$nextTick();
      const addFieldDropdown = wrapper.find('.appearance-tab__add-field');
      expect(addFieldDropdown.exists()).toBe(true);
    });

    it('should hide add field dropdown when all fields are displayed', async () => {
      wrapper = createWrapper({
        initialSubtitle: 'Subtitle',
        initialInitPayload: '/start',
        initialTooltipMessage: 'Hello!',
        initialInputTextFieldHint: 'Type here...',
      });
      await wrapper.vm.$nextTick();
      const addFieldDropdown = wrapper.find('.appearance-tab__add-field');
      expect(addFieldDropdown.exists()).toBe(false);
    });

    it('should show add field dropdown when some fields are displayed', async () => {
      wrapper = createWrapper({
        initialSubtitle: 'Subtitle',
        initialInitPayload: '',
        initialTooltipMessage: '',
        initialInputTextFieldHint: '',
      });
      await wrapper.vm.$nextTick();
      const addFieldDropdown = wrapper.find('.appearance-tab__add-field');
      expect(addFieldDropdown.exists()).toBe(true);
    });
  });
});
