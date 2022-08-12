<template>
  <div class="whatsapp-templates">
    <unnnic-breadcrumb :crumbs="crumbs" @crumbClick="handleCrumbClick"></unnnic-breadcrumb>
    <TemplatesHeader />
    <TemplatesTable />
  </div>
</template>

<script>
  import TemplatesHeader from '@/components/WhatsAppTemplates/Header';
  import TemplatesTable from '@/components/WhatsAppTemplates/Table';

  export default {
    name: 'WhatsAppTemplatesTable',
    components: {
      TemplatesHeader,
      TemplatesTable,
    },
    data() {
      return {
        crumbs: [{ name: 'Profile', path: '/apps/my' }, { name: 'Manage templates' }],
      };
    },
    methods: {
      handleCrumbClick(crumb) {
        if (crumb.path) {
          this.$router.push(crumb.path);
        }
      },
    },
  };
</script>

<style lang="scss" scoped></style>
