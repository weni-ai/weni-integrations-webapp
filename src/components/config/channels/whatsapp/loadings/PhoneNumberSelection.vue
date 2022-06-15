<template>
  <div class="whatsapp-phone-number-loading">
    <unnnic-skeleton-loading
      class="whatsapp-phone-number-loading__content"
      tag="div"
      height="38px"
    />
    <div class="whatsapp-phone-number-loading__buttons">
      <unnnic-button
        class="whatsapp-phone-number-loading__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('WhatsAppCloud.config.phone_numbers.connect_later')"
      ></unnnic-button>

      <unnnic-button
        class="whatsapp-phone-number-loading__buttons__save"
        type="terciary"
        size="large"
        :text="$t('general.loading')"
        iconLeft="loading-circle-1"
      ></unnnic-button>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .whatsapp-phone-number-loading {
    &__content {
      height: $unnnic-avatar-size-sm;
    }

    &__buttons {
      display: flex;
      justify-content: space-around;
      margin-top: $unnnic-spacing-stack-lg;

      &__save {
        ::v-deep svg {
          animation: rotation 1.5s infinite linear;
        }
      }
    }
  }
</style>
