<template>
  <div class="whatsapp-config-loading">
    <unnnic-tab></unnnic-tab>
    <div class="account">
      <unnnic-skeleton-loading tag="div" width="100%" height="10vh" />
    </div>
    <div class="channel">
      <unnnic-skeleton-loading tag="div" width="100%" height="30vh" />
    </div>
    <div class="waba">
      <unnnic-skeleton-loading tag="div" width="100%" height="28vh" />
    </div>
    <unnnic-button
      class="whatsapp-config-loading__button"
      type="secondary"
      size="large"
      :text="$t('general.Close')"
    />
  </div>
</template>

<script>
  export default {};
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
