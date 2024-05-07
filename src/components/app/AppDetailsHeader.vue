<template>
  <div class="app-details-header" :style="cssVars">
    <div class="app-details-header__icon">
      <img class="app-details-header__icon__src" :src="app?.icon" />
    </div>
    <div class="app-details-header__content">
      <div class="app-details-header__content__title">{{ app?.name }}</div>
      <div class="app-details-header__content__description">{{ $t(app?.summary || '') }}</div>
    </div>
    <integrate-button
      ref="unnnic-button-add"
      class="app-details-header__button"
      type="add"
      size="large"
      icon="add-1"
      :app="app"
      :disabled="!app?.can_add"
      :text="$t('apps.details.header.add')"
      loadingPosition="left"
    />

    <add-modal ref="addModal" />
  </div>
</template>

<script>
  import addModal from '../AddModal/index.vue';
  import IntegrateButton from '../IntegrateButton/index.vue';

  export default {
    name: 'AppDetailsHeader',
    components: { addModal, IntegrateButton },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    computed: {
      cssVars() {
        return {
          '--icon-bg-color': this.app?.bg_color || 'white',
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-details-header {
    display: flex;
    flex-direction: row;

    &__icon {
      display: flex;
      height: 80px;
      width: 80px;
      background-color: var(--icon-bg-color);
      border-radius: $unnnic-border-radius-md;
      justify-content: center;

      &__src {
        padding: $unnnic-inset-xs;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family: $unnnic-font-family-secondary;
      margin-left: $unnnic-inline-sm;
      &__title {
        font-weight: $unnnic-font-weight-bold;
        font-size: $unnnic-font-size-title-md;
        line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
        color: $unnnic-color-neutral-black;
      }

      &__description {
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-lg;
        line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;
      }
    }

    &__button {
      align-self: flex-start;
      margin-left: auto;
    }
  }
</style>
