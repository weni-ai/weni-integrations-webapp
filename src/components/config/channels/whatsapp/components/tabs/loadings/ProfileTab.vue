<template>
  <div class="profile-loading">
<<<<<<< HEAD
    <unnnic-skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <unnnic-skeleton-loading
      class="profile-loading__upload"
      tag="div"
      width="100%"
      height="160px"
    />
    <unnnic-skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <unnnic-skeleton-loading class="profile-loading__desc" tag="div" width="100%" height="48px" />
    <unnnic-skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <unnnic-skeleton-loading
      class="profile-loading__company"
      tag="div"
      width="100%"
      height="48px"
    />
    <unnnic-skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <div class="profile-loading__websites">
      <unnnic-skeleton-loading tag="div" width="100%" height="48px" />
      <unnnic-skeleton-loading tag="div" width="100%" height="48px" />
    </div>
    <unnnic-skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <div class="profile-loading__email">
      <unnnic-skeleton-loading tag="div" width="100%" height="48px" />
    </div>
    <unnnic-skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <div class="profile-loading__address">
      <unnnic-skeleton-loading tag="div" width="100%" height="48px" />
=======
    <skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <skeleton-loading class="profile-loading__upload" tag="div" width="100%" height="160px" />
    <skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <skeleton-loading class="profile-loading__desc" tag="div" width="100%" height="48px" />
    <skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <skeleton-loading class="profile-loading__company" tag="div" width="100%" height="48px" />
    <skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <div class="profile-loading__websites">
      <skeleton-loading tag="div" width="100%" height="48px" />
      <skeleton-loading tag="div" width="100%" height="48px" />
    </div>
    <skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <div class="profile-loading__email">
      <skeleton-loading tag="div" width="100%" height="48px" />
    </div>
    <skeleton-loading class="profile-loading__title" tag="div" width="20%" height="22px" />
    <div class="profile-loading__address">
      <skeleton-loading tag="div" width="100%" height="48px" />
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD
  export default {};
=======
  import skeletonLoading from '@/components/Skeleton/SkeletonLoading.vue';
  export default {
    components: { skeletonLoading },
  };
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
