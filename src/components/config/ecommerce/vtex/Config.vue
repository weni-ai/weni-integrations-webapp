<template>
  <div class="config-vtex">
    <div class="config-vtex__header">
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
        <div class="config-vtex__settings__content__vtexADS">
          <unnnic-switch :modelValue="vtexADS" @update:modelValue="updateVtexADS" />
          <p>Vtex ADS</p>
          <unnnicToolTip side="top" :text="$t('vtex.config.vtexADS')" enabled>
            <img class="logo" src="../../../../assets/svgs/info.svg" alt="" />
          </unnnicToolTip>
        </div>
        <div class="config-vtex__settings__content__sellers" v-if="hasConnectedCatalog">
          <span class="config-vtex__settings__content__sellers__label">
            {{ $t('vtex.config.sellers') }}
          </span>

          <unnnic-multi-select
            class="config-vtex__settings__content__sellers__options"
            :options="sellerOptions"
            :modelValue="selectedSellers"
            @update:modelValue="handleSelectSellers"
            :placeholder="$t('vtex.config.placeholder.sellers')"
            :disabled="disableSellers"
          />
          <div class="config-vtex__settings__content__sellers__alert" v-if="disableSellers">
            <unnnic-icon
              class="config-vtex__settings__content__sellers__alert__icon"
              icon="alert-circle-1-1"
              scheme="feedback-yellow"
            />
            <span class="config-vtex__settings__content__sellers__alert__text">
              {{ $t('vtex.config.processing') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <section class="config-vtex__buttons">
      <unnnic-button
        class="config-vtex__buttons__cancel"
        type="tertiary"
        size="large"
        :text="$t('vtex.config.buttons.close')"
        @click="closeConfig"
      />

      <unnnic-button
        class="config-vtex__buttons__save"
        type="secondary"
        size="large"
        :disabled="disableSave"
        :text="$t('vtex.config.buttons.confirm')"
        @click="handleSave"
      />
    </section>

    <unnnic-dialog
      class="connect-modal"
      :open="showConnectModal"
      @update:open="handleConnectModalOpenUpdate"
    >
      <unnnic-dialog-content size="large" @interact-outside.prevent>
        <unnnic-dialog-header :close-button="false">
          <unnnic-dialog-title>
            {{ $t('vtex.connect_catalog.title') }}
          </unnnic-dialog-title>
        </unnnic-dialog-header>

        <ConnectCatalogModalContent
          ref="connectCatalogModalContent"
          @closeModal="showConnectModal = false"
          @connectCatalog="connectCatalog"
        />

        <unnnic-dialog-footer>
          <unnnic-button
            type="tertiary"
            :text="$t('general.Cancel')"
            @click="showConnectModal = false"
          />
          <unnnic-button :text="$t('general.continue')" @click="submitConnectCatalog" />
        </unnnic-dialog-footer>
      </unnnic-dialog-content>
    </unnnic-dialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import unnnic from '@weni/unnnic-system';
  import ConnectCatalogModalContent from './ConnectCatalogModalContent.vue';
  import { auth_store } from '@/stores/modules/auth.store';
  import { my_apps } from '@/stores/modules/myApps.store';
  import i18n from '@/utils/plugins/i18n';

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
        disableSellers: false,
        selectedSellers: [],
        vtexADS: false,
        disableVtexADS: true,
      };
    },
    computed: {
      ...mapState(my_apps, ['configuredApps']),
      ...mapState(app_type, ['currentApp', 'errorCurrentApp', 'appUuid']),
      ...mapState(auth_store, ['project']),
      ...mapState(ecommerce_store, [
        'loadingConnectVtexCatalog',
        'errorConnectVtexCatalog',
        'sellersList',
        'errorSellersList',
        'errorSyncSellers',
        'checkSellers',
        'vtexADS',
      ]),
      sellerOptions() {
        return [
          {
            value: '#all',
            label: this.$t('vtex.config.all'),
          },
        ].concat(
          this.sellersList.map((item) => ({
            value: item,
            label: item,
          })) || [],
        );
      },
      disableSave() {
        return this.hasConnectedCatalog && this.selectedSellers.length === 0 && this.disableVtexADS;
      },
      appConfig() {
        return this.configuredApps?.find((item) => item.uuid === this.appUuid)?.config;
      },
    },
    async mounted() {
      await this.fetchRelatedWppData();
      await this.checkSyncSellers({ uuid: this.appUuid });
      this.vtexADS = this.appConfig ? this.appConfig.vtex_ads : false;
      if (this.checkSellers) {
        this.disableSellers = true;
        return;
      }
      await this.fetchSellersOptions();
    },
    async unmounted() {
      const params = {
        project_uuid: this.project,
      };
      await this.getConfiguredApps({ params });
    },
    methods: {
      ...mapActions(my_apps, ['getConfiguredApps']),
      ...mapActions(auth_store, ['project']),
      ...mapActions(app_type, ['updateApp', 'getApp']),
      ...mapActions(ecommerce_store, [
        'connectVtexCatalog',
        'getSellersList',
        'getVtexAppUuid',
        'syncSellers',
        'syncADS',
        'getADS',
        'checkSyncSellers',
      ]),
      handleConnectModalOpenUpdate(open) {
        if (!open) {
          this.showConnectModal = false;
        }
      },
      submitConnectCatalog() {
        this.$refs.connectCatalogModalContent?.connectCatalog();
      },
      async connectCatalog(eventData) {
        const data = {
          code: 'wpp-cloud',
          appUuid: this.appUuid,
          payload: {
            catalog_id: eventData.name,
          },
        };

        await this.connectVtexCatalog(data);

        if (this.errorConnectVtexCatalog) {
          this.callModal({ type: 'error', text: i18n.global.t('vtex.errors.connect_catalog') });
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
            text: i18n.global.t('vtex.errors.update_connected_catalog_status'),
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
          this.callModal({
            type: 'error',
            text: i18n.global.t('vtex.errors.fetch_related_wpp_data'),
          });
          return;
        }

        this.wpp_uuid = this.currentApp.uuid;
        this.wpp_number = this.currentApp.config.title;
      },
      async fetchSellersOptions() {
        await this.getSellersList({ uuid: this.appUuid });

        if (this.errorSellersList) {
          this.callModal({
            type: 'error',
            text: i18n.global.t('vtex.errors.redirect_to_wpp_catalog'),
          });
        }
      },
      redirectToWppCatalog() {
        if (this.wpp_uuid) {
          this.$router.push({ path: `/apps/my/wpp-cloud/${this.wpp_uuid}/catalogs` });
        } else {
          this.callModal({
            type: 'error',
            text: i18n.global.t('vtex.errors.redirect_to_wpp_catalog'),
          });
        }
      },
      closeConfig() {
        this.$emit('closeModal');
      },
      callModal({ text, type }) {
        unnnic.unnnicCallAlert({
          props: {
            text,
            type,
          },
          seconds: 6,
        });
      },
      handleSelectSellers(value) {
        const isAllSelectedBefore = this.selectedSellers.includes('#all');
        const isAllSelectedNow = value.includes('#all');
        const anySellerSelectedNow = value.filter((item) => item !== '#all');

        if (isAllSelectedNow && value.length === 1) {
          this.selectedSellers = value;
        } else if (!isAllSelectedBefore && isAllSelectedNow) {
          this.selectedSellers = ['#all'];
        } else if (isAllSelectedBefore && anySellerSelectedNow.length) {
          this.selectedSellers = anySellerSelectedNow;
        } else {
          this.selectedSellers = value;
        }
      },
      async handleSave() {
        if (this.appConfig?.vtex_ads !== undefined) {
          await this.syncADS({
            uuid: this.appUuid,
            payload: { project_uuid: this.project, vtex_ads: this.vtexADS },
          });
        }

        const isAllSellersSelected = this.selectedSellers.includes('#all');
        const sellers = this.selectedSellers;

        if (sellers.length) {
          const payloadSync = {
            project_uuid: this.project,
          };

          if (isAllSellersSelected) {
            payloadSync.sync_all_sellers = true;
          } else {
            payloadSync.sellers = sellers;
          }

          await this.syncSellers({ uuid: this.appUuid, payload: payloadSync });
          this.disableSellers = true;
        }

        if (this.errorSyncSellers) {
          this.callModal({
            text: i18n.global.t('vtex.errors.redirect_to_wpp_catalog'),
            type: 'error',
          });
          return;
        }
        this.callModal({ text: i18n.global.t('vtex.success.sync_sellers'), type: 'success' });
      },
      updateVtexADS(value) {
        this.vtexADS = value;
        if (this.disableVtexADS) {
          this.disableVtexADS = false;
        }
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

      &__description {
        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-fg-base;

        :deep(a) {
          font-weight: $unnnic-font-weight-bold;
          color: $unnnic-color-fg-base;
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
        color: $unnnic-color-fg-base;
        font-size: $unnnic-font-size-body-gt;
        line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
        margin: 0 $unnnic-spacing-lg $unnnic-spacing-lg $unnnic-spacing-lg;

        &__catalog,
        &__details,
        &__sellers {
          display: flex;
          flex-direction: column;
          margin-bottom: $unnnic-spacing-sm;

          &__label {
            color: $unnnic-color-fg-emphasized;
            font-size: $unnnic-font-size-body-lg;
            font-weight: $unnnic-font-weight-bold;
            line-height: $unnnic-line-height-md + $unnnic-font-size-body-lg;
            margin-bottom: $unnnic-spacing-sm;
          }
        }

        &__vtexADS {
          display: flex;
          font-family: $unnnic-font-family-secondary;
          flex-direction: row;
          align-items: center;
          gap: $unnnic-spacing-inline-xs;

          :deep(.unnnic-tooltip) {
            display: flex;
          }
        }

        &__sellers {
          gap: $unnnic-spacing-xs;
          &__alert {
            display: flex;
            background-color: $unnnic-color-bg-base-soft;
            border: 1px solid $unnnic-color-border-base;
            border-radius: 4px;
            align-items: center;
            gap: $unnnic-spacing-xs;
            padding: $unnnic-spacing-xs;
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
    &__buttons {
      margin: $unnnic-spacing-stack-sm;
      display: flex;

      &__cancel,
      &__save {
        flex-grow: 1;
      }
    }
  }
</style>
