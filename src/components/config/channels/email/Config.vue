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
      <div class="app-config-email__settings__content__inputs"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'emailConfig',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        pageName: this.app.config.page_name,
      };
    },
    computed: {
      pageId() {
        return `ID: ${this.app.config.page_id}`;
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
          flex-direction: row;
          gap: $unnnic-spacing-inline-xs;

          &__name,
          &__id {
            width: 50%;
          }
        }
      }
    }
  }
</style>
