<template>
  <div class="container">
    <Carousel />
    <NavBar v-if="!details" />
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
    computed: {
      details() {
        return this.$route.name == 'App Details';
      },
    },
  };
</script>

<style scoped lang="scss">
  @import './styles.scss';
</style>
import { computed } from 'vue';
