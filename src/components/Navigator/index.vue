<template>
  <div class="navigator">
    <div v-for="(route, index) in routes" :key="route.name" class="navigator__container">
      <router-link :to="route.path" class="navigator__container__link">
        {{ route.name }}
      </router-link>
      <unnnic-icon-svg
        v-if="index !== routes.length - 1"
        icon="arrow-right-1-1"
        size="xs"
        lineHeight="md"
        class="navigator__container__divider"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Navigator',
    props: {
      routes: {
        type: Array,
        default: null,
      },
    },
  };
</script>

<style scoped lang="scss">
  @import './styles.scss';
</style>
