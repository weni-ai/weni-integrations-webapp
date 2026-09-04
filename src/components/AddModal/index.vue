<template>
  <unnnic-dialog
    ref="unnnic-add-modal"
    class="add-modal"
    :open="showAddModal"
    @update:open="handleOpenUpdate"
  >
    <unnnic-dialog-content size="medium">
      <unnnic-dialog-header type="success">
        <unnnic-dialog-title>
          {{ $t('apps.details.actions.installed.title') }}
        </unnnic-dialog-title>
      </unnnic-dialog-header>

      <section
        class="add-modal__description"
        v-html="$t('apps.details.actions.installed.description')"
      />

      <unnnic-dialog-footer>
        <unnnic-dialog-close>
          <unnnic-button
            ref="unnnic-add-modal-close-button"
            type="tertiary"
            :text="$t('general.Close')"
          />
        </unnnic-dialog-close>
        <unnnic-button
          ref="unnnic-add-modal-navigate-button"
          type="primary"
          :text="$t('apps.details.actions.installed.access_my_apps')"
          @click="navigateToMyApps"
        />
      </unnnic-dialog-footer>
    </unnnic-dialog-content>
  </unnnic-dialog>
</template>

<script>
  export default {
    name: 'AddModal',
    data() {
      return {
        showAddModal: false,
      };
    },
    methods: {
      handleOpenUpdate(open) {
        if (!open) {
          this.showAddModal = false;
        }
      },
      toggleModal() {
        this.showAddModal = !this.showAddModal;
      },
      navigateToMyApps() {
        this.$router.replace('/apps/my');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .add-modal {
    &__description {
      padding: $unnnic-space-4;
      color: $unnnic-color-fg-base;
    }
  }
</style>
