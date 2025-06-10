<template>
  <div class="discovery-content">
    <unnnic-input
      v-model="searchTerm"
      class="discovery-content__search"
      :placeholder="$t('apps.discovery.search.placeholder')"
      icon-left="search-1"
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
        :loading="loadingAllAppTypes"
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
    </div>
    <div v-else-if="searchTerm && !filteredApps.length && !filteredExternalServices.length">
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
  </div>
</template>

<script>
  import AppGrid from '@/components/AppGrid/index.vue';
  import EmptyApps from '@/components/EmptyApps/index.vue';
  import { mapActions, mapState } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { externals_store } from '@/stores/modules/appType/externals/externals.store';
  import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
  import unnnic from '@weni/unnnic-system';
  export default {
    name: 'Discovery',
    components: {
      AppGrid,
      EmptyApps,
    },
    data() {
      return {
        searchTerm: '',
        channels: {
          loading: true,
          data: null,
        },
      };
    },
    async mounted() {
      this.fetchChannels();

      this.fetchExternalServices();

      this.fetchEcommerceApps();

      this.fetchFeatured();
    },
    computed: {
      ...mapState(app_type, [
        'allAppTypes',
        'loadingAllAppTypes',
        'errorAllAppTypes',
        'featuredApps',
        'loadingFeaturedApps',
      ]),
      ...mapState(externals_store, ['loadingExternalServices', 'externalServicesList']),
      ...mapState(ecommerce_store, ['loadingEcommerceApps', 'ecommerceAppsList']),
      searchOptions() {
        if (!this.allAppTypes || !this.externalServicesList) return [];

        const allApps = [...this.allAppTypes, ...this.externalServicesList];

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
      hasAnyVisibleApp() {
        return (
          this.filteredExternalServices.length ||
          this.filteredEcommerceApps.length ||
          this.filteredApps.length
        );
      },
    },
    methods: {
      ...mapActions(app_type, ['getAllAppTypes', 'fetchFeatured']),
      ...mapActions(externals_store, ['getExternalServicesTypes']),
      ...mapActions(ecommerce_store, ['getEcommerceTypes']),
      async fetchChannels() {
        const params = {
          category: 'channel',
        };
        await this.getAllAppTypes({ params });

        if (this.errorAllAppTypes) {
          unnnic.unnnicCallAlert({
            props: {
              text: this.$t('apps.discovery.fetch_error'),
              type: 'error',
            },
            seconds: 6,
          });
          return;
        }

        this.channels.data = this.allAppTypes;
      },
      async fetchExternalServices() {
        await this.getExternalServicesTypes();
      },
      async fetchEcommerceApps() {
        await this.getEcommerceTypes();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
