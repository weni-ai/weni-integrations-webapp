<template>
  <div class="form-tab-content-body" @click="$refs.bodyText.focus()">
    <unnnic-tag
      class="form-tab-content-body__tag"
      type="default"
      :text="$t('WhatsApp.templates.form_field.body_text')"
      scheme="neutral-darkest"
    />

    <div
      ref="bodyText"
      :key="bodyKey"
      class="form-tab-content-body__input"
      :contenteditable="!disableInputs"
      v-html="bodyContent"
      @keypress="checkContentLength"
      @paste="checkPasteLength"
      @input="onInput"
    />
    <InputEditor
      class="form-tab-content-body__input__actions"
      :formatter="false"
      @format-event="handleFormatEvent"
      @add-variable="addVariable"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import InputEditor from '@/components/whatsAppTemplates/InputEditor';

  import { countVariables } from '@/utils/countTemplateVariables.js';

  export default {
    name: 'FormTabContentBody',
    components: {
      InputEditor,
    },
    props: {
      disableInputs: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        bodyKey: 0,
      };
    },
    created() {
      this.initialContent = this.templateTranslationCurrentForm?.body || '';
    },
    computed: {
      ...mapGetters('WhatsApp', ['templateTranslationCurrentForm']),
      bodyContent() {
        return this.templateTranslationCurrentForm?.body || '';
      },
    },
    methods: {
      /* istanbul ignore next */
      handleFormatEvent(event, sValue = null) {
        if (this.disableInputs) {
          return;
        }

        this.$refs.bodyText.focus();
        document.execCommand(event, false, sValue);
        this.$refs.bodyText.focus();
      },
      addVariable() {
        if (this.disableInputs) {
          return;
        }

        const variableCount = countVariables(this.templateTranslationCurrentForm?.body);

        let body = '';
        if (this.templateTranslationCurrentForm?.body) {
          body = this.templateTranslationCurrentForm.body.trim();
        }
        const fieldValue = (body + ` {{${variableCount + 1}}}`).trim();

        if (fieldValue.length >= 1024) {
          return;
        }

        this.$refs.bodyText.textContent = fieldValue;

        this.$emit('input-change', {
          fieldName: 'body',
          fieldValue,
        });
      },
      /* istanbul ignore next */
      onInput(event) {
        if (this.disableInputs) {
          return;
        }
        this.$emit('input-change', {
          fieldName: 'body',
          fieldValue: event.srcElement.textContent,
          preventRerender: true,
        });
        this.$emit('manual-preview-update');
      },
      /* istanbul ignore next */
      checkContentLength(event) {
        if (event.srcElement.textContent.length < 1024) {
          return true;
        } else {
          event.preventDefault();
        }
      },
      /* istanbul ignore next */
      checkPasteLength(event) {
        const pasteData = event.clipboardData.getData('text/plain');
        const bodyLength = this.templateTranslationCurrentForm.body?.length || 0;
        if (bodyLength + pasteData.length >= 1024) {
          event.preventDefault();
          return false;
        } else {
          event.preventDefault();
          document.execCommand('insertText', false, pasteData);
        }
      },
      forceUpdateBody() {
        this.bodyKey += 1;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-tab-content-body {
    display: flex;
    flex-direction: column;

    &__tag {
      width: fit-content;
      margin-bottom: $unnnic-spacing-stack-sm;
    }

    &__input {
      height: 6.5rem;
      box-sizing: border-box;
      overflow: auto;
      background-color: $unnnic-color-neutral-snow;
      border-radius: $unnnic-border-radius-sm;
      padding: $unnnic-spacing-inset-nano;
      border: $unnnic-border-width-thinner solid $unnnic-color-neutral-clean;
      outline: none;
      color: $unnnic-color-neutral-cloudy;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-regular;
      cursor: text;
      outline: none;
      white-space: pre-wrap;

      &__actions {
        margin-left: auto;
      }
    }
  }
</style>
