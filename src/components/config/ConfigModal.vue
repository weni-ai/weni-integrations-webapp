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
            :isConfigured="isConfigured"
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
        type="tertiary"
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
  import wwcConfig from '@/components/config/channels//WWC/Config.vue';
  import telegramConfig from '@/components/config/channels//telegram/Config.vue';
  import wppDemoPreview from '@/components/config/channels//wpp_demo/Preview.vue';
  import whatsappConfig from '@/components/config/channels//whatsapp/Config.vue';
  import powerBiConfig from '@/components/config/bi_tools/power_bi/Config.vue';
  import genericTypeConfig from '@/components/config/channels/generic/Config.vue';
  import instagramConfig from '@/components/config/channels/instagram/Config.vue';
  import facebookConfig from '@/components/config/channels/facebook/Config.vue';
  import omieConfig from '@/components/config/external/omie/Config.vue';
  import chatGptConfig from '@/components/config/external/chatgpt/Config.vue';

  export default {
    name: 'Modal',
    data() {
      return {
        show: false,
        type: '',
        currentApp: {},
        isConfigured: false,
        showConfirmationModal: false,
        needConfirmation: false,
        componentMapping: {
          wwc: wwcConfig,
          tg: telegramConfig,
          wpp: whatsappConfig,
          'wpp-cloud': whatsappConfig,
          'wpp-demo': wppDemoPreview,
          'power-bi': powerBiConfig,
          ig: instagramConfig,
          fba: facebookConfig,
          omie: omieConfig,
          chatgpt: chatGptConfig,
        },
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
      openModal({ app, isConfigured }) {
        this.type = app.code;
        this.currentApp = app;
        this.isConfigured = isConfigured;
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
        return this.componentMapping[this.type] || genericTypeConfig;
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
