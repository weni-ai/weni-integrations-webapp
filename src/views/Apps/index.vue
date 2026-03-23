<template>
  <div class="container">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
  import NavBar from '../../components/NavBar/index.vue';
  export default {
    name: 'Apps',
    components: {
      NavBar,
    },
  };
</script>

<style scoped lang="scss">
  @import './styles.scss';
</style>
