<template>
  <UnnnicDialog
    ref="unnnic-add-modal"
    class="add-modal"
    :open="showAddModal"
    @update:open="handleOpenUpdate"
  >
    <UnnnicDialogContent size="medium">
      <UnnnicDialogHeader type="success">
        <UnnnicDialogTitle>
          {{ $t('apps.details.actions.installed.title') }}
        </UnnnicDialogTitle>
      </UnnnicDialogHeader>

      <section
        class="add-modal__description"
        v-html="$t('apps.details.actions.installed.description')"
      />

      <UnnnicDialogFooter>
        <UnnnicDialogClose>
          <UnnnicButton
            ref="unnnic-add-modal-close-button"
            type="tertiary"
            :text="$t('general.Close')"
          />
        </UnnnicDialogClose>
        <UnnnicButton
          ref="unnnic-add-modal-navigate-button"
          type="primary"
          :text="$t('apps.details.actions.installed.access_my_apps')"
          @click="navigateToMyApps"
        />
      </UnnnicDialogFooter>
    </UnnnicDialogContent>
  </UnnnicDialog>
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
