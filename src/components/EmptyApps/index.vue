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
  @import './styles.scss';
</style>
