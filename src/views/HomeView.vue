<template>
  <main>aaaaa {{ teste }}</main>
</template>

<script>
  import { app_type } from '@/stores/modules/appType.store.js';
  export default {
    name: 'HomeView',
    data() {
      return {
        teste: app_type().onboardStatus,
      };
    },
  };
</script>
