<template>
  <div class="dynamic-form">
    <div class="dynamic-form__fields" v-for="(input, index) in inputs" :key="index">
      <unnnic-input
        v-if="input.type === 'input'"
        :class="[!input.label && 'dynamic-form__fields--top-margin']"
        v-model="inputs[index].value"
        :label="input.label && $t(input.label)"
        :placeholder="input.placeholder && $t(input.placeholder)"
        @input="emitInput(index, input, $event)"
      />
      <unnnic-select
        v-else-if="input.type === 'select'"
        :placeholder="input.placeholder && $t(input.placeholder)"
        :label="input.label && $t(input.label)"
        :value="input.value"
        @input="emitInput(index, input, $event)"
      >
        <option v-for="(option, index) in input.options" :key="index" :value="option.value">
          {{ option.text }}
        </option>
      </unnnic-select>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DynamicForm',
    props: {
      inputs: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      emitInput(index, input, value) {
        switch (input.type) {
          case 'select':
            this.$emit('input', { index, value: input.options[value].value });
            break;
          default:
            this.$emit('input', { index, value });
            break;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dynamic-form {
    &__fields {
      &--top-margin {
        margin-top: $unnnic-spacing-stack-xs;
      }
    }
  }
</style>
