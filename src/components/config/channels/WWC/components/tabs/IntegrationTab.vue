<template>
  <div class="integration-tab">
    <h3 class="integration-tab__title">
      {{ $t('weniWebChat.config.script') }}
    </h3>

    <unnnic-disclaimer
      v-if="!scriptCode"
      class="integration-tab__disclaimer"
      :text="$t('weniWebChat.config.script_disclaimer')"
      icon="alert-circle-1"
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
      iconCenter="file_copy"
      :text="$t('weniWebChat.config.copy_code')"
      :disabled="!scriptCode"
      @click="copyScript"
    />
  </div>
</template>

<script setup>
  import { computed } from 'vue';
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
  });

  // Computed
  const scriptCode = computed(() => generateScriptCode(props.appConfig));

  // Methods
  function copyScript() {
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
