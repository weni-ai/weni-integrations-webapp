<template>
  <unnnic-input
    ref="input"
    :disabled="disabled"
    :modelValue="value"
    :label="label"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :message="message"
    :type="type"
  />
</template>

<script>
  export default {
    name: 'BaseInput',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      value: {
        type: String,
        default: '',
      },
      label: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
      maxlength: {
        type: Number,
        default: 25,
      },
      message: {
        type: String,
        default: null,
      },
      type: {
        type: String,
        default: 'normal',
        validator(value) {
          return ['normal', 'error'].indexOf(value) !== -1;
        },
      },
      replaceRegex: {
        type: RegExp,
        default: null,
      },
    },
    mounted() {
      const nativeInput = this.$refs.input.$el?.querySelector('input');

      nativeInput?.addEventListener('input', () => {
        if (this.replaceRegex) {
          nativeInput.value = nativeInput.value.replace(this.replaceRegex, '');
        }
        this.$emit('input', nativeInput.value);
      });
      nativeInput?.addEventListener('paste', () => {
        if (this.replaceRegex) {
          nativeInput.value = nativeInput.value.replace(this.replaceRegex, '');
        }

        this.$emit('input', nativeInput.value);
      });
    },
  };
</script>

<style></style>
