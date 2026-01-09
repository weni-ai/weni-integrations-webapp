<template>
  <div class="preferences-tab">
    <div class="preferences-tab__scroll">
      <div class="preferences-tab__switches">
        <section class="preferences-tab__section">
          <h3 class="preferences-tab__section-title">
            {{ $t('weniWebChat.config.behavior') }}
          </h3>

          <unnnic-switch
            v-model="embedded"
            :inititalState="false"
            size="small"
            :textRight="$t('weniWebChat.config.embedded_mode')"
          />

          <unnnic-switch
            v-model="showFullScreenButton"
            :inititalState="false"
            size="small"
            :textRight="$t('weniWebChat.config.show_fullscreen_button')"
            :disabled="embedded"
          />

          <unnnic-switch
            v-model="startFullScreen"
            :inititalState="false"
            size="small"
            :textRight="$t('weniWebChat.config.start_with_fullscreen')"
            :disabled="embedded"
          />

          <unnnic-switch
            v-if="version === '2'"
            v-model="showVoiceRecordingButton"
            :inititalState="false"
            size="small"
            :textRight="$t('weniWebChat.config.show_voice_recording_button')"
          />

          <unnnic-switch
            v-if="version === '2'"
            v-model="showCameraButton"
            :inititalState="false"
            size="small"
            :textRight="$t('weniWebChat.config.show_camera_button')"
          />

          <unnnic-switch
            v-model="displayUnreadCount"
            :inititalState="false"
            size="small"
            :textRight="$t('weniWebChat.config.unread_messages_indicator')"
          />

          <unnnic-switch
            v-model="useConnectionOptimization"
            :inititalState="false"
            size="small"
            :textRight="$t('weniWebChat.config.use_connection_optimization')"
          />
        </section>

        <section class="preferences-tab__section">
          <h3 class="preferences-tab__section-title">
            {{ $t('weniWebChat.config.history') }}
          </h3>

          <unnnic-switch
            v-model="keepHistory"
            :inititalState="false"
            size="small"
            :textRight="$t('weniWebChat.config.keep_chat_history')"
          />

          <div class="preferences-tab__contact-timeout">
            <div class="preferences-tab__contact-timeout-header">
              <unnnic-switch
                v-model="enableContactTimeout"
                :inititalState="false"
                size="small"
                :textRight="$t('weniWebChat.config.contactTimeoutInput.label')"
              />
              <unnnic-toolTip
                class="preferences-tab__contact-timeout-tooltip"
                :text="$t('weniWebChat.config.contactTimeoutToolTip')"
                :enabled="true"
                side="top"
              >
                <unnnic-icon-svg
                  class="preferences-tab__contact-timeout-icon"
                  icon="help"
                  size="sm"
                  scheme="neutral-cloudy"
                />
              </unnnic-toolTip>
            </div>

            <transition name="fade">
              <unnnic-input
                v-show="enableContactTimeout"
                v-model="contactTimeout"
                class="preferences-tab__contact-timeout-input"
                mask="##:##"
                :type="contactTimeoutError ? 'error' : 'normal'"
                :message="
                  contactTimeoutError ? $t('weniWebChat.config.contactTimeoutInvalidTime') : ''
                "
              />
            </transition>
          </div>

          <unnnic-form-element
            :label="$t('weniWebChat.config.time_between_messages')"
            :message="$t('weniWebChat.config.time_between_messages_message')"
          >
            <unnnic-select-smart
              :modelValue="timeBetweenMessagesValue"
              :options="timeBetweenMessagesOptions"
              :placeholder="$t('weniWebChat.config.time_between_messages_placeholder')"
              @update:modelValue="handleTimeBetweenMessagesChange"
            />
          </unnnic-form-element>
        </section>
      </div>
    </div>

    <div class="preferences-tab__buttons">
      <unnnic-button
        type="tertiary"
        size="large"
        :text="$t('general.Cancel')"
        @click="emit('cancel')"
      />
      <unnnic-button
        type="primary"
        size="large"
        :text="$t('apps.config.save_changes')"
        :disabled="contactTimeoutError || loading"
        :loading="loading"
        @click="emit('save')"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { isInvalidTime } from '../../constants';

  const { t } = useI18n();

  const props = defineProps({
    version: { type: String, default: '1' },
    initialEmbedded: { type: Boolean, default: false },
    initialShowFullScreenButton: { type: Boolean, default: false },
    initialStartFullScreen: { type: Boolean, default: false },
    initialShowVoiceRecordingButton: { type: Boolean, default: false },
    initialShowCameraButton: { type: Boolean, default: false },
    initialDisplayUnreadCount: { type: Boolean, default: false },
    initialUseConnectionOptimization: { type: Boolean, default: false },
    initialKeepHistory: { type: Boolean, default: false },
    initialEnableContactTimeout: { type: Boolean, default: false },
    initialContactTimeout: { type: String, default: '23:59' },
    initialTimeBetweenMessages: { type: Number, default: 1 },
    loading: { type: Boolean, default: false },
  });

  const emit = defineEmits([
    'update:embedded',
    'update:showFullScreenButton',
    'update:startFullScreen',
    'update:showVoiceRecordingButton',
    'update:showCameraButton',
    'update:displayUnreadCount',
    'update:useConnectionOptimization',
    'update:keepHistory',
    'update:enableContactTimeout',
    'update:contactTimeout',
    'update:timeBetweenMessages',
    'save',
    'cancel',
  ]);

  // Refs
  const embedded = ref(props.initialEmbedded);
  const showFullScreenButton = ref(props.initialShowFullScreenButton);
  const startFullScreen = ref(props.initialStartFullScreen);
  const showVoiceRecordingButton = ref(props.initialShowVoiceRecordingButton);
  const showCameraButton = ref(props.initialShowCameraButton);
  const displayUnreadCount = ref(props.initialDisplayUnreadCount);
  const useConnectionOptimization = ref(props.initialUseConnectionOptimization);
  const keepHistory = ref(props.initialKeepHistory);
  const enableContactTimeout = ref(props.initialEnableContactTimeout);
  const contactTimeout = ref(props.initialContactTimeout);
  const timeBetweenMessages = ref(props.initialTimeBetweenMessages);

  // Computed
  const timeBetweenMessagesOptions = computed(() => [
    { label: t('weniWebChat.config.time_between_messages_option', { count: 1 }), value: '1' },
    { label: t('weniWebChat.config.time_between_messages_option', { count: 2 }), value: '2' },
    { label: t('weniWebChat.config.time_between_messages_option', { count: 3 }), value: '3' },
    { label: t('weniWebChat.config.time_between_messages_option', { count: 4 }), value: '4' },
  ]);

  const timeBetweenMessagesValue = computed(() => {
    const option = timeBetweenMessagesOptions.value.find(
      (opt) => parseInt(opt.value) === timeBetweenMessages.value,
    );
    return option ? [option] : [];
  });

  const contactTimeoutError = computed(() => {
    if (!enableContactTimeout.value) return false;
    return isInvalidTime(contactTimeout.value);
  });

  // Methods
  function handleTimeBetweenMessagesChange(value) {
    timeBetweenMessages.value = parseInt(value[0]?.value) || 1;
  }

  // Watchers
  watch(embedded, (value) => {
    emit('update:embedded', value);
    if (value) {
      startFullScreen.value = false;
      showFullScreenButton.value = false;
    }
  });

  watch(showFullScreenButton, (value) => emit('update:showFullScreenButton', value));
  watch(startFullScreen, (value) => emit('update:startFullScreen', value));
  watch(showVoiceRecordingButton, (value) => emit('update:showVoiceRecordingButton', value));
  watch(showCameraButton, (value) => emit('update:showCameraButton', value));
  watch(displayUnreadCount, (value) => emit('update:displayUnreadCount', value));
  watch(useConnectionOptimization, (value) => emit('update:useConnectionOptimization', value));
  watch(keepHistory, (value) => emit('update:keepHistory', value));

  watch(enableContactTimeout, (value) => {
    emit('update:enableContactTimeout', value);
    if (!value) {
      contactTimeout.value = '00:00';
    } else if (contactTimeout.value === '00:00') {
      contactTimeout.value = '23:59';
    }
  });

  watch(contactTimeout, (value) => emit('update:contactTimeout', value));
  watch(timeBetweenMessages, (value) => emit('update:timeBetweenMessages', value));
</script>

<style lang="scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .preferences-tab {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__scroll {
      display: flex;
      flex-direction: column;
      overflow: auto;
      scrollbar-gutter: stable;
      padding-bottom: $unnnic-space-6;
      flex: 1;
    }

    &__switches {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-4;
    }

    &__section {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-3;
    }

    &__section-title {
      font: $unnnic-font-display-3;
      margin: 0;
      margin-bottom: $unnnic-space-1;
      color: $unnnic-color-fg-emphasized;
    }

    &__contact-timeout {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-stack-xs;
    }

    &__contact-timeout-header {
      display: flex;
      align-items: center;
    }

    &__contact-timeout-icon {
      margin-left: $unnnic-space-1;
    }

    &__buttons {
      display: flex;
      gap: $unnnic-space-3;
      justify-content: center;
      padding: $unnnic-space-6 0;
      margin-top: auto;

      :deep(.unnnic-button) {
        width: 100% !important;
      }
    }
  }
</style>
