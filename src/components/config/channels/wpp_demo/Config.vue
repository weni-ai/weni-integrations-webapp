<template>
  <unnnic-modal
    ref="unnnic-wpp-demo-modal"
    class="wpp-demo-modal"
    :text="$t('WhatsAppDemo.config.title')"
    scheme="feedback-green"
    modal-icon="check-circle-1-1"
    @close="closePopUp"
    @click.stop
  >
    <template #message>
      <span v-html="$t('WhatsAppDemo.config.description')"></span>
    </template>
    <template #options>
      <unnnic-button ref="unnnic-wpp-demo-modal-close-button" type="tertiary" @click="closePopUp">{{
        $t('general.Close')
      }}</unnnic-button>
      <unnnic-button
        ref="unnnic-wpp-demo-modal-navigate-button"
        type="primary"
        @click="openWppLink"
      >
        {{ $t('WhatsAppDemo.config.continue_and_redirect') }}
      </unnnic-button>
    </template>
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
      closePopUp() {
        this.showModal = !this.showModal;
        this.$emit('closePopUp');
      },
      openWppLink() {
        /* istanbul ignore next */
        window.open(this.app.config.redirect_url, '_blank');
        this.closePopUp();
      },
    },
  };
</script>

<style lang="scss" scoped></style>
