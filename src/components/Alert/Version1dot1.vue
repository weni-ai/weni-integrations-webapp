<template>
  <div ref="alertContainer" class="alert-container">
    <div
      :class="[
        'alert',
        {
          'alert--scheme-aux-green': scheme === 'feedback-green' || type === 'success',
          'alert--scheme-aux-red': scheme === 'feedback-red' || type === 'error',
        },
      ]"
    >
      <div ref="progress" class="alert__progress"></div>

      <div v-show="text" class="alert__text">
        {{ text }}
      </div>

      <a v-if="linkHref" class="alert__link" :href="linkHref" :target="linkTarget">
        {{ linkText }}
      </a>

      <div class="alert__close" @click="emitClose">
        <unnnic-icon icon="close" size="sm" scheme="neutral-white" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      version: {
        type: String,
        default: '1.0',
      },
      text: {
        type: String,
        default: null,
      },
      scheme: {
        type: String,
        default: null,
      },
      onClose: {
        type: Function,
        default: () => {},
      },
      linkHref: {
        type: String,
        default: '',
      },
      linkTarget: {
        type: String,
        default: '_blank',
      },
      linkText: {
        type: String,
        default: 'Learn more',
      },
      type: {
        type: String,
        default: 'default',
      },
    },

    mounted() {
      this.$refs.progress.addEventListener('animationend', () => {
        this.$refs.alertContainer.classList.add('slide-down');
      });

      this.$refs.alertContainer.addEventListener('animationend', (event) => {
        if (event.animationName.startsWith('slideDown')) {
          this.emitClose();
        }
      });
    },

    methods: {
      emitClose() {
        this.onClose();

        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alert-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    animation: slideUp 200ms ease;

    @keyframes slideUp {
      from {
        bottom: -3.375 * $unnnic-font-size;
      }

      to {
        bottom: 0;
      }
    }

    &.slide-down {
      animation-name: slideDown;
    }

    @keyframes slideDown {
      from {
        bottom: 0;
      }

      to {
        bottom: -3.375 * $unnnic-font-size;
      }
    }
  }

  .alert {
    position: relative;
    border-radius: $unnnic-border-radius-sm;

    display: inline-flex;
    align-items: center;
    margin-bottom: $unnnic-spacing-sm;

    color: $unnnic-color-neutral-white;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
    font-weight: $unnnic-font-weight-regular;

    background-color: $unnnic-color-neutral-dark;

    z-index: 9999;

    overflow: hidden;

    @keyframes progress {
      from {
        width: 0;
      }

      to {
        width: 100%;
      }
    }

    &__progress {
      position: absolute;
      height: 100%;
      background-color: $unnnic-color-neutral-darkest;
      border-radius: $unnnic-border-radius-sm;
      left: 0;
      top: 0;
      pointer-events: none;
      z-index: -1;
      animation-name: progress;
      animation-duration: 5000ms;
      animation-timing-function: linear;
    }

    &:hover {
      .alert__progress {
        animation-play-state: paused;
      }
    }

    &__text {
      padding: $unnnic-spacing-xs $unnnic-spacing-sm;
    }

    &__link,
    &__close {
      border-left: $unnnic-border-width-thinner solid $unnnic-color-neutral-cloudy;

      &:hover {
        background-color: $unnnic-color-neutral-cloudy;
      }
    }

    &__link {
      padding: $unnnic-spacing-xs $unnnic-spacing-sm;
      text-decoration: none;
      color: inherit;
      display: block;
      font-weight: $unnnic-font-weight-bold;
    }

    &__close {
      padding: $unnnic-spacing-xs $unnnic-spacing-sm;
      cursor: pointer;
      user-select: none;
    }

    &--scheme-aux-green {
      background-color: $unnnic-color-aux-green-500;

      .alert__progress {
        background-color: $unnnic-color-aux-green-700;
      }

      .alert__link,
      .alert__close {
        border-left: $unnnic-border-width-thinner solid $unnnic-color-aux-green-300;

        &:hover {
          background-color: $unnnic-color-aux-green-300;
        }
      }
    }

    &--scheme-aux-red {
      background-color: $unnnic-color-aux-red-500;

      .alert__progress {
        background-color: $unnnic-color-aux-red-700;
      }

      .alert__link,
      .alert__close {
        border-left: $unnnic-border-width-thinner solid $unnnic-color-aux-red-300;

        &:hover {
          background-color: $unnnic-color-aux-red-300;
        }
      }
    }
  }
</style>
