<template>
  <div class="loading-app-details">
    <unnnic-skeleton-loading tag="div" height="150px" width="100%" />

    <div class="loading-app-details__title">
      <unnnic-skeleton-loading tag="div" height="70px" width="70px" />
      <unnnic-skeleton-loading tag="div" height="48px" width="160px" />
    </div>

    <unnnic-skeleton-loading tag="div" height="130px" width="100%" />

    <div class="loading-app-details__description">
      <unnnic-skeleton-loading tag="div" height="207px" width="65vw" />
      <unnnic-skeleton-loading tag="div" height="207px" width="25vw" />
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .loading-app-details {
    width: 100%;
    margin-top: $unnnic-spacing-stack-xl;

    &__title {
      display: flex;
      justify-content: space-between;
      margin: $unnnic-spacing-stack-md 0;
    }

    &__description {
      display: flex;
      justify-content: space-between;
      margin-top: $unnnic-spacing-stack-xl;
    }
  }
</style>
