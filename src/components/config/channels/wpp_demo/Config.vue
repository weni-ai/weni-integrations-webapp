<template>
  <div class="wpp-demo-modal">
    <UnnnicDialog
      ref="unnnic-wpp-demo-modal"
      :open="true"
      @update:open="handleOpenUpdate"
    >
      <UnnnicDialogContent size="medium">
        <UnnnicDialogHeader type="success">
          <UnnnicDialogTitle>
            {{ $t('WhatsAppDemo.config.title') }}
          </UnnnicDialogTitle>
        </UnnnicDialogHeader>

        <section
          class="wpp-demo-modal__description"
          v-html="$t('WhatsAppDemo.config.description')"
        />

        <UnnnicDialogFooter>
          <UnnnicDialogClose>
            <UnnnicButton
              ref="unnnic-wpp-demo-modal-close-button"
              type="tertiary"
              :text="$t('general.Close')"
            />
          </UnnnicDialogClose>
          <UnnnicButton
            ref="unnnic-wpp-demo-modal-navigate-button"
            type="primary"
            :text="$t('WhatsAppDemo.config.continue_and_redirect')"
            @click="openWppLink"
          />
        </UnnnicDialogFooter>
      </UnnnicDialogContent>
    </UnnnicDialog>
  </div>
</template>

<script>
export default {
  name: 'WppDemoModal',
  props: {
    app: {
      type: Object,
      default: /* istanbul ignore next */ () => {},
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    handleOpenUpdate(open) {
      if (!open) {
        this.closePopUp();
      }
    },
    closePopUp() {
      this.showModal = !this.showModal;
      this.$emit('closePopUp');
    },
    openWppLink() {
      /* istanbul ignore next */
      window.open(this.app.config.redirect_url, '_blank');
      this.closePopUp();
    },
  },
};
</script>

<style lang="scss" scoped>
.wpp-demo-modal {
  &__description {
    padding: $unnnic-space-4;
    color: $unnnic-color-fg-base;
  }
}
</style>
