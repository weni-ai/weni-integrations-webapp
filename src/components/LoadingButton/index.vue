<template>
  <unnnic-button
    :class="['loading-button', { 'loading-button--loading': isLoading }]"
    :type="type"
    :size="size"
    :disabled="disabled"
    :text="isLoading ? loadingText : text"
    :iconLeft="loadingPosition === 'left' && isLoading ? 'loading-circle-1' : iconLeft"
    :iconCenter="loadingPosition === 'center' && isLoading ? 'loading-circle-1' : iconCenter"
    @click.stop="() => !isLoading && !disabled && $emit('clicked')"
    ref="unnnic-button"
  ></unnnic-button>
</template>

<script>
  export default {
    name: 'LoadingButton',
    props: {
      type: {
        type: String,
        default: 'tertiary',
      },
      size: {
        type: String,
        default: 'large',
      },
      isLoading: {
        type: Boolean,
        default: false,
      },
      loadingText: {
        type: String,
        default: null,
      },
      loadingPosition: {
        type: String,
        default: 'left',
        validator(value) {
          return ['left', 'center', 'right'].indexOf(value) !== -1;
        },
      },
      text: {
        type: String,
        default: null,
      },
      iconLeft: {
        type: String,
        default: null,
      },
      iconCenter: {
        type: String,
        default: null,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style scoped lang="scss">
  @import './styles.scss';
</style>
