<template>
  <div id="topnav">
    <router-link class="link" to="discovery">{{ $t('discovery') }}</router-link>
    <router-link class="link" to="apps">{{ $t('my_apps') }}</router-link>
  </div>
</template>
<script>
  import eventHub from '../utils/plugins/eventHub';

  export default {
    name: 'NavBar',

    mounted() {
      eventHub.$on('change-language', async (language) => {
        const languages = {
          'en-us': 'en',
          'pt-br': 'pt_br',
        };
        this.$root.$i18n.locale = languages[language];
      });
    },
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
