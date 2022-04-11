<template>
  <span :class="['status', `${status}`]" />
</template>

<script>
  export default {
    name: 'StatusIndicator',
    props: {
      status: {
        type: String,
        default: 'green',
        validator(value) {
          return ['green', 'yellow', 'red'].includes(value);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .status {
    height: 8px;
    border-radius: $unnnic-border-radius-pill;
    display: inline-block;

    width: 8px;
    min-width: 8px;
    align-self: center;

    &.green {
      background-color: $unnnic-color-feedback-green;
    }

    &.yellow {
      background-color: $unnnic-color-feedback-yellow;
    }

    &.red {
      background-color: $unnnic-color-feedback-red;
    }
  }
</style>
