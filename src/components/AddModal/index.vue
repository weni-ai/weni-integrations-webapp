<template>
  <unnnic-modal
    ref="unnnic-add-modal"
    class="add-modal"
    :showModal="showAddModal"
    :text="$t('apps.details.actions.installed.title')"
    scheme="feedback-green"
    modal-icon="check-circle-1-1"
    @close="toggleModal"
    @click.stop
  >
    <span slot="message" v-html="$t('apps.details.actions.installed.description')"></span>
    <unnnic-button
      ref="unnnic-add-modal-close-button"
      slot="options"
      type="tertiary"
      @click.stop="toggleModal"
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
  @import './styles.scss';
</style>
