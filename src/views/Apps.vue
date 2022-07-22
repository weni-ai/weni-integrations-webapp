<template>
  <div class="container">
    <Carousel />
    <NavBar />
    <router-view />
  </div>
</template>

<script>
  import NavBar from '../components/NavBar.vue';
  import Carousel from '../components/Carousel.vue';
  export default {
    name: 'Apps',
    components: {
      NavBar,
      Carousel,
    },
  };
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    height: calc(100vh - 16px);
  }
</style>
