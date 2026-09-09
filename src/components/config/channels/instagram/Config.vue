<template>
  <div class="app-config-instagram">
    <div class="app-config-instagram__settings__content">
      <UnnnicLabel
        ref="label"
        :label="$t('instagram.config.connected_account')"
      />
      <div class="app-config-instagram__settings__content__inputs">
        <UnnnicInput
          v-model="pageName"
          class="app-config-instagram__settings__content__inputs__name"
          type="normal"
          :disabled="true"
        />
        <UnnnicInput
          v-model="formattedPageId"
          class="app-config-instagram__settings__content__inputs__id"
          type="normal"
          :disabled="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstagramConfig',
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
