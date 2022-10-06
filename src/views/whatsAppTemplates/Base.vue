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
      };
    },
    computed: {
      crumbs() {
        return [
          {
            name: 'Templates',
            path: '/apps/my',
          },
          {
            name: this.$t(this.crumb_title),
          },
        ];
      },
    },
    watch: {
      '$route.meta.crumb_title'(newValue) {
        this.crumb_title = newValue;
      },
    },
    methods: {
      handleCrumbClick(crumb) {
        if (crumb.path) {
          this.$router.go(-1);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-templates-base {
    height: 100%;
  }
</style>

<style lang="scss">
  body {
    margin: 0;
    padding: $unnnic-spacing-inset-md;
  }
</style>
