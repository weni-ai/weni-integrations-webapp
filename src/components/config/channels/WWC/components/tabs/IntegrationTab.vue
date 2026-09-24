<template>
  <div class="integration-tab">
    <h3 class="integration-tab__title">
      {{ $t('weniWebChat.config.script') }}
    </h3>

    <UnnnicDisclaimer
      v-if="!scriptCode"
      class="integration-tab__disclaimer"
      :title="$t('weniWebChat.config.script_disclaimer')"
      type="informational"
    />

    <UnnnicTextArea
      :class="[
        'integration-tab__textarea',
        { 'integration-tab__textarea--filled': !!scriptCode },
      ]"
      :modelValue="scriptCode"
      :label="$t('weniWebChat.config.script_tutorial')"
      :disabled="!scriptCode"
      resize="none"
    />

    <UnnnicButton
      class="integration-tab__copy-button"
      type="secondary"
      size="large"
      iconLeft="content_copy"
      :text="$t('weniWebChat.config.copy_code')"
      :disabled="!scriptCode"
      @click="copyCode"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { unnnicToastManager } from '@weni/unnnic-system';
import { generateScriptCode } from '../../constants';

const { t } = useI18n();

const props = defineProps({
  appConfig: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
});

// Computed
const scriptCode = computed(() => generateScriptCode(props.appConfig));

// Methods
async function copyCode() {
  if (!scriptCode.value) return;

  await navigator.clipboard.writeText(scriptCode.value);
  unnnicToastManager.info(t('weniWebChat.config.code_copied'));
}
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
}
</style>
