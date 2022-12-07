<template>
  <div class="input-editor">
    <div v-click-outside-element="hideEmoji">
      <VEmojiPicker
        v-show="displayEmoji"
        class="input-editor__emoji-picker"
        :emojiSize="22"
        :emojisByRow="7"
        @select="selectEmoji"
      />
      <unnnic-button
        class="input-editor__emoji-picker__button"
        type="terciary"
        iconCenter="emoji"
        size="small"
        @click="toggleEmoji"
      />
    </div>
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

      <unnnic-tool-tip side="top" text="Monospace" enabled>
        <unnnic-button
          class="input-editor__button input-editor__button__mono"
          type="terciary"
          size="small"
          @click="$emit('format-event', '```')"
        >
          {{ monospaceString }}
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
  import { VEmojiPicker } from 'v-emoji-picker';
  import StrikeThroughIcon from '@/assets/svgs/strike-through.svg';

  export default {
    name: 'InputEditor',
    components: {
      VEmojiPicker,
    },
    data() {
      return {
        displayEmoji: false,
        search: '',
        strikeIcon: StrikeThroughIcon,
        monospaceString: '</>',
      };
    },
    props: {
      formatter: {
        type: Boolean,
        default: true,
      },
    },
    methods: {
      hideEmoji() {
        this.displayEmoji = false;
      },
      toggleEmoji() {
        this.displayEmoji = !this.displayEmoji;
      },
      selectEmoji(emoji) {
        this.$emit('emoji-event', emoji);
        this.displayEmoji = false;
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

      &__mono {
        font-family: $unnnic-font-family-primary;
        font-size: $unnnic-font-size-body-lg;
        color: $unnnic-color-neutral-cleanest;
      }

      ::v-deep {
        svg {
          width: $unnnic-icon-size-sm;
          margin-left: $unnnic-spacing-inline-nano;
        }
      }
    }

    &__emoji-picker {
      position: absolute;
      left: 0px;
      z-index: 1;
      top: -270px;

      &__button {
        opacity: $unnnic-opacity-level-clarifying;
      }

      ::v-deep .container-emoji {
        height: 200px;
      }
    }
  }
</style>
