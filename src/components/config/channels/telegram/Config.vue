<template>
  <div class="app-config-telegram">
    <div class="app-config-telegram__header">
      <div class="app-config-telegram__header__title">
        <div class="app-config-telegram__header__title__icon-container">
          <img class="app-config-telegram__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="app-config-telegram__header__title__name">{{ app.name }}</div>
      </div>
      <div class="app-config-telegram__header__description">
        {{ $t('telegram.config.description.text') }}
        <!-- TODO: get correct href -->
        <a href="https://google.com" target="_blank">
          {{ $t('telegram.config.description.link') }}
        </a>
      </div>
    </div>

    <div class="app-config-telegram__settings__content">
      <unnnic-input
        key="config-title"
        v-model="token"
        type="normal"
        :label="$t('telegram.config.TokenInput.label')"
      />
    </div>

    <div class="app-config-telegram__settings__buttons">
      <unnnic-button
        class="app-config-telegram__settings__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="closeConfig"
      ></unnnic-button>

      <unnnic-button
        class="app-config-telegram__settings__buttons__save"
        type="secondary"
        size="large"
        :text="$t('apps.config.validate')"
        @click="saveConfig"
      ></unnnic-button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'telegram-config',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        token: null,
      };
    },
    methods: {
      ...mapActions(['updateAppConfig']),
      async saveConfig() {
        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            config: {
              token: this.token,
            },
          },
        };

        try {
          await this.updateAppConfig(data);
          unnnicCallAlert({
            props: {
              text: this.$t('apps.config.integration_success'),
              title: 'Success',
              icon: 'check-circle-1-1',
              scheme: 'feedback-green',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } catch (err) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } finally {
          this.$root.$emit('updateGrid');
        }
      },
      closeConfig() {
        this.$emit('closeModal');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-telegram {
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

          background-color: rgba(3, 155, 229, 0.2);

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
        padding-bottom: $unnnic-inline-md;
        border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;

        a {
          margin-left: $unnnic-inline-nano;
          font-weight: $unnnic-font-weight-bold;
          color: $unnnic-color-neutral-cloudy;
        }
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
        &__save {
          flex-grow: 1;
        }
      }
    }
  }
</style>
