<template>
  <div class="steps">
    <div class="step" v-for="(step, index) in steps" :key="index">
      <div :class="['indicator', index <= currentStep ? 'indicator--filled' : null]" />

      <span :class="['label', index <= currentStep ? 'label--filled' : null]">
        {{ $t(step) }}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StepIndicator',
    props: {
      steps: {
        type: Array,
        required: true,
      },
      currentStep: {
        type: Number,
        default: 0,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .steps {
    display: flex;
    align-items: flex-start;
    gap: $unnnic-spacing-xs;
    align-self: stretch;

    .step {
      flex: 1;
    }
  }
  .indicator {
    height: $unnnic-spacing-xs;
    border-radius: $unnnic-border-radius-pill;
    background: $unnnic-color-bg-muted;

    &--filled {
      background: $unnnic-color-bg-accent-strong;
    }
  }

  .label {
    color: $unnnic-color-fg-base;
    font-size: $unnnic-font-size-body-md;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-medium;

    &--filled {
      color: $unnnic-color-fg-accent;
    }
  }
</style>
