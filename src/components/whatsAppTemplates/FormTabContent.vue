<template>
  <div class="form-tab-content">
    <unnnic-input
      :disabled="disableInputs || formMode !== 'create'"
      :value="templateForm.name"
      @input="handleTemplateFormInput({ fieldName: 'name', fieldValue: $event })"
      @keyup="formatTemplateName"
      @keydown="preventTemplateName"
      :label="$t('WhatsApp.templates.form_field.name')"
      :maxlength="512"
    />
    <div class="form-tab-content__selects">
      <unnnic-select
        :class="{ 'form-tab-content__selects__disabled': disableInputs || formMode !== 'create' }"
        :disabled="disableInputs || formMode !== 'create'"
        :value="templateForm.category"
        @input="handleTemplateFormInput({ fieldName: 'category', fieldValue: $event })"
        :label="$t('WhatsApp.templates.form_field.category')"
      >
        <option
          v-for="option in categoryOptions"
          :key="option.value"
          :value="option.value"
          :label="option.text"
        >
          {{ option.text }}
        </option>
      </unnnic-select>
      <unnnic-select
        :class="{ 'form-tab-content__selects__disabled': disableInputs }"
        :key="languageKey"
        :disabled="disableInputs"
        :value="currentLanguage"
        :search="true"
        @input="handleLanguageSelection"
        :label="$t('WhatsApp.templates.form_field.language')"
      >
        <option
          v-for="option in availableLanguages"
          :key="option.value"
          :value="option.value"
          :label="option.text"
        >
          {{ option.text }}
        </option>
      </unnnic-select>
    </div>

    <FormTabContentHeader
      class="form-tab-content__header"
      :disableInputs="disableInputs"
      @input-change="handleGenericInput"
    />
    <FormTabContentBody
      ref="contentBody"
      class="form-tab-content__body"
      :disableInputs="disableInputs"
      @input-change="handleGenericInput"
      @manual-preview-update="$emit('manual-preview-update')"
    />
    <FormTabContentFooter
      class="form-tab-content__footer"
      :disableInputs="disableInputs"
      @input-change="handleGenericInput"
    />
    <FormTabContentButtons
      class="form-tab-content__buttons"
      :disableInputs="disableInputs"
      @input-change="handleGenericInput"
    />

    <div class="form-tab-content__actions">
      <unnnic-button
        class="form-tab-content__actions__cancel"
        type="terciary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="closeEdit"
      />
      <unnnic-button
        class="form-tab-content__actions__save"
        type="secondary"
        size="large"
        :loading="loadingSave"
        :text="$t('WhatsApp.templates.form_field.save_language')"
        :disabled="disableInputs"
        @click="$emit('save-changes')"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import FormTabContentHeader from '@/components/whatsAppTemplates/FormTabContentHeader.vue';
  import FormTabContentBody from '@/components/whatsAppTemplates/FormTabContentBody.vue';
  import FormTabContentFooter from '@/components/whatsAppTemplates/FormTabContentFooter.vue';
  import FormTabContentButtons from '@/components/whatsAppTemplates/FormTabContentButtons.vue';

  export default {
    name: 'FormTabContent',
    components: {
      FormTabContentHeader,
      FormTabContentBody,
      FormTabContentFooter,
      FormTabContentButtons,
    },
    props: {
      formMode: {
        type: String,
        default: 'create',
      },
      canEdit: {
        type: Boolean,
        default: true,
      },
      selectedForm: {
        type: String,
        default: '',
      },
      removeLanguages: {
        type: Array,
        default: /* istanbul ignore next */ () => [],
      },
      availableLanguages: {
        type: Array,
        default: /* istanbul ignore next */ () => [],
      },
      loadingSave: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        languageKey: 0,
        categoryOptions: [
          { value: 'MARKETING', text: this.$t('WhatsApp.templates.category_options.marketing') },
          {
            value: 'TRANSACTIONAL',
            text: this.$t('WhatsApp.templates.category_options.transactional'),
          },
          { value: 'OTP', text: this.$t('WhatsApp.templates.category_options.otp') },
        ],
      };
    },
    computed: {
      ...mapGetters('WhatsApp', ['templateTranslationCurrentForm']),
      ...mapState('WhatsApp', ['templateForm']),
      disableInputs() {
        return !this.canEdit;
      },
      currentLanguage() {
        return this.templateTranslationCurrentForm?.language;
      },
    },
    methods: {
      ...mapActions('WhatsApp', ['updateTemplateForm', 'updateTemplateTranslationForm']),
      preventTemplateName(event) {
        if (!event.key.match(/[a-zA-Z0-9_ ]+/)) {
          event.preventDefault();
        }
      },
      formatTemplateName(event) {
        var textValue = event.srcElement.value;
        textValue = textValue.replace(/ /g, '_').toLowerCase();
        event.srcElement.value = textValue;
      },
      handleTemplateFormInput({ fieldName, fieldValue }) {
        this.updateTemplateForm({ fieldName, fieldValue });
      },
      handleGenericInput({ fieldName, fieldValue, preventRerender }) {
        this.updateTemplateTranslationForm({
          formName: this.selectedForm,
          fieldName,
          fieldValue,
          preventRerender,
        });
      },
      handleLanguageSelection(value) {
        const selectedLanguage = this.availableLanguages.find((item) => item.value === value);

        if (!selectedLanguage) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.unexpected_language'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'top-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 6,
          });
          return;
        }

        if (
          selectedLanguage.value !== this.templateTranslationCurrentForm.language &&
          this.removeLanguages.includes(selectedLanguage.text)
        ) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.language_already_exists'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'top-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 6,
          });
          return;
        }

        this.updateTemplateTranslationForm({
          formName: this.selectedForm,
          fieldName: 'language',
          fieldValue: selectedLanguage.value,
        });
        this.$emit('language-change', selectedLanguage.text);
        this.languageKey += 1;
        this.updateBody();
      },
      closeEdit() {
        this.$router.go(-1);
      },
      updateBody() {
        this.$refs.contentBody.forceUpdateBody();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-tab-content {
    display: flex;
    flex-direction: column;

    &__selects {
      display: flex;
      gap: $unnnic-spacing-inline-sm;

      .unnnic-select {
        flex: 1;
      }

      &__disabled {
        cursor: default;

        ::v-deep .input,
        ::v-deep .unnnic-icon {
          pointer-events: none;
        }

        ::v-deep .input {
          border: $unnnic-border-width-thinner dashed $unnnic-color-neutral-clean;
          background-color: $unnnic-color-neutral-light;
        }
      }
    }

    &__header,
    &__body,
    &__footer,
    &__buttons,
    &__actions {
      margin-top: $unnnic-spacing-stack-md;
    }

    &__actions {
      width: 100%;
      display: flex;
      gap: $unnnic-spacing-inline-md;
      margin-left: auto;
      justify-content: flex-end;

      &__save,
      &__cancel {
        width: 200px;
      }
    }
  }
</style>
