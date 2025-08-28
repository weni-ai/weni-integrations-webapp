<template>
  <section class="template-preview">
    <header class="template-preview__header">
      <h1 class="template-preview__header__title">
        {{ $t('WhatsApp.templates.template_preview') }}
      </h1>
      <!-- TODO: link template name on edit -->
      <h1 class="template-preview__header__template-title" v-if="false">: {{ 'asdfasd' }}</h1>
    </header>
    <section class="template-preview__body">
      <unnnic-template-preview v-if="hasInitTemplateConfig" :template="templatePreview" />
      <section v-else class="template-preview__body__empty">
        <h1 class="template-preview__body__empty__title">
          {{ $t('WhatsApp.templates.template_preview') }}
        </h1>
      </section>
    </section>
  </section>
</template>

<script>
  import { mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';

  export default {
    name: 'TemplatePreview',
    props: {
      showTitle: {
        type: Boolean,
        default: true,
      },
      bodyOverwrite: {
        type: String,
        default: null,
      },
      headerOverwrite: {
        type: String,
        default: null,
      },
    },
    computed: {
      ...mapState(whatsapp_store, {
        currentForm: 'templateTranslationCurrentForm',
      }),
      ...mapState(whatsapp_store, ['loadingFetchWhatsAppTemplate']),
      hasHeader() {
        if (!this.currentForm) {
          return false;
        }

        const header = this.currentForm.header;
        if (!header) {
          return false;
        }

        if (header.header_type === 'TEXT') {
          return !!header.text;
        } else {
          return !!header.mediaType;
        }
      },
      hasBody() {
        if (!this.currentForm) {
          return false;
        }

        return !!this.currentForm.body;
      },
      hasFooter() {
        if (!this.currentForm) {
          return false;
        }

        return !!this.currentForm.footer;
      },
      hasButtons() {
        if (!this.currentForm) {
          return false;
        }

        return this.currentForm.buttons?.length > 0;
      },
      hasInitTemplateConfig() {
        return this.hasHeader || this.hasBody || this.hasFooter || this.hasButtons;
      },
      templatePreview() {
        return {
          header: {
            type: this.currentForm.header?.header_type,
            text: this.currentForm.header?.text,
            mediaType: this.currentForm.header?.mediaType,
          },
          body: this.currentForm.body,
          footer: this.currentForm.footer,
          buttons:
            this.currentForm.buttons?.map((button) => {
              return {
                type: button.button_type,
                text: button.text,
              };
            }) || [],
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .template-preview {
    border-radius: $unnnic-border-radius-sm;
    border: 1px solid $unnnic-color-neutral-soft;

    &__header {
      display: flex;
      padding: $unnnic-spacing-ant $unnnic-spacing-sm;

      &__template-title {
        margin: 0;
        font-family: $unnnic-font-family-secondary;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        font-weight: $unnnic-font-weight-regular;
        color: $unnnic-color-neutral-dark;
      }
      &__title {
        margin: 0;
        font-family: $unnnic-font-family-secondary;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        font-weight: $unnnic-font-weight-bold;
        color: $unnnic-color-neutral-dark;
      }
    }

    &__body {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $unnnic-color-neutral-light;
      padding: $unnnic-spacing-md;
      height: -webkit-fill-available;

      &__empty {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: $unnnic-shadow-level-near;
        background-color: $unnnic-color-background-white;
        width: 368px;
        height: 80%;
        border-radius: $unnnic-border-radius-md;
        &__title {
          margin: 0;
          font-family: $unnnic-font-family-secondary;
          font-size: $unnnic-font-size-body-gt;
          line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
          font-weight: $unnnic-font-weight-regular;
          color: $unnnic-color-neutral-clean;
        }
      }
    }
  }
</style>
