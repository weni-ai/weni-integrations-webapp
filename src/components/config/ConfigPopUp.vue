<template>
  <div class="config-popup" v-if="show">
    <component
      class="config-popup__component"
      :is="currentComponent"
      :app="currentApp"
      :customData="currentCustomData"
      @closePopUp="closePopUp"
      @toggleIntegratedAppModal="toggleIntegratedAppModal"
    />
  </div>

  <add-modal ref="addModal" />
</template>

<script>
  import addModal from '../AddModal/index.vue';
  import wppDemoConfig from './channels/wpp_demo/Config.vue';
  import wppCloudSetup from './channels/whatsapp/Setup.vue';
  import facebookSetup from './channels/facebook/Setup.vue';
  import chatGptSetup from './external/chatgpt/Setup.vue';
  import vtexSetup from './ecommerce/vtex/Setup.vue';
  import gmailSetup from './channels/email/Setup.vue';

  export default {
    name: 'Config-PopUp',
    components: {
      addModal,
    },
    data() {
      return {
        show: false,
        type: '',
        currentApp: {},
        currentCustomData: null,
        componentMapping: {
          'wpp-demo': wppDemoConfig,
          'wpp-cloud': wppCloudSetup,
          ig: facebookSetup,
          fba: facebookSetup,
          chatgpt: chatGptSetup,
          vtex: vtexSetup,
          gmail: gmailSetup,
        },
      };
    },
    methods: {
      toggleIntegratedAppModal() {
        this.$refs.addModal.toggleModal();
      },
      closePopUp() {
        this.show = false;
      },
      openPopUp(app, customData) {
        this.type = app.code;
        this.currentApp = app;
        this.currentCustomData = customData;
        this.show = true;
      },
    },
    computed: {
      currentComponent() {
        return this.componentMapping[this.type];
      },
    },
  };
</script>

<style lang="scss" scoped></style>
