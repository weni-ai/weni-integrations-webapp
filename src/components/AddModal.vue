<template>
  <unnnic-modal
    ref="unnnic-add-modal"
    class="add-modal"
    :showModal="showAddModal"
    :text="$t('apps.details.actions.installed.title')"
    scheme="feedback-green"
    modal-icon="check-circle-1-1"
    @close="toggleModal"
  >
    <span slot="message" v-html="$t('apps.details.actions.installed.description')"></span>
    <unnnic-button
      ref="unnnic-add-modal-close-button"
      slot="options"
      type="terciary"
      @click="toggleModal"
      >{{ $t('general.Close') }}</unnnic-button
    >
    <unnnic-button
      ref="unnnic-add-modal-navigate-button"
      slot="options"
      type="primary"
      @click="navigateToMyApps"
    >
      {{ $t('apps.details.actions.installed.access_my_apps') }}
    </unnnic-button>
  </unnnic-modal>
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
  .add-modal {
    ::v-deep .unnnic-modal-container-background-body-close_icon {
      .unnnic-icon {
        display: none;
      }
    }
  }
</style>
