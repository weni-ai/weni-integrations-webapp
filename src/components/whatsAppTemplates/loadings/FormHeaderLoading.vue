<template>
  <div class="loading">
    <skeleton-loading width="40px" height="40px" />
    <skeleton-loading width="120px" height="40px" />

    <skeleton-loading width="80px" height="20px" />
  </div>
</template>

<script>
  import skeletonLoading from '@/components/Skeleton/SkeletonLoading.vue';

  export default {
    name: 'FormHeaderLoading',
    components: { skeletonLoading },
  };
</script>

<style lang="scss" scoped>
  .loading {
    display: flex;
    gap: $unnnic-spacing-inline-md;
  }
</style>
