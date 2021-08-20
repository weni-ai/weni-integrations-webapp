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
      :firstTitle="$t('Version')"
      :firstDescription="app.version || '0'"
      :secondTitle="$t('Integrated_into')"
      :secondDescription="app.integrationsCount || '0'"
      :subtitle="$t('organizations')"
      :thirdTitle="$t('Classification')"
      :thirdDescription="appRatingString"
      :rating="app.rating.average || 0"
    />
    <div class="app-details__section app-details__section__columns">
      <app-details-about :description="app.description" :links="app.links" />
      <app-details-recommended class="app-details__section__columns__recommended" />
    </div>
    <app-details-comments />
  </div>
</template>

<script>
  import Navigator from '../components/Navigator.vue';
  import AppImagesBanner from '../components/app/AppImagesBanner.vue';
  import AppDetailsHeader from '../components/app/AppDetailsHeader.vue';
  import AppDetailsAbout from '../components/app/AppDetailsAbout.vue';
  import AppDetailsRecommended from '../components/app/AppDetailsRecommended.vue';
  import AppDetailsComments from '../components/app/AppDetailsComments.vue';

  import { mapActions } from 'vuex';

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
        navigatorHistory: null,
      };
    },
    watch: {
      $route: 'fetchApp',
    },
    async mounted() {
      await this.fetchApp(this.$route.params.appCode);

      this.navigatorHistory = [
        {
          name: this.$t('discovery'),
          path: '/apps/discovery',
        },
        {
          name: this.app.name,
          path: '',
        },
      ];
    },
    methods: {
      ...mapActions(['getAppType']),
      async fetchApp(appCode) {
        const { data } = await this.getAppType(appCode);
        this.app = data;
        this.loading = false;
      },
    },
    computed: {
      appRatingString() {
        return this.app.rating.average ? this.app.rating.average.toString() : '0';
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
