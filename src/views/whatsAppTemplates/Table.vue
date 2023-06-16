<template>
  <div class="whatsapp-templates">
    <Header />
    <Table />
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
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
  }
</style>

<style lang="scss">
  body {
    height: calc(100vh - $unnnic-spacing-stack-md);
  }
</style>
