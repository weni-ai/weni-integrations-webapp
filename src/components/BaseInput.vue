<template>
  <unnnic-input
    ref="input"
    :disabled="disabled"
    :value="value"
    :label="label"
    :placeholder="placeholder"
    :maxlength="maxlength"
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
      replaceRegex: {
        type: RegExp,
        default: null,
      },
    },
    mounted() {
      const nativeInput = this.$refs.input.$el.querySelector('input');

      nativeInput.addEventListener('input', () => {
        if (this.replaceRegex) {
          nativeInput.value = nativeInput.value.replace(this.replaceRegex, '');
        }
        this.$emit('input', nativeInput.value);
      });
      nativeInput.addEventListener('paste', () => {
        if (this.replaceRegex) {
          nativeInput.value = nativeInput.value.replace(this.replaceRegex, '');
        }

        this.$emit('input', nativeInput.value);
      });
    },
  };
</script>

<style></style>
