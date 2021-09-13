<template>
  <div class="app-details" v-if="!loading">
    <navigator class="app-details__navigator" :routes="navigatorHistory" />
    <app-images-banner class="app-details__section" :images="app.banners" />
    <app-details-header
      class="app-details__section"
      :title="app.name"
      :description="app.summary"
      :icon="app.icon"
      :iconbgColor="app.bg_color"
    />
    <unnnic-banner
      type="info"
      :firstTitle="$t('apps.details.info')"
      :firstDescription="appMetrics"
      :secondTitle="$t('apps.details.integrated_into')"
      :secondDescription="appIntegrationsCount"
      :subtitle="$t('apps.details.organizations')"
      :thirdTitle="$t('apps.details.rating')"
      :thirdDescription="appRatingString"
      :rating="app.rating.average || 0"
      @ratingAction="handleRating"
    />
    <div class="app-details__section app-details__section__columns">
      <app-details-about :description="app.description" :links="appLinks" />
      <app-details-recommended class="app-details__section__columns__recommended" />
    </div>
    <app-details-comments :appCode="app.code" />
  </div>
</template>

<script>
  import Navigator from '../components/Navigator.vue';
  import AppImagesBanner from '../components/app/AppImagesBanner.vue';
  import AppDetailsHeader from '../components/app/AppDetailsHeader.vue';
  import AppDetailsAbout from '../components/app/AppDetailsAbout.vue';
  import AppDetailsRecommended from '../components/app/AppDetailsRecommended.vue';
  import AppDetailsComments from '../components/app/AppDetailsComments.vue';
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
      AppDetailsRecommended,
      AppDetailsComments,
    },
    data() {
      return {
        loading: true,
        app: null,
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
              closeText: this.$t('close'),
            },
            seconds: 3,
          });
        }
      },
    },
    computed: {
      appRatingString() {
        return this.app.rating.average ? this.app.rating.average.toString() : '0';
      },
      navigatorHistory() {
        return [
          {
            name: this.$t('apps.details.navigator.discovery'),
            path: '/apps/discovery',
          },
          {
            name: this.app.name,
            path: '',
          },
        ];
      },
      appLinks() {
        const links = this.app.assets.filter((asset) => asset.type === 'link');
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
  }
</style>
