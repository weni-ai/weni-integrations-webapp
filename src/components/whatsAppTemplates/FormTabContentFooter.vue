<template>
  <div class="form-tab-content-footer">
    <unnnic-tag
      class="form-tab-content-footer__tag"
      type="default"
      :text="$t('WhatsApp.templates.form_field.footer_text')"
      scheme="neutral-darkest"
    />

    <unnnic-text-area
      class="form-tab-content-footer__input"
      :disabled="disableInputs"
      :maxLength="60"
      :value="templateTranslationCurrentForm.footer || ''"
      @input="$emit('input-change', { fieldName: 'footer', fieldValue: $event })"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'FormTabContentFooter',
    props: {
      disableInputs: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapGetters('WhatsApp', ['templateTranslationCurrentForm']),
    },
  };
</script>

<style lang="scss" scoped>
  .form-tab-content-footer {
    display: flex;
    flex-direction: column;

    &__tag {
      width: fit-content;
      margin-bottom: $unnnic-spacing-stack-sm;
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
