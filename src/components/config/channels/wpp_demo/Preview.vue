<template>
  <div class="app-preview-wpp_demo">
    <div class="app-preview-wpp_demo__header">
      <div class="app-preview-wpp_demo__header__description">
        {{ $t('WhatsAppDemo.preview.description') }}
      </div>
    </div>

    <div class="app-preview-wpp_demo__settings__content">
      <div class="app-preview-wpp_demo__settings__content__qr">
        <img :src="QRCodeUrl" />
      </div>

      <unnnic-data-area :text="url" hoverText="">
        <template #buttons>
          <div class="app-preview-wpp_demo__settings__content__input__buttons">
            <unnnic-button
              class="app-preview-wpp_demo__settings__content__input__buttons--copy"
              type="primary"
              size="large"
              iconCenter="copy-paste-1"
              @click="copyUrl"
            />
            <unnnic-button
              class="app-preview-wpp_demo__settings__content__input__buttons--open"
              type="primary"
              size="large"
              iconCenter="export-1"
              @click="openWppLink"
            />
          </div>
        </template>
      </unnnic-data-area>
    </div>

    <div class="app-preview-wpp_demo__settings__buttons">
      <unnnic-button
        class="app-preview-wpp_demo__settings__buttons__cancel"
        type="tertiary"
        size="large"
        :text="$t('general.Close')"
        @click="closePreview"
      />
    </div>
  </div>
</template>

<script>
  import unnnic from '@weni/unnnic-system';

  export default {
    name: 'wpp-demo-preview',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        url: this.app.config.redirect_url ?? null,
      };
    },
    computed: {
      QRCodeUrl() {
        return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURI(
          this.url,
        )}`;
      },
    },
    methods: {
      closePreview() {
        this.$emit('closeModal');
      },
      /* istanbul ignore next */
      copyUrl() {
        navigator.clipboard.writeText(this.url);
        unnnic.unnnicCallAlert({
          props: {
            text: this.$t('apps.config.copy_success'),
            type: 'success',
          },
          seconds: 3,
        });
      },
      /* istanbul ignore next */
      openWppLink() {
        window.open(this.app.config.redirect_url, '_blank');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-preview-wpp_demo {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;

    &__header {
      display: flex;
      margin: $unnnic-spacing-inset-lg;
      margin-bottom: $unnnic-spacing-stack-sm;
      flex-direction: column;

      &__description {
        display: flex;
        flex-wrap: wrap;

        margin-top: $unnnic-inline-sm;

        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-fg-base;
      }
    }

    &__settings {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: hidden;

      &__content {
        padding-right: $unnnic-spacing-inline-xs;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: auto;
        overflow: auto;
        display: flex;
        flex-direction: column;
        flex: 1;
        color: $unnnic-color-fg-base;
        font-size: $unnnic-font-size-body-gt;
        line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
        margin: 0 $unnnic-spacing-inset-lg;

        :deep(.unnnic-button--primary) {
          background-color: rgba(226, 230, 237, 0.4) !important;

          span {
            color: $unnnic-color-fg-emphasized !important;
          }
        }

        &__qr {
          align-self: center;
          margin: $unnnic-spacing-stack-sm 0;
        }

        &__input {
          margin-top: $unnnic-spacing-stack-xs;

          &__payload {
            flex: 1;
            margin-top: $unnnic-spacing-stack-xs;

            :deep(.unnnic-form-input) {
              margin-top: $unnnic-spacing-stack-xs;
            }
          }

          &__buttons {
            display: flex;
            gap: $unnnic-spacing-inline-nano;
          }
        }
      }

      &__buttons {
        padding-right: $unnnic-spacing-inline-xs;
        margin: $unnnic-spacing-inset-lg;
        display: flex;

        &__cancel,
        &__copy {
          flex-grow: 1;
        }
      }
    }
  }
</style>
