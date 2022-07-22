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

  export default {
    name: 'OtherApps',
    computed: {
      ...mapGetters(['getSelectedFlowOrg']),
      iframeSrc() {
        return `${process.env.VUE_APP_FLOWS_IFRAME_URL}/weni/${this.getSelectedFlowOrg}/authenticate?next=/org/home/?flows_config_hide=configs`;
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
