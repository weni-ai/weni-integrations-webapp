<template>
  <div class="my-apps">
    <unnnic-autocomplete
      v-if="hasApps"
      v-model="searchTerm"
      class="my-apps__search"
      :placeholder="$t('apps.discovery.search.placeholder')"
      icon-left="search-1"
      :data="searchOptions"
      id="search"
    />

    <span
      v-if="hasApps && searchTerm && searchTerm.trim()"
      class="discovery-content__search__results"
    >
      {{ $t('apps.discovery.search.results') }}
      <span class="discovery-content__search__results__highlight">
        {{ `“${searchTerm}”...` }}
      </span>
    </span>

    <div v-if="hasApps" class="my-apps__sections">
      <div v-if="searchTerm && !filteredConfiguredApps.length && !filteredInstalledApps.length">
        <EmptyApps :term="searchTerm" @clear="navigateToDiscovery" />
      </div>
      <div class="my-apps__sections__grids" v-else>
        <app-grid
          section="configured"
          type="edit"
          :loading="loadingConfiguredApps"
          :apps="filteredConfiguredApps"
          @update="fetchConfigured"
        />
        <app-grid
          section="installed"
          type="config"
          :loading="loadingInstalledApps"
          :apps="filteredInstalledApps"
          @update="fetchInstalled"
        />
      </div>
    </div>
    <div v-else class="my-apps__empty">
      <img class="my-apps__empty__image" src="@/assets/svgs/empty-apps.svg" />
      <div class="my-apps__empty__description__main">
        {{ $t('apps.myApps.empty.no-integrations') }}
      </div>
      <div class="my-apps__empty__description__secondary">
        <div>{{ $t('apps.myApps.empty.search') }}</div>
        <div class="my-apps__empty__description__secondary__link" @click="navigateToDiscovery()">
          {{ $t('apps.myApps.empty.link') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppGrid from '@/components/AppGrid/index.vue';
  import EmptyApps from '@/components/EmptyApps/index.vue';
  import { mapState, mapActions } from 'pinia';
  import unnnic from '@weni/unnnic-system';
  import { auth_store } from '@/stores/modules/auth.store';
  import { my_apps } from '@/stores/modules/myApps.store';
  import { useEventStore } from '@/stores/event.store';

  export default {
    name: 'Apps',
    components: { AppGrid, EmptyApps },
    data() {
      return {
        searchTerm: '',
        eventStore: useEventStore(),
      };
    },
    /* istanbul ignore next */
    mounted() {
      this.fetchCategories();
      this.on('updateGrid', this.fetchCategories);
    },
    beforeUnmount() {
      this.off('updateGrid', this.fetchCategories);
    },
    /* istanbul ignore next */
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(my_apps, [
        'configuredApps',
        'errorConfiguredApps',
        'errorConfiguredApps',
        'installedApps',
        'loadingInstalledApps',
        'errorInstalledApps',
      ]),
      hasApps: function () {
        if (this.loadingConfiguredApps || this.loadingInstalledApps) {
          return true;
        }

        return this.configuredApps?.length || this.installedApps?.length;
      },
      searchOptions() {
        if (!this.configuredApps || !this.installedApps) return [];

        const allApps = [...this.configuredApps, ...this.installedApps];

        const filtered = this.filterByName(allApps, this.searchTerm);

        return filtered.map((app) => {
          let name = app.generic ? app.config.channel_name : app.name;
          if (app.config?.title) {
            name += ` - ${app.config?.title}`;
          }
          return name;
        });
      },
      filteredConfiguredApps() {
        if (!this.configuredApps) return [];

        if (!this.searchTerm || !this.searchTerm.trim()) return this.configuredApps;

        return this.filterByName(this.configuredApps, this.searchTerm);
      },
      filteredInstalledApps() {
        if (!this.installedApps) return [];

        if (!this.searchTerm || !this.searchTerm.trim()) return this.installedApps;

        return this.filterByName(this.installedApps, this.searchTerm);
      },
    },
    methods: {
      ...mapActions(my_apps, ['getConfiguredApps', 'getInstalledApps']),
      ...mapActions(useEventStore, ['on', 'off']),
      filterByName(appList, search) {
        return appList.filter((app) => {
          const appMainName = app.generic ? app.config.channel_name : app.name;
          const appName = app.config?.title || app.config?.channel_name;

          const name = appMainName + appName;
          return name.toLowerCase().includes(search.toLowerCase());
        });
      },
      fetchCategories() {
        this.fetchConfigured();
        this.fetchInstalled();
      },
      fetchConfigured() {
        const params = {
          project_uuid: this.project,
        };
        this.getConfiguredApps({ params });

        if (this.errorConfiguredApps) {
          this.callErrorModal({ text: this.$t('apps.myApps.error.configured') });
        }
      },
      fetchInstalled() {
        const params = {
          project_uuid: this.project,
        };
        this.getInstalledApps({ params });

        if (this.errorInstalledApps) {
          this.callErrorModal({ text: this.$t('apps.myApps.error.installed') });
        }
      },
      navigateToDiscovery() {
        this.$router.replace('/apps/discovery');
      },
      callErrorModal({ text }) {
        unnnic.unnnicCallAlert({
          props: {
            text: text,
            type: 'error',
          },
          seconds: 6,
        });
      },
      handleEvent() {
        console.log('chegou');
        this.fetchCategories();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
