<template>
  <div id="topnav">
    <router-link class="link" to="discovery">Descoberta</router-link>
    <router-link class="link" to="apps">Meus aplicativos</router-link>
  </div>
</template>
<script>
  export default {
    name: 'NavBar',
  };
</script>
<style lang="scss" scoped>
  @import '@weni/unnnic-system/src/assets/scss/unnnic.scss';
  #topnav {
    font-size: $unnnic-font-size-title-lg;
    font-weight: $unnnic-font-weight-bold;
    line-height: calc($unnnic-font-size-title-lg + $unnnic-line-height-md);
  }

  .link {
    text-decoration: none;
    color: $unnnic-color-neutral-cleanest;
    margin-right: $unnnic-inline-lg;
  }

  .router-link-active {
    color: $unnnic-color-neutral-dark;
    border-bottom: $unnnic-border-width-thin solid $unnnic-color-brand-weni-soft;
  }
</style>
