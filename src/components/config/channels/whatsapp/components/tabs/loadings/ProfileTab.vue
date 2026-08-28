<template>
  <div class="profile-loading">
    <UnnnicSkeletonLoading
      class="profile-loading__title"
      tag="div"
      width="20%"
      height="22px"
    />
    <UnnnicSkeletonLoading
      class="profile-loading__upload"
      tag="div"
      width="100%"
      height="160px"
    />
    <UnnnicSkeletonLoading
      class="profile-loading__title"
      tag="div"
      width="20%"
      height="22px"
    />
    <UnnnicSkeletonLoading
      class="profile-loading__desc"
      tag="div"
      width="100%"
      height="48px"
    />
    <UnnnicSkeletonLoading
      class="profile-loading__title"
      tag="div"
      width="20%"
      height="22px"
    />
    <UnnnicSkeletonLoading
      class="profile-loading__company"
      tag="div"
      width="100%"
      height="48px"
    />
    <UnnnicSkeletonLoading
      class="profile-loading__title"
      tag="div"
      width="20%"
      height="22px"
    />
    <div class="profile-loading__websites">
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="48px"
      />
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="48px"
      />
    </div>
    <UnnnicSkeletonLoading
      class="profile-loading__title"
      tag="div"
      width="20%"
      height="22px"
    />
    <div class="profile-loading__email">
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="48px"
      />
    </div>
    <UnnnicSkeletonLoading
      class="profile-loading__title"
      tag="div"
      width="20%"
      height="22px"
    />
    <div class="profile-loading__address">
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="48px"
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
.profile-loading {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  gap: $unnnic-spacing-stack-nano;
  margin-top: $unnnic-spacing-stack-nano;

  &__title {
    margin: $unnnic-spacing-inline-nano 0;
  }

  &__websites {
    display: flex;
    flex-direction: column;
    gap: $unnnic-inline-nano;
  }
}
</style>
