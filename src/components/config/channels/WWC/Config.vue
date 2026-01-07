<template>
  <div class="app-config-wwc">
    <div class="app-config-wwc__header">
      <div class="app-config-wwc__header__title-container">
        <h1 class="app-config-wwc__header__title">{{ selectedApp.name }}</h1>
        <p class="app-config-wwc__header__description">
          {{ $t('weniWebChat.config.description') }}
        </p>
      </div>
      <div class="app-config-wwc__header__close">
        <unnnic-button
          size="small"
          iconCenter="arrow_forward"
          type="tertiary"
          class="app-config-wwc__header__close__button"
          @click="closeConfig"
        />
      </div>
    </div>

    <div class="app-config-wwc__content">
      <unnnic-tab class="app-config-wwc__tabs" :tabs="configTabs" initialTab="appearance">
        <template #tab-head-appearance> {{ $t('weniWebChat.config.appearance') }} </template>
        <template #tab-panel-appearance>
          <AppearanceTab
            :initialTitle="config.title"
            :initialSubtitle="config.subtitle"
            :initialInitPayload="config.initPayload"
            :initialTooltipMessage="config.tooltipMessage"
            :initialInputTextFieldHint="config.inputTextFieldHint"
            :initialMainColor="config.mainColor"
            :initialAvatarFile="config.avatarFile"
            :initialAvatarBase64="config.avatarBase64"
            :initialCssFile="config.customCssFile"
            :initialCustomCss="config.customCss"
            :loading="loadingSave"
            @update:title="updateConfig('title', $event)"
            @update:subtitle="updateConfig('subtitle', $event)"
            @update:initPayload="updateConfig('initPayload', $event)"
            @update:tooltipMessage="updateConfig('tooltipMessage', $event)"
            @update:inputTextFieldHint="updateConfig('inputTextFieldHint', $event)"
            @update:mainColor="updateConfig('mainColor', $event)"
            @update:avatarFile="updateConfig('avatarFile', $event)"
            @update:avatarBase64="updateConfig('avatarBase64', $event)"
            @update:cssFile="updateConfig('customCssFile', $event)"
            @update:customCss="updateConfig('customCss', $event)"
            @save="saveConfig"
            @cancel="closeConfig"
          />
        </template>

        <template #tab-head-preferences> {{ $t('weniWebChat.config.preferences') }} </template>
        <template #tab-panel-preferences>
          <PreferencesTab
            :initialEmbedded="config.embedded"
            :initialShowFullScreenButton="config.showFullScreenButton"
            :initialStartFullScreen="config.startFullScreen"
            :initialDisplayUnreadCount="config.displayUnreadCount"
            :initialUseConnectionOptimization="config.useConnectionOptimization"
            :initialKeepHistory="config.keepHistory"
            :initialEnableContactTimeout="config.enableContactTimeout"
            :initialContactTimeout="config.contactTimeout"
            :initialTimeBetweenMessages="config.timeBetweenMessages"
            :loading="loadingSave"
            @update:embedded="updateConfig('embedded', $event)"
            @update:showFullScreenButton="updateConfig('showFullScreenButton', $event)"
            @update:startFullScreen="updateConfig('startFullScreen', $event)"
            @update:displayUnreadCount="updateConfig('displayUnreadCount', $event)"
            @update:useConnectionOptimization="updateConfig('useConnectionOptimization', $event)"
            @update:keepHistory="updateConfig('keepHistory', $event)"
            @update:enableContactTimeout="updateConfig('enableContactTimeout', $event)"
            @update:contactTimeout="updateConfig('contactTimeout', $event)"
            @update:timeBetweenMessages="updateConfig('timeBetweenMessages', $event)"
            @save="saveConfig"
            @cancel="closeConfig"
          />
        </template>

        <template #tab-head-integration> {{ $t('weniWebChat.config.script') }} </template>
        <template #tab-panel-integration>
          <IntegrationTab :appConfig="selectedApp.config" :title="config.title" />
        </template>
      </unnnic-tab>
    </div>

    <div ref="simulatorSwitchRef" class="app-config-wwc__simulator-switch" @click="toggleSimulator">
      <unnnic-icon-svg
        class="app-config-wwc__simulator-switch__icon"
        icon="view-1-1"
        size="xl"
        scheme="brand-weni-soft"
      />
    </div>

    <WwcSimulator
      ref="simulatorRef"
      :avatar="config.avatarBase64"
      :mainColor="config.mainColor"
      :title="config.title"
      :subtitle="chatSubtitle"
      :placeholder="config.inputTextFieldHint"
      :showFullScreenButton="config.showFullScreenButton"
      :displayUnreadCount="config.displayUnreadCount"
    />
  </div>
