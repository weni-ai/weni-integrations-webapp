<template>
  <div>{{ teste }}</div>
</template>

<script>
  import { survey_store } from '@/stores/modules/survey.store';
  export default {
    name: 'Discovery',
    data() {
      return {
        teste: survey_store().surveyStatus,
      };
    },
  };
</script>
