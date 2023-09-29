<template>
  <div class="whatsapp-catalogs-base">
    <unnnic-breadcrumb :crumbs="crumbs" @crumbClick="handleCrumbClick" />
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'WhatsAppCatalogs',
    data() {
      return {
        crumb_title: this.$route.meta.crumb_title,
        baseCrumbs: [
          {
            name: this.$t('apps.nav.my_apps'),
            path: '/apps/my',
            meta: 'myApps',
          },
        ],
      };
    },
    computed: {
      crumbs() {
        const routeCrumbs = this.$route.matched.slice(1);

        const routeCrumbsWithTitles = routeCrumbs.map((crumb) => {
          const { meta } = crumb;
          return {
            name: this.$t(meta.crumb_title),
            path: crumb.path,
            meta: crumb.name,
          };
        });
        return this.baseCrumbs.concat(routeCrumbsWithTitles);
      },
    },
    methods: {
      handleCrumbClick(crumb) {
        if (crumb.meta === this.$route.name) return;

        if (crumb.meta === 'WhatsApp Catalogs List') {
          this.$router.go(-1);
        } else {
          this.$router.push(crumb.path);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-catalogs-base {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
</style>
