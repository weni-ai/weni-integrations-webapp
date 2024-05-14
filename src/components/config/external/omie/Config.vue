<template>
  <div class="app-config-omie">
    <div class="app-config-omie__header">
      <div class="app-config-omie__header__title">
        <div class="app-config-omie__header__title__icon-container">
          <img class="app-config-omie__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="app-config-omie__header__title__name">{{ app.name }}</div>
      </div>
      <span class="app-config-omie__header__description" v-html="$t('omie.config.description')" />
    </div>

    <div class="app-config-omie__settings__content">
      <unnnic-tab class="app-config-omie__tabs" :tabs="tabs" initialTab="config">
        <template #tab-head-config> {{ $t('omie.config.tabs.config.title') }} </template>
        <template #tab-panel-config>
          <div class="app-config-omie__tabs__config__content">
            <div class="app-config-omie__tabs__config__content__scroll">
              <unnnic-input
                v-model="name"
                class="app-config-omie__settings__content__inputs__name"
                type="normal"
                :disabled="disabledForm"
                :label="$t('omie.config.tabs.config.inputs.name.label')"
              />
              <unnnic-input
                v-model="appKey"
                class="app-config-omie__settings__content__inputs__key"
                type="normal"
                :disabled="disabledForm"
                :label="$t('omie.config.tabs.config.inputs.app_key.label')"
              />
              <unnnic-input
                v-model="appSecret"
                class="app-config-omie__settings__content__inputs__secret"
                type="normal"
                :disabled="disabledForm"
                :label="$t('omie.config.tabs.config.inputs.app_secret.label')"
              />
              <div></div>
            </div>
          </div>
          <div class="app-config-omie__tabs__config__content__buttons">
            <unnnic-button
              class="app-config-omie__tabs__config__content__buttons__cancel"
              type="tertiary"
              size="large"
              :text="$t('apps.config.cancel')"
              @click="closeConfig"
            />

            <unnnic-button
              class="app-config-omie__tabs__config__content__buttons__save"
              type="secondary"
              size="large"
              :text="$t('omie.config.connect')"
              :disabled="disabledForm"
              :loading="loadingUpdateAppConfig"
              @click="saveConfig"
            />
          </div>
        </template>
      </unnnic-tab>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import unnnic from '@weni/unnnic-system';

  export default {
    name: 'omie-config',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        name: this.app.config.name ?? null,
        appSecret: this.app.config.app_secret ?? null,
        appKey: this.app.config.app_key ?? null,
        tabs: ['config'],
        disabledForm: !!this.app.config.name,
      };
    },
    computed: {
      ...mapState(app_type, ['loadingUpdateAppConfig', 'errorUpdateAppConfig']),
    },
    methods: {
      ...mapActions(app_type, ['updateAppConfig']),

      async saveConfig() {
        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            config: {
              name: this.name,
              app_secret: this.appSecret,
              app_key: this.appKey,
            },
          },
        };

        await this.updateAppConfig(data);

        if (this.errorUpdateAppConfig) {
          this.callModal({ type: 'error', text: this.$t('omie.errors.configure') });
          return;
        }

        this.callModal({ type: 'success', text: this.$t('omie.success.configure') });
        this.$root.$emit('updateGrid');
        this.disabledForm = true;
      },
      closeConfig() {
        this.$emit('closeModal');
      },
      callModal({ text, type }) {
        unnnic.unnnicCallAlert({
          props: {
            text,
            type,
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-omie {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
      display: flex;
      margin: $unnnic-spacing-inset-lg;
      margin-bottom: $unnnic-spacing-stack-sm;
      flex-direction: column;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;
          align-items: center;

          background-color: rgba(0, 227, 245, 0.1);

          &__icon {
            width: $unnnic-icon-size-md;
            height: $unnnic-icon-size-md;
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
        margin-top: $unnnic-inline-sm;
        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;

        ::v-deep {
          a {
            font-weight: $unnnic-font-weight-bold;
            color: $unnnic-color-neutral-cloudy;
          }
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
        flex: 1;
        overflow: auto;
        color: $unnnic-color-neutral-cloudy;
        font-size: $unnnic-font-size-body-gt;
        line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
        margin: $unnnic-spacing-inset-lg;
        margin-top: 0;

        &__inputs {
          display: flex;
          flex-direction: row;
          gap: $unnnic-spacing-inline-xs;
        }
      }
    }

    &__tabs {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: hidden;
      width: 100%;

      ::v-deep .tab-body {
        display: flex;
        height: 100%;
        overflow-y: auto;
      }
      ::v-deep .tab-panel {
        width: 100%;

        display: flex;
        flex-direction: column;
        height: 100%;
      }
      &__config {
        &__content {
          padding-right: $unnnic-spacing-inline-xs;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: auto;

          &__buttons {
            margin-top: $unnnic-spacing-stack-md;
            display: flex;
            flex-direction: row;
            width: 100%;

            &__cancel,
            &__save {
              display: flex;
              width: 300px;
              flex-grow: 1;
            }
          }

          &__scroll {
            display: flex;
            flex-direction: column;
            overflow: auto;
            padding-right: $unnnic-spacing-stack-sm;
          }
        }
      }
    }
  }
</style>
