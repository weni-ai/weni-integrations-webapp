<template>
  <div class="wwc-simulator" :style="cssVars">
    <transition name="fade">
      <div v-if="isOpen" class="wwc-simulator__content">
        <div class="wwc-simulator__content__header">
          <div v-if="!avatar" class="wwc-simulator__content__header__icon-container">
            <unnnic-icon-svg
              class="wwc-simulator__content__header__icon-container__icon"
              icon="single-neutral-2"
              size="sm"
              scheme="background-snow"
            />
          </div>
          <div v-else class="wwc-simulator__content__header__custom-icon" />
          <div class="wwc-simulator__content__header__text">
            <div class="wwc-simulator__content__header__text__title">
              {{ title || $t('weniWebChat.simulator.chatTitle') }}
            </div>
            <div class="wwc-simulator__content__header__text__subtitle">
              {{ subtitle || $t('weniWebChat.simulator.chatSubtitle') }}
            </div>
          </div>
          <div class="wwc-simulator__content__header__button">
            <unnnic-icon-svg
              v-if="showFullScreenButton"
              icon="expand-full-1"
              size="sm"
              lineHeight="sm"
              scheme="background-snow"
            />
            <div class="wwc-simulator__content__header__button__close" @click="toggleChat">
              <unnnic-icon-svg icon="close-1" size="sm" lineHeight="sm" scheme="background-snow" />
            </div>
          </div>
        </div>
        <div class="wwc-simulator__content__body">
          <div
            v-for="message in messages"
            :key="message.text"
            :class="`wwc-simulator__content__body__message--${message.direction}`"
          >
            <div
              v-if="!avatar && message.direction === 'incoming'"
              :class="`wwc-simulator__content__body__message--${message.direction}__icon-container`"
            >
              <unnnic-icon-svg
                :class="`wwc-simulator__content__body__message--${message.direction}__icon-container__icon`"
                icon="single-neutral-2"
                size="sm"
                scheme="background-snow"
              />
            </div>
            <div
              v-else-if="message.direction === 'incoming'"
              :class="`wwc-simulator__content__body__message--${message.direction}__custom-icon`"
            />
            <div :class="`wwc-simulator__content__body__message--${message.direction}__content`">
              <div
                :class="`wwc-simulator__content__body__message--${message.direction}__content__text`"
              >
                {{ message.text }}
              </div>
              <div
                :class="`wwc-simulator__content__body__message--${message.direction}__content__replies`"
              >
                <div
                  v-for="reply in message.replies"
                  :key="reply.id"
                  :class="`wwc-simulator__content__body__message--${message.direction}__content__replies__reply`"
                >
                  {{ reply.text }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="wwc-simulator__content__input">
          <div class="wwc-simulator__content__input__text">
            {{ placeholder || $t('weniWebChat.simulator.chatPlaceholder') }}
          </div>
          <div class="wwc-simulator__content__input__button">
            <unnnic-icon-svg
              class="wwc-simulator__content__input__button__icon"
              icon="send-email-3-1"
              size="md"
              scheme="neutral-clean"
            />
          </div>
        </div>
      </div>
    </transition>
    <div class="wwc-simulator__button" @click="toggleChat">
      <div v-if="displayUnreadCount && !isOpen" class="wwc-simulator__button__unread">{{ 2 }}</div>
      <div v-if="!avatar" class="wwc-simulator__button__content">
        <unnnic-icon-svg
          class="wwc-simulator__button__content__icon"
          icon="single-neutral-2"
          size="md"
          scheme="background-snow"
        />
      </div>
      <div v-else class="wwc-simulator__button__custom-icon" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const props = defineProps({
    mainColor: {
      type: String,
      default: '#009E96',
    },
    avatar: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    showFullScreenButton: {
      type: Boolean,
      default: false,
    },
    displayUnreadCount: {
      type: Boolean,
      default: false,
    },
  });

  // State
  const isOpen = ref(true);

  const messages = ref([
    {
      direction: 'incoming',
      text: `Curabitur vitae luctus felis, eget placerat est. In hac habitasse platea dictumst.
      Phasellus ipsum sem, pulvinar eget ultrices nec, tristique non quam. Nulla ac sem ut
      nisi fermentum luctus.`,
      replies: [],
    },
    {
      direction: 'outgoing',
      text: `Vitae`,
      replies: [],
    },
    {
      direction: 'incoming',
      text: `Curabitur porta, tortor sit amet laoreet posuere.`,
      replies: [
        { id: 1, text: t('weniWebChat.simulator.replies.yes') },
        { id: 2, text: t('weniWebChat.simulator.replies.no') },
        { id: 3, text: t('weniWebChat.simulator.replies.maybe') },
      ],
    },
  ]);

  // Computed
  const cssVars = computed(() => {
    const validColor = props.mainColor || '#009E96';
    return {
      '--main-color': validColor,
      '--main-color-opaque': validColor + '1C',
      '--custom-avatar': `url(${props.avatar})`,
    };
  });

  // Methods
  function toggleChat() {
    isOpen.value = !isOpen.value;
  }

  // Expose for parent component
  defineExpose({
    isOpen,
    toggleChat,
  });
</script>

<style lang="scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  @mixin customIcon {
    width: $unnnic-icon-size-md;
    height: $unnnic-icon-size-md;
    background-image: var(--custom-avatar);
    background-size: cover;
    border-radius: $unnnic-border-radius-pill;
    margin: $unnnic-spacing-inset-nano;
    background-position: center;
  }

  @mixin colorTransition {
    transition:
      color 0.3s ease-in,
      background-color 0.3s ease-in;
  }

  .wwc-simulator {
    height: 100%;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-content: flex-end;

    &__content {
      display: flex;
      flex-direction: column;
      flex: 1;
      background-color: $unnnic-color-background-snow;
      margin-bottom: $unnnic-spacing-stack-sm;
      border-radius: $unnnic-border-radius-sm $unnnic-border-radius-sm 0 0;

      &__header {
        @include colorTransition;
        display: flex;
        background-color: var(--main-color);
        border-radius: $unnnic-border-radius-sm $unnnic-border-radius-sm 0 0;
        width: 100%;

        &__custom-icon {
          @include customIcon;
          align-self: center;
        }

        &__icon-container {
          display: flex;
          align-items: center;
          border-radius: 100%;
          width: $unnnic-icon-size-md;
          height: $unnnic-icon-size-md;
          align-self: center;
          margin: $unnnic-spacing-inset-nano;

          &__icon {
            display: flex;
            margin: 0 auto;
            justify-items: center;
          }
        }

        &__text {
          flex-grow: 1;
          color: $unnnic-color-background-snow;
          margin: $unnnic-spacing-inset-nano 0;
          overflow: hidden;

          &__title {
            font-size: $unnnic-font-size-body-lg;
            overflow: hidden;
          }

          &__subtitle {
            font-size: $unnnic-font-size-body-md;
          }
        }

        &__button {
          display: flex;
          align-items: center;
          margin-right: $unnnic-inline-sm;
          gap: $unnnic-spacing-inset-nano;

          &__close {
            margin-top: -$unnnic-spacing-stack-nano;
            cursor: pointer;
          }
        }
      }

      &__body {
        flex: 1;
        overflow-y: auto;
        padding: $unnnic-spacing-inset-nano;

        &__message {
          &--incoming {
            min-height: min-content;
            margin: $unnnic-spacing-inset-nano 0;
            display: flex;

            &__icon-container {
              @include colorTransition;
              background-color: var(--main-color);
              display: flex;
              align-items: center;
              border-radius: 100%;
              min-width: $unnnic-icon-size-md;
              width: $unnnic-icon-size-md;
              height: $unnnic-icon-size-md;
              margin: 0 $unnnic-spacing-inline-nano;

              &__icon {
                display: flex;
                margin: 0 auto;
              }
            }

            &__custom-icon {
              @include customIcon;
              margin: 0 $unnnic-spacing-inline-nano;
              min-width: $unnnic-icon-size-md;
            }

            &__content {
              display: flex;
              flex-direction: column;
              margin-top: $unnnic-spacing-stack-xs;

              &__text {
                background-color: $unnnic-color-background-sky;
                border-radius: 0px $unnnic-border-radius-sm $unnnic-border-radius-sm;
                padding: $unnnic-spacing-inset-nano;
                font-family: $unnnic-font-family-secondary;
                font-size: $unnnic-font-size-body-md;
                line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
              }

              &__replies {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                gap: $unnnic-spacing-inline-xs;
                margin-top: $unnnic-spacing-stack-xs;

                &__reply {
                  @include colorTransition;
                  border: $unnnic-border-width-thinner solid var(--main-color);
                  border-radius: $unnnic-border-radius-pill;
                  padding: $unnnic-spacing-stack-nano $unnnic-inline-sm;
                  font-family: $unnnic-font-family-secondary;
                  font-size: $unnnic-font-size-body-md;
                  line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
                  color: var(--main-color);
                  background-color: var(--main-color-opaque);
                }
              }
            }
          }

          &--outgoing {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;

            &__content {
              &__text {
                @include colorTransition;
                background-color: var(--main-color);
                font-family: $unnnic-font-family-secondary;
                font-size: $unnnic-font-size-body-md;
                line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
                color: $unnnic-color-background-snow;
                border-radius: $unnnic-border-radius-sm;
                padding: $unnnic-squish-nano;
              }
            }
          }
        }
      }

      &__input {
        display: flex;
        align-items: center;
        background-color: $unnnic-color-background-sky;

        &__text {
          margin: $unnnic-inset-nano;
          font-family: $unnnic-font-family-secondary;
          font-size: $unnnic-font-size-body-lg;
          line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
          color: $unnnic-color-neutral-clean;
          width: 100%;
          overflow: hidden;
        }

        &__button {
          margin-left: auto;
          margin-right: $unnnic-inline-xs;
        }
      }
    }

    &__button {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: auto;

      &__content {
        @include colorTransition;
        background-color: var(--main-color);
        padding: $unnnic-inset-xs;
        border-radius: 100%;
      }

      &__custom-icon {
        @include customIcon;
        width: 48px;
        height: 48px;
        margin: 0;
      }

      &__unread {
        z-index: 1;
        color: $unnnic-color-background-snow;
        background-color: var(--main-color);
        margin-right: -$unnnic-spacing-inline-xs;
        height: $unnnic-icon-size-sm;
        width: $unnnic-icon-size-sm;
        border-radius: $unnnic-border-radius-pill;
        font-size: $unnnic-font-size-body-md;
        text-align: center;
      }
    }
  }
</style>
