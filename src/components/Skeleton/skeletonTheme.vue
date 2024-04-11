<template>
  <div :style="themeStyle">
    <component v-if="tag" :is="tag">
      <slot></slot>
    </component>
    <slot v-else></slot>
  </div>
</template>

<script>
  import { ref, provide } from 'vue';
  import colors from './colors.scss?raw';

  // eslint-disable-next-line no-useless-escape
  const backgroundValueRegex = /unnnicColorBackgroundSolo:\s*(.*)\;/;
  export const DEFAULT_BACKGROUND = backgroundValueRegex.exec(colors)[1];
  export const DEFAULT_HIGHLIGHT = 'rgba(255,255,255,0.375)';
  export const SkeletonStyle = {
    backgroundColor: DEFAULT_BACKGROUND,
    backgroundImage: `linear-gradient(
    90deg,
    ${DEFAULT_BACKGROUND},
    ${DEFAULT_HIGHLIGHT},
    ${DEFAULT_BACKGROUND}
  )`,
  };
  export default {
    name: 'unnnicSkeletonTheme',
    setup() {
      // const themeStyle = ref(SkeletonStyle);
      const theme = ref({});

      // provide('_themeStyle', themeStyle);
      provide('_skeletonTheme', theme);

      return {
        // themeStyle,
        theme,
      };
    },
    props: {
      color: {
        type: String,
        default: DEFAULT_BACKGROUND,
      },
      highlight: {
        type: String,
        default: DEFAULT_HIGHLIGHT,
      },
      duration: {
        type: Number,
        default: 1.5,
      },
      tag: {
        type: String,
        default: 'div',
      },
      loading: {
        type: Boolean,
        default: undefined,
      },
    },
    data() {
      return {
        themeStyle: { ...SkeletonStyle },
      };
    },
    mounted() {
      const { color, highlight, duration } = this;
      this.themeStyle.backgroundColor = color;
      this.themeStyle.backgroundImage = `linear-gradient(
      90deg,
      ${color},
      ${highlight},
      ${color}
    )`;
      if (duration) {
        this.themeStyle.animation = `SkeletonLoading ${duration}s ease-in-out infinite`;
      } else {
        this.themeStyle.animation = '';
        this.themeStyle.backgroundImage = '';
      }
    },
  };
</script>
