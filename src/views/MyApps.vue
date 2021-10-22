<template>
  <div>
    <div v-if="hasApps">
      <app-grid
        section="configured"
        type="edit"
        :loading="configuredApps.loading"
        :apps="configuredApps.data"
        @update="fetchConfigured"
      />
      <app-grid
        section="installed"
        type="config"
        :loading="installedApps.loading"
        :apps="installedApps.data"
        @update="fetchInstalled"
      />
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
  import AppGrid from '../components/AppGrid.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'Apps',
    components: { AppGrid },
    data() {
      return {
        configuredApps: {
          loading: true,
          data: null,
        },
        installedApps: {
          loading: true,
          data: null,
        },
      };
    },
    async mounted() {
      await this.fetchCategories();
      this.$root.$on('updateGrid', async () => {
        await this.fetchCategories();
      });
    },
    beforeDestroy() {
      this.$root.$off('updateGrid');
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
      }),
      hasApps: function () {
        if (this.configuredApps.loading || this.installedApps.loading) {
          return true;
        }

        return this.configuredApps.data?.length || this.installedApps.data?.length;
      },
    },
    methods: {
      ...mapActions(['getConfiguredApps', 'getInstalledApps']),
      async fetchCategories() {
        await this.fetchConfigured();
        await this.fetchInstalled();
      },
      async fetchConfigured() {
        this.configuredApps.loading = true;
        const params = {
          project_uuid: this.getSelectedProject,
        };
        const { data } = await this.getConfiguredApps({ params });
        this.configuredApps.data = data;
        this.configuredApps.loading = false;
      },
      async fetchInstalled() {
        this.installedApps.loading = true;
        const params = {
          project_uuid: this.getSelectedProject,
        };
        const { data } = await this.getInstalledApps({ params });
        this.installedApps.data = data;
        this.installedApps.loading = false;
      },
      navigateToDiscovery() {
        this.$router.replace('/apps/discovery');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .my-apps {
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
  }
</style>
