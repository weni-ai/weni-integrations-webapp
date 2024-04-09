<template>
  <div>
    <div class="title">
      <unnnic-skeleton-loading tag="div" width="40px" height="40px" />
      <unnnic-skeleton-loading tag="div" width="208px" height="40px" />
    </div>
    <div class="grid">
      <unnnic-skeleton-loading
        v-for="index in 4"
        :key="index"
        class="grid__item"
        tag="div"
        width="256px"
        height="200px"
      />
    </div>
  </div>
</template>

<script>
  // import SkeletonLoading from '../Skeleton/SkeletonLoading.vue';
  export default {};
</script>

<style lang="scss" scoped>
  .title {
    display: flex;
    gap: $unnnic-spacing-inline-xs;
    margin: $unnnic-spacing-stack-md 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(256px, 256px));
    grid-gap: $unnnic-spacing-stack-sm;
    align-items: flex-start;
  }
</style>
