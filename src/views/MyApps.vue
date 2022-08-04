<template>
  <div>
    <div v-if="hasApps" class="my-apps__sections">
      <app-grid
        section="configured"
        type="edit"
        :loading="loadingConfiguredApps"
        :apps="configuredApps"
        @update="fetchConfigured"
      />
      <app-grid
        section="installed"
        type="config"
        :loading="loadingInstalledApps"
        :apps="installedApps"
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
  import { mapActions, mapGetters, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'Apps',
    components: { AppGrid },
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
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
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
    },
    methods: {
      ...mapActions(['getConfiguredApps', 'getInstalledApps']),
      fetchCategories() {
        this.fetchConfigured();
        this.fetchInstalled();
      },
      fetchConfigured() {
        const params = {
          project_uuid: this.getSelectedProject,
        };
        this.getConfiguredApps({ params });

        if (this.errorConfiguredApps) {
          this.callErrorModal({ text: this.$t('apps.myApps.error.configured') });
        }
      },
      fetchInstalled() {
        const params = {
          project_uuid: this.getSelectedProject,
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
      gap: $unnnic-spacing-stack-giant;
    }
  }
</style>
