<template>
  <div class="form-tab-content">
    <div class="form-tab-content--inline">
      <unnnic-input
        class="form-tab-content__input--name"
        :disabled="disableInputs || formMode !== 'create'"
        :value="templateForm.name"
        @input="handleTemplateFormInput({ fieldName: 'name', fieldValue: $event })"
        @keyup="formatTemplateName"
        @keydown="preventTemplateName"
        :label="$t('WhatsApp.templates.form_field.name')"
        :placeholder="$t('WhatsApp.templates.form_field.name')"
        :maxlength="512"
        :type="errorStates.name.value ? 'error' : 'normal'"
        :message="errorStates.name.message"
      />

      <unnnic-multi-select
        ref="categorySelect"
        :class="{
          'form-tab-content__selects--category': true,
          'form-tab-content__selects__disabled': disableInputs || formMode !== 'create',
        }"
        :inputTitle="currentCategory || $t('WhatsApp.templates.form_field.category_placeholder')"
        :hideGroupTitle="true"
        :label="$t('WhatsApp.templates.form_field.category')"
        :groups="categoryGroups"
        @change="handleCategoryChange"
      />
    </div>

    <div class="divider" />
    <unnnic-select
      :class="{ 'form-tab-content__selects__disabled': disableInputs }"
      :key="languageKey"
      :disabled="disableInputs"
      :value="currentLanguage"
      :search="true"
      @input="handleLanguageSelection"
      :label="$t('WhatsApp.templates.form_field.language')"
      :placeholder="$t('WhatsApp.templates.form_field.language__placeholder')"
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

    <FormTabContentHeader
      class="form-tab-content__header"
      :disableInputs="disableContentInputs"
      @input-change="handleGenericInput"
    />
    <FormTabContentBody
      ref="contentBody"
      class="form-tab-content__body"
      :disableInputs="disableContentInputs"
      @input-change="handleGenericInput"
      @manual-preview-update="$emit('manual-preview-update')"
    />
    <FormTabContentFooter
      class="form-tab-content__footer"
      :disableInputs="disableContentInputs"
      @input-change="handleGenericInput"
    />
    <FormTabContentButtons
      class="form-tab-content__buttons"
      :disableInputs="disableContentInputs"
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
        :disabled="!canSave || disableContentInputs"
        @click="saveTemplate"
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
        categoryGroups: [
          {
            title: this.$t('WhatsApp.templates.form_field.category'),
            selected: -1,
            items: [
              {
                value: 'UTILITY',
                title: this.$t('WhatsApp.templates.category_options.utility'),
                description: this.$t('WhatsApp.templates.category_options.utility_description'),
              },
              {
                value: 'MARKETING',
                title: this.$t('WhatsApp.templates.category_options.marketing'),
                description: this.$t('WhatsApp.templates.category_options.marketing_description'),
              },
              {
                value: 'AUTHENTICATION',
                title: this.$t('WhatsApp.templates.category_options.authentication'),
                description: this.$t(
                  'WhatsApp.templates.category_options.authentication_description',
                ),
              },
            ],
          },
        ],
        errorStates: {
          name: {
            value: false,
            message: '',
          },
        },
      };
    },
    computed: {
      ...mapGetters('WhatsApp', ['templateTranslationCurrentForm']),
      ...mapState('WhatsApp', ['templateForm', 'whatsAppTemplates']),
      disableInputs() {
        return !this.canEdit;
      },
      disableContentInputs() {
        return (
          this.templateTranslationCurrentForm?.status !== 'REJECTED' &&
          this.templateTranslationCurrentForm?.status !== 'APPROVED' &&
          !this.canEdit
        );
      },
      currentLanguage() {
        return this.templateTranslationCurrentForm?.language;
      },
      currentCategory() {
        const category = this.categoryGroups[0].items.find(
          (item) => item.value === this.templateForm.category,
        );

        if (!category) {
          return '';
        }

        const categoryLabel = category.value.toLowerCase();
        return this.$t(`WhatsApp.templates.category_options.${categoryLabel}`);
      },
      canSave() {
        return !this.templateTranslationCurrentForm?.bodyHasError;
      },
    },
    methods: {
      ...mapActions('WhatsApp', ['updateTemplateForm', 'updateTemplateTranslationForm']),
      preventTemplateName(event) {
        if (!event.key.match(/[a-zA-Z0-9_]+/)) {
          event.preventDefault();
        }
      },
      formatTemplateName(event) {
        var textValue = event.srcElement.value;
        textValue = textValue.replace(/ /g, '_').toLowerCase();
        event.srcElement.value = textValue;
      },
      handleTemplateFormInput({ fieldName, fieldValue }) {
        if (fieldName === 'name') {
          const exists = this.verifyExistingName(fieldValue);
          this.errorStates.name.value = !!exists;

          this.errorStates.name.message = exists
            ? this.$t('WhatsApp.templates.form_field.name_exists')
            : '';
        }
        this.updateTemplateForm({ fieldName, fieldValue });
      },
      handleGenericInput({ fieldName, fieldValue }) {
        this.updateTemplateTranslationForm({
          formName: this.selectedForm,
          fieldName,
          fieldValue,
        });
      },
      handleCategoryChange(event) {
        this.categoryGroups = event;
        const selectedCategory = event[0].items[event[0].selected];

        this.handleTemplateFormInput({ fieldName: 'category', fieldValue: selectedCategory.value });
        this.$refs.categorySelect.active = false;
      },
      handleLanguageSelection(value) {
        const selectedLanguage = this.availableLanguages.find((item) => item.value === value);

        if (!selectedLanguage) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.unexpected_language'),
              title: this.$t('general.error'),
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
              title: this.$t('general.error'),
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
      },
      closeEdit() {
        const tablePath = this.$router.currentRoute.path.split('templates')[0] + 'templates';
        this.$router.push(tablePath);
      },
      verifyExistingName(templateName) {
        return this.whatsAppTemplates.results.find((template) => template.name === templateName);
      },
      saveTemplate() {
        let validFields = true;
        for (const key in this.errorStates) {
          if (this.errorStates[key].value) {
            validFields = false;
          }
        }

        if (!validFields) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.invalid_fields'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 6,
          });
          return;
        }

        if (this.canSave) {
          this.$emit('save-changes');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .divider {
    margin-top: $unnnic-spacing-stack-lg;
    margin-bottom: $unnnic-spacing-stack-md;
    border-top: 1px solid $unnnic-color-neutral-soft;
  }

  .form-tab-content {
    display: flex;
    flex-direction: column;

    &--inline {
      display: flex;
      // flex: 1;
      gap: $unnnic-spacing-inline-sm;
    }

    &__input--name {
      flex: 3;

      ::v-deep .unnnic-form__message {
        color: $unnnic-color-feedback-red;
      }
    }

    &__selects {
      ::v-deep .select-permission {
        min-height: 22px;
      }

      &__disabled {
        cursor: default;
        ::v-deep {
          .input,
          .unnnic-icon,
          .select-permission {
            pointer-events: none;
          }

          .input,
          .select-permission {
            border: $unnnic-border-width-thinner dashed $unnnic-color-neutral-clean;
            background-color: $unnnic-color-neutral-light;
          }
        }
      }

      &--category {
        flex: 1;

        ::v-deep {
          .select-permission-label {
            margin-top: $unnnic-spacing-stack-xs;
          }

          .select-content {
            z-index: 1;
          }
        }
      }
    }

    &__header,
    &__body,
    &__footer,
    &__buttons,
    &__actions {
      margin-top: $unnnic-spacing-stack-lg;
    }

    &__actions {
      width: 100%;
      display: flex;
      gap: $unnnic-spacing-inline-sm;

      &__save,
      &__cancel {
        flex: 1;
      }
    }
  }
</style>
