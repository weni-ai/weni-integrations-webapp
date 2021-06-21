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
    mounted() {
      this.$root.$on('change-language', async (language) => {
        const languages = {
          'en-us': 'en',
          'pt-br': 'pt_br',
        };
        this.$root.$i18n.locale = languages[language];
      });
    },
  };
</script>

<style lang="scss">
  body {
    margin: $unnnic-spacing-inset-md;
    background-color: $unnnic-color-background-snow;
    font-family: $unnnic-font-family-secondary, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
</style>
