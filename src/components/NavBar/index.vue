<template>
  <div id="topnav">
    <router-link class="link" :to="{ name: 'Discovery' }">{{ $t('apps.nav.discovery') }}</router-link>
    <router-link class="link" :to="{ name: 'Apps' }">{{ $t('apps.nav.my_apps') }}</router-link>
    <router-link class="link" :to="{ name: 'Other Apps' }">{{ $t('apps.nav.other_apps') }}</router-link>
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
