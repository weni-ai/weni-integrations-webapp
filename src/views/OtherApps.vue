<template>
  <div class="container">
    <iframe
      class="flows-iframe"
      :src="iframeSrc"
      allow="clipboard-read; clipboard-write;"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import getEnv from '@/utils/env';

  export default {
    name: 'OtherApps',
    computed: {
      ...mapGetters(['getSelectedFlowOrg']),
      iframeSrc() {
        return `${getEnv('VUE_APP_FLOWS_IFRAME_URL')}/weni/${
          this.getSelectedFlowOrg
        }/authenticate?next=/org/home/?flows_config_hide=configs`;
      },
    },
  };
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    flex: 1;
    overflow: auto;

    .flows-iframe {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: auto;
    }
  }
</style>

<style lang="scss">
  body {
    margin-bottom: 0 !important;
    // margin-top: 0 !important;
  }
</style>
