<template>
  <unnnic-modal
    ref="unnnic-wpp-demo-modal"
    class="wpp-demo-modal"
    text="Selecione sua conta do WhatsApp Business que deseja conectar"
    scheme="feedback-green"
    modal-icon="check-circle-1-1"
    @close="closePopUp"
  >
    <div slot="message">
      <unnnic-button
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
    name: 'WppDemoModal',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
      customData: {
        type: Object,
        default: () => {},
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
