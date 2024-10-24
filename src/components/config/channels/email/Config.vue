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
      <unnnic-label
        label="Conecte seu e-mail e automatize o atendimento ao cliente com mais facilidade."
      />
      <div class="app-config-email__settings__content__divider" />
      <div class="app-config-email__settings__content__config">
        <p class="app-config-email__settings__content__config__title">Configuração de Solução</p>
        <unnnic-label label="Preencha os campos abaixo para integrar um e-mail" />
      </div>
      <div class="app-config-email__settings__content__inputs">
        <div class="app-config-email__settings__content__inputs__type">
          <p>Selecione o tipo de email</p>
          <unnnic-radio value="gmail" v-model="selectedType">Gmail</unnnic-radio>
          <unnnic-radio value="other" v-model="selectedType">Other</unnnic-radio>
        </div>

        <div class="app-config-email__settings__content__inputs__SMPT">
          <unnnic-form-element
            label="Servidor SMTP"
            message="Endereço do servidor SMTP para envio de e-mails."
          >
            <unnnic-input
              class="server"
              v-model="smtp_host"
              size="md"
              type="normal"
              nativeType="normal"
              placeholder="smtp.exemplo.com"
            />
          </unnnic-form-element>
          <unnnic-form-element label="Porta SMTP" message="Porta de comunicação do servidor SMTP.">
            <unnnic-input
              class="port"
              v-model="smtp_port"
              size="md"
              type="normal"
              nativeType="normal"
              placeholder="Ex:. 587 ou 465."
            />
          </unnnic-form-element>
        </div>
        <div class="app-config-email__settings__content__inputs__IMAP">
          <unnnic-form-element
            label="Servidor IMAP"
            message="Endereço do servidor IMAP para envio de e-mails."
          >
            <unnnic-input
              class="server"
              v-model="imap_host"
              size="md"
              type="normal"
              nativeType="normal"
              placeholder="smtp.exemplo.com"
            />
          </unnnic-form-element>
          <unnnic-form-element
            class="port"
            label="Porta IMAP"
            message="Porta de comunicação do servidor IMAP."
          >
            <unnnic-input
              class="port"
              v-model="imap_port"
              size="md"
              type="normal"
              nativeType="normal"
              placeholder="Ex:. 993"
            />
          </unnnic-form-element>
        </div>
        <div class="app-config-email__settings__content__inputs__login">
          <unnnic-form-element label="Username" message="O e-mail utilizado para ser autenticado.">
            <unnnic-input
              v-model="username"
              size="md"
              type="normal"
              nativeType="normal"
              placeholder="seu.email@exemplo.com"
            />
          </unnnic-form-element>
          <unnnic-form-element label="Password">
            <unnnic-input
              v-model="password"
              size="md"
              type="normal"
              nativeType="normal"
              placeholder="Digite sua senha"
            />
          </unnnic-form-element>
        </div>
      </div>
    </div>

    <div class="app-config-telegram__settings__buttons">
      <unnnic-button
        class="app-config-telegram__settings__buttons__cancel"
        type="tertiary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="closeConfig"
      ></unnnic-button>

      <unnnic-button
        class="app-config-telegram__settings__buttons__save"
        type="secondary"
        size="large"
        :text="$t('apps.config.validate')"
        :disabled="this.app.config.token"
        @click="saveConfig"
      ></unnnic-button>
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
        selectedType: '',
        smtp_host: this.app.config.smtp_host,
        smtp_port: this.app.config.smtp_port,
        imap_host: this.app.config.imap_host,
        imap_port: this.app.config.imap_port,
        username: this.app.config.username,
        password: this.app.config.password,
      };
    },
    computed: {
      ...mapState(auth_store, ['project']),
    },
    methods: {
      ...mapActions(app_type, ['updateAppConfig']),
      selectType(type) {
        this.selectedType = type;
      },
      async saveConfig() {
        const payloadGeneric = {
          project_uuid: this.project,
          config: {
            username: this.username,
            password: this.password,
            smtp_host: this.smtp_host,
            smtp_port: this.smtp_port,
            imap_host: this.imap_host,
            imap_port: this.imap_port,
          },
          channeltype_code: 'EM',
        };

        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: payloadGeneric,
        };

        if (this.selectedType === 'other') {
          try {
            await this.updateAppConfig(data);
          } catch (error) {
            unnnic.unnnicCallAlert({
              props: {
                text: 'Errooou',
                type: 'error',
              },
              seconds: 3,
            });
          }
        }
      },
      closeConfig() {
        this.$emit('closeModal');
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
    }
  }
</style>
