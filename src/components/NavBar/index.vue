<template>
  <div id="topnav">
    <RouterLink
      class="link"
      :to="{ name: 'Discovery' }"
      >{{ $t('apps.nav.discovery') }}</RouterLink
    >
    <RouterLink
      class="link"
      :to="{ name: 'Apps' }"
      >{{ $t('apps.nav.my_apps') }}</RouterLink
    >
    <RouterLink
      class="link"
      :to="{ name: 'Other Apps' }"
      >{{ $t('apps.nav.other_apps') }}</RouterLink
    >
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
