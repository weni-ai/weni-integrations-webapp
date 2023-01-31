<template>
  <div class="config-popup" v-if="show">
    <component
      class="config-popup__component"
      :is="currentComponent"
      :v-bind="$attrs"
      :app="currentApp"
      :customData="currentCustomData"
      @closePopUp="closePopUp"
    />
  </div>
</template>

<script>
  import wppDemoConfig from './channels/wpp_demo/Config.vue';
  import wppCloudSetup from './channels/whatsapp/Setup.vue';
  import instagramSetup from './channels/instagram/Setup.vue';

  export default {
    name: 'Config-PopUp',
    data() {
      return {
        show: false,
        type: '',
        currentApp: {},
        currentCustomData: null,
        componentMapping: {
          'wpp-demo': wppDemoConfig,
          'wpp-cloud': wppCloudSetup,
          ig: instagramSetup,
        },
      };
    },
    methods: {
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
