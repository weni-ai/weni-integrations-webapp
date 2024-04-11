<template>
  <div class="whatsapp-config-loading">
    <unnnic-tab></unnnic-tab>
    <div class="account">
      <skeleton-loading tag="div" width="100%" height="10vh" />
    </div>
    <div class="channel">
      <skeleton-loading tag="div" width="100%" height="30vh" />
    </div>
    <div class="waba">
      <skeleton-loading tag="div" width="100%" height="28vh" />
    </div>
  </div>
</template>

<script>
  import skeletonLoading from '@/components/Skeleton/SkeletonLoading.vue';
  export default {
    components: { skeletonLoading },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-config-loading {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;

    &__button {
      display: flex;
      width: 50%;
      align-self: flex-end;
      margin-top: $unnnic-spacing-stack-sm;
    }
  }
</style>
