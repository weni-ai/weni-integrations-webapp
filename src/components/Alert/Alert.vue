<template>
  <div v-if="version === '1.0'" :class="['unnnic-alert', `unnnic-alert-position--${position}`]">
    <unnnic-icon :icon="icon" :scheme="scheme" size="sm" />
    <div class="unnnic-alert__content">
      <div class="unnnic-alert__title">
        {{ title.toUpperCase() }}
      </div>
      <div class="unnnic-alert__text">
        {{ text }}
      </div>
    </div>
    <div v-if="closeText" class="unnnic-alert__close-text unnnic--clickable" @click="onClose()">
      {{ closeText.toUpperCase() }}
    </div>
    <unnnic-icon v-else clickable icon="close" @click="onClose" />
  </div>

  <component
    v-else
    :is="'version' + version.replace(/\./g, 'dot')"
    v-bind="{ ...$props }"
  ></component>
</template>

<script>
  import Version1dot1 from './Version1dot1.vue';

  export default {
    name: 'unnnicAlert',
    components: {
      Version1dot1,
    },
    props: {
      version: {
        type: String,
        default: '1.1',
      },

      title: {
        type: String,
        default: null,
      },
      text: {
        type: String,
        default: null,
      },
      scheme: {
        type: String,
        default: null,
      },
      icon: {
        type: String,
        default: null,
      },
      onClose: {
        type: Function,
        default: () => {},
      },
      closeText: {
        type: String,
      },
      position: {
        type: String,
        default: 'top-right',
      },
      linkHref: {
        type: String,
      },
      linkTarget: {
        type: String,
      },
      linkText: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .unnnic-alert {
    position: fixed;
    padding: $unnnic-inset-xs;
    min-width: 12.5 * $unnnic-font-size;

    display: inline-flex;
    align-items: center;

    font-family: $unnnic-font-family-secondary;
    border-radius: $unnnic-border-radius-sm;

    background-color: $unnnic-color-background-snow;
    box-shadow: $unnnic-shadow-level-near;
    position: fixed;

    z-index: 9999;

    &-position {
      &--top-right {
        top: 1 * $unnnic-font-size;
        right: 1 * $unnnic-font-size;
      }
      &--top-left {
        top: 1 * $unnnic-font-size;
        left: 1 * $unnnic-font-size;
      }
      &--bottom-right {
        bottom: 1 * $unnnic-font-size;
        right: 1 * $unnnic-font-size;
      }
      &--bottom-left {
        bottom: 1 * $unnnic-font-size;
        left: 1 * $unnnic-font-size;
      }
    }

    &__content {
      flex: 1;
      margin: 0 $unnnic-inline-xs;
    }

    &__title {
      font-size: $unnnic-font-size-body-sm;
      font-weight: $unnnic-font-weight-bold;
      color: $unnnic-color-neutral-darkest;
    }

    &__text {
      font-size: $unnnic-font-size-body-md;
      font-weight: $unnnic-font-weight-regular;
      color: $unnnic-color-neutral-dark;
    }

    &__close {
      &-text {
        color: $unnnic-color-brand-sec;
        font-size: $unnnic-font-size-body-md;
      }
    }
  }
</style>
