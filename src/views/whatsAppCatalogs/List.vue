<template>
  <div class="whatsapp-catalogs">
    <div v-if="$route.name === 'WhatsApp Catalogs List'">
      <List />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
  import List from '@/components/whatsAppCatalogs/List';

  export default {
    name: 'WhatsAppCatalogsList',
    components: {
      List,
    },
  };
</script>
