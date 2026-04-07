<template>
  <div class="integration-tab">
    <h3 class="integration-tab__title">
      {{ $t('weniWebChat.config.script') }}
    </h3>

    <unnnic-disclaimer
      v-if="!scriptCode"
      class="integration-tab__disclaimer"
      :title="$t('weniWebChat.config.script_disclaimer')"
      type="informational"
    />

    <unnnic-text-area
      :class="['integration-tab__textarea', { 'integration-tab__textarea--filled': !!scriptCode }]"
      :modelValue="scriptCode"
      :label="$t('weniWebChat.config.script_tutorial')"
      :disabled="!scriptCode"
      resize="none"
    />

    <unnnic-button
      class="integration-tab__copy-button"
      type="secondary"
      size="large"
      iconCenter="download"
      :text="$t('weniWebChat.config.download_script')"
      :disabled="!scriptCode"
      @click="downloadScript"
    />

    <section class="integration-tab__voice-mode-section">
      <h3 class="integration-tab__voice-mode-title">
        {{ $t('weniWebChat.config.voice_mode.title') }}
      </h3>

      <unnnic-switch
        v-model="voiceModeEnabled"
        size="small"
        :textRight="$t('weniWebChat.config.voice_mode.enabled')"
      />

      <section class="integration-tab__voice-mode-fields">
        <unnnic-input
          class="integration-tab__voice-mode-field"
          v-model="elevenLabsVoiceId"
          :label="$t('weniWebChat.config.voice_mode.elevenLabsVoiceId.label')"
          :placeholder="$t('weniWebChat.config.voice_mode.elevenLabsVoiceId.placeholder')"
          :disabled="!voiceModeEnabled"
        />
        <unnnic-input
          class="integration-tab__voice-mode-field"
          v-model="elevenLabsApiKey"
          :label="$t('weniWebChat.config.voice_mode.elevenLabsApiKey.label')"
          :placeholder="$t('weniWebChat.config.voice_mode.elevenLabsApiKey.placeholder')"
          :disabled="!voiceModeEnabled"
        />
      </section>
    </section>

    <div class="integration-tab__buttons">
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
        :loading="loading"
        @click="emit('save')"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { generateScriptCode } from '../../constants';

  const props = defineProps({
    appConfig: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits([
    'update:voiceModeEnabled',
    'update:elevenLabsVoiceId',
    'update:elevenLabsApiKey',
  ]);

  // Computed
  const scriptCode = computed(() => generateScriptCode(props.appConfig));
  const voiceModeEnabled = ref(!!props.appConfig.voiceMode?.enabled);
  const elevenLabsVoiceId = ref(props.appConfig.voiceMode?.elevenLabs?.voiceId);
  const elevenLabsApiKey = ref(props.appConfig.voiceMode?.elevenLabs?.apiKey);

  // Methods
  function downloadScript() {
    const htmlScript = `<!DOCTYPE html>\n<head>\n\t<meta charset="UTF-8">\n</head>\n<body>\n\t${scriptCode.value}\n</body>\n</html>`;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8, ' + encodeURIComponent(htmlScript),
    );
    element.setAttribute('download', `wwc-script-${props.title}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // Watch
  watch(voiceModeEnabled, (newValue) => {
    emit('update:voiceModeEnabled', newValue);
  });
  watch(elevenLabsVoiceId, (newValue) => {
    emit('update:elevenLabsVoiceId', newValue);
  });
  watch(elevenLabsApiKey, (newValue) => {
    emit('update:elevenLabsApiKey', newValue);
  });
</script>

<style lang="scss" scoped>
  .integration-tab {
    display: flex;
    flex-direction: column;
    gap: $unnnic-inline-xs;

    &__title {
      font: $unnnic-font-display-3;
      margin: 0;
      margin-bottom: $unnnic-space-1;
      color: $unnnic-color-fg-emphasized;
    }

    &__textarea {
      &--filled {
        :deep(.unnnic-text-area__textarea) {
          height: 362px;
        }
      }
    }

    &__copy-button {
      width: 100% !important;
    }

    &__voice-mode-title {
      font: $unnnic-font-display-3;
      margin: 0;
      color: $unnnic-color-fg-emphasized;
    }

    &__voice-mode-section {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-3;
    }

    &__voice-mode-fields {
      display: flex;
      flex-direction: row;
      gap: $unnnic-space-3;
    }

    &__voice-mode-field {
      width: 100%;
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
