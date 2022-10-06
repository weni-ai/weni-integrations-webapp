<template>
  <div class="input-editor">
    <div v-if="formatter">
      <unnnic-tool-tip side="top" text="Bold" enabled :style="{ marginLeft: '1rem' }">
        <unnnic-button
          class="input-editor__button"
          type="terciary"
          iconCenter="text-bold"
          size="small"
          @click="$emit('format-event', 'bold')"
        />
      </unnnic-tool-tip>

      <unnnic-tool-tip side="top" text="Italic" enabled>
        <unnnic-button
          class="input-editor__button"
          type="terciary"
          iconCenter="text-italic"
          size="small"
          @click="$emit('format-event', 'italic')"
        />
      </unnnic-tool-tip>

      <unnnic-tool-tip side="top" text="Strike Through" enabled>
        <unnnic-button
          class="input-editor__button"
          type="terciary"
          iconCenter="text-underline"
          size="small"
          @click="$emit('format-event', 'strikeThrough')"
        />
      </unnnic-tool-tip>
    </div>
    <unnnic-button
      type="terciary"
      iconLeft="add-1"
      size="small"
      class="templates-form-body__add-variable"
      @click="$emit('add-variable')"
    >
      {{ $t('WhatsApp.templates.form_field.add_variable') }}
    </unnnic-button>
  </div>
</template>

<script>
  export default {
    name: 'InputEditor',
    props: {
      formatter: {
        type: Boolean,
        default: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .input-editor {
    display: flex;
    align-items: center;

    &__button {
      width: $unnnic-icon-size-lg;
      height: $unnnic-icon-size-lg;

      ::v-deep {
        svg {
          width: $unnnic-icon-size-sm;
          margin-left: $unnnic-spacing-inline-nano;
        }
      }
    }
  }
</style>
