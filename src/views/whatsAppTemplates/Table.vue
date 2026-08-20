<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <div class="whatsapp-templates">
    <div class="whatsapp-templates__table" v-if="$route.name === 'WhatsApp Templates Table'">
      <Header @templates-synced="refreshTemplatesTable" />
      <Table ref="templatesTable" />
    </div>
    <router-view v-else />
  </div>
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
    methods: {
      refreshTemplatesTable() {
        const table = this.$refs.templatesTable;
        table?.fetchData?.({ page: table.page || 1 });
      },
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
