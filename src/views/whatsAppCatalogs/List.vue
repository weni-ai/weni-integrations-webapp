<template>
  <div class="whatsapp-catalogs">
    <CatalogList v-if="$route.name === 'WhatsApp Catalogs List'" />

    <router-view v-else />
  </div>
</template>

<script>
  import CatalogList from '@/components/whatsAppCatalogs/CatalogList';

  export default {
    name: 'WhatsAppCatalogsList',
    components: {
      CatalogList,
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
