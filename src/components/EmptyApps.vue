<template>
  <div class="empty">
    <img class="empty__image" src="@/assets/svgs/empty-apps.svg" />
    <span class="empty__title">
      {{ `${$t('apps.discovery.search.empty_title')} “${term}”.` }}
    </span>
    <span class="empty__description">
      {{ $t('apps.discovery.search.empty_description') }}
      <span class="empty__description__link" @click="() => $emit('clear')">
        {{ $t('apps.discovery.search.empty_link') }}
      </span>
    </span>
  </div>
</template>
<script>
  export default {
    props: {
      term: {
        type: String,
        required: true,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $unnnic-spacing-stack-xs;
    margin-top: $unnnic-spacing-stack-xl;

    &__title {
      font-size: $unnnic-font-size-title-sm;
      line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-bold;
    }

    &__description {
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-regular;
      color: $unnnic-color-neutral-cloudy;

      &__link {
        font-weight: $unnnic-font-weight-bold;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
</style>
