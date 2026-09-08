<template>
  <div class="loading-app-details">
    <UnnnicSkeletonLoading
      tag="div"
      height="150px"
      width="100%"
    />

    <div class="loading-app-details__title">
      <UnnnicSkeletonLoading
        tag="div"
        height="70px"
        width="70px"
      />
      <UnnnicSkeletonLoading
        tag="div"
        height="48px"
        width="160px"
      />
    </div>

    <UnnnicSkeletonLoading
      tag="div"
      height="130px"
      width="100%"
    />

    <div class="loading-app-details__description">
      <UnnnicSkeletonLoading
        tag="div"
        height="207px"
        width="65vw"
      />
      <UnnnicSkeletonLoading
        tag="div"
        height="207px"
        width="25vw"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkeletonLoading',
};
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
