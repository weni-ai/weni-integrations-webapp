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
  import wppPageSelection from './channels/whatsapp/PageSelection.vue';

  export default {
    name: 'Config-PopUp',
    data() {
      return {
        show: false,
        type: '',
        currentApp: {},
        currentCustomData: null,
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
        if (this.type === 'wpp-demo') return wppDemoConfig;
        if (this.type === 'wpp') return wppPageSelection;
        return wppDemoConfig;
      },
    },
  };
</script>

<style lang="scss" scoped></style>
