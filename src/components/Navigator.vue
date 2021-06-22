<template>
  <div class="navigator">
    <div v-for="(route, index) in routes" :key="route.name" class="navigator__container">
      <router-link :to="route.path" class="navigator__container__link">
        {{ route.name }}
      </router-link>
      <unnnic-icon-svg
        v-if="index !== routes.length - 1"
        icon="arrow-right-1-1"
        size="xs"
        lineHeight="md"
        class="navigator__container__divider"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Navigator',
    props: {
      routes: {
        type: Array,
        default: null,
      },
    },
  };
</script>

<style scoped lang="scss">
  .navigator {
    display: flex;
    flex-direction: row;
    &__container {
      display: flex;
      flex-direction: row;

      &__divider {
        margin: 0 $unnnic-inline-xs;
      }

      &__link {
        text-decoration: none;
        font-family: $unnnic-font-family-secondary;
        font-size: $unnnic-font-size-body-lg;
        line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;

        color: $unnnic-color-neutral-cloudy;
        border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-cloudy;
        &.router-link-active {
          color: $unnnic-color-neutral-dark;
          font-weight: $unnnic-font-weight-bold;
          cursor: default;

          border: none;
        }
      }
    }
  }
</style>
