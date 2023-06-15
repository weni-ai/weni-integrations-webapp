<template>
  <div class="discovery-content">
    <unnnic-autocomplete
      v-model="searchTerm"
      class="discovery-content__search"
      :placeholder="$t('apps.discovery.search.placeholder')"
      icon-left="search-1"
      :data="searchOptions"
    />

    <span v-if="searchTerm && searchTerm.trim()" class="discovery-content__search__results">
      {{ $t('apps.discovery.search.results') }}
      <span class="discovery-content__search__results__highlight">
        {{ `“${searchTerm}”...` }}
      </span>
    </span>

    <div
      v-if="filteredBiApps.length || filteredExternalServices.length || filteredApps.length"
      class="discovery-content__grids"
    >
      <app-grid
        ref="appGrid"
        section="channel"
        type="add"
        :loading="loadingAllAppTypes"
        :apps="filteredApps"
        @update="fetchChannels"
      />

      <app-grid
        section="external"
        type="add"
        :loading="loadingExternalServices"
        :apps="filteredExternalServices"
        @update="fetchExternalServices"
      />

      <app-grid section="bi-tools" type="view" :loading="false" :apps="filteredBiApps" />
    </div>

    <div
      v-else-if="
        searchTerm &&
        !filteredApps.length &&
        !filteredExternalServices.length &&
        !filteredBiApps.length
      "
    >
      <EmptyApps :term="searchTerm" />
    </div>

    <div v-if="searchTerm" class="discovery-content__recommended">
      <app-grid
        section="recommended"
        type="add"
        :loading="loadingFeaturedApps"
        :apps="featuredApps"
      />
    </div>
    <OnboardModal />
  </div>
</template>
<script>
  import PowerBiIcon from '@/assets/logos/power_bi.png';
  import AppGrid from '@/components/AppGrid.vue';
  import OnboardModal from '@/components/OnboardModal.vue';
  import EmptyApps from '@/components/EmptyApps.vue';
  import { mapActions, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'Discovery',
    components: {
      AppGrid,
      OnboardModal,
      EmptyApps,
    },
    data() {
      return {
        searchTerm: '',
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
      this.fetchChannels();

      const createAppCode = this.$route.query.create_app;
      if (createAppCode) {
        this.callManuallyCreateApp(createAppCode);
      }

      this.fetchExternalServices();

      this.fetchFeatured();
    },
    computed: {
      ...mapState({
        allAppTypes: (state) => state.appType.allAppTypes,
        loadingAllAppTypes: (state) => state.appType.loadingAllAppTypes,
        errorAllAppTypes: (state) => state.appType.errorAllAppTypes,
        featuredApps: (state) => state.appType.featuredApps,
        loadingFeaturedApps: (state) => state.appType.loadingFeaturedApps,
      }),
      ...mapState('externals', [
        'loadingExternalServices',
        'errorExternalServices',
        'externalServicesList',
      ]),
      searchOptions() {
        if (!this.allAppTypes || !this.externalServicesList) return [];

        const allApps = [...this.allAppTypes, ...this.externalServicesList, ...this.biApps];

        const filtered = allApps.filter((app) => {
          return app.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        });

        return filtered.map((app) => {
          return app.name;
        });
      },
      filteredApps() {
        if (!this.allAppTypes) return [];

        if (!this.searchTerm || !this.searchTerm.trim()) return this.allAppTypes;

        return this.allAppTypes.filter((app) => {
          return app.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        });
      },
      filteredExternalServices() {
        if (!this.externalServicesList) return [];

        if (!this.searchTerm || !this.searchTerm.trim()) return this.externalServicesList;

        return this.externalServicesList.filter((app) => {
          return app.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        });
      },
      filteredBiApps() {
        if (!this.searchTerm || !this.searchTerm.trim()) return this.biApps;

        return this.biApps.filter((app) => {
          return app.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        });
      },
    },
    methods: {
      ...mapActions(['getAllAppTypes', 'fetchFeatured']),
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
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: $unnnic-spacing-stack-lg;

    &__grids {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-stack-lg;
      margin-bottom: $unnnic-spacing-stack-lg;
    }

    &__search {
      margin-top: $unnnic-spacing-stack-sm;
      margin-bottom: $unnnic-spacing-stack-lg;

      &__results {
        font-size: $unnnic-font-size-body-lg;
        line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
        color: $unnnic-color-neutral-darkest;

        &__highlight {
          font-weight: $unnnic-font-weight-bold;
        }
      }
    }

    &__recommended {
      margin-top: auto;
    }
  }
</style>
