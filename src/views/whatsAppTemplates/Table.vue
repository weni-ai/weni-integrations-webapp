<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <div class="whatsapp-templates" v-if="$route.name === 'WhatsApp Templates Table'">
    <div class="whatsapp-templates__table">
      <Header />
      <Table />
    </div>
  </div>
  <router-view v-else />
</template>
<!-- eslint-disable vue/no-reserved-component-names -->
<script>
  import Header from '@/components/whatsAppTemplates/TableHeader.vue';
  import Table from '@/components/whatsAppTemplates/Table.vue';

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
