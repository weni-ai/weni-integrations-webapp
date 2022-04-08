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
    border-radius: 50%;
    display: inline-block;

    min-width: 8px;
    align-self: center;
    width: 8px;

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
