<template>
  <div>
    <app-grid
      section="channel"
      type="add"
      :loading="loadingAllAppTypes"
      :apps="allAppTypes"
      @update="fetchChannels"
    />

    <app-grid section="bi-tools" type="view" :loading="false" :apps="biApps" />
  </div>
</template>
<script>
  import PowerBiIcon from '@/assets/logos/power_bi.png';
  import AppGrid from '../components/AppGrid.vue';
  import { mapActions, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'Discovery',
    components: {
      AppGrid,
    },
    data() {
      return {
        channels: {
          loading: true,
          data: null,
        },
        biApps: [
          {
            code: 'power-bi',
            name: 'Power BI',
            category: 'bi-tools',
            config_design: 'sidebar',
            description: 'PowerBi.data.description',
            summary: 'PowerBi.data.summary',
            icon: PowerBiIcon,
          },
        ],
      };
    },
    async mounted() {
      await this.fetchChannels();
    },
    computed: {
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

        this.channels.data = this.allAppTypes;
      },
    },
  };
</script>
<style lang="scss"></style>
