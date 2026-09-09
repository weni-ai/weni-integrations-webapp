<template>
  <div
    v-if="show"
    class="config-popup"
  >
    <component
      :is="currentComponent"
      class="config-popup__component"
      :app="currentApp"
      :customData="currentCustomData"
      @close-pop-up="closePopUp"
      @toggle-integrated-app-modal="toggleIntegratedAppModal"
    />
  </div>

  <AddModal ref="addModal" />
</template>

<script>
import AddModal from '../AddModal/index.vue';
import wppDemoConfig from './channels/wpp_demo/Config.vue';
import wppCloudSetup from './channels/whatsapp/Setup.vue';
import facebookSetup from './channels/facebook/Setup.vue';
import chatGptSetup from './external/chatgpt/Setup.vue';
import vtexSetup from './ecommerce/vtex/Setup.vue';
import gmailSetup from './channels/email/Setup.vue';

export default {
  name: 'ConfigPopUp',
  components: {
    AddModal,
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
  computed: {
    currentComponent() {
      return this.componentMapping[this.type];
    },
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
};
</script>

<style lang="scss" scoped></style>
