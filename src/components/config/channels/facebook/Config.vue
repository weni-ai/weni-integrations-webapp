<template>
  <div class="app-config-facebook">
    <div class="app-config-facebook__header">
      <div class="app-config-facebook__header__title">
        <div class="app-config-facebook__header__title__icon-container">
          <img class="app-config-facebook__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="app-config-facebook__header__title__name">{{ app.name }}</div>
      </div>
    </div>

    <div class="app-config-facebook__settings__content">
      <unnnic-label :label="this.$t('facebook.config.connected_account')" />
      <div class="app-config-facebook__settings__content__inputs">
        <unnnic-input
          class="app-config-facebook__settings__content__inputs__name"
          type="normal"
          :disabled="true"
          :value="app.config.page_name"
        />
        <unnnic-input
          class="app-config-facebook__settings__content__inputs__id"
          type="normal"
          :disabled="true"
          :value="`ID: ${app.config.page_id}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FacebookConfig',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-facebook {
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
