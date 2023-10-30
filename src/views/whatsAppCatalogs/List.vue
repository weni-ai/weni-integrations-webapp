<template>
  <div class="whatsapp-catalogs">
    <List v-if="$route.name === 'WhatsApp Catalogs List'" />

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

<styles scoped lang="scss">
.whatsapp-catalogs {
  display: flex;
  overflow: hidden;
  height: 100%;
}
</styles>
