<template>
  <div class="loading">
    <UnnnicSkeletonLoading
      width="40px"
      height="40px"
    />
    <UnnnicSkeletonLoading
      width="120px"
      height="40px"
    />

    <UnnnicSkeletonLoading
      width="80px"
      height="20px"
    />
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
