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
  import wppPhoneNumberSelection from './channels/whatsapp/PhoneNumberSelection.vue';

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
          'wpp-cloud': wppPhoneNumberSelection,
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
