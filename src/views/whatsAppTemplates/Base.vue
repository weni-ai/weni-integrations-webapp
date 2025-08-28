<template>
  <div class="whatsapp-templates-base">
    <unnnic-breadcrumb v-if="showCrumbs" :crumbs="crumbs" @crumbClick="handleCrumbClick" />
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
          {
            name: this.$t('WhatsApp.template_details.crumbs.model_details'),
            path: '/',
            meta: 'myApps',
          },
        ],
      };
    },
    computed: {
      showCrumbs() {
        return !['Create Template', 'Edit Template'].includes(this.$route.name);
      },
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
    height: auto;
    padding-bottom: $unnnic-spacing-sm;
  }
</style>
