<template>
  <div>{{ teste }}</div>
</template>

<script>
  import { insights_store } from '@/stores/modules/insights.store';
  export default {
    name: 'Discovery',
    data() {
      return {
        teste: insights_store().isActive,
      };
    },
    onMounted() {
      insights_store().setHasInsights({ isActive: true });
    },
  };
</script>
