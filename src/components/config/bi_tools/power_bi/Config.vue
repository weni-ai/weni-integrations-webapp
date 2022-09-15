<template>
  <div class="app-config-power-bi">
    <div class="app-config-power-bi__header">
      <div class="app-config-power-bi__header__title">
        <div class="app-config-power-bi__header__title__icon-container">
          <img class="app-config-power-bi__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="app-config-power-bi__header__title__name">{{ $t('PowerBi.title') }}</div>
      </div>
      <span class="app-config-power-bi__header__description">
        {{ $t('PowerBi.config.description.text') }}
        <a
          class="app-config-power-bi__header__description__link"
          :href="documentationLink"
          target="_blank"
        >
          <span>
            {{ $t('PowerBi.config.description.link') }}
            <unnnic-icon-svg icon="export-1" size="xs" />
          </span>
        </a>
      </span>
    </div>

    <div class="app-config-power-bi__content">
      <unnnic-data-area
        v-if="!loadingFlowToken"
        class="app-config-power-bi__content__token-input"
        title="Token"
        :text="flowToken || ''"
      >
        <unnnic-toolTip
          slot="buttons"
          :text="$t('PowerBi.config.token_input.tooltip')"
          :enabled="true"
          side="top"
        >
          <unnnic-button
            class="app-config-power-bi__content__token-input__button"
            type="secondary"
            size="small"
            iconCenter="copy-paste-1"
            @click="copyToken"
          />
        </unnnic-toolTip>
      </unnnic-data-area>
      <unnnic-skeleton-loading v-else tag="div" width="100%" height="6rem" />

      <div class="app-config-power-bi__content__download">
        <unnnic-label
          class="app-config-power-bi__content__download__label"
          :label="$t('PowerBi.config.download.label')"
        />
        <unnnic-button
          class="app-config-power-bi__content__download__button"
          type="secondary"
          size="small"
          iconCenter="download-thick-bottom-1"
          :loading="loadingDownload"
          @click="downloadConnector"
        />
      </div>
    </div>

    <div class="app-config-power-bi__buttons">
      <unnnic-button
        class="app-config-power-bi__buttons__cancel"
        type="secondary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="$emit('closeModal')"
      />
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  import PowerBiIcon from '@/assets/logos/power_bi.png';

  export default {
    name: 'PowerBiConfig',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        documentations: {
          'en-us': 'https://docs.weni.ai/l/en/extras/weni-data-connector-for-power-bi',
          'pt-br':
            'https://docs.weni.ai/l/pt/extras/como-instalar-e-usar-o-conector-de-dados-para-power-bi',
        },
        loadingDownload: false,
      };
    },
    async mounted() {
      await this.getFlowToken();

      if (this.errorFlowToken) {
        unnnicCallAlert({
          props: {
            text: this.$t('PowerBi.config.token_error'),
            title: 'Error',
            icon: 'alert-circle-1-1',
            scheme: 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 3,
        });
      }
    },
    computed: {
      ...mapState({
        flowToken: (state) => state.auth.flowToken,
        errorFlowToken: (state) => state.auth.errorFlowToken,
        loadingFlowToken: (state) => state.auth.loadingFlowToken,
      }),
      powerBiIcon() {
        return PowerBiIcon;
      },
      documentationLink() {
        return this.documentations[this.$i18n.locale] ?? this.documentations['en-us'];
      },
    },
    methods: {
      ...mapActions(['getFlowToken']),
      /* istanbul ignore next */
      async copyToken() {
        if (!this.flowToken) {
          return;
        }

        navigator.clipboard.writeText(this.flowToken);

        unnnicCallAlert({
          props: {
            text: this.$t('apps.config.copy_success'),
            title: 'Success',
            icon: 'check-circle-1-1',
            scheme: 'feedback-green',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 3,
        });
      },
      /* istanbul ignore next */
      downloadConnector() {
        this.loadingDownload = true;
        const anchor = document.createElement('a');
        anchor.href =
          'https://github.com/Ilhasoft/custom-connector-powerbi/releases/download/v1.0.1/WeniFluxos.mez';
        anchor.download = 'WeniFluxos.mez';
        anchor.style.display = 'none';

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        setTimeout(() => {
          this.loadingDownload = false;
        }, 500);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-power-bi {
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
    height: -moz-available;
    padding: $unnnic-inset-lg;

    &__header {
      display: flex;
      margin-bottom: $unnnic-spacing-stack-nano;
      flex-direction: column;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          align-items: center;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;

          background-color: rgba(253, 186, 56, 0.2);

          &__icon {
            width: $unnnic-icon-size-md;
            height: $unnnic-icon-size-md;
            margin: 0 auto;
          }
        }

        &__name {
          align-self: center;
          font-family: $unnnic-font-family-primary;
          font-weight: $unnnic-font-weight-regular;
          font-size: $unnnic-font-size-title-md;
          line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
          color: $unnnic-color-neutral-darkest;

          margin-left: $unnnic-inline-sm;
        }
      }

      &__description {
        margin-top: $unnnic-inline-sm;
        padding-bottom: $unnnic-inline-md;

        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;

        &__link {
          border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-cloudy;
        }

        a {
          font-weight: $unnnic-font-weight-bold;
          color: $unnnic-color-neutral-cloudy;
          text-decoration: none;
        }
      }
    }

    &__content {
      ::v-deep .data-area-container__header__title {
        color: $unnnic-color-neutral-cloudy;
      }

      ::v-deep .data-area-container__content {
        padding: $unnnic-squish-xs;
      }

      &__download {
        margin: $unnnic-spacing-stack-md 0;
      }

      &__url-input,
      &__token-input {
        &__button {
          &::after {
            border: none;
          }
        }
      }
    }

    &__buttons {
      display: flex;
      gap: $unnnic-spacing-inline-sm;
      justify-content: flex-end;
      margin-top: $unnnic-spacing-stack-xl;

      &__cancel {
        width: 50%;
      }
    }
  }
</style>
