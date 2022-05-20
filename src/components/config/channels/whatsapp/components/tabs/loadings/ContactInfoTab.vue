<template>
  <div class="contact-info-loading">
    <unnnic-skeleton-loading
      class="contact-info-loading__title"
      tag="div"
      width="20%"
      height="1vh"
    />
    <div class="contact-info-loading__websites">
      <unnnic-skeleton-loading tag="div" width="100%" height="5vh" />
      <unnnic-skeleton-loading tag="div" width="100%" height="5vh" />
    </div>
    <unnnic-skeleton-loading
      class="contact-info-loading__title"
      tag="div"
      width="20%"
      height="1vh"
    />
    <div class="contact-info-loading__email">
      <unnnic-skeleton-loading tag="div" width="100%" height="5vh" />
    </div>
    <unnnic-skeleton-loading
      class="contact-info-loading__title"
      tag="div"
      width="20%"
      height="1vh"
    />
    <div class="contact-info-loading__address">
      <unnnic-skeleton-loading tag="div" width="100%" height="5vh" />
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .contact-info-loading {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;

    &__title {
      margin: $unnnic-spacing-inline-xs 0;
    }

    &__websites {
      display: flex;
      flex-direction: column;
      gap: $unnnic-inline-nano;
    }
  }
</style>
