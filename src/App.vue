<template>
  <NavBar />
  <router-view />
</template>

<script>
  import NavBar from './components/NavBar.vue';

  export default {
    name: 'App',
    components: {
      NavBar,
    },
  };
</script>

<style lang="scss">
  @import '@weni/unnnic-system/src/assets/scss/unnnic.scss';
  body {
    margin: 0;
    background-color: $unnnic-color-background-snow;
    font-family: $unnnic-font-family-secondary;
    margin-left: 34px;
    margin-top: 45px;
  }
</style>
