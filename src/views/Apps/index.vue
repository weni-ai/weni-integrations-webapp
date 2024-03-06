<template>
  <div class="container">
    <Carousel />
    <NavBar />
    <router-view />
  </div>
</template>

<script>
  import NavBar from '../../components/NavBar/index.vue';
  import Carousel from '../../components/Carousel/index.vue';
  export default {
    name: 'Apps',
    components: {
      NavBar,
      Carousel,
    },
  };
</script>

<style scoped lang="scss">
  @import './styles.scss';
</style>