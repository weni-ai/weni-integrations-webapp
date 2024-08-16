<template>
  <unnnic-modal
    ref="unnnic-remove-modal"
    :showModal="showRemoveModal"
    :text="$t('apps.details.actions.remove.title')"
    scheme="feedback-red"
    modal-icon="alert-circle-1"
    @close="toggleRemoveModal"
  >
    <template #message>
      <span v-html="$t('apps.details.actions.remove.description')"></span>
    </template>
    <template #options>
      <unnnic-button
        ref="unnnic-remove-modal-close-button"
        data-testid="remove-modal-button"
        type="tertiary"
        @click="toggleRemoveModal"
        >{{ $t('general.Cancel') }}</unnnic-button
      >
      <LoadingButton
        ref="unnnic-remove-modal-navigate-button"
        type="primary"
        :isLoading="loadingDeleteApp"
        :loadingText="$t('general.loading')"
        :text="$t('apps.details.actions.remove.remove')"
        @clicked="removeApp(currentRemoval.code, currentRemoval.uuid)"
      />
    </template>
  </unnnic-modal>
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
      toggleRemoveModal(app = null) {
        this.currentRemoval = app;
        this.showRemoveModal = !this.showRemoveModal;
      },
    },
  };
</script>
