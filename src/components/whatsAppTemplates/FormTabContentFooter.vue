<template>
  <div class="form-tab-content-footer">
    <span class="form-tab-content-footer__title">
      {{ $t('WhatsApp.templates.form_field.footer_text') }}
    </span>

    <unnnic-text-area
      class="form-tab-content-footer__input"
      :disabled="disableInputs"
      :maxLength="60"
      :modelValue="textInput"
      @update:modelValue="$emit('input-change', { fieldName: 'footer', fieldValue: $event })"
      :placeholder="$t('WhatsApp.templates.form_field.footer_text_placeholder')"
    />
  </div>
</template>

<script>
  import { mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';

  export default {
    name: 'FormTabContentFooter',
    props: {
      disableInputs: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapState(whatsapp_store, ['templateTranslationCurrentForm']),
      textInput() {
        return this.templateTranslationCurrentForm.footer || '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-tab-content-footer {
    display: flex;
    flex-direction: column;

    &__title {
      margin-bottom: $unnnic-spacing-stack-sm;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-bold;

      color: $unnnic-color-neutral-darkest;
    }

    &__input {
      ::v-deep textarea {
        resize: none;
      }

      ::v-deep .helper {
        margin-top: $unnnic-spacing-stack-xs;
      }
    }
  }
</style>
