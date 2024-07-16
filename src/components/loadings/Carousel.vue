<template>
  <div>
    <unnnic-skeleton-loading class="carousel_loading" tag="div" width="100%" height="152px" />
  </div>
</template>

<script>
  export default {
    name: 'CarouselLoading',
  };
</script>

<style lang="scss" scoped>
  .carousel_loading {
    margin-bottom: $unnnic-spacing-stack-md;
  }
</style>
