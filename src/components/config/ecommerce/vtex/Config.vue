<template>
  <div class="config-vtex">
    <div class="config-vtex__header">
      <div class="config-vtex__header__title">
        <div class="config-vtex__header__title__icon-container">
          <img class="config-vtex__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="config-vtex__header__title__name">{{ app.name }}</div>

        <unnnic-button
          class="config-vtex__header__title__close"
          type="tertiary"
          icon-center="close-1"
          size="small"
          @click="closeConfig"
        />
      </div>
      <span class="config-vtex__header__description" v-html="$t('vtex.config.description')" />
    </div>

    <div class="config-vtex__settings__content">
      <div class="config-vtex__settings__content__scroll">
        <div class="config-vtex__settings__content__catalog">
          <span class="config-vtex__settings__content__catalog__label">
            {{ $t('vtex.config.catalog') }}</span
          >
          <unnnic-button v-if="app.hasConnectedCatalog">
            {{ $t('vtex.config.view_catalog') }}
          </unnnic-button>
          <unnnic-button v-else @click="showConnectModal = true">
            {{ $t('vtex.config.connect_catalog') }}
          </unnnic-button>
        </div>

        <div class="config-vtex__settings__content__details">
          <span class="config-vtex__settings__content__details__label">
            {{ $t('vtex.config.details') }}
          </span>

          <table class="config-vtex__settings__content__details__table">
            <tr>
              <td>{{ $t('vtex.config.name') }}</td>
              <td>{{ app.name }}</td>
            </tr>
            <tr>
              <td>{{ $t('vtex.config.environment') }}</td>
              <td>{{ app.config.api_credentials.domain }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <unnnic-modal
      v-if="showConnectModal"
      class="connect-modal"
      @close="showConnectModal = false"
      @click.stop
      :closeIcon="false"
    >
      <ConnectCatalogModalContent
        @closeModal="showConnectModal = false"
        @connectCatalog="connectCatalog"
      />
    </unnnic-modal>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import ConnectCatalogModalContent from './ConnectCatalogModalContent.vue';

  export default {
    name: 'vtex-config',
    components: { ConnectCatalogModalContent },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        name: this.app.config?.name ?? null,
        showConnectModal: false,
      };
    },
    computed: {
      ...mapState({
        project: (state) => state.auth.project,
        loadingUpdateApp: (state) => state.appType.loadingUpdateApp,
        errorUpdateApp: (state) => state.appType.errorUpdateApp,
      }),
      ...mapState('ecommerce', ['loadingConnectVtexCatalog', 'errorConnectVtexCatalog']),
    },
    methods: {
      ...mapActions(['updateApp']),
      ...mapActions('ecommerce', ['connectVtexCatalog']),
      async saveConfig() {
        this.handleUpdateApp();
        this.$root.$emit('updateGrid');
      },
      async connectCatalog(eventData) {
        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            name: eventData.name,
            businessType: eventData.businessType,
          },
        };

        await this.connectVtexCatalog(data);

        if (this.errorConnectVtexCatalog) {
          this.callModal({ type: 'Error', text: this.$t('vtex.errors.connect_catalog') });
          return;
        }
      },
      closeConfig() {
        this.$emit('closeModal');
      },
      callModal({ text, type }) {
        unnnicCallAlert({
          props: {
            text: text,
            title: type === 'Success' ? this.$t('general.success') : this.$t('general.error'),
            icon: type === 'Success' ? 'check-circle-1-1' : 'alert-circle-1',
            scheme: type === 'Success' ? 'feedback-green' : 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .config-vtex {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
      display: flex;
      flex-direction: column;
      margin: 2rem;
      margin-bottom: 1.5rem;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;
          align-items: center;

          background-color: rgba(0, 158, 150, 0.16);

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

        &__close {
          margin-left: auto;
          align-self: center;
        }
      }

      &__description {
        margin-top: $unnnic-inline-sm;
        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;

        ::v-deep {
          a {
            font-weight: $unnnic-font-weight-bold;
            color: $unnnic-color-neutral-cloudy;
          }
        }
      }
    }

    &__settings {
      display: flex;
      flex-direction: column;
      height: -webkit-fill-available;
      height: -moz-available;
      overflow-y: hidden;

      &__content {
        overflow: auto;
        display: flex;
        flex-direction: column;
        flex: 1;
        color: $unnnic-color-neutral-cloudy;
        font-size: $unnnic-font-size-body-gt;
        line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
        margin: 0 2rem 2rem 2rem;

        &__catalog,
        &__details {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;

          &__label {
            color: $unnnic-color-neutral-darkest;
            font-size: $unnnic-font-size-body-lg;
            font-weight: $unnnic-font-weight-bold;
            line-height: $unnnic-line-height-md + $unnnic-font-size-body-lg;
            margin-bottom: $unnnic-spacing-sm;
          }
        }

        &__details {
          &__table {
            position: relative;
            top: -$unnnic-spacing-sm;
            width: 100%;
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 0 $unnnic-spacing-sm;
          }
        }

        // &__description {
        //   font-weight: $unnnic-font-weight-bold;
        //   font-size: $unnnic-font-size-body-gt;
        //   line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
        //   color: $unnnic-color-neutral-cloudy;
        // }

        &__scroll {
          padding-right: $unnnic-spacing-inline-xs;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: auto;
          overflow-x: hidden;
          gap: $unnnic-spacing-stack-sm;
          margin-bottom: 2rem;
        }

        // &__inputs {
        //   display: flex;
        //   flex-direction: row;
        //   gap: $unnnic-spacing-inline-xs;

        //   ::v-deep .unnnic-text-area {
        //     textarea {
        //       border-color: #e2e6ed;

        //       &:focus {
        //         border-color: #9caccc;
        //       }
        //     }
        //   }
        // }

        // &__prompts-wrapper {
        //   display: flex;
        //   flex-wrap: wrap;
        //   gap: $unnnic-spacing-inline-sm;
        // }

        // &__prompt {
        //   max-width: 100%;
        //   ::v-deep .unnnic-tag__label {
        //     white-space: nowrap;
        //     overflow: hidden;
        //     text-overflow: ellipsis;
        //   }
        // }
      }

      // &__buttons {
      //   padding-right: $unnnic-spacing-inline-xs;
      //   margin-top: auto;
      //   display: flex;
      //   justify-content: space-between;
      //   gap: $unnnic-spacing-inline-md;

      //   &__cancel,
      //   &__save {
      //     flex: 1;
      //   }
      // }
    }

    // &__general {
    //   display: flex;
    //   flex-direction: column;
    //   gap: $unnnic-spacing-stack-sm;

    //   &__field {
    //     display: flex;
    //     gap: $unnnic-spacing-inline-sm;
    //     justify-content: space-between;
    //   }
    // }

    // ::v-deep .unnnic-form__label {
    //   margin: 0 0 0.25rem;
    // }

    // ::v-deep .unnnic-label__label {
    //   margin: 5px 0px -10px;
    // }
  }

  .connect-modal {
    ::v-deep .unnnic-modal-container-background {
      width: 750px;
      max-width: 90%;
    }
  }
</style>
