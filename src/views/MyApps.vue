<template>
  <div>
    <app-grid section="configured_apps" type="edit" />
    <app-grid section="installed_apps" type="config" />
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
