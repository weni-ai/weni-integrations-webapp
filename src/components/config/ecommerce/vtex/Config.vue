<template>
  <div class="config-vtex">
    <div class="config-vtex__header">
      <div class="config-vtex__header__title">
        <div class="config-vtex__header__title__icon-container">
          <img class="config-vtex__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="config-vtex__header__title__name">{{ app.name }}</div>

        <unnnic-button
          ref="closeButton"
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
          <unnnic-button v-if="hasConnectedCatalog" ref="viewButton" @click="redirectToWppCatalog">
            {{ $t('vtex.config.view_catalog') }}
          </unnnic-button>
          <unnnic-button v-else ref="connectButton" @click="showConnectModal = true">
            {{ $t('vtex.config.connect_catalog') }}
          </unnnic-button>
        </div>

        <div class="config-vtex__settings__content__details">
          <span class="config-vtex__settings__content__details__label">
            {{ $t('vtex.config.details') }}
          </span>

          <table class="config-vtex__settings__content__details__table">
            <tr>
              <td>{{ $t('vtex.config.wpp_number') }}</td>
              <td v-if="wpp_number">{{ wpp_number }}</td>
              <td v-else>
                <unnnic-skeleton-loading tag="div" width="100%" height="22px" />
              </td>
            </tr>
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
      :closeIcon="false"
      @click.stop
    >
      <ConnectCatalogModalContent
        ref="connectCatalogModalContent"
        @closeModal="showConnectModal = false"
        @connectCatalog="connectCatalog"
      />
    </unnnic-modal>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import alert from '@/utils/call';
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
      /* istanbul ignore next */
      return {
        name: this.app.config?.name ?? null,
        hasConnectedCatalog: this.app.config?.connected_catalog ?? false,
        showConnectModal: false,
        wpp_number: null,
        wpp_uuid: null,
      };
    },
    computed: {
      ...mapState(app_type, ['currentApp', 'errorCurrentApp']),
      ...mapState(ecommerce_store, ['loadingConnectVtexCatalog', 'errorConnectVtexCatalog']),
    },
    async mounted() {
      await this.fetchRelatedWppData();
    },
    methods: {
      ...mapActions(app_type, ['updateApp', 'getApp']),
      ...mapActions(ecommerce_store, ['connectVtexCatalog']),
      async connectCatalog(eventData) {
        const data = {
          code: 'wpp-cloud',
          appUuid: this.app.config.wpp_cloud_uuid,
          payload: {
            name: eventData.name,
          },
        };

        await this.connectVtexCatalog(data);

        if (this.errorConnectVtexCatalog) {
          this.callModal({ type: 'error', text: this.$t('vtex.errors.connect_catalog') });
          return;
        }

        await this.updateConnectedCatalogStatus();
      },
      async updateConnectedCatalogStatus() {
        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
        };

        await this.getApp(data);

        if (this.errorCurrentApp) {
          this.callModal({
            type: 'error',
            text: this.$t('vtex.errors.update_connected_catalog_status'),
          });
          return;
        }

        this.hasConnectedCatalog = this.currentApp.config?.connected_catalog ?? false;
      },
      async fetchRelatedWppData() {
        const data = {
          code: 'wpp-cloud',
          appUuid: this.app.config.wpp_cloud_uuid,
        };

        await this.getApp(data);

        if (this.errorCurrentApp) {
          this.callModal({ type: 'error', text: this.$t('vtex.errors.fetch_related_wpp_data') });
          return;
        }

        this.wpp_uuid = this.currentApp.uuid;
        this.wpp_number = this.currentApp.config.title;
      },
      redirectToWppCatalog() {
        if (this.wpp_uuid) {
          this.$router.push({ path: `/apps/my/wpp-cloud/${this.wpp_uuid}/catalogs` });
        } else {
          this.callModal({ type: 'error', text: this.$t('vtex.errors.redirect_to_wpp_catalog') });
        }
      },
      closeConfig() {
        this.$emit('closeModal');
      },
      callModal({ text, type }) {
        alert.callAlert({
          props: {
            text: text,
            title: type,
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
      margin: $unnnic-spacing-lg;
      margin-bottom: $unnnic-spacing-md;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;
          align-items: center;

          background-color: rgba(247, 25, 99, 0.08);

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
        margin: 0 $unnnic-spacing-lg $unnnic-spacing-lg $unnnic-spacing-lg;

        &__catalog,
        &__details {
          display: flex;
          flex-direction: column;
          margin-bottom: $unnnic-spacing-sm;

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

            &__loading {
              display: flex;
              width: 100%;
            }
          }
        }

        &__scroll {
          padding-right: $unnnic-spacing-inline-xs;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: auto;
          overflow-x: hidden;
          gap: $unnnic-spacing-stack-sm;
          margin-bottom: $unnnic-spacing-lg;
        }
      }
    }
  }

  .connect-modal {
    ::v-deep .unnnic-modal-container-background {
      width: 750px;
      max-width: 90%;
    }
  }
</style>
