<template>
  <div class="form-tab-content-body">
    <span class="form-tab-content-body__title">
      {{ $t('WhatsApp.templates.form_field.body_text') }}
    </span>

    <unnnic-text-area
      ref="bodyText"
      :key="bodyKey"
      class="form-tab-content-body__input"
      :disabled="disableInputs"
      :value="bodyContent"
      :placeholder="$t('WhatsApp.templates.form_field.body_text__placeholder')"
      @input="onInput"
      :maxLength="1024"
      :type="hasErrors ? 'error' : 'normal'"
      :errors="errorsList"
    />
    <InputEditor
      :class="[
        'form-tab-content-body__input__actions',
        hasErrors && 'form-tab-content-body__input__actions--error',
      ]"
      :formatter="true"
      @format-event="handleFormatEvent"
      @add-variable="addVariable"
      @emoji-event="handleNewEmoji"
    />
    <unnnic-button type="tertiary" iconLeft="add-1" size="small" @click="addVariable">
      {{ $t('WhatsApp.templates.form_field.add_variable') }}
    </unnnic-button>
  </div>
</template>

<script>
  import InputEditor from '@/components/whatsAppTemplates/InputEditor';

  import {
    countVariables,
    startsWithVariableRegex,
    endsWithVariableRegex,
    singleBracketVariableRegex,
    incompleteStartBracketVariableRegex,
    incompleteEndBracketVariableRegex,
  } from '@/utils/countTemplateVariables.js';

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
    computed: {
      templateTranslationCurrentForm(){
        return whatsapp_store().templateTranslationCurrentForm
      },
      bodyContent() {
        return this.templateTranslationCurrentForm?.body || '';
      },
      hasErrors() {
        return this.errorsList.length > 0;
      },
      errorsList() {
        const errors = [];

        if (
          this.bodyContent.match(startsWithVariableRegex) ||
          this.bodyContent.match(endsWithVariableRegex)
        ) {
          errors.push(this.$t('WhatsApp.templates.error.start_or_end_with_variable'));
        }

        if (
          this.bodyContent.match(singleBracketVariableRegex) ||
          this.bodyContent.match(incompleteStartBracketVariableRegex) ||
          this.bodyContent.match(incompleteEndBracketVariableRegex)
        ) {
          errors.push(this.$t('WhatsApp.templates.error.incomplete_bracket_variable'));
        }

        const variableCount = countVariables(this.bodyContent);
        const wordCount = this.countWords(this.bodyContent);
        if (wordCount && variableCount * 2 + 1 > wordCount - variableCount) {
          errors.push(this.$t('WhatsApp.templates.error.too_many_variables'));
        }

        return errors;
      },
    },
    methods: {
      /* istanbul ignore next */
      handleFormatEvent(eventCharacter) {
        if (this.disableInputs) {
          return;
        }

        const textArea = Array.from(this.$refs.bodyText.$el.children).find(
          (child) => child.nodeName === 'TEXTAREA',
        );

        const before = textArea.value.substring(0, textArea.selectionStart);
        const selectionContent = textArea.value.substring(
          textArea.selectionStart,
          textArea.selectionEnd,
        );
        const after = textArea.value.substring(textArea.selectionEnd);
        const result = `${before}${eventCharacter}${selectionContent}${eventCharacter}${after}`;

        this.emitInputChange(result);

        textArea.focus();
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

        this.emitInputChange(fieldValue);

        const textArea = Array.from(this.$refs.bodyText.$el.children).find(
          (child) => child.nodeName === 'TEXTAREA',
        );
        textArea.focus();
      },
      /* istanbul ignore next */
      onInput(event) {
        if (this.disableInputs) {
          return;
        }

        this.emitInputChange(event);
      },
      handleNewEmoji(emoji) {
        if (this.disableInputs) {
          return;
        }
        const result = (this.templateTranslationCurrentForm.body || '') + emoji.data;

        this.emitInputChange(result);
      },
      emitInputChange(fieldValue) {
        this.$emit('input-change', {
          fieldName: 'body',
          fieldValue,
        });

        this.$emit('input-change', {
          fieldName: 'bodyHasError',
          fieldValue: this.hasErrors,
        });
      },
      countWords(text) {
        if (!text) {
          return 0;
        }

        return text.trim().split(/\s+/).length;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-tab-content-body {
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

      &__actions {
        margin-left: auto;
        margin-top: -28px;
        margin-right: $unnnic-spacing-inline-giant;

        &--error {
          margin-top: 0;
          margin-right: 0;
        }
      }
    }
  }
</style>import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';

