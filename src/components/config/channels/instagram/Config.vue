<template>
  <div class="app-config-instagram">
    <div class="app-config-instagram__header">
      <div class="app-config-instagram__header__title">
        <div class="app-config-instagram__header__title__icon-container">
          <img class="app-config-instagram__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div ref="title-name" class="app-config-instagram__header__title__name">{{ app.name }}</div>
      </div>
    </div>

    <div class="app-config-instagram__settings__content">
      <unnnic-label ref="label" :label="$t('instagram.config.connected_account')" />
      <div class="app-config-instagram__settings__content__inputs">
        <unnnic-input
          class="app-config-instagram__settings__content__inputs__name"
          type="normal"
          :disabled="true"
          v-model="pageName"
        />
        <unnnic-input
          class="app-config-instagram__settings__content__inputs__id"
          type="normal"
          :disabled="true"
          v-model="formattedPageId"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'instagram-config',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        pageName: this.app.config?.page_name,
      };
    },
    computed: {
      formattedPageId() {
        return `ID: ${this.app.config?.page_id}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-instagram {
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

          background-color: rgba(222, 22, 186, 0.08);

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
