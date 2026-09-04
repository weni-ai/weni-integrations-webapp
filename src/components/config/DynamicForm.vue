<template>
  <div class="dynamic-form">
    <div class="dynamic-form__fields" v-for="(input, index) in inputs" :key="index">
      <unnnic-input
        v-if="input.type === 'input'"
        ref="unnnic-input"
        :class="[!input.label && 'dynamic-form__fields--top-margin', 'dynamic-form__fields__input']"
        :type="getType(input)"
        v-model="input.value"
        :label="input.label && getValue(input, 'label')"
        :placeholder="input.placeholder && getValue(input, 'placeholder')"
        :message="input.message && getValue(input, 'message')"
        @update:modelValue="(e) => emitInput(index, e)"
      />

      <div v-if="input.type === 'select'">
        <unnnic-label :label="input.label && getValue(input, 'label')" />
        <unnnic-select
          ref="unnnic-select"
          :options="selectOptions(input)"
          v-model="input.value"
          :placeholder="input.placeholder && getValue(input, 'placeholder')"
          @update:modelValue="(e) => emitInput(index, e)"
        />
      </div>
      <div v-else-if="input.type === 'upload'">
        <unnnic-label :label="input.label && getValue(input, 'label')" />
        <unnnic-upload-area
          ref="unnnic-upload"
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
          @fileChange="(e) => emitInput(index, e)"
        />
      </div>
      <unnnic-checkbox
        ref="unnnic-checkbox"
        v-else-if="input.type === 'checkbox'"
        class="dynamic-form__fields--top-margin"
        v-model="input.value"
        :textRight="input.label && getValue(input, 'label')"
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
        default: () => [],
      },
      channelCode: {
        type: String,
        default: '',
      },
    },
    methods: {
      emitInput(index, event) {
        this.$emit('input', { index, value: event });
      },
      selectOptions(input) {
        return (input.options || []).map((option) => ({
          value: option.value,
          label: option.label || option.text,
        }));
      },
      getType(input) {
        return input.error ? 'error' : 'normal';
      },
      getValue(input, type) {
        const key = `channels.inputs.${this.channelCode}.${input.name}.${type}`;
        return this.$te(key) ? this.$t(key) : this.$t(input[type]);
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
        :deep(.unnnic-form__message) {
          color: $unnnic-color-fg-base;
        }
      }
    }
  }
</style>
