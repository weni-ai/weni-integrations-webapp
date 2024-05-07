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

      <div v-show="text" class="alert__text">{{ text }}</div>

      <a v-if="linkHref" class="alert__link" :href="linkHref" :target="linkTarget">
        {{ linkText }}
      </a>

      <div class="alert__close" @click="emitClose">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Group">
            <path
              id="Vector"
              d="M11.6237 11.9992C11.5744 11.9993 11.5257 11.9897 11.4802 11.9708C11.4347 11.9519 11.3934 11.9242 11.3587 11.8892L5.9998 6.53074L0.640851 11.8892C0.606245 11.9243 0.565 11.9522 0.519515 11.9712C0.47403 11.9903 0.425212 12.0001 0.375903 12.0001C0.326594 12.0001 0.277776 11.9903 0.232291 11.9712C0.186806 11.9522 0.145561 11.9243 0.110955 11.8892C0.0408349 11.8187 0.00146931 11.7234 0.00146931 11.624C0.00146931 11.5246 0.0408349 11.4292 0.110955 11.3588L5.4699 5.99984L0.110955 0.641393C0.0399689 0.570907 0.000976562 0.476425 0.000976562 0.376445C0.000976562 0.276465 0.0399689 0.181983 0.110955 0.111497C0.181441 0.0405108 0.275923 0.00151849 0.375903 0.00151849C0.475883 0.00151849 0.570365 0.0405108 0.640851 0.111497L5.9998 5.46995L11.3587 0.110997C11.3934 0.0758707 11.4346 0.0479763 11.4801 0.0289365C11.5256 0.00989665 11.5744 9.15527e-05 11.6237 9.15527e-05C11.673 9.15527e-05 11.7218 0.00989665 11.7673 0.0289365C11.8128 0.0479763 11.854 0.0758707 11.8886 0.110997C11.9237 0.145714 11.9515 0.187024 11.9704 0.232541C11.9894 0.278059 11.9992 0.326883 11.9992 0.376195C11.9992 0.425507 11.9894 0.474331 11.9704 0.519849C11.9515 0.565366 11.9237 0.606676 11.8886 0.641393L6.5297 6.00034L11.8886 11.3593C11.9588 11.4297 11.9981 11.5251 11.9981 11.6245C11.9981 11.7239 11.9588 11.8192 11.8886 11.8897C11.8539 11.9245 11.8126 11.9521 11.7671 11.9709C11.7216 11.9897 11.6729 11.9993 11.6237 11.9992Z"
              fill="#ffff"
            />
          </g>
        </svg>
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
