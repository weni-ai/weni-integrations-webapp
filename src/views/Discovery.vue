<template>
  <div>
    <app-grid
      section="channel"
      type="add"
      :loading="loadingAllAppTypes"
      :apps="allAppTypes"
      @update="fetchChannels"
    />
  </div>
</template>
<script>
  import AppGrid from '../components/AppGrid.vue';
  import { mapActions, mapGetters, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'Discovery',
    components: { AppGrid },
    data() {
      return {
        channels: {
          loading: true,
          data: null,
        },
      };
    },
    async mounted() {
      await this.fetchChannels();
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
      }),
      ...mapState({
        allAppTypes: (state) => state.appType.allAppTypes,
        loadingAllAppTypes: (state) => state.appType.loadingAllAppTypes,
        errorAllAppTypes: (state) => state.appType.errorAllAppTypes,
      }),
    },
    methods: {
      ...mapActions(['getAllAppTypes']),
      async fetchChannels() {
        const params = {
          category: 'channel',
        };
        await this.getAllAppTypes({ params });

        if (this.errorAllAppTypes) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.discovery.fetch_error'),
              title: 'Error',
              icon: 'alert-circle-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 6,
          });
          return;
        }

        this.channels.data = this.allAppTypes.reverse();
      },
    },
  };
</script>
<style lang="scss"></style>
