<template>
  <div class="config-popup" v-if="show">
    <component
      class="config-popup__component"
      :is="currentComponent"
      :v-bind="$attrs"
      :app="currentApp"
      @closePopUp="closePopUp"
    />
  </div>
</template>

<script>
  import wppDemoConfig from './channels/wpp_demo/Config.vue';

  export default {
    name: 'Config-PopUp',
    data() {
      return {
        show: false,
        type: '',
        currentApp: {},
      };
    },
    methods: {
      closePopUp() {
        this.show = false;
      },
      openPopUp(app) {
        this.type = app.code;
        this.currentApp = app;
        this.show = true;
      },
    },
    computed: {
      currentComponent() {
        if (this.type === 'whatsapp_demo') return wppDemoConfig;
        return wppDemoConfig;
      },
    },
  };
</script>

<style lang="scss" scoped></style>
