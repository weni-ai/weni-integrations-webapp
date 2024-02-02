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
        default: () => [],
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
    background: $unnnic-color-neutral-soft;

    &--filled {
      background: $unnnic-color-weni-600;
    }
  }

  .label {
    color: $unnnic-color-neutral-clean;
    font-size: $unnnic-font-size-body-md;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-medium;

    &--filled {
      color: $unnnic-color-weni-700;
    }
  }
</style>
