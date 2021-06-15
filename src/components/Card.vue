<template>
  <div>
    <div class="icons-container">
      <img :src="icon" class="app-icon" />
      <unnnic-button type="secondary" iconCenter="download-bottom-1" size="small" />
    </div>
    <div class="content">
      <p>{{ name }}</p>
      <p>{{ description }}</p>
      <p>{{ rating }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Card',

    props: {
      id: Number,
      name: String,
      description: String,
      rating: Number,
      icon: String,
    },
  };
</script>

<style lang="scss" scoped>
  .app-icon {
    width: 56px;
    height: 56px;
  }
</style>
