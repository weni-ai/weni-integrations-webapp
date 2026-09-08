<template>
  <div class="whatsapp-templates-table-loading">
    <UnnnicTable
      class="whatsapp-templates-table-loading__table"
      :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    >
      <template #header>
        <UnnnicTableRow :headers="headers" />
      </template>
      <template #item="{ item }">
        <UnnnicSkeletonLoading
          width="100%"
          height="64px"
          :item="item"
        />
      </template>
    </UnnnicTable>
  </div>
</template>

<script>
export default {
  name: 'TableLoading',
  props: {
    headers: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.whatsapp-templates-table-loading {
  display: flex;
  flex-direction: column;

  &__table {
    :deep(.scroll) {
      @media (max-height: 800px) {
        max-height: 60vh;
      }

      @media (min-height: 800px) {
        max-height: 68vh;
      }

      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
