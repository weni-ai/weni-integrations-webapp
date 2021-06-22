<template>
  <div class="">Test {{ appId }}</div>
</template>

<script>
  export default {
    name: 'AppPage',
    props: {
      appId: {
        type: Number,
        default: 0,
      },
    },
  };
</script>

<style></style>
