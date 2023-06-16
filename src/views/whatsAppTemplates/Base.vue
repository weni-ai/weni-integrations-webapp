<template>
  <div class="whatsapp-templates-base">
    <unnnic-breadcrumb :crumbs="crumbs" @crumbClick="handleCrumbClick" />
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'WhatsAppTemplates',
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

        if (crumb.meta === 'WhatsApp Templates Table') {
          this.$router.go(-1);
        } else {
          this.$router.push(crumb.path);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-templates-base {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>

<style lang="scss">
  body {
    margin: 0;
    padding: $unnnic-spacing-inset-md;
  }
</style>
