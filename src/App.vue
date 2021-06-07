<template>
  <div>
    <Carousel />
    <NavBar />
    <router-view />
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue';
  import Carousel from './components/Carousel.vue';
  import '@weni/unnnic-system';

  export default {
    name: 'App',
    components: {
      NavBar,
      Carousel,
    },
  };
</script>

<style lang="scss">
  @import '~@weni/unnnic-system/dist/unnnic.css';
  @import '~@weni/unnnic-system/src/assets/scss/unnnic.scss';
  body {
    margin: $unnnic-spacing-inset-md;
    background-color: $unnnic-color-background-snow;
    font-family: $unnnic-font-family-secondary, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
</style>
