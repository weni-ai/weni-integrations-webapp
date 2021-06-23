<template>
  <div class="app-banner">
    <img v-for="image in images" :key="image" :src="image" class="app-banner__image" />
  </div>
</template>

<script>
  export default {
    name: 'AppImagesBanner',
    props: {
      images: {
        type: Array,
        default: null,
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-banner {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 100%;
    border-radius: $unnnic-border-radius-md;
    overflow: hidden;
    &__image {
      max-height: 210px;
      object-fit: cover;
      width: 100%;
    }
  }
</style>
