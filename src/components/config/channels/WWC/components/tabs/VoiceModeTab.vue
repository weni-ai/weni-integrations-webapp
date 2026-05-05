<template>
  <div class="voice-mode-tab">
    <unnnic-switch
      v-model="voiceModeEnabled"
      size="small"
      :textRight="$t('weniWebChat.config.voice_mode.enabled')"
    />

    <div class="voice-mode-tab__token">
      <unnnic-input
        nativeType="password"
        v-model="elevenLabsApiKey"
        :label="$t('weniWebChat.config.voice_mode.elevenLabsApiKey.label')"
        :placeholder="$t('weniWebChat.config.voice_mode.elevenLabsApiKey.placeholder')"
        :disabled="!voiceModeEnabled"
      />

      <p class="voice-mode-tab__token-hint">
        {{ $t('weniWebChat.config.voice_mode.no_key_text') }}
        <a
          href="https://elevenlabs.io/app/settings/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          >{{ $t('weniWebChat.config.voice_mode.get_token_here') }}</a
        >
      </p>
    </div>

    <section class="voice-mode-tab__voice-selection">
      <p class="voice-mode-tab__voice-selection-label">
        {{ $t('weniWebChat.config.voice_mode.select_voice') }}
      </p>

      <div class="voice-mode-tab__voice-list">
        <label
          v-for="voice in PREDEFINED_VOICES"
          :key="voice.id"
          class="voice-mode-tab__voice-row"
          :class="{ 'voice-mode-tab__voice-row--disabled': !voiceModeEnabled }"
        >
          <unnnic-radio
            v-model="selectedVoiceId"
            :disabled="!voiceModeEnabled"
            :options="PREDEFINED_VOICES"
            :value="voice.id"
          >
            <section
              class="voice-mode-tab__voice-row-content"
              :class="{ 'voice-mode-tab__voice-row-content--disabled': !voiceModeEnabled }"
            >
              <span>{{ voice.name }}</span>

              <span class="voice-mode-tab__voice-category">
                ({{ $t(`weniWebChat.config.voice_mode.voice_category.${voice.categoryKey}`) }})
              </span>
            </section>
          </unnnic-radio>

          <unnnic-button
            class="voice-mode-tab__play-button"
            type="secondary"
            size="small"
            :iconCenter="playingVoiceId === voice.id ? 'pause' : 'play_arrow'"
            iconsFilled
            :loading="loadingVoiceId === voice.id"
            :disabled="!voiceModeEnabled"
            @click.stop.prevent="playVoice(voice.id)"
          />
        </label>

        <label
          class="voice-mode-tab__voice-row voice-mode-tab__voice-row--other"
          :class="{ 'voice-mode-tab__voice-row--disabled': !voiceModeEnabled }"
        >
          <unnnic-radio
            v-model="selectedVoiceId"
            :disabled="!voiceModeEnabled"
            :options="PREDEFINED_VOICES"
            value="other"
          >
            <section
              class="voice-mode-tab__voice-row-content"
              :class="{ 'voice-mode-tab__voice-row-content--disabled': !voiceModeEnabled }"
            >
              <span>{{ $t('weniWebChat.config.voice_mode.other_voice') }}</span>
            </section>
          </unnnic-radio>

          <unnnic-input
            class="voice-mode-tab__custom-voice-id"
            v-model="customVoiceId"
            :placeholder="$t('weniWebChat.config.voice_mode.other_voice_placeholder')"
            :disabled="!voiceModeEnabled || selectedVoiceId !== 'other'"
            @click.stop
          />
        </label>
      </div>
    </section>

    <div class="voice-mode-tab__buttons">
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
  import { ref, computed, watch, onUnmounted } from 'vue';

  const VOICE_PREVIEW_BASE_URL = 'https://cdn.cloud.weni.ai/evenlabs/voices';

  const PREDEFINED_VOICES = [
    {
      id: 'GOkMqfyKMLVUcYfO2WbB',
      name: 'Jenifer',
      categoryKey: 'default_portuguese',
      previewUrl: `${VOICE_PREVIEW_BASE_URL}/GOkMqfyKMLVUcYfO2WbB.mp3`,
    },
    {
      id: '1eBtZhneFpMPiYsjVTGl',
      name: 'Eduardo',
      categoryKey: 'portuguese',
      previewUrl: `${VOICE_PREVIEW_BASE_URL}/1eBtZhneFpMPiYsjVTGl.mp3`,
    },
    {
      id: 'cNYrMw9glwJZXR8RwbuR',
      name: 'Belle',
      categoryKey: 'english',
      previewUrl: `${VOICE_PREVIEW_BASE_URL}/cNYrMw9glwJZXR8RwbuR.mp3`,
    },
    {
      id: 'AwmgI32PB22lsT7wnBFH',
      name: 'Liz',
      categoryKey: 'spanish',
      previewUrl: `${VOICE_PREVIEW_BASE_URL}/AwmgI32PB22lsT7wnBFH.mp3`,
    },
    {
      id: 'YExhVa4bZONzeingloMX',
      name: 'Juan',
      categoryKey: 'spanish',
      previewUrl: `${VOICE_PREVIEW_BASE_URL}/YExhVa4bZONzeingloMX.mp3`,
    },
  ];

  const PREDEFINED_VOICE_IDS = PREDEFINED_VOICES.map((v) => v.id);

  const props = defineProps({
    initialVoiceModeEnabled: {
      type: Boolean,
      default: false,
    },
    initialElevenLabsVoiceId: {
      type: String,
      default: null,
    },
    initialElevenLabsApiKey: {
      type: String,
      default: null,
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
    'save',
    'cancel',
  ]);

  const voiceModeEnabled = ref(props.initialVoiceModeEnabled);
  const elevenLabsApiKey = ref(props.initialElevenLabsApiKey);

  const isKnownVoice =
    props.initialElevenLabsVoiceId && PREDEFINED_VOICE_IDS.includes(props.initialElevenLabsVoiceId);

  const selectedVoiceId = ref(
    isKnownVoice
      ? props.initialElevenLabsVoiceId
      : props.initialElevenLabsVoiceId
        ? 'other'
        : PREDEFINED_VOICES[0].id,
  );
  const customVoiceId = ref(isKnownVoice ? null : props.initialElevenLabsVoiceId);

  const computedVoiceId = computed(() =>
    selectedVoiceId.value === 'other' ? customVoiceId.value : selectedVoiceId.value,
  );

  const playingVoiceId = ref(null);
  const loadingVoiceId = ref(null);
  let currentAudio = null;

  function stopCurrentAudio() {
    if (currentAudio) {
      const audio = currentAudio;
      currentAudio = null;
      audio.pause();
      audio.currentTime = 0;
    }
    playingVoiceId.value = null;
    loadingVoiceId.value = null;
  }

  function playVoice(voiceId) {
    if (playingVoiceId.value === voiceId || loadingVoiceId.value === voiceId) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();

    const voice = PREDEFINED_VOICES.find((v) => v.id === voiceId);
    if (!voice) return;

    const audio = new Audio(voice.previewUrl);
    currentAudio = audio;
    loadingVoiceId.value = voiceId;

    audio.addEventListener('canplay', () => {
      if (currentAudio !== audio) return;
      loadingVoiceId.value = null;
      playingVoiceId.value = voiceId;
    });
    audio.addEventListener('ended', () => {
      if (currentAudio !== audio) return;
      playingVoiceId.value = null;
      loadingVoiceId.value = null;
      currentAudio = null;
    });
    audio.play().catch(() => {});
  }

  onUnmounted(stopCurrentAudio);

  watch(voiceModeEnabled, (val) => emit('update:voiceModeEnabled', val));
  watch(elevenLabsApiKey, (val) => emit('update:elevenLabsApiKey', val));
  watch(computedVoiceId, (val) => emit('update:elevenLabsVoiceId', val));
</script>

<style lang="scss" scoped>
  .voice-mode-tab {
    display: flex;
    flex-direction: column;
    gap: $unnnic-space-4;

    &__token {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-1;
    }

    &__token-hint {
      margin: 0;
      font: $unnnic-font-caption-2;

      a {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
    }

    &__voice-selection {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-3;
    }

    &__voice-selection-label {
      margin: 0;
      font: $unnnic-font-body;
    }

    &__voice-list {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-1;
    }

    &__voice-row {
      display: flex;
      align-items: center;
      gap: $unnnic-space-2;
      padding: $unnnic-space-2;
      cursor: pointer;
      border-radius: $unnnic-border-radius-md;
      border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

      &--disabled {
        cursor: not-allowed;
      }
    }

    &__voice-row-content {
      display: flex;
      align-items: center;
      gap: $unnnic-space-2;
      font: $unnnic-font-body;
      color: $unnnic-color-fg-base;

      &--disabled {
        color: $unnnic-color-fg-muted;
      }
    }

    &__voice-category {
      color: $unnnic-color-fg-muted;
    }

    &__voice-name {
      color: $unnnic-color-fg-emphasized;
    }

    &__play-button {
      margin-left: auto;
    }

    &__custom-voice-id {
      flex: 1;
      width: 100%;

      :deep(.unnnic-input__container) {
        margin-bottom: 0;
      }
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
