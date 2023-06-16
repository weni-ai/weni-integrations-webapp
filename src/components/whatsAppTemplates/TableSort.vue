<template>
  <unnnic-icon-svg
    class="table-sort__icon"
    :icon="sortIcon"
    @click="emitSort"
    clickable
    size="xs"
  />
</template>

<script>
  export default {
    name: 'TableSort',
    props: {
      sortDirection: {
        type: String,
        default: 'NONE',
        validator: (value) => {
          return ['NONE', 'ASC', 'DESC'].includes(value);
        },
      },
    },
    computed: {
      sortIcon() {
        if (this.sortDirection === 'NONE') {
          return 'sort-default';
        } else if (this.sortDirection === 'ASC') {
          return 'sort-asc';
        } else {
          return 'sort-desc';
        }
      },
    },
    methods: {
      emitSort() {
        if (this.sortDirection === 'NONE') {
          this.$emit('sort', 'DESC');
        } else if (this.sortDirection === 'DESC') {
          this.$emit('sort', 'ASC');
        } else {
          this.$emit('sort', 'NONE');
        }
      },
    },
  };
</script>

<style lang="scss" scoped></style>
