<template>
  <div class="app-config-email">
    <div class="app-config-email__header">
      <div class="app-config-email__header__title">
        <div class="app-config-email__header__title__icon-container">
          <img class="app-config-email__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="app-config-email__header__title__name">{{ app.name }}</div>
      </div>
    </div>

    <div class="app-config-email__settings__content">
      <unnnic-label :label="`${$t('email.config.description')}`" />
      <div class="app-config-email__settings__content__divider" />
      <div class="app-config-email__settings__content__config">
        <p class="app-config-email__settings__content__config__title">
          {{ $t('email.config.config_solution') }}
        </p>
        <unnnic-label :label="`${$t('email.config.config_solution_subtitle')}`" />
      </div>
      <div class="app-config-email__settings__content__inputs">
        <div class="app-config-email__settings__content__inputs__SMPT">
          <unnnic-form-element
            :label="$t('email.config.smpt_server.title')"
            :message="$t('email.config.smpt_server.description')"
          >
            <unnnic-input
              class="server"
              :modelValue="smtp_host.value"
              @update:modelValue="(value) => updateValue('smtp_host', value)"
              size="md"
              nativeType="normal"
              placeholder="smtp.exemplo.com"
              :message="smtp_host.error || ''"
              :type="smtp_host.error ? 'error' : 'normal'"
            />
          </unnnic-form-element>
          <unnnic-form-element
            :label="$t('email.config.smpt_port.title')"
            :message="$t('email.config.smpt_port.description')"
          >
            <unnnic-input
              class="port"
              :modelValue="smtp_port.value"
              @update:modelValue="(value) => updateValue('smtp_port', value)"
              size="md"
              nativeType="normal"
              placeholder="Ex:. 587 ou 465."
              :message="smtp_port.error || ''"
              :type="smtp_port.error ? 'error' : 'normal'"
            />
          </unnnic-form-element>
        </div>
        <div class="app-config-email__settings__content__inputs__IMAP">
          <unnnic-form-element
            :label="$t('email.config.imap_server.title')"
            :message="$t('email.config.imap_server.description')"
          >
            <unnnic-input
              class="server"
              :modelValue="imap_host.value"
              @update:modelValue="(value) => updateValue('imap_host', value)"
              size="md"
              nativeType="normal"
              placeholder="smtp.exemplo.com"
              :message="imap_host.error || ''"
              :type="imap_host.error ? 'error' : 'normal'"
            />
          </unnnic-form-element>
          <unnnic-form-element
            class="port"
            :label="$t('email.config.imap_port.title')"
            :message="$t('email.config.imap_port.description')"
          >
            <unnnic-input
              class="port"
              :modelValue="imap_port.value"
              @update:modelValue="(value) => updateValue('imap_port', value)"
              size="md"
              nativeType="normal"
              placeholder="Ex:. 993"
              :message="imap_port.error || ''"
              :type="imap_port.error ? 'error' : 'normal'"
            />
          </unnnic-form-element>
        </div>
        <div class="app-config-email__settings__content__inputs__login">
          <unnnic-form-element
            :label="$t('email.config.username')"
            :message="$t('email.config.username_description')"
          >
            <unnnic-input
              :modelValue="username.value"
              @update:modelValue="(value) => updateValue('username', value)"
              size="md"
              nativeType="normal"
              placeholder="seu.email@exemplo.com"
              :message="username.error || ''"
              :type="username.error ? 'error' : 'normal'"
            />
          </unnnic-form-element>
          <unnnic-form-element :label="$t('email.config.password')">
            <unnnic-input
              :modelValue="password.value"
              @update:modelValue="(value) => updateValue('password', value)"
              size="md"
              nativeType="normal"
              placeholder="Digite sua senha"
              :message="password.error || ''"
              :type="password.error ? 'error' : 'normal'"
            />
          </unnnic-form-element>
        </div>
      </div>
    </div>
    <div class="app-config-email__settings__buttons">
      <unnnic-button
        class="app-config-email__settings__buttons__cancel"
        type="tertiary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="closeConfig"
      />

      <unnnic-button
        class="app-config-email__settings__buttons__save"
        size="large"
        :text="$t('apps.config.validate')"
        :disabled="this.app.config.token || disableValidate"
        @click="saveConfig"
      />
    </div>
  </div>
</template>

