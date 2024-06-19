<template>
  <div class="dynamic-form">
    <div class="dynamic-form__fields" v-for="(input, index) in inputs" :key="index">
      <unnnic-input
        v-if="input.type === 'input'"
        ref="unnnic-input"
        :class="[!input.label && 'dynamic-form__fields--top-margin', 'dynamic-form__fields__input']"
        :type="getType(input)"
        v-model="input.value"
        :label="input.label && $t(input.label)"
        :placeholder="input.placeholder && $t(input.placeholder)"
        :message="input.message && $t(input.message)"
        @update:modelValue="($event) => emitInput(index, $event)"
      />

      <div v-if="input.type === 'select'">
        <unnnic-label :label="$t(input.label)" />
        <unnnic-select-smart ref="unnnic-select" :options="input.options" v-model="input.value" />
      </div>
      <div v-else-if="input.type === 'upload'">
        <unnnic-label :label="$t(input.label)" />
        <unnnic-upload-area
          :files="input.props.files"
          :acceptMultiple="input.props.acceptMultiple"
          :supportedFormats="input.props.supportedFormats"
          :maximumUploads="input.props.maximumUploads"
          :maxFileSize="input.props.maxFileSize"
          :filesProgress="input.props.filesProgress"
          :isUploading="input.props.isUploading"
          :canImport="input.props.canImport"
          :canDelete="input.props.canDelete"
          :shouldReplace="input.props.shouldReplace"
          @fileChange="(e) => handleUpload(e, index)"
        />
      </div>
      <unnnic-checkbox
        v-else-if="input.type === 'checkbox'"
        class="dynamic-form__fields--top-margin"
        v-model="input.value"
        :textRight="input.label"
        @change="(e) => emitInput(index, e)"
      />
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
      emitInput(index, event) {
        const type = this.inputs[index]?.type;
        switch (type) {
          case 'select':
            this.$emit('input', { index, value: event[0] });
            break;
          default:
            this.$emit('input', { index, value: event });
            break;
        }
      },
      getType(input) {
        return input.error ? 'error' : 'normal';
      },
      selectedOption(option) {
        return option;
      },
      handleUpload(value, index) {
        this.selectedInputs[index] = value;
        this.emitInput();
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

      &__input {
        ::v-deep {
          .unnnic-form__message {
            color: $unnnic-color-neutral-cloudy;
          }
        }
      }
    }
  }
</style>
