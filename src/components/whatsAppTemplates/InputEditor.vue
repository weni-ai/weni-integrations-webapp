<template>
  <div class="input-editor">
    <div v-click-outside="hideEmoji">
      <unnnicEmojiPicker
        class="input-editor__emoji-picker__list"
        v-show="displayEmoji"
        @emojiSelected="selectEmoji"
        @close="closeEmojiPicker"
      />
      <unnnic-button
        class="input-editor__emoji-picker__button"
        type="tertiary"
        iconCenter="emoji"
        size="small"
        @click="toggleEmoji"
      />
    </div>
    <div v-if="formatter" class="input-editor__formatter">
      <unnnic-tool-tip side="top" text="Bold" enabled>
        <unnnic-button
          class="input-editor__button"
          type="tertiary"
          iconCenter="text-bold"
          size="small"
          @click="$emit('format-event', '*')"
        />
      </unnnic-tool-tip>

      <unnnic-tool-tip side="top" text="Italic" enabled>
        <unnnic-button
          class="input-editor__button"
          type="tertiary"
          iconCenter="text-italic"
          size="small"
          @click="$emit('format-event', '_')"
        />
      </unnnic-tool-tip>

      <unnnic-tool-tip side="top" text="Strike Through" enabled>
        <unnnic-button
          class="input-editor__button input-editor__button__strike"
          type="tertiary"
          size="small"
          @click="$emit('format-event', '~')"
        >
          <img :src="strikeIcon" />
        </unnnic-button>
      </unnnic-tool-tip>

      <unnnic-tool-tip side="top" text="Monospace" enabled>
        <unnnic-button
          class="input-editor__button input-editor__button__mono"
          type="tertiary"
          size="small"
          @click="$emit('format-event', '```')"
        >
          {{ monospaceString }}
        </unnnic-button>
      </unnnic-tool-tip>
    </div>
  </div>
</template>

<script>
  import StrikeThroughIcon from '@/assets/svgs/strike-through.svg';

  export default {
    name: 'InputEditor',
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

      &__list {
        transform: translateX(-150px);
      }

      ::v-deep .container-emoji {
        height: 200px;
      }
    }
  }
</style>
