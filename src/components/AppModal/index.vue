<template>
  <unnnic-dialog
    ref="unnnic-remove-modal"
    class="app-modal"
    :open="showRemoveModal"
    @update:open="handleOpenUpdate"
  >
    <unnnic-dialog-content size="medium">
      <unnnic-dialog-header type="warning">
        <unnnic-dialog-title>
          {{ $t('apps.details.actions.remove.title') }}
        </unnnic-dialog-title>
      </unnnic-dialog-header>

      <section
        class="app-modal__description"
        v-html="$t('apps.details.actions.remove.description')"
      />

      <unnnic-dialog-footer>
        <unnnic-dialog-close>
          <unnnic-button
            ref="unnnic-remove-modal-close-button"
            data-testid="remove-modal-button"
            type="tertiary"
            :text="$t('general.Cancel')"
          />
        </unnnic-dialog-close>
        <LoadingButton
          ref="unnnic-remove-modal-navigate-button"
          type="primary"
          :isLoading="loadingDeleteApp"
          :loadingText="$t('general.loading')"
          :text="$t('apps.details.actions.remove.remove')"
          @clicked="removeApp(currentRemoval.code, currentRemoval.uuid)"
        />
      </unnnic-dialog-footer>
    </unnnic-dialog-content>
  </unnnic-dialog>
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
