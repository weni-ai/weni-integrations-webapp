<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue';
  import '@weni/unnnic-system';

  export default {
    name: 'App',
    components: {
      NavBar,
    },
  };
</script>

<style lang="scss">
  @import '~@weni/unnnic-system/dist/unnnic.css';
  @import '~@weni/unnnic-system/src/assets/scss/unnnic.scss';
  body {
    margin: 45px 34px 0px 34px;
    background-color: $unnnic-color-background-snow;
    font-family: $unnnic-font-family-secondary, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
</style>
