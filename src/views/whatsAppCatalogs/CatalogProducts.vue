<template>
  <ProductList class="whatsapp-catalog-products" :catalogName="catalogName" />
</template>

<script>
  import ProductList from '@/components/whatsAppCatalogs/ProductList';

  export default {
    name: 'CatalogProducts',
    props: {
      catalogName: {
        type: String,
        required: true,
      },
    },
    components: {
      ProductList,
    },
  };
</script>

<styles scoped lang="scss">
.whatsapp-catalog-products {
  display: flex;
  overflow: hidden;
  height: 100%;
}
</styles>
