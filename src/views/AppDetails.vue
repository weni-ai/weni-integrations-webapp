<template>
  <div class="app-details">
    <navigator class="app-details__navigator" :routes="navigatorHistory" />
    <app-images-banner class="app-details__section" :images="app.banners" />
    <app-details-header
      class="app-details__section"
      :title="app.name"
      :description="app.brief"
      :icon="app.icon"
    />
    <unnnic-banner
      type="info"
      :firstTitle="$t('Version')"
      :firstDescription="app.version"
      :secondTitle="$t('Integrated_into')"
      :secondDescription="app.integrationsCount"
      :subtitle="$t('organizations')"
      :thirdTitle="$t('Classification')"
      :thirdDescription="app.rating.toString()"
      :rating="app.rating"
    />
    <app-details-about
      class="app-details__section"
      :description="app.description"
      :links="app.links"
    />
  </div>
</template>

<script>
  import Navigator from '../components/Navigator.vue';
  import AppImagesBanner from '../components/app/AppImagesBanner.vue';
  import AppDetailsHeader from '../components/app/AppDetailsHeader.vue';
  import AppDetailsAbout from '../components/app/AppDetailsAbout.vue';
  export default {
    name: 'AppPage',
    components: { Navigator, AppImagesBanner, AppDetailsHeader, AppDetailsAbout },
    data() {
      return {
        loading: true,
        app: null,
        navigatorHistory: null,
      };
    },
    created() {
      this.fetchApp();
    },
    watch: {
      $route: 'fetchApp',
    },
    mounted() {
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
      fetchApp() {
        this.app = {
          id: this.$route.params.appId,
          name: 'WhatsApp',
          version: 'v1.0.0',
          integrationsCount: '253',
          brief: 'Sint in minim consequat est velit in aliquip dolor consequat',
          description:
            'Sint in minim consequat est velit in aliquip dolor consequat esse veniam magna. Exercitation est duis esse id dolor id enim magna. Ad laborum ea dolor proident ullamco minim deserunt laborum nulla laboris labore adipisicing labore.',
          usersCount: 590,
          backgroundImage:
            'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/Ilustra%C3%A7%C3%A3o%20banner%201.png',
          rating: 4.7,
          commentsCount: 7,
          icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/iconfinder_13-whatsapp_4202050+1.svg',
          banners: [
            'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/imagem%201.png',
            'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/imagem%202.png',
            'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/imagem%203.png',
          ],
          links: [
            {
              title: 'Access documentation',
              url: 'https://google.com',
            },
            {
              title: 'How to integrate?',
              url: 'https://google.com',
            },
            {
              title: 'Social Media',
              url: 'https://google.com',
            },
          ],
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-details {
    &__section {
      margin: $unnnic-spacing-stack-md 0;
    }
  }
</style>
