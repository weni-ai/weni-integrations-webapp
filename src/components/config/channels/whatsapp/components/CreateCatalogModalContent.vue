<template>
  <div class="modal">
    <div slot="message" class="modal__content">
      <span class="modal__content__title">{{ $t('whatsapp.create_catalog.title') }}</span>

      <div class="modal__content__header">
        <span class="modal__content__header__title">{{
          $t('whatsapp.create_catalog.header.title')
        }}</span>
        <span class="modal__content__header__description">{{
          $t('whatsapp.create_catalog.header.description')
        }}</span>
      </div>

      <div class="modal__content__form">
        <div class="modal__content__form__options">
          <div
            ref="vtexOption"
            :class="['modal__content__form__options__card', type === types.VTEX ? 'selected' : '']"
            @click="type = types.VTEX"
          >
            <div class="modal__content__form__options__card__icon">
              <img
                class="modal__content__form__options__card__icon__image"
                src="~@/assets/vtex_small.png"
              />
            </div>

            <div class="modal__content__form__options__card__content">
              <span class="modal__content__form__options__card__content__title">{{
                $t('whatsapp.create_catalog.option.vtex.title')
              }}</span>
              <span class="modal__content__form__options__card__content__description">
                {{ $t('whatsapp.create_catalog.option.vtex.description') }}
              </span>
            </div>
          </div>

          <div
            ref="metaOption"
            :class="['modal__content__form__options__card', type === types.META ? 'selected' : '']"
            @click="type = types.META"
          >
            <div class="modal__content__form__options__card__icon">
              <img
                class="modal__content__form__options__card__icon__image"
                src="~@/assets/meta_small.png"
              />
            </div>

            <div class="modal__content__form__options__card__content">
              <span class="modal__content__form__options__card__content__title">
                {{ $t('whatsapp.create_catalog.option.meta.title') }}
                <unnnic-icon
                  icon="open_in_new"
                  class="modal__content__form__options__card__content__title__icon"
                />
              </span>
              <span class="modal__content__form__options__card__content__description">
                {{ $t('whatsapp.create_catalog.option.meta.description') }}
              </span>
            </div>
          </div>
        </div>

        <span
          v-html="$t('whatsapp.create_catalog.footer')"
          class="modal__content__form__footer"
        ></span>
      </div>
    </div>
    <div class="modal__buttons">
      <unnnic-button slot="options" ref="closeButton" type="tertiary" @click="closeModal">
        {{ $t('general.Cancel') }}
      </unnnic-button>
      <!-- TODO: Check if VTEX app is enabled to enable this button -->
      <unnnic-button slot="options" ref="createButton" @click="createCatalog">
        {{ $t('general.continue') }}
      </unnnic-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CreateCatalogModalContent',
    data() {
      return {
        types: {
          VTEX: 'vtex',
          META: 'meta',
        },
        type: 'vtex',
      };
    },
    methods: {
      createCatalog() {
        this.$emit('createCatalog', this.type);
      },
      closeModal() {
        this.$emit('closeModal');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .modal {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-md;

    &__buttons {
      display: flex;
      gap: $unnnic-spacing-lg;
      widows: 100%;
      flex: 1;

      ::v-deep .unnnic-button {
        width: 100%;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-sm;
      text-align: left;

      &__title {
        color: $unnnic-color-neutral-darkest;
        font-size: $unnnic-font-size-title-sm;
        font-weight: $unnnic-font-weight-black;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-medium;
      }

      &__header {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-nano;

        &__title {
          color: $unnnic-color-neutral-darkest;
          font-size: $unnnic-font-size-body-lg;
          font-weight: $unnnic-font-weight-black;
          line-height: $unnnic-font-size-body-lg + $unnnic-line-height-medium;
        }

        &__description {
          color: $unnnic-color-neutral-cloudy;
          font-size: $unnnic-font-size-body-md;
          line-height: $unnnic-font-size-body-md + $unnnic-line-height-medium;
        }
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-sm;

        &__options {
          display: flex;
          flex-direction: column;
          gap: $unnnic-spacing-xs;

          &__card {
            display: flex;
            padding: $unnnic-spacing-ant $unnnic-spacing-sm;
            align-items: center;
            gap: $unnnic-spacing-sm;

            border-radius: $unnnic-border-radius-sm;
            border: $unnnic-border-width-thinner solid $unnnic-color-neutral-cleanest;
            background: $unnnic-color-neutral-lightest;

            cursor: pointer;

            &.selected {
              border-radius: $unnnic-border-radius-sm;
              border: $unnnic-border-width-thinner solid $unnnic-color-weni-600;
              background: $unnnic-color-weni-50;
            }

            &__icon {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-radius: $unnnic-border-radius-sm;
              background: rgba(59, 65, 77, 0.08);
              width: 40px;
              height: 40px;
            }

            &__content {
              display: flex;
              flex-direction: column;
              align-items: flex-start;

              &__title {
                display: flex;
                align-items: center;
                gap: $unnnic-spacing-nano;
                color: $unnnic-color-neutral-darkest;
                font-size: $unnnic-font-size-body-gt;
                font-weight: $unnnic-font-weight-bold;
                line-height: $unnnic-font-size-body-gt + $unnnic-line-height-medium;

                &__icon {
                  font-size: $unnnic-font-size-title-sm !important;
                }
              }

              &__description {
                color: $unnnic-color-neutral-cloudy;
                font-size: $unnnic-font-size-body-md;
                line-height: $unnnic-font-size-body-md + $unnnic-line-height-medium;
              }
            }
          }
        }

        &__footer {
          margin-top: $unnnic-spacing-stack-xs;
          color: $unnnic-color-neutral-cloudy;
          font-size: $unnnic-font-size-body-gt;
          line-height: $unnnic-font-size-body-gt + $unnnic-line-height-medium;
        }
      }
    }
  }
</style>
