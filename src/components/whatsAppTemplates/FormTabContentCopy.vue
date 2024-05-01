<template>
  <div class="form-tab-content">
    <div class="form-tab-content__scroll">
      <div class="form-tab-content--inline">
        <unnnic-input
          class="form-tab-content__input--name"
          label="name"
          placeholder="template name..."
          :disabled="disableInputs || formMode !== 'create'"
          :modelValue="templateName"
          @update:modelValue="handleNameChange"
        />
        <div
          :class="{
            'form-tab-content__selects--category': true,
            'form-tab-content__selects__disabled': disableInputs || formMode !== 'create',
          }"
        >
          <unnnic-label label="category" />
          <unnnic-select-smart
            :disabled="disableInputs || formMode !== 'create'"
            :options="categoryGroups"
            :modelValue="templateCategory"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  // import { unnnicCallAlert } from '@weni/unnnic-system';
  // import FormTabContentHeader from '@/components/whatsAppTemplates/FormTabContentHeader.vue';
  // import FormTabContentBody from '@/components/whatsAppTemplates/FormTabContentBody.vue';
  // import FormTabContentFooter from '@/components/whatsAppTemplates/FormTabContentFooter.vue';
  // import FormTabContentButtons from '@/components/whatsAppTemplates/FormTabContentButtons.vue';

  export default {
    name: 'FormTabContentCopy',
    components: {
      // FormTabContentHeader,
      // FormTabContentBody,
      // FormTabContentFooter,
      // FormTabContentButtons,
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
        templateName: '',
        templateCategory: [],
        categoryGroups: [
          {
            value: 'UTILITY',
            label: this.$t('WhatsApp.templates.category_options.utility'),
            description: this.$t('WhatsApp.templates.category_options.utility_description'),
          },
          {
            value: 'MARKETING',
            label: this.$t('WhatsApp.templates.category_options.marketing'),
            description: this.$t('WhatsApp.templates.category_options.marketing_description'),
          },
          {
            value: 'AUTHENTICATION',
            label: this.$t('WhatsApp.templates.category_options.authentication'),
            description: this.$t('WhatsApp.templates.category_options.authentication_description'),
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
    beforeDestroy() {
      this.resetTemplateTranslationCurrentForm();
    },
    computed: {
      ...mapState(whatsapp_store, ['templateTranslationCurrentForm', 'templateForm']),
    },
    methods: {
      ...mapActions(whatsapp_store, ['resetTemplateTranslationCurrentForm']),
      handleNameChange(name) {
        this.templateName = name;
      },
      verifyExistingName(templateName) {
        return this.whatsAppTemplates.results.find((template) => template.name === templateName);
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
