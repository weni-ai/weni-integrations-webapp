<template>
  <div class="discovery-content">
    <unnnic-autocomplete
      v-model="searchTerm"
      class="discovery-content__search"
      placeholder="gdfgbfgbgbfg"
      icon-left="search-1"
      :data="[]"
    />
    <span v-if="searchTerm && searchTerm.trim()" class="discovery-content__search__results">
      {{ $t('apps.discovery.search.results') }}
      <span class="discovery-content__search__results__highlight">
        {{ `“${searchTerm}”...` }}
      </span>
    </span>
    <div v-if="hasAnyVisibleApp" class="discovery-content__grids">
      <AppGrid
        ref="appGrid"
        section="channel"
        type="add"
        :apps="filteredApps"
        @update="fetchChannels"
      />

      <AppGrid
        section="ecommerce"
        type="add"
        :loading="loadingEcommerceApps"
        :apps="filteredEcommerceApps"
        @update="fetchEcommerceApps"
      />

      <AppGrid
        section="external"
        type="add"
        :loading="loadingExternalServices"
        :apps="filteredExternalServices"
        @update="fetchExternalServices"
      />

      <AppGrid section="bi-tools" type="view" :loading="false" :apps="filteredBiApps" />
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
      <AppGrid
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
  import { insights_store } from '@/stores/modules/insights.store';
  import PowerBiIcon from '@/assets/logos/power_bi.png';
  import AppGrid from '@/components/AppGrid/index.vue';
  import OnboardModal from '@/components/OnboardModal/index.vue';
  import EmptyApps from '@/components/EmptyApps/index.vue';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { externals_store } from '@/stores/modules/appType/externals/externals.store';
  import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import { storeToRefs } from 'pinia';
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
        appType: storeToRefs(app_type()),
        externals: storeToRefs(externals_store()),
        ecommerce: storeToRefs(ecommerce_store()),
      };
    },
    async mounted() {
      insights_store().setHasInsights({ isActive: true });
      this.fetchChannels();

      const createAppCode = this.$route.query.create_app;
      if (createAppCode) {
        this.callManuallyCreateApp(createAppCode);
      }

      this.fetchExternalServices();

      this.fetchEcommerceApps();

      app_type().fetchFeatured();
    },
    computed: {
      allAppTypes() {
        return this.appType.allAppTypes;
      },
      loadingAllAppTypes() {
        return this.appType.loadingAllAppTypes;
      },
      errorAllAppTypes() {
        return this.appType.errorAllAppTypes;
      },
      featuredApps() {
        return this.appType.featuredApps;
      },
      loadingFeaturedApps() {
        return this.appType.loadingFeaturedApps;
      },
      loadingExternalServices() {
        return this.externals.loadingExternalServices;
      },
      externalServicesList() {
        return this.externals.externalServicesList;
      },
      loadingEcommerceApps() {
        return this.ecommerce.loadingEcommerceApps;
      },
      ecommerceAppsList() {
        return this.ecommerce.ecommerceAppsList;
      },
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
      filteredEcommerceApps() {
        if (!this.ecommerceAppsList) return [];

        if (!this.searchTerm || !this.searchTerm.trim()) return this.ecommerceAppsList;

        return this.ecommerceAppsList.filter((app) => {
          return app.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        });
      },
      filteredBiApps() {
        if (!this.searchTerm || !this.searchTerm.trim()) return this.biApps;

        return this.biApps.filter((app) => {
          return app.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        });
      },
      hasAnyVisibleApp() {
        return (
          this.filteredBiApps.length ||
          this.filteredExternalServices.length ||
          this.filteredEcommerceApps.length ||
          this.filteredApps.length
        );
      },
    },
    methods: {
      async fetchChannels() {
        const params = {
          category: 'channel',
        };
        await app_type().getAllAppTypes({ params });

        if (this.errorAllAppTypes) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.discovery.fetch_error'),
              title: this.$t('general.error'),
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
        await externals_store().getExternalServicesTypes();
      },
      async fetchEcommerceApps() {
        await ecommerce_store().getEcommerceTypes();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
storeToRefs, app_type, app_type, import appType from '@/api/appType'; import appType from
'@/api/appType'; import appType from '@/api/appType'; import appType from '@/api/appType';