<script>
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { auth_store } from '@/stores/modules/auth.store';
  import { mapActions, mapState } from 'pinia';
  import unnnic from '@weni/unnnic-system';

  export default {
    name: 'emailConfig',
    props: {
      app: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        pageName: this.app.config.page_name,
        smtp_host: {
          value: this.app.config.smtp_host || null,
          error: null,
        },

        smtp_port: {
          value: this.app.config.smtp_port || null,
          error: null,
        },

        imap_host: {
          value: this.app.config.imap_host || null,
          error: null,
        },

        imap_port: {
          value: this.app.config.imap_port || null,
          error: null,
        },

        username: {
          value: this.app.config.username || null,
          error: null,
        },

        password: {
          value: this.app.config.password || null,
          error: null,
        },
        disableValidate: false,
      };
    },
    computed: {
      ...mapState(auth_store, ['project']),
    },
    methods: {
      ...mapActions(app_type, ['updateAppConfig', 'errorUpdateAppConfig']),
      selectType(type) {
        this.selectedType = type;
      },
      async saveConfig() {
        const payloadGeneric = {
          project_uuid: this.project,
          config: {
            username: this.username.value,
            password: this.password.value,
            smtp_host: this.smtp_host.value,
            smtp_port: this.smtp_port.value,
            imap_host: this.imap_host.value,
            imap_port: this.imap_port.value,
          },
          channeltype_code: 'EM',
        };

        for (let key in payloadGeneric.config) {
          this.errorFor(key);
        }
        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: payloadGeneric,
        };

        if (this.selectedType === 'other') {
          try {
            await this.updateAppConfig(data);
            if (this.errorUpdateAppConfig) {
              throw new Error(this.errorUpdateAppConfig);
            }
            unnnic.unnnicCallAlert({
              props: {
                text: this.$t('apps.config.integration_success'),
                type: 'success',
              },
              seconds: 3,
            });
          } catch (err) {
            let errorMessage = this.$t('apps.details.status_error');

            if (err.response?.status === 400) {
              this.invalidToken = true;
              errorMessage = this.$t('telegram.config.errors.invalidToken');
            }

            unnnic.unnnicCallAlert({
              props: {
                text: errorMessage,
                type: 'error',
              },
              seconds: 3,
            });
          } finally {
            this.emit('updateGrid');
          }
        }
      },
      closeConfig() {
        this.$emit('closeModal');
      },
      errorFor(key) {
        const item = this.$data[key];
        if (item.value === null && this.disableValidate) {
          return;
        }
        if (!(item.value !== null && item.value.trim())) {
          this.$data[key].error = this.$t('errors.empty_input');
          return;
        }
        if (item.value.length > 20) {
          this.$data[key].error = 'By default, the maximum is 20 characters.';
          return;
        }
        this.$data[key].error = null;
        if (!this.app.config.token) {
          this.disableValidate = false;
        }
      },
      updateValue(key, value) {
        this.$data[key].value = value;
        if (value && !this.app.config.token) {
          this.disableValidate = false;
        }
        this.errorFor(key);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-email {
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
    height: -moz-available;
    padding: $unnnic-inset-lg;
    overflow-y: scroll;

    &__header {
      display: flex;
      margin-bottom: $unnnic-spacing-stack-md;
      flex-direction: column;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;

          background-color: rgba(197, 220, 245, 0.5);

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

        &__divider {
          box-sizing: border-box;
          margin-top: $unnnic-spacing-stack-sm;
          margin-bottom: $unnnic-spacing-stack-md;
          border-top: 1px solid $unnnic-color-neutral-soft;
        }

        &__config {
          display: flex;
          flex-direction: column;
          &__title {
            margin: 0 !important;
            font-family: $unnnic-font-family-secondary;
            font-weight: $unnnic-font-weight-bold;
            font-size: $unnnic-font-size-body-lg;
            color: $unnnic-color-neutral-darkest;
          }
        }

        &__inputs {
          display: flex;
          flex-direction: column;
          gap: $unnnic-spacing-inline-xs;

          &__type {
            font-family: $unnnic-font-family-secondary;
            font-size: $unnnic-font-size-body-gt;
          }

          &__SMPT,
          &__IMAP {
            display: flex;
            flex-direction: row;
            gap: $unnnic-spacing-inline-md;
            width: 100%;

            .server {
              ::v-deep .unnnic-form-input {
                display: flex;
                max-width: 364px;
              }
            }

            .port {
              ::v-deep .unnnic-form-input {
                max-width: 198px;
              }
            }
          }
        }
      }

      &__buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: $unnnic-spacing-inline-sm 0;

        ::v-deep .unnnic-button {
          width: 100%;
        }
      }
    }
  }
</style>
