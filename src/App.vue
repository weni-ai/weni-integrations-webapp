<template>
  <div>
    <router-view />
  </div>
</template>

<script>
  import '@weni/unnnic-system';

  export default {
    name: 'App',
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
