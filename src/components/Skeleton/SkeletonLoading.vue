<template>
  <component :is="tag" v-if="showLoading">
    <span
      v-for="(element, index) in elements"
      :key="index"
      :class="classes"
      :style="styles"
    >
      &zwnj;
    </span>
  </component>
</template>

<script>
import { ref, inject } from 'vue';
import { SkeletonStyle } from './skeletonTheme.vue';

export default {
  name: 'unnnicSkeletonLoading',
  setup() {
    const themeStyle = inject('_themeStyle', ref(SkeletonStyle));
    const theme = inject('_skeletonTheme', ref({}));

    return {
      themeStyle,
      theme,
    };
  },
  props: {
    prefix: {
      type: String,
      default: 'unnnic',
    },
    count: {
      type: Number,
      default: 1,
    },
    duration: {
      type: Number,
      default: 1.5,
    },
    tag: {
      type: String,
      default: 'span',
    },
    width: [String, Number],
    height: [String, Number],
    circle: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: undefined,
    },
  },
  computed: {
    isLoading() {
      return typeof this.theme.loading !== 'undefined'
        ? this.theme.loading
        : this.loading;
    },
    classes() {
      return [`${this.prefix}-skeleton`];
    },
    styles() {
      const styles = { ...this.themeStyle };
      if (this.duration) {
        styles.animation = `SkeletonLoading ${this.duration}s ease-in-out infinite`;
      } else {
        styles.backgroundImage = '';
      }
      if (this.width) styles.width = this.width;
      if (this.height) styles.height = this.height;
      if (this.circle) styles.borderRadius = '50%';
      return styles;
    },
    elements() {
      const elements = [];
      for (let i = 0; i < this.count; i += 1) {
        elements.push({});
      }
      return elements;
    },
    showLoading() {
      return typeof this.isLoading !== 'undefined'
      ? this.isLoading
      : this.isEmptyVNode(this.$slots.default);
    },
  },
  methods: {
    isEmptyVNode(children) {
      if (!children) return true;
      const [firstNode] = children;
      let str = firstNode.text;
      if (str) {
        // remove all line-break and space character
        str = str.replace(/(\n|\r\n|\s)/g, '');
      }
      return typeof firstNode.tag === 'undefined' && !str;
    },
  },
};
</script>

<style lang="scss">
.unnnic-skeleton {
  background-size: 500px 100%;
  background-repeat: no-repeat;
  border-radius: $unnnic-border-radius-sm;
  display: inline-block;
  line-height: 1;
  width: 100%;
  height: inherit;
}
@keyframes SkeletonLoading {
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: calc(500px + 100%) 0;
  }
}
</style>
