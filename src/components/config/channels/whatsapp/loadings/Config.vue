<template>
  <div class="whatsapp-config-loading">
    <UnnnicTab></UnnnicTab>
    <div class="account">
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="10vh"
      />
    </div>
    <div class="channel">
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="30vh"
      />
    </div>
    <div class="waba">
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="28vh"
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
