<template>
  <div class="dz-preview dz-file-preview">
    <div v-if="type === 'image'" class="dz-image">
      <div class="data-dz-thumbnail-bg"></div>
    </div>
    <div v-else>
      <unnnic-icon-svg
        class="dropzone-preview__icon"
        icon="paginate-filter-text-1"
        size="md"
        scheme="neutral-clean"
      />
    </div>
    <div class="dz-details">
      <div class="dz-size"><span data-dz-size></span></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PreviewTemplate',
    props: {
      type: {
        type: String,
        default: 'style',
        validator(value) {
          return ['image', 'style'].indexOf(value) !== -1;
        },
      },
    },
  };
</script>
