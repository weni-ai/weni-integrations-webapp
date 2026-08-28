<template>
  <div class="input-editor">
    <div v-click-outside="hideEmoji">
      <UnnnicEmojiPicker
        v-show="displayEmoji"
        class="input-editor__emoji-picker__list"
        @emoji-selected="selectEmoji"
        @close="closeEmojiPicker"
      />
      <UnnnicToolTip
        side="top"
        text="Emoji"
        enabled
      >
        <UnnnicButton
          class="input-editor__emoji-picker__button"
          type="tertiary"
          iconCenter="emoji"
          size="small"
          @click="toggleEmoji"
        />
      </UnnnicToolTip>
    </div>
    <div
      v-if="formatter"
      class="input-editor__formatter"
    >
      <UnnnicToolTip
        side="top"
        text="Bold"
        enabled
      >
        <UnnnicButton
          class="input-editor__button"
          type="tertiary"
          iconCenter="text-bold"
          size="small"
          @click="$emit('format-event', '*')"
        />
      </UnnnicToolTip>

      <UnnnicToolTip
        side="top"
        text="Italic"
        enabled
      >
        <UnnnicButton
          class="input-editor__button"
          type="tertiary"
          iconCenter="text-italic"
          size="small"
          @click="$emit('format-event', '_')"
        />
      </UnnnicToolTip>

      <UnnnicToolTip
        side="top"
        text="Strike Through"
        enabled
      >
        <UnnnicButton
          class="input-editor__button input-editor__button__strike"
          type="tertiary"
          size="small"
          @click="$emit('format-event', '~')"
        >
          <img :src="strikeIcon" />
        </UnnnicButton>
      </UnnnicToolTip>

      <UnnnicToolTip
        side="top"
        text="Monospace"
        enabled
      >
        <UnnnicButton
          class="input-editor__button input-editor__button__mono"
          type="tertiary"
          size="small"
          @click="$emit('format-event', '```')"
        >
          {{ monospaceString }}
        </UnnnicButton>
      </UnnnicToolTip>
    </div>
  </div>
</template>

<script>
import StrikeThroughIcon from '@/assets/svgs/strike-through.svg';

export default {
  name: 'InputEditor',
  props: {
    formatter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      displayEmoji: false,
      search: '',
      strikeIcon: StrikeThroughIcon,
      monospaceString: '</>',
    };
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
    margin-top: 1px;

    &__strike {
      :deep(span) {
        align-self: baseline;
        opacity: 0.5;
      }
    }

    &__mono {
      font-family: $unnnic-font-family-primary;
      font-size: $unnnic-font-size-body-lg;
      color: $unnnic-color-fg-muted;
      padding-top: 20px;
    }

    :deep(svg) {
      width: $unnnic-icon-size-sm;
      margin-left: $unnnic-spacing-inline-nano;
    }
  }

  &__emoji-picker {
    position: absolute;
    left: 0px;
    z-index: 1;
    top: -270px;

    &__button {
      margin-top: 1px;
      opacity: $unnnic-opacity-level-clarifying;
    }

    &__list {
      transform: translateX(-150px);
    }

    :deep(.container-emoji) {
      height: 200px;
    }
  }
}
</style>
