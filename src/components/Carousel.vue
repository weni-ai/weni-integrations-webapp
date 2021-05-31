<template>
  <div class="carousel">
    <div class="add">
      <unnnicButton type="terciary" size="small" :text="$t('add')" iconLeft="add-1" />
    </div>
    <div class="content">
      <button disabled="disabled">Previous</button>
      <div class="info">
        <p>Title</p>
        <p>Description</p>
      </div>
      <button disabled="disabled">Next</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Carousel',
  };
</script>

<style lang="scss" scoped>
  .carousel {
    display: flex;
    flex-direction: column;
    background-color: #a0e7e5;
  }

  .add {
    display: inline-flex;
    justify-content: flex-end;
  }

  .content {
    display: flex;
    flex-direction: row;
  }

  .info {
    flex-grow: 1;
  }
</style>
