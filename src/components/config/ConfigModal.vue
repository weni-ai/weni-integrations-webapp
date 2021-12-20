<template>
  <div>
    <transition name="fade">
      <div class="config-modal" v-if="show">
        <div class="config-modal__backdrop" @click="closeModal" />

        <div class="config-modal__dialog">
          <component
            class="config-modal__component"
            :is="currentComponent"
            :v-bind="$attrs"
            :app="currentApp"
            @closeModal="closeModal"
            @setConfirmation="setConfirmation"
          />
        </div>
      </div>
    </transition>

    <unnnic-modal
      ref="unnnic-confirmation-modal"
      :showModal="showConfirmationModal"
      :text="$t('apps.config.confirmation.title')"
      scheme="feedback-yellow"
      modal-icon="alert-circle-1"
      @close="toggleConfirmationModal"
    >
      <span slot="message" v-html="$t('apps.config.confirmation.description')"></span>
      <unnnic-button
        ref="unnnic-remove-modal-close-button"
        slot="options"
        type="terciary"
        @click="toggleConfirmationModal"
      >
        {{ $t('apps.config.confirmation.goBackToConfig') }}
      </unnnic-button>
      <unnnic-button
        ref="unnnic-remove-modal-navigate-button"
        slot="options"
        type="primary"
        @click="confirmClose()"
      >
        {{ $t('general.confirm') }}
      </unnnic-button>
    </unnnic-modal>
  </div>
</template>

<script>
  import wwcConfig from './channels/WWC/Config.vue';
  import telegramConfig from './channels/telegram/Config.vue';
  import wppDemoPreview from './channels/wpp_demo/Preview.vue';

  export default {
    name: 'Modal',
    data() {
      return {
        show: false,
        type: '',
        currentApp: {},
        showConfirmationModal: false,
        needConfirmation: false,
      };
    },
    methods: {
      closeModal() {
        if (this.needConfirmation) {
          this.showConfirmationModal = true;
          return;
        }
        this.show = false;
      },
      openModal(app) {
        this.type = app.code;
        this.currentApp = app;
        this.show = true;
      },
      setConfirmation(value) {
        this.needConfirmation = value;
      },
      toggleConfirmationModal() {
        this.showConfirmationModal = !this.showConfirmationModal;
      },
      confirmClose() {
        this.needConfirmation = false;
        this.showConfirmationModal = false;
        this.show = false;
      },
    },
    computed: {
      currentComponent() {
        if (this.type === 'wwc') return wwcConfig;
        if (this.type === 'tg') return telegramConfig;
        if (this.type === 'wpp-demo') return wppDemoPreview;
        return wwcConfig;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .config-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    &__backdrop {
      position: fixed;
      top: 0;
      right: 50%;
      bottom: 0;
      left: 0;
      background-color: rgba($unnnic-color-brand-sec-dark, 0.4);
      z-index: 1;
    }
    &__dialog {
      height: 100vh;
      width: 50%;
      background-color: $unnnic-color-background-snow;
      margin: 0 50%;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
