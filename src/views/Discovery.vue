<template>
  <div class="discovery-content__sessions">
    <app-grid
      ref="appGrid"
      section="channel"
      type="add"
      :loading="loadingAllAppTypes"
      :apps="allAppTypes"
      @update="fetchChannels"
    />

    <app-grid
      section="external"
      type="add"
      :loading="loadingExternalServices"
      :apps="externalServicesList"
      @update="fetchExternalServices"
    />

    <app-grid section="bi-tools" type="view" :loading="false" :apps="biApps" />

    <OnboardModal />
  </div>
</template>
<script>
  import PowerBiIcon from '@/assets/logos/power_bi.png';
  import AppGrid from '../components/AppGrid.vue';
  import OnboardModal from '../components/OnboardModal.vue';
  import { mapActions, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'Discovery',
    components: {
      AppGrid,
      OnboardModal,
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

      const createAppCode = this.$route.query.create_app;
      if (createAppCode) {
        await this.callManuallyCreateApp(createAppCode);
      }

      await this.fetchExternalServices();
    },
    computed: {
      ...mapState({
        allAppTypes: (state) => state.appType.allAppTypes,
        loadingAllAppTypes: (state) => state.appType.loadingAllAppTypes,
        errorAllAppTypes: (state) => state.appType.errorAllAppTypes,
      }),

      ...mapState('externals', [
        'loadingExternalServices',
        'errorExternalServices',
        'externalServicesList',
      ]),
    },
    methods: {
      ...mapActions(['getAllAppTypes']),
      ...mapActions('externals', ['getExternalServicesTypes']),
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
      async callManuallyCreateApp(appCode) {
        await this.$refs.appGrid.manuallyCreateApp(appCode);
      },
      async fetchExternalServices() {
        await this.getExternalServicesTypes();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .discovery-content {
    &__sessions {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-stack-lg;

      margin-bottom: $unnnic-spacing-stack-md;
    }
  }
</style>
