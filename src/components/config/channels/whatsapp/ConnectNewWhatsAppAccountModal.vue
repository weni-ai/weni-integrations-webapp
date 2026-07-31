<template>
  <unnnic-modal
    class="connect-new-whatsapp-account-modal"
    :showModal="show"
    :text="$t('WhatsAppCloud.setup.connect_new_account.title')"
    scheme="feedback-red"
    modal-icon="alert-circle-1"
    @close="handleClose"
    @click.stop
  >
    <template #message>
      <section
        class="connect-new-whatsapp-account-modal__description"
        v-html="$t('WhatsAppCloud.setup.connect_new_account.description')"
      />
    </template>
    <template #options>
      <unnnic-button
        type="primary"
        size="large"
        :text="$t('WhatsAppCloud.setup.connect_new_account.try_again')"
        @click="handleTryAgain"
      />
    </template>
  </unnnic-modal>
</template>

<script setup>
  defineProps({
    show: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['close', 'try-again']);

  function handleClose() {
    emit('close');
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
