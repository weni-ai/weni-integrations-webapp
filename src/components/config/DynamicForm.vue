<template>
  <div class="dynamic-form">
    <div class="dynamic-form__fields" v-for="(input, index) in inputs" :key="index">
      <unnnic-input
        v-if="input.type === 'input'"
        ref="unnnic-input"
        :class="[!input.label && 'dynamic-form__fields--top-margin', 'dynamic-form__fields__input']"
        :type="getType(input)"
        v-model="selectedInputs[index]"
        :label="input.label && $t(input.label)"
        :placeholder="input.placeholder && $t(input.placeholder)"
        :message="input.message && $t(input.message)"
        @input="emitInput"
      />

      <div v-if="input.type === 'select'">
        <unnnic-label :label="$t(input.label)" />
        <unnnic-select-smart
          ref="unnnic-select"
          :options="filterOptions(input.options)"
          :modelValue="selectedInputs[index]"
          @update:modelValue="
            (event) => {
              selectedInputs[index] = event;
              emitInput();
            }
          "
        />
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
        v-model="selectedInputs[index]"
        :textRight="input.label"
        @change="emitInput"
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
    data() {
      return {
        selectedInputs: [],
      };
    },
    methods: {
      emitInput() {
        this.selectedInputs.forEach((item, index) => {
          const type = this.inputs[index]?.type;
          switch (type) {
            case 'select':
              this.$emit('input', { index, value: item[0].value });
              break;
            default:
              this.$emit('input', { index, value: item });
              break;
          }
        });
      },
      getType(input) {
        return input.error ? 'error' : 'normal';
      },
      filterOptions(options) {
        return options.length
          ? options.map((item) => {
              return {
                value: item.value,
                label: item.text,
              };
            })
          : [];
      },
      handleUpload(value, index) {
        (this.selectedInputs[index] = value), this.emitInput();
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
