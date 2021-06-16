<template>
  <div id="topnav">
    <router-link class="link" to="discovery">{{ $t('discovery') }}</router-link>
    <router-link class="link" to="apps">{{ $t('my_apps') }}</router-link>
  </div>
</template>
<script>
  export default {
    name: 'NavBar',
  };
</script>
<style lang="scss" scoped>
  #topnav {
    font-size: $unnnic-font-size-body-lg;
    font-weight: $unnnic-font-weight-bold;
    line-height: calc($unnnic-font-size-body-lg + $unnnic-line-height-md);
    border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
    padding-bottom: $unnnic-spacing-stack-sm;
  }

  .link {
    text-decoration: none;
    color: $unnnic-color-neutral-clean;
    margin-right: $unnnic-inline-lg;
  }

  .router-link-active {
    color: $unnnic-color-neutral-darkest;
  }
</style>
