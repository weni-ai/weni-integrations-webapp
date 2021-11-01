<template>
  <div>
    <navigator class="navigator" :routes="navigatorHistory" />

    <div class="app-details" v-if="!loading">
      <app-images-banner class="app-details__section" :images="app.banners" />
      <app-details-header
        class="app-details__section"
        :title="app.name"
        :description="app.summary"
        :icon="app.icon"
        :iconbgColor="app.bg_color"
        :appCode="app.code"
      />
      <unnnic-banner
        class="app-details__banner"
        :key="bannerKey"
        type="info"
        :firstTitle="$t('apps.details.info')"
        :firstDescription="appMetrics"
        :secondTitle="$t('apps.details.integrated_into')"
        :secondDescription="appIntegrationsCount"
        :subtitle="$t('apps.details.organizations')"
        :thirdTitle="$t('apps.details.rating')"
        :thirdDescription="appRatingString"
        :rating="appRatingAverage"
        @ratingAction="handleRating"
      />
      <div class="app-details__section app-details__section__columns">
        <app-details-about :description="app.description" :links="appLinks" />
        <!-- <app-details-recommended class="app-details__section__columns__recommended" /> -->
      </div>
      <app-details-comments :appCode="app.code" />
    </div>
    <skeleton-loading v-else />
  </div>
</template>

<script>
  import Navigator from '../components/Navigator.vue';
  import AppImagesBanner from '../components/app/AppImagesBanner.vue';
  import AppDetailsHeader from '../components/app/AppDetailsHeader.vue';
  import AppDetailsAbout from '../components/app/AppDetailsAbout.vue';
  // import AppDetailsRecommended from '../components/app/AppDetailsRecommended.vue';
  import AppDetailsComments from '../components/app/AppDetailsComments.vue';
  import skeletonLoading from './loadings/AppDetails.vue';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  import { mapActions } from 'vuex';
  import millify from 'millify';

  export default {
    name: 'AppPage',
    components: {
      Navigator,
      AppImagesBanner,
      AppDetailsHeader,
      AppDetailsAbout,
      // AppDetailsRecommended,
      AppDetailsComments,
      skeletonLoading,
    },
    data() {
      return {
        loading: true,
        app: null,
        bannerKey: 0,
      };
    },
    watch: {
      $route: 'fetchApp',
    },
    async mounted() {
      await this.fetchApp(this.$route.params.appCode);
    },
    methods: {
      ...mapActions(['getAppType', 'postRating']),
      async fetchApp(appCode) {
        const { data } = await this.getAppType(appCode);
        this.app = data;
        this.loading = false;
      },
      async reloadSection() {
        await this.fetchApp(this.$route.params.appCode);
        this.reloadBanner();
      },
      async handleRating(rate) {
        try {
          const data = {
            code: this.app.code,
            payload: {
              rate,
            },
          };
          await this.postRating(data);
        } catch (err) {
          unnnicCallAlert({
            props: {
              text: this.$t('app_details.status_error'),
              title: 'Error',
              icon: 'check-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } finally {
          this.reloadSection();
        }
      },
      reloadBanner() {
        this.bannerKey += 1;
      },
    },
    computed: {
      appRatingString() {
        return this.app.rating.average
          ? parseFloat(this.app.rating.average.toFixed(2)).toString()
          : '0';
      },
      appRatingAverage() {
        return this.app.rating.average ? parseFloat(this.app.rating.average.toFixed(2)) : 0;
      },
      navigatorHistory() {
        let history = [
          {
            name: this.$t('apps.details.navigator.discovery'),
            path: '/apps/discovery',
          },
        ];
        if (this.app) {
          history.push({
            name: this.app.name,
            path: '',
          });
        }
        return history;
      },
      appLinks() {
        const links = this.app.assets.filter((asset) => asset.type === 'LK');
        return links;
      },
      appMetrics() {
        return this.app.metrics ? millify(this.app.metrics) : '-';
      },
      appIntegrationsCount() {
        return this.app.integrations_count ? millify(this.app.integrations_count) : '-';
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-details {
    &__section {
      margin: $unnnic-spacing-stack-md 0;

      &__columns {
        display: flex;

        &__recommended {
          max-width: 256px;
          margin-left: auto;
        }
      }
    }

    &__banner {
      ::v-deep .unnnic-banner-info__section {
        align-self: center;
      }
    }
  }
</style>
