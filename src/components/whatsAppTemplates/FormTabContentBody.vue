<template>
  <div class="form-tab-content-body">
    <unnnic-tag
      class="form-tab-content-body__tag"
      type="default"
      :text="$t('WhatsApp.templates.form_field.body_text')"
      scheme="neutral-darkest"
    />

    <unnnic-text-area
      ref="bodyText"
      :key="bodyKey"
      class="form-tab-content-body__input"
      :disabled="disableInputs"
      :value="bodyContent"
      @input="onInput"
      :maxLength="1024"
    />
    <InputEditor
      class="form-tab-content-body__input__actions"
      :formatter="true"
      @format-event="handleFormatEvent"
      @add-variable="addVariable"
      @emoji-event="handleNewEmoji"
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
    computed: {
      ...mapGetters('WhatsApp', ['templateTranslationCurrentForm']),
      bodyContent() {
        return this.templateTranslationCurrentForm?.body || '';
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

        this.$emit('input-change', {
          fieldName: 'body',
          fieldValue: result,
        });

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

        this.$emit('input-change', {
          fieldName: 'body',
          fieldValue,
        });

        this.$refs.bodyText.$el.children[0].focus();
      },
      /* istanbul ignore next */
      onInput(event) {
        if (this.disableInputs) {
          return;
        }

        this.$emit('input-change', {
          fieldName: 'body',
          fieldValue: event,
        });
      },
      handleNewEmoji(emoji) {
        if (this.disableInputs) {
          return;
        }
        const result = (this.templateTranslationCurrentForm.body || '') + emoji.data;

        this.$emit('input-change', {
          fieldName: 'body',
          fieldValue: result,
        });
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
      ::v-deep textarea {
        resize: none;
      }

      &__actions {
        margin-left: auto;
        margin-top: -28px;
        margin-right: $unnnic-spacing-inline-giant;
      }
    }
  }
</style>
