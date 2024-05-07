<template>
  <div class="container">
    <div v-if="loading" class="flows-iframe">
      <img class="logo" src="../../assets/svgs/LogoWeniAnimada4.svg" alt="" />
    </div>

    <iframe
      @load="onLoad"
      v-show="!loading"
      class="flows-iframe"
      :src="iframeSrc"
      allow="clipboard-read; clipboard-write;"
      title=""
    ></iframe>
  </div>
</template>

<script>
  import { mapState } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  import getEnv from '@/utils/env';

  export default {
    name: 'OtherApps',
    data() {
      return {
        loading: true,
      };
    },
    computed: {
      ...mapState(auth_store, ['flowOrg']),
      iframeSrc() {
<<<<<<< HEAD
        return `${getEnv('VUE_APP_FLOWS_IFRAME_URL')}/weni/${
=======
        return `${getEnv('VITE_APP_FLOWS_IFRAME_URL')}/weni/${
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
  @import './styles.scss';
</style>

<style lang="scss">
  body {
    margin-bottom: 0 !important;
  }
</style>
import { auth_store } from '@/stores/modules/auth.store'; auth_store,
