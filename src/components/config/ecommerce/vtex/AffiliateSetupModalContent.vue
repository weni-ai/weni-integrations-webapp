<template>
  <div slot="message" class="vtex-modal__content">
    <!-- Cabeçalho com padding -->
    <div class="vtex-modal__padding">
      <header class="vtex-modal__header">
        <span class="vtex-modal__header__title">
          {{ $t('vtex.setup.affiliate_title') }}
        </span>
      </header>
    </div>

    <!-- Divider fora do padding lateral -->
    <div class="divider" />

    <!-- Resto do conteúdo com padding -->
    <div class="vtex-modal__padding">
      <span class="vtex-modal__header__description">
        {{ $t('vtex.setup.affiliate_description') }}
      </span>

      <div class="vtex-modal__content__section_wrapper">
        <section class="vtex-modal__content__section">
          <span class="vtex-modal__content__section__number">1</span>
          <div class="vtex-modal__content__section__content">
            <span class="vtex-modal__content__section__content__title">
              {{ $t('vtex.setup.affiliate_step1.title') }}
            </span>
            <p
              class="vtex-modal__content__section__content__description"
              v-html="$t('vtex.setup.affiliate_step1.description')"
            ></p>
          </div>
        </section>

        <section class="vtex-modal__content__section">
          <span class="vtex-modal__content__section__number">2</span>
          <div class="vtex-modal__content__section__content">
            <span class="vtex-modal__content__section__content__title">
              {{ $t('vtex.setup.affiliate_step2.title') }}
            </span>
            <p
              class="vtex-modal__content__section__content__description"
              v-html="$t('vtex.setup.affiliate_step2.description')"
            ></p>
          </div>
        </section>

        <section class="vtex-modal__content__section">
          <span class="vtex-modal__content__section__number">3</span>
          <div class="vtex-modal__content__section__content">
            <span class="vtex-modal__content__section__content__title">
              {{ $t('vtex.setup.affiliate_step3.title') }}
            </span>
            <p
              class="vtex-modal__content__section__content__description"
              v-html="$t('vtex.setup.affiliate_step3.description')"
            ></p>
          </div>
        </section>

        <section class="vtex-modal__content__section">
          <span class="vtex-modal__content__section__number">4</span>
          <div class="vtex-modal__content__section__content">
            <span class="vtex-modal__content__section__content__title">
              {{ $t('vtex.setup.affiliate_step4.title') }}
            </span>
            <p
              class="vtex-modal__content__section__content__description"
              v-html="$t('vtex.setup.affiliate_step4.description')"
            ></p>

            <div class="vtex-modal__content__section__content__url-wrapper">
              <unnnic-input
                class="vtex-modal__content__section__content__url-input"
                :value="webhookUrl"
              />

              <unnnic-button
                ref="vtex-copy-button"
                class="vtex-modal__content__section__content__url-wrapper__button"
                type="secondary"
                iconLeft="content_copy"
                text="Copiar"
                @click="copyWebhookUrl"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      webhookUrl: {
        type: String,
        required: true,
      },
    },
    methods: {
      copyWebhookUrl() {
        this.$refs['vtex-copy-button'].copy();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .vtex-modal {
    ::v-deep {
      .unnnic-modal-container-background {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0 $unnnic-spacing-md;
        max-height: 95vh;
        cursor: auto;
        box-shadow: none;
        width: 750px;
      }

      .unnnic-modal-container-background-body {
        border-radius: $unnnic-border-radius-sm $unnnic-border-radius-sm 0 0;
      }

      .unnnic-modal-container-background-body-title,
      .unnnic-modal-container-background-body-description-container {
        padding-bottom: $unnnic-spacing-xs;
      }
    }

    &__padding {
      padding: 0 24px;
    }

    &__header {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-xs;
      text-align: left;
      margin-bottom: $unnnic-spacing-sm;

      padding-top: 24px;
      &__title {
        color: $unnnic-color-neutral-darkest;
        font-size: $unnnic-font-size-title-sm;
        font-weight: $unnnic-font-weight-black;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
      }

      &__description {
        color: $unnnic-color-neutral-dark;
        font-size: $unnnic-font-size-body-md;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
        padding: 24px 0;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;

      &__section_wrapper {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-sm;
      }

      &__section {
        display: flex;
        text-align: left;
        gap: $unnnic-spacing-stack-xs;

        &__number {
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 31px;
          min-height: 31px;
          max-width: 31px;
          max-height: 31px;
          border-radius: $unnnic-border-radius-pill;
          background: $unnnic-color-weni-200;
        }

        &__content {
          display: flex;
          flex-direction: column;
          gap: $unnnic-spacing-stack-nano;
          margin-top: 2px;

          &__title {
            color: $unnnic-color-neutral-darkest;
            font-size: $unnnic-font-size-body-lg;
            font-weight: $unnnic-font-weight-bold;
            line-height: $unnnic-line-height-md + $unnnic-font-size-body-lg;
          }

          &__description {
            margin: 0;
            color: $unnnic-color-neutral-dark;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

            ::v-deep {
              .highlight {
                color: $unnnic-color-neutral-dark;
                background: $unnnic-color-neutral-soft;
                border-radius: $unnnic-border-radius-sm;
                padding: 2px $unnnic-spacing-nano;
              }

              ul {
                margin: 0;
                padding: 0;
                padding-left: 20px;
              }
            }
          }

          &__url-wrapper {
            display: flex;
            gap: $unnnic-spacing-xs;
            align-items: center;

            &__button {
              min-width: 110px;
            }
          }
        }
      }
    }
  }

  .divider {
    margin: $unnnic-spacing-xs 0;
    padding: 0;
    border-top: 1px solid $unnnic-color-neutral-soft;
  }
</style>
