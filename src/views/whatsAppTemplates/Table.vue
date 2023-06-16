<template>
  <div class="whatsapp-templates">
    <div class="whatsapp-templates__table" v-if="$route.name === 'WhatsApp Templates Table'">
      <Header />
      <Table />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
  import Header from '@/components/whatsAppTemplates/TableHeader';
  import Table from '@/components/whatsAppTemplates/Table';

  export default {
    name: 'WhatsAppTemplatesTable',
    components: {
      Header,
      Table,
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-templates {
    height: 100%;

    &__table {
      height: 100%;
    }
  }
</style>

<style lang="scss">
  body {
    height: calc(100vh - $unnnic-spacing-stack-md);
  }
</style>
