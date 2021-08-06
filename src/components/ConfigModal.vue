<template>
  <transition name="fade">
    <div class="config-modal" v-if="show">
      <div class="config-modal__backdrop" @click="closeModal" />

      <div class="config-modal__dialog">
        <component
          class="config-modal__component"
          :is="currentComponent"
          :v-bind="$attrs"
          :app="currentApp"
        />
      </div>
    </div>
  </transition>
</template>

<script>
  import wwcConfig from '../components/config/channels/WWC/Config.vue';

  export default {
    name: 'Modal',
    data() {
      return {
        show: false,
        type: '',
        currentApp: {},
      };
    },
    methods: {
      closeModal() {
        this.show = false;
      },
      openModal(app) {
        this.type = app.code;
        this.currentApp = app;
        this.show = true;
      },
    },
    computed: {
      currentComponent() {
        if (this.type === 'wwc') return wwcConfig;
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
      display: flex;
      flex-direction: column;
      height: 100%;
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
