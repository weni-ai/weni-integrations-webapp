<template>
  <div class="whatsapp-phone-number-loading">
    <unnnic-skeleton-loading
      class="whatsapp-phone-number-loading__content"
      tag="div"
      height="38px"
    />
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .whatsapp-phone-number-loading {
    &__content {
      height: $unnnic-avatar-size-sm;
    }
  }
</style>
