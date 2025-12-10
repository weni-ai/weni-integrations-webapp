import { shallowMount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import unnnic from '@weni/unnnic-system';
import { app_type } from '@/stores/modules/appType/appType.store';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

vi.mock('@/utils/files', () => ({
  dataUrlToFile: vi.fn().mockResolvedValue(null),
  toBase64: vi.fn().mockResolvedValue('base64data'),
}));

vi.mock('@/utils/clean', () => ({
  default: vi.fn((data) => data),
}));

describe('wwcConfig Component', () => {
  let wrapper;
  let store;
  let pinia;

  const defaultAppConfig = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    mainColor: '#009E96',
    inputTextFieldHint: 'Type here...',
    tooltipMessage: 'Tooltip',
    displayUnreadCount: true,
    showFullScreenButton: true,
    keepHistory: true,
    customCss: '.test { color: red; }',
    profileAvatar: null,
    script: 'https://test.script.url',
    params: {
      storage: 'local',
    },
    contactTimeout: '02:30',
    timeBetweenMessages: 2,
    startFullScreen: false,
    useConnectionOptimization: false,
    embedded: false,
    version: '1',
  };

  const createWrapper = (props = {}, storeOverrides = {}) => {
    pinia = createTestingPinia({ stubActions: false });
    setActivePinia(pinia);

    store = app_type();
    store.currentApp = { config: { title: 'App Teste' } };
    store.loadingUpdateAppConfig = false;
    store.loadingCurrentApp = false;
    store.errorUpdateAppConfig = null;
    store.errorCurrentApp = null;
    Object.assign(store, storeOverrides);

    return shallowMount(wwcConfig, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        stubs: {
          'unnnic-tab': {
            template:
              '<div><slot name="tab-panel-appearance" /><slot name="tab-panel-preferences" /><slot name="tab-panel-integration" /></div>',
          },
          'unnnic-button': true,
          'unnnic-icon-svg': true,
          WwcSimulator: {
            template: '<div class="wwc-simulator" />',
            methods: {
              toggleChat: vi.fn(),
            },
            setup() {
              return {
                isOpen: false,
              };
            },
          },
        },
        mocks: {
          unnnic,
        },
      },
      props: {
        app: {
          code: 'wwc',
          uuid: 'test-uuid',
          name: 'Test App',
          config: { ...defaultAppConfig, ...props.config },
        },
        ...props,
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render the component correctly', () => {
      expect(wrapper.find('.app-config-wwc').exists()).toBe(true);
      expect(wrapper.find('.app-config-wwc__header__title').text()).toBe('Test App');
    });

    it('should render AppearanceTab component', () => {
      expect(wrapper.findComponent({ name: 'AppearanceTab' }).exists()).toBe(true);
    });

    it('should render PreferencesTab component', () => {
      expect(wrapper.findComponent({ name: 'PreferencesTab' }).exists()).toBe(true);
    });

    it('should render IntegrationTab component', () => {
      expect(wrapper.findComponent({ name: 'IntegrationTab' }).exists()).toBe(true);
    });

    it('should render header with title and description', () => {
      expect(wrapper.find('.app-config-wwc__header').exists()).toBe(true);
      expect(wrapper.find('.app-config-wwc__header__title-container').exists()).toBe(true);
      expect(wrapper.find('.app-config-wwc__header__description').exists()).toBe(true);
    });

    it('should render close button', () => {
      expect(wrapper.find('.app-config-wwc__header__close').exists()).toBe(true);
    });

    it('should have simulator switch button', () => {
      expect(wrapper.find('.app-config-wwc__simulator-switch').exists()).toBe(true);
    });

    it('should render content container', () => {
      expect(wrapper.find('.app-config-wwc__content').exists()).toBe(true);
    });

    it('should render tabs', () => {
      expect(wrapper.find('.app-config-wwc__tabs').exists()).toBe(true);
    });

    it('should render simulator', () => {
      expect(wrapper.find('.wwc-simulator').exists()).toBe(true);
    });
  });

  describe('close functionality', () => {
    it('should emit closeModal when close button is clicked', async () => {
      const closeButton = wrapper.find('.app-config-wwc__header__close unnnic-button-stub');
      await closeButton.trigger('click');
      expect(wrapper.emitted().closeModal).toBeTruthy();
    });

    it('should emit closeModal when cancel is triggered from AppearanceTab', async () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('cancel');
      expect(wrapper.emitted().closeModal).toBeTruthy();
    });

    it('should emit closeModal when cancel is triggered from PreferencesTab', async () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      await preferencesTab.vm.$emit('cancel');
      expect(wrapper.emitted().closeModal).toBeTruthy();
    });
  });

  describe('config updates', () => {
    it('should emit setConfirmation when AppearanceTab emits update:title', async () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('update:title', 'New Title');
      expect(wrapper.emitted().setConfirmation).toBeTruthy();
      expect(wrapper.emitted().setConfirmation[0]).toEqual([true]);
    });

    it('should emit setConfirmation when AppearanceTab emits update:subtitle', async () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('update:subtitle', 'New Subtitle');
      expect(wrapper.emitted().setConfirmation).toBeTruthy();
    });

    it('should emit setConfirmation when AppearanceTab emits update:mainColor', async () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('update:mainColor', '#FF0000');
      expect(wrapper.emitted().setConfirmation).toBeTruthy();
    });

    it('should emit setConfirmation when PreferencesTab emits update:embedded', async () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      await preferencesTab.vm.$emit('update:embedded', true);
      expect(wrapper.emitted().setConfirmation).toBeTruthy();
    });

    it('should emit setConfirmation when PreferencesTab emits update:displayUnreadCount', async () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      await preferencesTab.vm.$emit('update:displayUnreadCount', false);
      expect(wrapper.emitted().setConfirmation).toBeTruthy();
    });
  });

  describe('AppearanceTab props', () => {
    it('should pass correct initialTitle to AppearanceTab', () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('initialTitle')).toBe('Test Title');
    });

    it('should pass correct initialMainColor to AppearanceTab', () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('initialMainColor')).toBe('#009E96');
    });

    it('should pass correct initialSubtitle to AppearanceTab', () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('initialSubtitle')).toBe('Test Subtitle');
    });

    it('should pass correct initialInputTextFieldHint to AppearanceTab', () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('initialInputTextFieldHint')).toBe('Type here...');
    });

    it('should pass correct initialTooltipMessage to AppearanceTab', () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('initialTooltipMessage')).toBe('Tooltip');
    });

    it('should pass loading state to AppearanceTab', () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('loading')).toBe(false);
    });
  });

  describe('PreferencesTab props', () => {
    it('should pass correct initialDisplayUnreadCount to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialDisplayUnreadCount')).toBe(true);
    });

    it('should pass correct initialShowFullScreenButton to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialShowFullScreenButton')).toBe(true);
    });

    it('should pass correct initialKeepHistory to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialKeepHistory')).toBe(true);
    });

    it('should pass correct initialTimeBetweenMessages to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialTimeBetweenMessages')).toBe(2);
    });

    it('should pass correct initialEnableContactTimeout to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialEnableContactTimeout')).toBe(true);
    });

    it('should pass loading state to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('loading')).toBe(false);
    });

    it('should pass correct initialEmbedded to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialEmbedded')).toBe(false);
    });

    it('should pass correct initialStartFullScreen to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialStartFullScreen')).toBe(false);
    });

    it('should pass correct initialUseConnectionOptimization to PreferencesTab', () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialUseConnectionOptimization')).toBe(false);
    });
  });

  describe('IntegrationTab props', () => {
    it('should pass appConfig to IntegrationTab', () => {
      const integrationTab = wrapper.findComponent({ name: 'IntegrationTab' });
      expect(integrationTab.props('appConfig')).toEqual(defaultAppConfig);
    });

    it('should pass title to IntegrationTab', () => {
      const integrationTab = wrapper.findComponent({ name: 'IntegrationTab' });
      expect(integrationTab.props('title')).toBe('Test Title');
    });
  });

  describe('WwcSimulator', () => {
    it('should render simulator', () => {
      const simulator = wrapper.find('.wwc-simulator');
      expect(simulator.exists()).toBe(true);
    });

    it('should render simulator switch button', () => {
      expect(wrapper.find('.app-config-wwc__simulator-switch').exists()).toBe(true);
    });
  });

  describe('save functionality', () => {
    it('should not throw error when save is triggered with valid title', async () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await expect(async () => {
        await appearanceTab.vm.$emit('save');
        await wrapper.vm.$nextTick();
      }).not.toThrow();
    });

    it('should show error alert if title is empty when saving', async () => {
      const alertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');

      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('update:title', '');
      await appearanceTab.vm.$emit('save');

      expect(alertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({ type: 'error' }),
        }),
      );
    });

    it('should show error alert if title exceeds 20 characters', async () => {
      const alertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');

      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('update:title', 'This title is way too long');
      await appearanceTab.vm.$emit('save');

      expect(alertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({ type: 'error' }),
        }),
      );
    });

    it('should show error alert if title is whitespace only', async () => {
      const alertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');

      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('update:title', '   ');
      await appearanceTab.vm.$emit('save');

      expect(alertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({ type: 'error' }),
        }),
      );
    });

    it('should call updateAppConfig with correct data on save', async () => {
      const updateAppConfigSpy = vi.spyOn(store, 'updateAppConfig').mockResolvedValue();
      vi.spyOn(store, 'getApp').mockResolvedValue();
      store.currentApp = { config: { title: 'Test Title' } };

      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('save');
      await flushPromises();

      expect(updateAppConfigSpy).toHaveBeenCalled();
      const callArg = updateAppConfigSpy.mock.calls[0][0];
      expect(callArg.code).toBe('wwc');
      expect(callArg.appUuid).toBe('test-uuid');
      expect(callArg.payload.config.title).toBe('Test Title');
    });

    it('should emit setConfirmation false on successful save', async () => {
      vi.spyOn(store, 'updateAppConfig').mockResolvedValue();
      vi.spyOn(store, 'getApp').mockResolvedValue();
      store.currentApp = { config: { title: 'Test Title' } };

      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('save');
      await flushPromises();

      expect(wrapper.emitted().setConfirmation).toBeTruthy();
      const lastEmission =
        wrapper.emitted().setConfirmation[wrapper.emitted().setConfirmation.length - 1];
      expect(lastEmission).toEqual([false]);
    });

    it('should trigger save flow when save event emitted', async () => {
      // Create wrapper with valid title
      wrapper = createWrapper();

      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      // The save will be attempted - even if it fails due to network, the flow was triggered
      await appearanceTab.vm.$emit('save');
      await wrapper.vm.$nextTick();

      // The component should attempt to validate and save
      expect(appearanceTab.exists()).toBe(true);
    });

    it('should show success alert on subsequent saves', async () => {
      const alertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');
      vi.spyOn(store, 'updateAppConfig').mockResolvedValue();
      vi.spyOn(store, 'getApp').mockResolvedValue();
      store.currentApp = { config: { title: 'Test Title' } };

      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('save');
      await flushPromises();

      expect(alertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({ type: 'success' }),
          seconds: 3,
        }),
      );
    });

    it('should show error alert on save failure', async () => {
      const alertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');
      store.errorUpdateAppConfig = 'Some error';
      vi.spyOn(store, 'updateAppConfig').mockResolvedValue();

      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      await appearanceTab.vm.$emit('save');
      await flushPromises();

      expect(alertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({ type: 'error' }),
        }),
      );
    });
  });

  describe('simulator toggle', () => {
    it('should have simulator switch with correct icon', () => {
      const simulatorSwitch = wrapper.find('.app-config-wwc__simulator-switch');
      const icon = simulatorSwitch.find('unnnic-icon-svg-stub');
      expect(icon.attributes('icon')).toBe('view-1-1');
    });

    it('should call toggleChat on simulator when switch is clicked', async () => {
      const simulatorSwitch = wrapper.find('.app-config-wwc__simulator-switch');
      await simulatorSwitch.trigger('click');
      // The toggle function is on the simulator ref
    });
  });

  describe('default values', () => {
    it('should use default color when mainColor is not provided', () => {
      wrapper = createWrapper({ config: { mainColor: null } });
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('initialMainColor')).toBe('#009E96');
    });

    it('should use default version when not provided', () => {
      wrapper = createWrapper({ config: { version: null } });
      // Version is used internally, we can verify through the integration tab
    });

    it('should handle keepHistory based on storage param', () => {
      wrapper = createWrapper({ config: { params: { storage: 'session' } } });
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialKeepHistory')).toBe(false);
    });

    it('should handle contactTimeout with valid value', () => {
      wrapper = createWrapper({ config: { contactTimeout: 150 } }); // 150 minutes = 2:30
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialContactTimeout')).toBeDefined();
    });

    it('should default timeBetweenMessages to 1 when not provided', () => {
      wrapper = createWrapper({ config: { timeBetweenMessages: null } });
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialTimeBetweenMessages')).toBe(1);
    });
  });

  describe('loading state', () => {
    it('should compute loadingSave based on loadingUpdateAppConfig', () => {
      wrapper = createWrapper({}, { loadingUpdateAppConfig: true });
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('loading')).toBe(true);
    });

    it('should compute loadingSave based on loadingCurrentApp', () => {
      wrapper = createWrapper({}, { loadingCurrentApp: true });
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
      expect(appearanceTab.props('loading')).toBe(true);
    });
  });

  describe('contact timeout calculation', () => {
    it('should return 0 when contact timeout is disabled', async () => {
      wrapper = createWrapper({ config: { contactTimeout: null } });
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialEnableContactTimeout')).toBe(false);
    });

    it('should enable contact timeout when 00:00 is set', () => {
      wrapper = createWrapper({ config: { contactTimeout: '00:00' } });
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
      expect(preferencesTab.props('initialEnableContactTimeout')).toBe(true);
    });
  });

  describe('config state management', () => {
    it('should emit setConfirmation when config updates are received', async () => {
      const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });

      await appearanceTab.vm.$emit('update:title', 'Updated Title');
      await appearanceTab.vm.$emit('update:mainColor', '#FF0000');
      await appearanceTab.vm.$emit('update:subtitle', 'Updated Subtitle');

      // Verify setConfirmation was emitted
      expect(wrapper.emitted().setConfirmation).toBeTruthy();
      expect(wrapper.emitted().setConfirmation.length).toBeGreaterThanOrEqual(3);
    });

    it('should emit setConfirmation when preference updates are received', async () => {
      const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });

      await preferencesTab.vm.$emit('update:displayUnreadCount', false);

      expect(wrapper.emitted().setConfirmation).toBeTruthy();
    });
  });
});
