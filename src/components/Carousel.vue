<template>
  <div class="carousel">
    <div class="add">
      <unnnicButton type="terciary" size="small" :text="$t('add')" iconLeft="add-1" />
    </div>
    <div class="content">
      <unnnic-icon icon="arrow-left-1-1" size="ant" />
      <div class="info">
        <p class="title">Title</p>

        <p class="description">
          Fugiat exercitation officia reprehenderit est commodo. Exercitation nostrud esse excepteur
          minim irure quis minim sit quis. Officia ex est ullamco ut reprehenderit id. Quis eu nulla
          duis in fugiat exercitation adipisicing irure consequat laborum commodo nulla cillum est.
        </p>

        <p class="users-count">+69 users</p>
      </div>
      <unnnic-icon icon="arrow-right-1-1" size="ant" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Carousel',
  };
</script>

<style lang="scss">
  @import '~@weni/unnnic-system/dist/unnnic.css';
  @import '~@weni/unnnic-system/src/assets/scss/unnnic.scss';

  .carousel {
    display: flex;
    flex-direction: column;
    background-color: #a0e7e5;
    color: $unnnic-color-neutral-light;
    border-radius: $unnnic-border-radius-sm;
  }

  .add {
    display: inline-flex;
    justify-content: flex-end;

    .unnnic-icon,
    .unnnic-button__label {
      color: $unnnic-color-neutral-light;
      font-size: $unnnic-font-size-title-sm;
    }

    .unnnic-button:hover:enabled {
      border: 0.0625rem solid transparent;
    }
  }

  .content {
    display: flex;
    flex-direction: row;

    .unnnic-icon {
      display: flex;
      align-items: center;
      margin: 0px $unnnic-inline-sm $unnnic-spacing-stack-lg;
    }
  }

  .info {
    flex-grow: 1;
    margin-bottom: $unnnic-spacing-stack-giant;
    margin-left: $unnnic-inline-lg;
    min-width: 0;

    .title {
      margin: $unnnic-inset-nano 0;
    }

    .description {
      margin: 0;
      margin-bottom: $unnnic-spacing-stack-xs;
      font-size: $unnnic-font-size-body-lg;
      line-height: calc($unnnic-font-size-body-lg + $unnnic-line-height-md);

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 50%;
    }

    .users-count {
      margin: 0;
      font-size: $unnnic-font-size-body-gt;
      line-height: calc($unnnic-font-size-body-gt + $unnnic-line-height-md);
    }
  }

  .title {
    font-size: $unnnic-font-size-h4;
    line-height: calc($unnnic-font-size-h4 + $unnnic-line-height-md);
    font-weight: $unnnic-font-weight-bold;
  }
</style>
