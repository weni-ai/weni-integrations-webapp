<template>
  <div class="dynamic-form">
    <div class="dynamic-form__fields" v-for="(input, index) in inputs" :key="index">
      <unnnic-input
        v-if="input.type === 'input'"
        ref="unnnic-input"
        :class="[!input.label && 'dynamic-form__fields--top-margin', 'dynamic-form__fields__input']"
        :type="getType(input)"
<<<<<<< HEAD
        v-model="input.value"
        :label="input.label && $t(input.label)"
        :placeholder="input.placeholder && $t(input.placeholder)"
        :message="input.message && $t(input.message)"
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
=======
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
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
          @fileChange="emitInput(index, input, $event)"
=======
          @fileChange="setInput(index, input)"
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
        />
      </div>
      <unnnic-checkbox
        v-else-if="input.type === 'checkbox'"
        class="dynamic-form__fields--top-margin"
<<<<<<< HEAD
        :value="input.value || false"
        :textRight="input.label"
        @change="emitInput(index, input, $event)"
=======
        v-model="selectedInputs[index]"
        :textRight="input.label"
        @change="emitInput"
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
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
=======
    data() {
      return {
        selectedInputs: [],
      };
    },
    methods: {
      emitInput() {
        this.selectedInputs.forEach((item, index) => {
          const type = this.inputs[index].type;
          switch (type) {
            case 'select':
              this.$emit('input', { index, value: item[0].value });
              break;
            default:
              this.$emit('input', { index, value: item });
              break;
          }
        });
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
      },
      getType(input) {
        return input.error ? 'error' : 'normal';
      },
<<<<<<< HEAD
=======
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
    },
    setSelectedInput(index, value) {
      this.selectedInputs[index] = value;
      this.emitInput();
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
