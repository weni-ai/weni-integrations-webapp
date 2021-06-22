<template>
  <div class="">
    <navigator :routes="navigatorHistory" />
    Test {{ app.id }}
  </div>
</template>

<script>
  import Navigator from '../components/Navigator.vue';
  export default {
    name: 'AppPage',
    components: { Navigator },
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
          name: 'Whatsapp',
          description:
            'Sint in minim consequat est velit in aliquip dolor consequat esse veniam magna. Exercitation est duis esse id dolor id enim magna. Ad laborum ea dolor proident ullamco minim deserunt laborum nulla laboris labore adipisicing labore.',
          usersCount: 590,
          backgroundImage:
            'https://images.unsplash.com/photo-1603145733146-ae562a55031e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
          rating: 4.7,
          commentsCount: 7,
          icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/iconfinder_13-whatsapp_4202050+1.svg',
        };
      },
    },
  };
</script>

<style></style>
