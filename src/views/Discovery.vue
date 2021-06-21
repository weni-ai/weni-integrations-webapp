<template>
  <div>
    <app-grid section="communication_channels" />
    <app-grid section="attendance_managers" />
  </div>
</template>
<script>
  import AppGrid from '../components/AppGrid.vue';
  export default {
    name: 'Discovery',
    components: { AppGrid },
  };
</script>
<style lang="scss"></style>
