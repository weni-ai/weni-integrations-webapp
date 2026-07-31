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
      <div
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

<script>
  export default {
    name: 'ConnectNewWhatsAppAccountModal',
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['close', 'try-again'],
    methods: {
      handleClose() {
        this.$emit('close');
      },
      handleTryAgain() {
        this.$emit('try-again');
        this.$emit('close');
      },
    },
  };
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
