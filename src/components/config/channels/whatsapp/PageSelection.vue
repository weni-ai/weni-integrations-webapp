<template>
  <unnnic-modal
    ref="page-selection-modal"
    class="page-selection"
    text="Selecione sua conta do WhatsApp Business que deseja conectar"
    scheme="feedback-green"
    modal-icon="check-circle-1-1"
    @close="closePopUp"
  >
    <div slot="message">
      <unnnic-button
        ref="unnnic-button"
        v-for="(page, index) in customData.pages"
        :key="index"
        type="secondary"
        size="large"
        :text="page.name"
        @click.stop="selectPage(page)"
      />
    </div>
  </unnnic-modal>
</template>

<script>
  export default {
    name: 'PageSelection',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
      customData: {
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
      closePopUp() {
        this.showModal = !this.showModal;
        this.$emit('closePopUp');
      },
      selectPage() {
        this.$router.replace('/apps/my');
      },
    },
  };
</script>

<style lang="scss" scoped></style>
