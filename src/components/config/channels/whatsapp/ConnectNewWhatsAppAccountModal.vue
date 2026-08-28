<template>
  <UnnnicDialog
    class="connect-new-whatsapp-account-modal"
    :open="show"
    @update:open="handleOpenUpdate"
  >
    <UnnnicDialogContent size="medium">
      <UnnnicDialogHeader type="warning">
        <UnnnicDialogTitle>
          {{ $t('WhatsAppCloud.setup.connect_new_account.title') }}
        </UnnnicDialogTitle>
      </UnnnicDialogHeader>

      <section
        class="connect-new-whatsapp-account-modal__description"
        v-html="$t('WhatsAppCloud.setup.connect_new_account.description')"
      />

      <UnnnicDialogFooter>
        <UnnnicButton
          type="primary"
          size="large"
          :text="$t('WhatsAppCloud.setup.connect_new_account.try_again')"
          @click="handleTryAgain"
        />
      </UnnnicDialogFooter>
    </UnnnicDialogContent>
  </UnnnicDialog>
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

    padding: $unnnic-space-4;
    color: $unnnic-color-fg-base;

    :deep(ol) {
      padding-left: $unnnic-space-3;
      margin: 0;
    }

    :deep(li) {
      margin-top: $unnnic-space-1;
    }

    :deep(b) {
      font-weight: $unnnic-font-weight-bold;
    }
  }
}
</style>
