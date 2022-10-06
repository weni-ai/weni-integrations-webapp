<template>
  <div class="input-editor">
    <div v-if="formatter" class="input-editor__formatter">
      <unnnic-tool-tip side="top" text="Bold" enabled>
        <unnnic-button
          class="input-editor__button"
          type="terciary"
          iconCenter="text-bold"
          size="small"
          @click="$emit('format-event', '*')"
        />
      </unnnic-tool-tip>

      <unnnic-tool-tip side="top" text="Italic" enabled>
        <unnnic-button
          class="input-editor__button"
          type="terciary"
          iconCenter="text-italic"
          size="small"
          @click="$emit('format-event', '_')"
        />
      </unnnic-tool-tip>

      <unnnic-tool-tip side="top" text="Strike Through" enabled>
        <unnnic-button
          class="input-editor__button input-editor__button__strike"
          type="terciary"
          size="small"
          @click="$emit('format-event', '~')"
        >
          <img :src="strikeIcon" />
        </unnnic-button>
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
  import StrikeThroughIcon from '@/assets/svgs/strike-through.svg';

  export default {
    name: 'InputEditor',
    data() {
      return {
        strikeIcon: StrikeThroughIcon,
      };
    },
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
    justify-content: flex-end;
    position: relative;

    &__formatter {
      display: flex;
    }

    &__button {
      width: $unnnic-icon-size-lg;
      height: $unnnic-icon-size-lg;

      &__strike {
        ::v-deep {
          span {
            align-self: baseline;
            opacity: 0.5;
          }
        }
      }

      ::v-deep {
        svg {
          width: $unnnic-icon-size-sm;
          margin-left: $unnnic-spacing-inline-nano;
        }
      }
    }
  }
</style>
