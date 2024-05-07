<template>
  <div class="template-preview" v-if="!loadingFetchWhatsAppTemplate">
    <div v-if="showTitle" class="template-preview__header">
      <unnnic-icon-svg class="template-preview__header__icon" icon="view-1-1" size="lg" />
      <span class="template-preview__header__title">{{ $t('WhatsApp.templates.preview') }}</span>
    </div>

    <div class="template-preview__content">
      <div v-if="hasHeader">
        <div
          v-if="currentForm.header.header_type === 'TEXT'"
          class="template-preview__content__header"
        >
          <span>{{ currentForm.header.text }}</span>
        </div>
        <div v-else-if="currentForm.header.header_type === 'MEDIA'">
          <img
            v-if="headerOverwrite"
            class="template-preview__content__header__image-preview"
            :src="headerOverwrite"
          />
          <div v-else class="template-preview__content__header__icon-wrapper">
            <unnnic-icon-svg :icon="headerIcon" size="lg" scheme="background-snow" />
          </div>
        </div>
      </div>
      <div v-if="hasBody" class="template-preview__content__body">
        <span v-if="bodyOverwrite"> {{ bodyOverwrite }}</span>
        <span v-else v-html="parsedBody" />
      </div>
      <div v-if="hasFooter" class="template-preview__content__footer">
        <span>{{ currentForm.footer }}</span>
      </div>

      <div v-if="hasButtons" class="template-preview__action-buttons">
        <div
          v-if="currentForm.buttons[0].button_type !== 'QUICK_REPLY'"
          class="template-preview__action-buttons__actions"
        >
          <div
            v-for="(button, index) in currentForm.buttons"
            :key="index"
            class="template-preview__action-buttons__button"
          >
            <unnnic-icon-svg
              class="template-preview__action-buttons__button__icon"
              :icon="actionIcon(button.button_type)"
              size="sm"
            />
            {{ button.text }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasButtons" class="template-preview__buttons">
      <div
        v-if="currentForm.buttons[0].button_type === 'QUICK_REPLY'"
        class="template-preview__buttons__replies"
      >
        <div
          v-for="(button, index) in currentForm.buttons"
          :key="index"
          class="template-preview__buttons__replies__button"
        >
          <span>{{ button.text }}</span>
        </div>
      </div>
    </div>
  </div>
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
      headerIcon() {
        const iconMap = {
          IMAGE: 'common-file-horizontal-image-1',
          VIDEO: 'button-play-1',
          DOCUMENT: 'text-justified',
        };

        return iconMap[this.currentForm.header.mediaType] || iconMap['DOCUMENT'];
      },
      parsedBody() {
        // bold
        let result = this.currentForm.body.replaceAll(/\*(.+?)\*/gs, '<b>$1</b>');

        //italic
        result = result.replaceAll(/_(.+?)_/gs, '<i>$1</i>');

        // strike through
        result = result.replaceAll(/~(.+?)~/gs, '<s>$1</s>');

        return result;
      },
    },
    methods: {
      actionIcon(iconType) {
        const actionIconMap = {
          PHONE_NUMBER: 'phone-4',
          URL: 'export-1',
        };

        return actionIconMap[iconType];
      },
    },
  };
</script>

<style lang="scss" scoped>
  .template-preview {
    position: relative;
    background-color: #e5ddd5;

    &::before {
      content: '';
      height: 100%;
      position: absolute;
      width: 100%;
      background: url('~@/assets/wpp-template-preview-bg.png');
      opacity: 0.06;
      background-size: 366.5px 666px;
      left: 0;
      top: 0;
    }

    &__header {
      display: flex;
      align-items: center;
      margin: $unnnic-spacing-inset-md;

      &__icon {
        margin-right: $unnnic-spacing-inline-xs;
      }

      &__title {
        font-size: $unnnic-font-size-title-sm;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
      }
    }

    &__content {
      position: relative;
      margin: $unnnic-spacing-inset-md;
      margin-bottom: 0;
      padding: $unnnic-spacing-inset-nano;
      min-height: $unnnic-avatar-size-nano;
      background-color: $unnnic-color-neutral-snow;
      border-radius: $unnnic-border-radius-sm;
      overflow-wrap: break-word;

      &::before {
        z-index: 1;
        background: none;
        content: '';
        width: 0px;
        height: 0px;
        position: absolute;
        border-left: 5px solid white;
        border-right: 5px solid transparent;
        border-bottom: 5px solid white;
        border-top: 5px solid transparent;
        left: -2px;
        top: -7px;
        transform: rotate(-20deg);
        opacity: 1;
      }

      &__header {
        color: $unnnic-color-neutral-dark;
        font-size: $unnnic-font-size-body-lg;
        font-weight: $unnnic-font-weight-bold;
        margin-bottom: $unnnic-spacing-stack-xs;

        &__icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 125px;
          background-color: $unnnic-color-neutral-clean;
          border-radius: $unnnic-border-radius-sm;
          margin-bottom: $unnnic-spacing-stack-xs;
        }

        &__image-preview {
          height: 125px;
          width: 100%;
          object-fit: cover;
        }
      }

      &__body {
        color: $unnnic-color-neutral-dark;
        font-size: $unnnic-font-size-body-gt;
        white-space: pre-wrap;
        margin-bottom: $unnnic-spacing-stack-xs;
        text-align: left;
      }

      &__footer {
        color: rgba($unnnic-color-neutral-dark, $unnnic-opacity-level-clarifying);
        font-size: $unnnic-font-size-body-gt;
        white-space: pre-wrap;
      }
    }

    &__buttons {
      margin: $unnnic-spacing-inset-md;
      margin-top: 2px;

      &__replies {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        flex-direction: row;

        &__button {
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          box-sizing: border-box;
          margin: 2px 0 0 2px;
          padding: 0 $unnnic-spacing-inline-ant;
          min-width: calc(50% - 2px);
          height: 34px;
          color: #00a5f4;
          background-color: $unnnic-color-neutral-snow;
          box-shadow: $unnnic-shadow-level-near;
          font-size: $unnnic-font-size-body-gt;
          line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
          white-space: pre-wrap;
          border-radius: $unnnic-border-radius-md;
        }
      }
    }

    &__action-buttons {
      &__actions {
        margin-top: $unnnic-spacing-stack-nano;
        border-top: $unnnic-border-width-thinner solid $unnnic-color-neutral-clean;
        min-width: 200px;
        display: block;
      }

      &__button {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #00a5f4;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
        height: 34px;
        padding: 0 $unnnic-spacing-inline-ant;
        white-space: pre-wrap;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &__icon {
          margin-right: $unnnic-spacing-inline-nano;

          ::v-deep svg > path {
            fill: #00a5f4;
          }
        }
      }
    }
  }
</style>
