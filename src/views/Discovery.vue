<template>
  <div>
    <app-grid section="channel" type="add" />
    <app-grid section="ticket" type="add" />
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
