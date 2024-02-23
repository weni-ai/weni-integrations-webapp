<template>
  <div>{{ teste }}</div>
</template>

<script>
  import { my_apps } from '@/stores/modules/myApps.store';
  export default {
    name: 'Discovery',
    data() {
      return {
        teste: my_apps().configuredApps,
      };
    },
  };
</script>
