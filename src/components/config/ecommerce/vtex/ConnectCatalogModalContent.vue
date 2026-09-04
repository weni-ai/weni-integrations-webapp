<template>
  <div class="modal">
    <div class="modal__content">
      <div class="modal__content__form">
        <UnnnicInput
          v-model="name"
          class="modal__content__form__input__name"
          :label="$t('vtex.connect_catalog.name')"
          :placeholder="$t('vtex.connect_catalog.name_placeholder')"
        />

        <span
          class="modal__content__form__footer"
          v-html="$t('vtex.connect_catalog.footer')"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectCatalogModalContent',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: '',
    };
  },
  methods: {
    connectCatalog() {
      this.$emit('connectCatalog', {
        name: this.name,
      });

      this.closeModal();
    },
    closeModal() {
      this.$emit('closeModal');
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-md;
  padding: $unnnic-space-4;

  &__content {
    display: flex;
    flex-direction: column;
    text-align: left;

    &__form {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-sm;

      &__footer {
        margin-top: $unnnic-spacing-stack-xs;
        color: $unnnic-color-fg-base;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-medium;
      }
    }
  }
}
</style>
