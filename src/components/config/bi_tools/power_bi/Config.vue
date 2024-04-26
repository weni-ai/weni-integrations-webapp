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
        hoverText=""
      >
        <template #buttons>
          <unnnic-toolTip
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
        </template>
      </unnnic-data-area>
      <skeleton-loading v-else tag="div" width="100%" height="6rem" />

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
          :loading="loadingDownloadConnector"
          @click="downloadConnector"
        />
      </div>

      <div class="app-config-power-bi__content__download">
        <unnnic-label
          class="app-config-power-bi__content__download__label"
          :label="$t('PowerBi.config.download_model.label')"
        />
        <unnnic-button
          class="app-config-power-bi__content__download__button"
          type="secondary"
          size="small"
          iconCenter="download-thick-bottom-1"
          :loading="loadingDownloadModel"
          @click="downloadModel"
        />
      </div>
    </div>

    <div class="app-config-power-bi__buttons">
      <unnnic-button
        class="app-config-power-bi__buttons__cancel"
        type="tertiary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="$emit('closeModal')"
      />
    </div>
  </div>
</template>

<script>
  import unnnicCallAlert from '@weni/unnnic-system';
  import PowerBiIcon from '@/assets/logos/power_bi.png';
  import { mapState, mapActions } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  import skeletonLoading from '@/components/Skeleton/SkeletonLoading.vue';

  export default {
    name: 'PowerBiConfig',
    components: { skeletonLoading },
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
        loadingDownloadConnector: false,
        loadingDownloadModel: false,
      };
    },
    async mounted() {
      await this.getFlowToken();

      if (this.errorFlowToken) {
        unnnicCallAlert({
          props: {
            text: this.$t('PowerBi.config.token_error'),
            type: 'success',
          },
          seconds: 3,
        });
      }
    },
    computed: {
      ...mapState(auth_store, ['flowToken', 'errorFlowToken', 'loadingFlowToken']),
      powerBiIcon() {
        return PowerBiIcon;
      },
      documentationLink() {
        return this.documentations[this.$i18n.locale] ?? this.documentations['en-us'];
      },
    },
    methods: {
      ...mapActions(auth_store, ['getFlowToken']),
      /* istanbul ignore next */
      async copyToken() {
        if (!this.flowToken) {
          return;
        }

        navigator.clipboard.writeText(this.flowToken);

        unnnicCallAlert({
          props: {
            text: this.$t('apps.config.copy_success'),
            type: 'success',
          },
          seconds: 3,
        });
      },
      /* istanbul ignore next */
      createDownload({ name, link }) {
        const anchor = document.createElement('a');
        anchor.href = link;
        anchor.download = name;
        anchor.style.display = 'none';

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      },
      downloadConnector() {
        this.loadingDownloadConnector = true;
        this.createDownload({
          name: 'WeniFluxos.mez',
          link: 'https://github.com/Ilhasoft/custom-connector-powerbi/releases/download/v1.0.1/WeniFluxos.mez',
        });
        setTimeout(() => {
          this.loadingDownloadConnector = false;
        }, 500);
      },
      downloadModel() {
        this.loadingDownloadModel = true;
        this.createDownload({
          name: 'base_dashboard.pbix',
          link: 'https://github.com/Ilhasoft/custom-connector-powerbi/releases/download/v1.0.1/base_dashboard.pbix',
        });
        setTimeout(() => {
          this.loadingDownloadModel = false;
        }, 500);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-power-bi {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
      display: flex;
      margin: $unnnic-spacing-inset-lg;
      margin-bottom: $unnnic-spacing-stack-sm;
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
      overflow: auto;
      display: flex;
      flex-direction: column;
      flex: 1;
      color: $unnnic-color-neutral-cloudy;
      font-size: $unnnic-font-size-body-gt;
      line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
      margin: 0 $unnnic-spacing-inset-lg;

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
      margin: $unnnic-spacing-inset-lg;

      &__cancel {
        flex: 1;
      }
    }
  }
</style>
