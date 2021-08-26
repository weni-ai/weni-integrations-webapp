<template>
  <div>
    <app-grid section="configured" type="edit" />
    <app-grid section="installed" type="config" />
  </div>
</template>

<script>
  import AppGrid from '../components/AppGrid.vue';
  export default {
    name: 'Apps',
    components: { AppGrid },
  };
</script>

<style scoped></style>
