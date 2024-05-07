<template>
  <div class="form-tab-content">
    <div class="form-tab-content__scroll">
      <div class="form-tab-content--inline">
        <unnnic-input
          class="form-tab-content__input--name"
          ref="nameInput"
          :disabled="disableInputs || formMode !== 'create'"
<<<<<<< HEAD
          :value="templateForm.name"
          @input="handleTemplateFormInput({ fieldName: 'name', fieldValue: $event })"
=======
          :modelValue="templateForm.name"
          @update:modelValue="handleTemplateFormInput({ fieldName: 'name', fieldValue: $event })"
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
          :groups="categoryGroups"
          @change="handleCategoryChange"
=======
          v-model="categoryGroups"
          @update:modelValue="handleCategoryChange"
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
        />
      </div>

      <div class="divider" />
<<<<<<< HEAD
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
=======
      <div>
        <unnnic-label :label="$t('WhatsApp.templates.form_field.language')" />
        <unnnic-select-smart
          :class="{ 'form-tab-content__selects__disabled': disableInputs }"
          :disabled="disableInputs"
          :options="availableLanguages"
          :modelValue="templateLanguage"
          @update:modelValue="handleLanguageSelection"
        />
      </div>
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800

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
    </div>

    <div class="form-tab-content__actions">
      <unnnic-button
        class="form-tab-content__actions__cancel"
        type="tertiary"
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
<<<<<<< HEAD
  import unnnicCallAlert from '@weni/unnnic-system';
=======
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import alert from '@/utils/call';
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
  import FormTabContentHeader from '@/components/whatsAppTemplates/FormTabContentHeader.vue';
  import FormTabContentBody from '@/components/whatsAppTemplates/FormTabContentBody.vue';
  import FormTabContentFooter from '@/components/whatsAppTemplates/FormTabContentFooter.vue';
  import FormTabContentButtons from '@/components/whatsAppTemplates/FormTabContentButtons.vue';
<<<<<<< HEAD
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import { mapState, mapActions } from 'pinia';
=======
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800

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
<<<<<<< HEAD
=======
        templateCategory: [],
        templateLanguage: [
          {
            value: '',
            label: '',
          },
        ],
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
          buttons: {
            value: false,
            message: '',
          },
        },
      };
    },
<<<<<<< HEAD
=======
    beforeMount() {
      if (this.templateTranslationCurrentForm?.language) {
        this.templateLanguage = this.availableLanguages.filter(
          (item) => item.value === this.templateTranslationCurrentForm?.language,
        );
      } else {
        this.languagesList = this.availableLanguages;
        this.languagesList.push({
          value: 'select',
          label: 'New Language',
        });
        this.templateLanguage = [
          {
            label: 'New Language',
            value: 'select',
          },
        ];
      }
    },
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
    mounted() {
      const nativeNameInput = this.$refs.nameInput.$el.querySelector('input');

      nativeNameInput.addEventListener('paste', (event) => {
        event.preventDefault();
        nativeNameInput.value = event.clipboardData
          .getData('Text')
          .replaceAll(' ', '_')
          .replaceAll('-', '_')
          .toLowerCase();
      });
    },
<<<<<<< HEAD
    computed: {
      ...mapState(whatsapp_store, [
        'templateForm',
        'whatsAppTemplates',
        'templateTranslationCurrentForm',
      ]),
=======
    beforeUnmount() {
      this.resetTemplates();
    },
    computed: {
      ...mapState(whatsapp_store, [
        'templateTranslationCurrentForm',
        'templateTranslationForms',
        'templateTranslationSelectedForm',
      ]),
      ...mapState(whatsapp_store, ['templateForm', 'whatsAppTemplates']),
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
      ...mapActions(whatsapp_store, ['updateTemplateForm', 'updateTemplateTranslationForm']),
=======
      ...mapActions(whatsapp_store, [
        'updateTemplateForm',
        'updateTemplateTranslationForm',
        'resetTemplates',
      ]),
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
      handleGenericInput({ fieldName, fieldValue, hasIssue = false }) {
        if (hasIssue) {
          this.errorStates[fieldName].value = true;
        }

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
<<<<<<< HEAD
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
=======
        if (this.templateLanguage === value) return;
        this.templateLanguage = value;
        const selectedLanguage = this.availableLanguages.find(
          (item) => item.value === value[0].value,
        );

        if (!selectedLanguage) {
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.unexpected_language'),
              type: 'error',
            },
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
          });
          return;
        }

        if (
<<<<<<< HEAD
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
=======
          selectedLanguage.value !== this.templateTranslationCurrentForm?.language &&
          this.removeLanguages.includes(selectedLanguage.label)
        ) {
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.language_already_exists'),
              type: 'error',
            },
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
          });
          return;
        }

<<<<<<< HEAD
=======
        if (this.templateTranslationCurrentForm?.uuid) return;
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
        this.updateTemplateTranslationForm({
          formName: this.selectedForm,
          fieldName: 'language',
          fieldValue: selectedLanguage.value,
        });
<<<<<<< HEAD
        this.$emit('language-change', selectedLanguage.text);
=======
        this.$emit('language-change', selectedLanguage.label);
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.invalid_fields'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
=======
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.invalid_fields'),
              type: 'error',
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
=======
    watch: {
      templateTranslationCurrentForm(newval) {
        if (newval?.language !== this.templateLanguage) {
          const selectedLanguage = this.availableLanguages.filter(
            (item) => item.value === newval.language,
          );
          this.templateLanguage = selectedLanguage;
        }
      },
    },
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
    overflow: auto;
    height: 100%;

    &__scroll {
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding-right: $unnnic-spacing-stack-sm;
    }

    &--inline {
      display: flex;
<<<<<<< HEAD
      // flex: 1;
=======
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
