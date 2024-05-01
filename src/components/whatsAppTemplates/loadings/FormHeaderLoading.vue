<template>
  <div class="loading">
    <unnnic-skeleton-loading width="40px" height="40px" />
    <unnnic-skeleton-loading width="120px" height="40px" />

    <unnnic-skeleton-loading width="80px" height="20px" />
  </div>
</template>

<script>
  export default {
    name: 'FormHeaderLoading',
  };
</script>

<style lang="scss" scoped>
  .loading {
    display: flex;
    gap: $unnnic-spacing-inline-md;
  }
</style>
