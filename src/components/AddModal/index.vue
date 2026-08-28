<template>
  <UnnnicModal
    ref="unnnic-add-modal"
    class="add-modal"
    :showModal="showAddModal"
    :text="$t('apps.details.actions.installed.title')"
    scheme="feedback-green"
    modalIcon="check-circle-1-1"
    @close="toggleModal"
    @click.stop
  >
    <template #message>
      <span v-html="$t('apps.details.actions.installed.description')"></span>
    </template>
    <template #options>
      <UnnnicButton
        ref="unnnic-add-modal-close-button"
        type="tertiary"
        @click.stop="toggleModal"
        >{{ $t('general.Close') }}</UnnnicButton
      >
      <UnnnicButton
        ref="unnnic-add-modal-navigate-button"
        type="primary"
        @click="navigateToMyApps"
      >
        {{ $t('apps.details.actions.installed.access_my_apps') }}
      </UnnnicButton>
    </template>
  </UnnnicModal>
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
@import './styles.scss';
</style>
