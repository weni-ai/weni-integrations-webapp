<template>
  <div id="topnav">
    <router-link class="link" to="discovery">{{ $t('apps.nav.discovery') }}</router-link>
    <router-link class="link" to="my">{{ $t('apps.nav.my_apps') }}</router-link>
    <router-link class="link" to="other-apps">{{ $t('apps.nav.other_apps') }}</router-link>
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
    line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
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
