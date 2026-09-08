<template>
  <UnnnicDialog
    ref="unnnic-remove-modal"
    class="app-modal"
    :open="showRemoveModal"
    @update:open="handleOpenUpdate"
  >
    <UnnnicDialogContent size="medium">
      <UnnnicDialogHeader type="warning">
        <UnnnicDialogTitle>
          {{ $t('apps.details.actions.remove.title') }}
        </UnnnicDialogTitle>
      </UnnnicDialogHeader>

      <section
        class="app-modal__description"
        v-html="$t('apps.details.actions.remove.description')"
      />

      <UnnnicDialogFooter>
        <UnnnicDialogClose>
          <UnnnicButton
            ref="unnnic-remove-modal-close-button"
            data-testid="remove-modal-button"
            type="tertiary"
            :text="$t('general.Cancel')"
          />
        </UnnnicDialogClose>
        <LoadingButton
          ref="unnnic-remove-modal-navigate-button"
          type="primary"
          :isLoading="loadingDeleteApp"
          :loadingText="$t('general.loading')"
          :text="$t('apps.details.actions.remove.remove')"
          @clicked="removeApp(currentRemoval.code, currentRemoval.uuid)"
        />
      </UnnnicDialogFooter>
    </UnnnicDialogContent>
  </UnnnicDialog>
</template>

<script>
import LoadingButton from '@/components/LoadingButton/index.vue';

export default {
  name: 'AppModal',
  components: {
    LoadingButton,
  },
  data() {
    return {
      showAddModal: false,
      showRemoveModal: false,
      currentRemoval: null,
    };
  },
  methods: {
    handleOpenUpdate(open) {
      if (!open) {
        this.showRemoveModal = false;
      }
    },
    toggleRemoveModal(app = null) {
      this.currentRemoval = app;
      this.showRemoveModal = !this.showRemoveModal;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-modal {
  &__description {
    padding: $unnnic-space-4;
    color: $unnnic-color-fg-base;
  }
}
</style>
