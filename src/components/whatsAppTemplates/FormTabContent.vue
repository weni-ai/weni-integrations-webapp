<template>
  <div class="form-tab-content">
    <div class="form-tab-content__scroll">
      <div class="divider" />
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
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import unnnic from '@weni/unnnic-system';
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
        // languageKey: 0,
        // templateCategory: [],
        // templateLanguage: [],
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
    beforeMount() {
      if (this.templateTranslationCurrentForm?.language) {
        this.templateLanguage = this.availableLanguages.filter(
          (item) => item.value === this.templateTranslationCurrentForm?.language,
        );
      }
    },
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
      ...mapActions(whatsapp_store, [
        'updateTemplateForm',
        'updateTemplateTranslationForm',
        'resetTemplates',
      ]),
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
      closeEdit() {
        const tablePath = this.$router.currentRoute.value.path.split('templates')[0] + 'templates';
        this.$router.push(tablePath);
      },
      saveTemplate() {
        let validFields = true;
        for (const key in this.errorStates) {
          if (this.errorStates[key].value) {
            validFields = false;
          }
        }

        if (!validFields) {
          unnnic.unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.invalid_fields'),
              type: 'error',
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
    watch: {
      // templateTranslationCurrentForm(newval) {
      //   console.log({ newval });
      //   if (newval?.language !== this.templateLanguage) {
      //     const selectedLanguage = this.availableLanguages.filter(
      //       (item) => item.value === newval.language,
      //     );
      //     this.templateLanguage = selectedLanguage;
      //   }
      // },
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

    &__scroll {
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding-right: $unnnic-spacing-stack-sm;
    }

    &--inline {
      display: flex;
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
