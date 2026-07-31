<template>
  <unnnic-dialog
    class="connect-new-whatsapp-account-modal"
    :open="show"
    @update:open="handleOpenUpdate"
  >
    <unnnic-dialog-content size="medium">
      <unnnic-dialog-header type="warning">
        <unnnic-dialog-title>
          {{ $t('WhatsAppCloud.setup.connect_new_account.title') }}
        </unnnic-dialog-title>
      </unnnic-dialog-header>

      <section
        class="connect-new-whatsapp-account-modal__description"
        v-html="$t('WhatsAppCloud.setup.connect_new_account.description')"
      />

      <unnnic-dialog-footer>
        <unnnic-button
          type="primary"
          size="large"
          :text="$t('WhatsAppCloud.setup.connect_new_account.try_again')"
          @click="handleTryAgain"
        />
      </unnnic-dialog-footer>
    </unnnic-dialog-content>
  </unnnic-dialog>
</template>

<script setup>
  defineProps({
    show: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['close', 'try-again']);

  function handleOpenUpdate(open) {
    if (!open) {
      emit('close');
    }
  }

  function handleTryAgain() {
    emit('try-again');
    emit('close');
  }
</script>

<style lang="scss" scoped>
  .connect-new-whatsapp-account-modal {
    cursor: default;

    &__description {
      text-align: left;
      padding: $unnnic-spacing-md;
      color: $unnnic-color-fg-base;

      :deep(ol) {
        padding-left: $unnnic-spacing-inline-md;
        margin: 0;
      }

      :deep(li) {
        margin-top: $unnnic-spacing-stack-nano;
      }

      :deep(b) {
        font-weight: $unnnic-font-weight-bold;
      }
    }
  }
</style>
