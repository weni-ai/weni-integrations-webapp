<template>
  <div class="whatsapp-catalogs">
    <div v-if="$route.name === 'WhatsApp Catalogs Table'">
      <Table />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
  import Table from '@/components/whatsAppCatalogs/Table';

  export default {
    name: 'WhatsAppCatalogsTable',
    components: {
      Table,
    },
  };
</script>
