<template>
  <div>
    <navigator ref="navigator" class="navigator" :routes="navigatorHistory" />
    <div class="app-details" v-if="!loadingCurrentAppType">
      <app-images-banner
        ref="appImagesBanner"
        class="app-details__section"
        :images="currentAppType && currentAppType.banners"
      />
      <app-details-header
        ref="appDetailsHeader"
        class="app-details__section"
        :app="currentAppType"
      />
      <unnnic-banner
        ref="banner"
        class="app-details__banner"
        :key="bannerKey"
        type="info"
        :firstTitle="$t('apps.details.info')"
        :firstDescription="appMetrics"
        :secondTitle="$t('apps.details.integrated_into')"
        :secondDescription="appIntegrationsCount"
        :subtitle="$t('apps.details.projects')"
        :thirdTitle="$t('apps.details.rating')"
        :thirdDescription="appRatingString"
        :rating="appRatingAverage"
        @ratingAction="handleRating"
      />
      <div class="app-details__section app-details__section__columns">
        <app-details-about ref="appDetailsAbout" :description="appDescription" :links="appLinks" />
      </div>
      <app-details-comments ref="appDetailsComments" :appCode="appCode" />
    </div>
    <skeleton-loading v-else ref="skeleton" />
  </div>
</template>

<script>
  import Navigator from '../../components/Navigator/index.vue';
  import AppImagesBanner from '../../components/app/AppImagesBanner.vue';
  import AppDetailsHeader from '../../components/app/AppDetailsHeader.vue';
  import AppDetailsAbout from '../../components/app/AppDetailsAbout.vue';
  import AppDetailsComments from '../../components/app/AppDetailsComments.vue';
  import skeletonLoading from '../loadings/AppDetails.vue';
  import unnnic from '@weni/unnnic-system';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { mapActions, mapState } from 'pinia';
  import millify from 'millify';

  export default {
    name: 'AppPage',
    components: {
      Navigator,
      AppImagesBanner,
      AppDetailsHeader,
      AppDetailsAbout,
      AppDetailsComments,
      skeletonLoading,
    },
    data() {
      return {
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
      ...mapActions(app_type, ['getAppType', 'postRating']),
      async fetchApp(appCode, shouldLoad = true) {
        await this.getAppType({ code: appCode, shouldLoad });
      },
      async reloadSection() {
        await this.fetchApp(this.$route.params.appCode, false);
        this.reloadBanner();
      },
      async handleRating(rate) {
        const data = {
          code: this.currentAppType.code,
          payload: {
            rate,
          },
        };
        await this.postRating(data);

        if (this.errorPostRating) {
          unnnic.unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              type: 'error',
            },
            seconds: 3,
          });
          return;
        }

        this.reloadSection();
      },
      reloadBanner() {
        this.bannerKey += 1;
      },
    },
    computed: {
      ...mapState(app_type, ['currentAppType', 'loadingCurrentAppType', 'appType.errorPostRating']),
      appRatingString() {
        return this.currentAppType?.rating?.average
          ? parseFloat(this.currentAppType.rating.average.toFixed(2)).toString()
          : '0';
      },
      appRatingAverage() {
        return this.currentAppType?.rating?.average
          ? parseFloat(this.currentAppType.rating.average.toFixed(2))
          : 0;
      },
      appDescription() {
        return this.currentAppType?.description;
      },
      navigatorHistory() {
        let history = [
          {
            name: this.$t('apps.details.navigator.discovery'),
            path: '/apps/discovery',
          },
        ];
        if (this.currentAppType?.name) {
          history.push({
            name: this.currentAppType.name,
            path: '',
          });
        }
        return history;
      },
      appLinks() {
        if (!this.currentAppType) {
          return [];
        }
        const links = this.currentAppType.assets.filter((asset) => asset.type === 'LK');
        return links;
      },
      appMetrics() {
        return this.currentAppType?.metrics ? millify(this.currentAppType.metrics) : '-';
      },
      appIntegrationsCount() {
        return this.currentAppType?.integrations_count
          ? millify(this.currentAppType.integrations_count)
          : '-';
      },
      appCode() {
        return this.currentAppType?.code;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import './styles.scss';
</style>
app_type,
