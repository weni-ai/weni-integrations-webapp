import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import unnnic from '@weni/unnnic-system';
import { app_type } from '@/stores/modules/appType/appType.store';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

vi.mock('@/utils/files', () => ({
  dataUrlToFile: vi.fn().mockResolvedValue(null),
  toBase64: vi.fn().mockResolvedValue(null),
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
  };

  beforeEach(() => {
    pinia = createTestingPinia({ stubActions: false });
    setActivePinia(pinia);

    store = app_type();
    store.currentApp = { config: { title: 'App Teste' } };
    store.loadingUpdateAppConfig = false;
    store.loadingCurrentApp = false;

    wrapper = shallowMount(wwcConfig, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        stubs: {
          'unnnic-tab': {
            template:
              '<div><slot name="tab-panel-appearance" /><slot name="tab-panel-preferences" /><slot name="tab-panel-integration" /></div>',
          },
          'unnnic-button': true,
          'unnnic-icon-svg': true,
          WwcSimulator: true,
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
          config: defaultAppConfig,
        },
      },
    });
  });

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

  it('should emit closeModal when close button is clicked', async () => {
    const closeButton = wrapper.find('.app-config-wwc__header__close unnnic-button-stub');
    await closeButton.trigger('click');
    expect(wrapper.emitted().closeModal).toBeTruthy();
  });

  it('should emit setConfirmation when AppearanceTab emits update:title', async () => {
    const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
    await appearanceTab.vm.$emit('update:title', 'New Title');
    expect(wrapper.emitted().setConfirmation).toBeTruthy();
    expect(wrapper.emitted().setConfirmation[0]).toEqual([true]);
  });

  it('should have simulator switch button', () => {
    expect(wrapper.find('.app-config-wwc__simulator-switch').exists()).toBe(true);
  });

  it('should pass correct initialTitle to AppearanceTab', () => {
    const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
    expect(appearanceTab.props('initialTitle')).toBe('Test Title');
  });

  it('should pass correct initialMainColor to AppearanceTab', () => {
    const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });
    expect(appearanceTab.props('initialMainColor')).toBe('#009E96');
  });

  it('should pass correct initialDisplayUnreadCount to PreferencesTab', () => {
    const preferencesTab = wrapper.findComponent({ name: 'PreferencesTab' });
    expect(preferencesTab.props('initialDisplayUnreadCount')).toBe(true);
  });

  it('should pass appConfig to IntegrationTab', () => {
    const integrationTab = wrapper.findComponent({ name: 'IntegrationTab' });
    expect(integrationTab.props('appConfig')).toEqual(defaultAppConfig);
  });

  it('should not throw error when save is triggered with valid title', async () => {
    const appearanceTab = wrapper.findComponent({ name: 'AppearanceTab' });

    // Should not throw when saving with valid title
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
