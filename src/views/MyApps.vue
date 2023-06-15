<template>
  <div class="my-apps">
    <unnnic-autocomplete
      v-if="hasApps"
      v-model="searchTerm"
      class="my-apps__search"
      :placeholder="$t('apps.discovery.search.placeholder')"
      icon-left="search-1"
      :data="searchOptions"
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
        <EmptyApps :term="searchTerm" />
      </div>
      <div v-else>
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
  import AppGrid from '@/components/AppGrid.vue';
  import EmptyApps from '@/components/EmptyApps.vue';
  import { mapActions, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'Apps',
    components: { AppGrid, EmptyApps },
    data() {
      return {
        searchTerm: '',
      };
    },
    /* istanbul ignore next */
    mounted() {
      this.fetchCategories();

      this.$root.$on('updateGrid', () => {
        this.fetchCategories();
      });
    },
    /* istanbul ignore next */
    beforeDestroy() {
      this.$root.$off('updateGrid');
    },
    computed: {
      ...mapState({
        project: (state) => state.auth.project,
      }),
      ...mapState({
        configuredApps: (state) => state.myApps.configuredApps,
        loadingConfiguredApps: (state) => state.myApps.loadingConfiguredApps,
        errorConfiguredApps: (state) => state.myApps.errorConfiguredApps,
        installedApps: (state) => state.myApps.installedApps,
        loadingInstalledApps: (state) => state.myApps.loadingInstalledApps,
        errorInstalledApps: (state) => state.myApps.errorInstalledApps,
      }),
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
      ...mapActions(['getConfiguredApps', 'getInstalledApps']),
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
        unnnicCallAlert({
          props: {
            text: text,
            title: 'Error',
            icon: 'alert-circle-1',
            scheme: 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .my-apps {
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

    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: $unnnic-spacing-stack-xl;

      &__description {
        &__main {
          font-family: $unnnic-font-family-secondary;
          font-weight: $unnnic-font-weight-bold;
          font-size: $unnnic-font-size-title-sm;
          line-height: $unnnic-line-height-md + $unnnic-font-size-title-sm;
          color: $unnnic-color-neutral-dark;
          text-align: center;
        }

        &__secondary {
          display: flex;
          gap: $unnnic-inline-nano;
          text-align: center;

          font-family: $unnnic-font-family-secondary;
          font-size: $unnnic-font-size-body-lg;
          line-height: $unnnic-line-height-md + $unnnic-font-size-body-lg;
          color: $unnnic-color-neutral-cloudy;

          &__link {
            cursor: pointer;
            font-weight: $unnnic-font-weight-bold;
            border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-cloudy;
          }
        }
      }
    }

    &__sections {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-stack-lg;

      margin-bottom: $unnnic-spacing-stack-md;
    }
  }
</style>
