<template>
  <div class="whatsapp-catalog-list">
    <div class="whatsapp-catalog-list__header">
      <div class="whatsapp-catalog-list__header__title">
        <unnnic-card
          class="whatsapp-catalog-list__header__title__text"
          type="title"
          :title="$t('WhatsApp.catalog.list.title')"
          :hasInformationIcon="false"
          icon="house-1-1"
          scheme="brand-weni-soft"
        />
        <span class="u font secondary body-gt color-neutral-darkest">
          {{ $t('WhatsApp.catalog.list.description') }}
        </span>
      </div>
      <!--       <div class="whatsapp-catalog-list__header__button">
        <unnnic-button-next type="terciary" size="large">
          {{ $t('WhatsApp.catalog.list.advanced_settings') }}
        </unnnic-button-next>
      </div> -->
    </div>
    <div
      class="whatsapp-catalog-list__cards"
      v-if="whatsAppCloudCatalogs || (!loadingWhatsAppCloudCatalogs && !errorWhatsAppCloudCatalogs)"
    >
      <Card
        v-for="(catalog, index) in whatsAppCloudCatalogs"
        :key="index"
        :catalog="catalog"
        :enabledCart="commerceSettings.is_cart_enabled"
        @enable="handleEnableCatalog(catalog)"
        @disable="handleDisableCatalog()"
        @toggleCart="toggleCart"
      />
    </div>
    <unnnic-modal-next
      v-if="openModal"
      type="alert"
      icon="alert-circle-1"
      scheme="feedback-red"
      :validate="connectedCatalog.name"
      :validatePlaceholder="
        $t('WhatsApp.catalog.list.disable_modal.label', { name: connectedCatalog.name })
      "
      :validateLabel="
        $t('WhatsApp.catalog.list.disable_modal.label', { name: connectedCatalog.name })
      "
      :title="$t('WhatsApp.catalog.list.disable_modal.title')"
      :actionPrimaryLabel="$t('WhatsApp.catalog.list.disable_modal.confirm')"
      :actionSecondaryLabel="$t('general.Cancel')"
      @click-action-secondary="closeModal"
      @click-action-primary="handleCatalogConfirmation"
    >
      <template slot="description">
        {{ $t('WhatsApp.catalog.list.disable_modal.description') }}
      </template>
    </unnnic-modal-next>
  </div>
</template>

<script>
  import Card from '@/components/whatsAppCatalogs/Card';
  import { mapActions, mapState } from 'vuex';
  import debounce from 'lodash.debounce';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'List',
    components: {
      Card,
    },
    data() {
      return {
        openModal: false,
        connectedCatalog: null,
        catalogToEnable: null,
      };
    },
    computed: {
      ...mapState('WhatsAppCloud', [
        'loadingWhatsAppCloudCatalogs',
        'errorWhatsAppCloudCatalogs',
        'whatsAppCloudCatalogs',
        'errorDisableCatalog',
        'errorEnableCatalog',
        'commerceSettings',
        'errorToggleCartVisibility',
      ]),
    },
    created() {
      this.fetchData();
    },
    methods: {
      ...mapActions('WhatsAppCloud', [
        'getWhatsAppCloudCatalogs',
        'disableWhatsAppCloudCatalogs',
        'enableWhatsAppCloudCatalogs',
        'getCommerceSettings',
        'toggleCartVisibility',
      ]),
      fetchData: debounce(async function () {
        const { appUuid } = this.$route.params;

        await this.getCommerceSettings({ appUuid });
        await this.getWhatsAppCloudCatalogs({ appUuid });

        if (this.errorWhatsAppCloudCatalog) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.catalog.error.fetch_catalogs'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
          });
        }

        this.connectedCatalog = this.whatsAppCloudCatalogs.find(
          (catalog) => catalog.is_connected === true,
        );
      }, 750),
      async disableCatalog() {
        const { appUuid } = this.$route.params;
        const data = {
          catalogUuid: this.connectedCatalog.uuid,
          appUuid,
        };

        await this.disableWhatsAppCloudCatalogs(data);

        if (this.errorDisableCatalog) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.catalog.error.disable_catalog'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
          });
        } else {
          this.openModal = false;
        }
        this.fetchData();
      },
      async handleEnableCatalog(catalog) {
        if (this.connectedCatalog) {
          this.catalogToEnable = catalog;
          this.openModal = true;
          return;
        }
        this.enableCatalog(catalog);
      },
      handleDisableCatalog() {
        this.openModal = true;
      },
      async enableCatalog(catalog) {
        const { appUuid } = this.$route.params;
        const data = {
          catalogUuid: catalog.uuid,
          appUuid,
        };

        await this.enableWhatsAppCloudCatalogs(data);

        if (this.errorEnableCatalog) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.catalog.error.enable_catalog'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
          });
        }

        this.fetchData();
      },
      async handleCatalogConfirmation() {
        await this.disableCatalog();
        if (!this.errorDisableCatalog && this.catalogToEnable) {
          await this.enableCatalog(this.catalogToEnable);
          this.catalogToEnable = null;
        }
      },
      closeModal() {
        this.catalogToEnable = null;
        this.openModal = false;
      },
      async toggleCart() {
        const { appUuid } = this.$route.params;
        const data = {
          appUuid,
          payload: {
            enable: !this.commerceSettings.is_cart_enabled,
          },
        };
        await this.toggleCartVisibility(data);

        if (this.errorToggleCartVisibility) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.catalog.error.toggle_cart_visibility'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
          });
        }

        this.fetchData();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-catalog-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    margin-top: $unnnic-spacing-lg;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $unnnic-spacing-md;

      &__title {
        display: flex;
        flex-direction: column;

        &__text {
          margin-bottom: $unnnic-spacing-xs;
        }
      }
    }

    &__cards {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: $unnnic-spacing-md;
    }
  }
</style>