</template>

<script setup>
  import { ref, reactive, computed, watch, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';
  import unnnic from '@weni/unnnic-system';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { useEventStore } from '@/stores/event.store';
  import { dataUrlToFile, toBase64 } from '@/utils/files';
  import removeEmpty from '@/utils/clean';
  import { DEFAULT_COLOR, formatContactTimeout, parseContactTimeout } from './constants';
  import AppearanceTab from './components/tabs/AppearanceTab.vue';
  import PreferencesTab from './components/tabs/PreferencesTab.vue';
  import IntegrationTab from './components/tabs/IntegrationTab.vue';
  import WwcSimulator from './Simulator.vue';

  const { t } = useI18n();

  const props = defineProps({
    app: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['closeModal', 'setConfirmation']);

  // Store
  const appTypeStore = app_type();
  const eventStore = useEventStore();
  const {
    loadingUpdateAppConfig,
    errorUpdateAppConfig,
    currentApp,
    loadingCurrentApp,
    errorCurrentApp,
  } = storeToRefs(appTypeStore);

  // Refs
  const simulatorRef = ref(null);
  const simulatorSwitchRef = ref(null);
  const selectedApp = ref(props.app);

  // Config state
  const config = reactive({
    title: props.app.config.title || '',
    subtitle: props.app.config.subtitle || '',
    initPayload: props.app.config.initPayload || '',
    tooltipMessage: props.app.config.tooltipMessage || '',
    inputTextFieldHint: props.app.config.inputTextFieldHint || '',
    mainColor: props.app.config.mainColor || DEFAULT_COLOR,
    version: props.app.config.version || '1',
    displayUnreadCount: !!props.app.config.displayUnreadCount,
    showFullScreenButton: !!props.app.config.showFullScreenButton,
    startFullScreen: !!props.app.config?.startFullScreen,
    useConnectionOptimization: !!props.app.config?.useConnectionOptimization,
    embedded: !!props.app.config?.embedded,
    keepHistory: props.app.config.params?.storage === 'local',
    timeBetweenMessages: props.app.config.timeBetweenMessages ?? 1,
    enableContactTimeout:
      !!props.app.config.contactTimeout || props.app.config.contactTimeout === '00:00',
    contactTimeout: formatContactTimeout(props.app.config.contactTimeout) || '23:59',
    avatarFile: null,
    avatarBase64: props.app.config.profileAvatar || null,
    customCssFile: null,
    customCss: props.app.config.customCss || null,
  });

  // Computed
  const configTabs = computed(() => ['appearance', 'preferences', 'integration']);

  const chatSubtitle = computed(() => config.subtitle || ' ');

  const loadingSave = computed(() => loadingUpdateAppConfig.value || loadingCurrentApp.value);

  // Methods
  function updateConfig(key, value) {
    config[key] = value;
    emit('setConfirmation', true);
  }

  function toggleSimulator() {
    simulatorRef.value?.toggleChat();
  }

  async function imageForUpload() {
    let avatar = config.avatarFile;
    if (typeof config.avatarFile === 'string') {
      avatar = await dataUrlToFile(config.avatarFile, 'avatar');
    }
    return toBase64(avatar);
  }

  function contactTimeoutInMinutes() {
    if (!config.enableContactTimeout) return 0;
    return parseContactTimeout(config.contactTimeout);
  }

  function errorFor(key) {
    const value = config[key];
    if (key === 'title') {
      if (!(value && value.trim())) {
        return t('errors.empty_input');
      }
      if (value.length > 20) {
        return 'By default, the maximum is 20 characters.';
      }
    }
    return null;
  }

  function validConfig() {
    let valid = true;
    const keysToValidate = ['title'];

    keysToValidate.forEach((key) => {
      const error = errorFor(key);
      if (error) {
        unnnic.unnnicCallAlert({
          props: { text: error, type: 'error' },
          seconds: 3,
        });
        valid = false;
      }
    });

    return valid;
  }

  async function saveConfig() {
    if (!validConfig()) return;

    const reqData = removeEmpty({
      code: selectedApp.value.code,
      appUuid: selectedApp.value.uuid,
      payload: {
        config: {
          title: config.title,
          subtitle: config.subtitle || null,
          initPayload: config.initPayload || null,
          tooltipMessage: config.tooltipMessage || null,
          inputTextFieldHint: config.inputTextFieldHint || null,
          showFullScreenButton: config.showFullScreenButton,
          displayUnreadCount: config.displayUnreadCount,
          timeBetweenMessages: config.timeBetweenMessages,
          keepHistory: config.keepHistory,
          startFullScreen: config.startFullScreen,
          useConnectionOptimization: config.useConnectionOptimization,
          embedded: config.embedded,
          mainColor: config.mainColor,
          profileAvatar: await imageForUpload(),
          contactTimeout: contactTimeoutInMinutes(),
          customCss: config.customCss,
          version: config.version,
        },
      },
    });

    try {
      const firstSave = !selectedApp.value.config.script;
      await appTypeStore.updateAppConfig(reqData);

      if (errorUpdateAppConfig.value) {
        throw new Error(errorUpdateAppConfig.value);
      }

      await appTypeStore.getApp({ code: selectedApp.value.code, appUuid: selectedApp.value.uuid });

      if (errorCurrentApp.value) {
        throw new Error(errorCurrentApp.value);
      }

      selectedApp.value.config = currentApp.value.config;
      emit('setConfirmation', false);

      unnnic.unnnicCallAlert({
        props: {
          text: firstSave
            ? t('apps.config.first_integration_success')
            : t('apps.config.integration_success'),
          type: 'success',
        },
        seconds: firstSave ? 8 : 3,
      });
    } catch (err) {
      unnnic.unnnicCallAlert({
        props: { text: t('apps.details.status_error'), type: 'error' },
        seconds: 3,
      });
    } finally {
      eventStore.emit('updateGrid');
    }
  }

  function closeConfig() {
    emit('closeModal');
  }

  // Initialize files on mount
  onMounted(async () => {
    if (selectedApp.value.config.profileAvatar) {
      config.avatarFile = await dataUrlToFile(selectedApp.value.config.profileAvatar, 'avatar.png');
      setTimeout(() => emit('setConfirmation', false), 250);
    }

    if (selectedApp.value.config.customCss) {
      const file = await dataUrlToFile(selectedApp.value.config.customCss, 'style.css');
      if (file) {
        config.customCssFile = file;
        setTimeout(() => emit('setConfirmation', false), 250);
      }
    }
  });

  // Watch displayUnreadCount to close simulator when enabled
  watch(
    () => config.displayUnreadCount,
    (newValue) => {
      if (newValue && simulatorRef.value?.isOpen) {
        simulatorRef.value.toggleChat();
      }
    },
  );
</script>

<style lang="scss" scoped>
  .app-config-wwc {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__content {
      overflow: auto;
      display: flex;
      flex-direction: column;
      flex: 1;
      color: $unnnic-color-neutral-cloudy;
      font-size: $unnnic-font-size-body-gt;
      line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
      padding: 0 $unnnic-space-6;
    }

    &__header {
      display: flex;
      margin: $unnnic-spacing-inset-lg;
      margin-bottom: $unnnic-spacing-stack-sm;

      &__title-container {
        display: flex;
        flex-direction: column;
        gap: $unnnic-space-1;
      }

      &__title {
        font: $unnnic-font-display-2;
        color: $unnnic-color-fg-emphasized;
        margin: 0;
      }

      &__description {
        font: $unnnic-font-body;
        color: $unnnic-color-fg-base;
        margin: 0;
      }

      &__close {
        margin-left: auto;
      }
    }

    &__tabs {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: hidden;
      width: 100%;

      :deep(.tab-body) {
        display: flex;
        height: 100%;
        overflow-y: auto;
      }

      :deep(.tab-panel) {
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 100%;

        > div {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
      }
    }

    &__simulator-switch {
      cursor: pointer;
      position: fixed;
      z-index: 2;
      bottom: 50%;
      right: calc(50% - 25px);
      background-color: $unnnic-color-neutral-snow;
      border-radius: $unnnic-border-radius-pill;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: $unnnic-shadow-level-near;
      transition: all 0.5s;

      &:hover {
        background-color: $unnnic-color-neutral-lightest;
      }
    }

    .wwc-simulator {
      position: fixed;
      z-index: 1;
      bottom: 0;
      right: 50%;
      max-width: 293px;
      height: auto;
      margin-right: $unnnic-spacing-inline-sm;
      margin-bottom: $unnnic-spacing-stack-md;
    }
  }
</style>

<style lang="scss">
  .unnnic-upload-area__dropzone {
    cursor: pointer;
  }
</style>
