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
    <div v-if="true" class="discovery-content__grids">
      <app-grid
        ref="appGrid"
        section="channel"
        type="add"
        :apps="filteredApps"
        @update="fetchChannels"
      />

      <app-grid
        section="ecommerce"
        type="add"
        :loading="loadingEcommerceApps"
        :apps="filteredEcommerceApps"
        @update="fetchEcommerceApps"
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
  </div>
</template>

<script>
  import { insights_store } from '@/stores/modules/insights.store';
  import PowerBiIcon from '@/assets/logos/power_bi.png';
  export default {
    name: 'Discovery',
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
      insights_store().setHasInsights({ isActive: true });
    },
    computed: {},
  };
</script>

<style lang="scss" scoped>
  @import './Discovery/styles.scss';
</style>
