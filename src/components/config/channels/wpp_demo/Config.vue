<template>
  <unnnic-modal
    ref="unnnic-wpp-demo-modal"
    class="wpp-demo-modal"
    :text="$t('wpp_demo.config.title')"
    scheme="feedback-green"
    modal-icon="check-circle-1-1"
    @close="toggleModal"
  >
    <span slot="message" v-html="$t('wpp_demo.config.description')"></span>
    <unnnic-button
      ref="unnnic-wpp-demo-modal-close-button"
      slot="options"
      type="terciary"
      @click="toggleModal"
      >{{ $t('general.Close') }}</unnnic-button
    >
    <unnnic-button
      ref="unnnic-wpp-demo-modal-navigate-button"
      slot="options"
      type="primary"
      scheme="feedback-green"
      @click="openWppLink"
    >
      {{ $t('wpp_demo.config.continue_and_redirect') }}
    </unnnic-button>
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
    },
    data() {
      return {
        showModal: false,
      };
    },
    methods: {
      toggleModal() {
        this.showModal = !this.showModal;
        this.$parent.closePopUp();
      },
      openWppLink() {
        window.open(this.app.config.wa_url, '_blank');
        this.toggleModal();
      },
    },
  };
</script>

<style lang="scss" scoped></style>
