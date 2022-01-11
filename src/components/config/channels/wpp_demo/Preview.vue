<template>
  <div class="app-preview-wpp_demo">
    <div class="app-preview-wpp_demo__header">
      <div class="app-preview-wpp_demo__header__title">
        <div class="app-preview-wpp_demo__header__title__icon-container">
          <img class="app-preview-wpp_demo__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="app-preview-wpp_demo__header__title__name">{{ app.name }}</div>
      </div>
      <div class="app-preview-wpp_demo__header__description">
        {{ $t('WhatsAppDemo.preview.description') }}
      </div>
    </div>

    <div class="app-preview-wpp_demo__settings__content">
      <unnnic-data-area :text="url">
        <unnnic-button
          slot="buttons"
          class="app-preview-wpp_demo__settings__content__button"
          type="primary"
          size="large"
          iconCenter="export-1"
          @click="openWppLink"
        ></unnnic-button>
      </unnnic-data-area>
    </div>

    <div class="app-preview-wpp_demo__settings__buttons">
      <unnnic-button
        class="app-preview-wpp_demo__settings__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="closePreview"
      ></unnnic-button>

      <unnnic-button
        class="app-preview-wpp_demo__settings__buttons__copy"
        type="secondary"
        size="large"
        :text="$t('apps.config.copy')"
        :disabled="this.app.config.token"
        @click="copyUrl"
      ></unnnic-button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

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
    methods: {
      ...mapActions(['updateAppConfig']),
      closePreview() {
        this.$emit('closeModal');
      },
      /* istanbul ignore next */
      copyUrl() {
        navigator.clipboard.writeText(this.url);

        unnnicCallAlert({
          props: {
            text: this.$t('apps.config.copy_success'),
            title: 'Success',
            icon: 'check-circle-1-1',
            scheme: 'feedback-green',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
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
    height: -webkit-fill-available;
    height: -moz-available;
    padding: $unnnic-inset-lg;

    &__header {
      display: flex;
      margin-bottom: $unnnic-spacing-stack-nano;
      flex-direction: column;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;

          background: rgba(209, 252, 201, 0.8);

          &__icon {
            width: $unnnic-icon-size-md;
            margin: 0 auto;
          }
        }

        &__name {
          align-self: center;
          font-family: $unnnic-font-family-primary;
          font-weight: $unnnic-font-weight-regular;
          font-size: $unnnic-font-size-title-md;
          line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
          color: $unnnic-color-neutral-darkest;

          margin-left: $unnnic-inline-sm;
        }
      }

      &__description {
        display: flex;
        flex-wrap: wrap;

        margin-top: $unnnic-inline-sm;

        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;
      }
    }

    &__settings {
      display: flex;
      flex-direction: column;
      height: -webkit-fill-available;
      height: -moz-available;
      overflow-y: hidden;
      &__content {
        padding-right: $unnnic-spacing-inline-xs;
        display: flex;
        flex-direction: column;

        &__input {
          margin-top: $unnnic-spacing-stack-xs;

          &__subtitle {
            margin-top: $unnnic-spacing-stack-nano/2;
          }

          &__payload {
            flex: 1;
            margin-top: $unnnic-spacing-stack-xs;

            ::v-deep .unnnic-form-input {
              margin-top: $unnnic-spacing-stack-xs;
            }
          }
        }
      }
      &__buttons {
        padding-right: $unnnic-spacing-inline-xs;
        margin-top: $unnnic-spacing-stack-md;
        display: flex;

        &__cancel,
        &__copy {
          flex-grow: 1;
        }
      }
    }
  }

  ::v-deep .unnnic-button--primary {
    background-color: rgba(226, 230, 237, 0.4) !important;
  }
</style>
