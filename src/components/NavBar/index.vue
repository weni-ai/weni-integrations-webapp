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
  @import './styles';
</style>
