<template>
  <div class="container">
    <div v-if="loading" class="flows-iframe">
      <img class="logo" src="../assets/svgs/LogoWeniAnimada4.svg" />
    </div>

    <iframe
      @load="onLoad"
      v-show="!loading"
      class="flows-iframe"
      :src="iframeSrc"
      allow="clipboard-read; clipboard-write;"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import getEnv from '@/utils/env';

  export default {
    name: 'OtherApps',
    data() {
      return {
        loading: true,
      };
    },
    computed: {
      ...mapState({
        flowOrg: (state) => state.auth.flowOrg,
      }),
      iframeSrc() {
        return `${getEnv('VUE_APP_FLOWS_IFRAME_URL')}/weni/${
          this.flowOrg
        }/authenticate?next=/org/home/?flows_config_hide=configs`;
      },
    },
    methods: {
      onLoad() {
        this.loading = false;
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

    .logo {
      width: 10%;
      max-width: $unnnic-avatar-size-md;
      max-height: $unnnic-avatar-size-md;
    }
  }
</style>

<style lang="scss">
  body {
    margin-bottom: 0 !important;
  }
</style>
