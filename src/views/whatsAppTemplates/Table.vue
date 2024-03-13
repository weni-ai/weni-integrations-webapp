<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <div class="whatsapp-templates">
    <div class="whatsapp-templates__table" v-if="$route.name === 'WhatsApp Templates Table'">
      <Header />
      <Table />
    </div>
    <router-view v-else />
  </div>
</template>
<!-- eslint-disable vue/no-reserved-component-names -->
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
    overflow: hidden;

    &__table {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
</style>
