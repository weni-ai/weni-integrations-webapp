<template>
  <div class="dynamic-form">
    <div class="dynamic-form__fields" v-for="(input, index) in inputs" :key="index">
      <unnnic-input
        v-if="input.type === 'input'"
        ref="unnnic-input"
        :class="[!input.label && 'dynamic-form__fields--top-margin']"
        v-model="inputs[index].value"
        :label="input.label && $t(input.label)"
        :placeholder="input.placeholder && $t(input.placeholder)"
        @input="emitInput(index, input, $event)"
      />
      <unnnic-select
        v-else-if="input.type === 'select'"
        ref="unnnic-select"
        :placeholder="input.placeholder && $t(input.placeholder)"
        :label="input.label && $t(input.label)"
        :value="input.value"
        @input="emitInput(index, input, $event)"
      >
        <option v-for="option in input.options" :key="option.key" :value="option.value">
          {{ option.text }}
        </option>
      </unnnic-select>
      <div v-else-if="input.type === 'upload'">
        <unnnic-label :label="$t(input.label)" />
        <unnnic-upload-area
          :files="input.props.files"
          :acceptMultiple="input.props.acceptMultiple"
          :supportedFormats="input.props.supportedFormats"
          :maximumUploads="input.props.maximumUploads"
          :filesProgress="input.props.filesProgress"
          :isUploading="input.props.isUploading"
          :canImport="input.props.canImport"
          :canDelete="input.props.canDelete"
          @fileChange="emitInput(index, input, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DynamicForm',
    props: {
      inputs: {
        type: Array,
        default: /* istanbul ignore next */ () => [],
      },
    },
    methods: {
      emitInput(index, input, value) {
        switch (input.type) {
          case 'select':
            // eslint-disable-next-line no-case-declarations
            const option = input.options.find((option) => option.value === value);
            this.$emit('input', { index, value: option.value });
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
