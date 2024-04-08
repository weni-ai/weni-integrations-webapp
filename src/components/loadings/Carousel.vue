<template>
  <div>
    <SkeletonLoading class="carousel_loading" tag="div" width="100%" height="152px" />
  </div>
</template>

<script>
import SkeletonLoading from '@/components/Skeleton/SkeletonLoading.vue';
  export default {
    name: 'CarouselLoading',
    components: {SkeletonLoading}
  };
</script>

<style lang="scss" scoped>
  .carousel_loading {
    margin-bottom: $unnnic-spacing-stack-md;
  }
</style>
