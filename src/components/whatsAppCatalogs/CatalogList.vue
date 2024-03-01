<template>
  <div class="whatsapp-catalog-list">
    <div class="whatsapp-catalog-list__header">
      <div class="whatsapp-catalog-list__header__text">
        <div class="whatsapp-catalog-list__header__icon">
          <img src="@/assets/svgs/storefront.svg" alt="" />
        </div>
        <div class="whatsapp-catalog-list__header__title">
          <span class="u font primary title-sm color-neutral-darkest">
            {{ $t('WhatsApp.catalog.list.title') }}
          </span>
          <span class="u font secondary body-gt color-neutral-darkest">
            {{ $t('WhatsApp.catalog.list.description') }}
          </span>
        </div>
      </div>
    </div>

    <div class="whatsapp-catalog-list__search">
      <unnnic-input
        v-model="searchTerm"
        :placeholder="$t('WhatsApp.catalog.list.search_placeholder')"
        iconLeft="search-1"
      />
    </div>

    <div
      class="whatsapp-catalog-list__cards"
      v-if="whatsAppCloudCatalogs || (!loadingWhatsAppCloudCatalogs && !errorWhatsAppCloudCatalogs)"
    >
      <CatalogCard
        v-for="(catalog, index) in listItems"
        :ref="`catalogCard-${index}`"
        :key="index"
        :catalog="catalog"
        :enabledCart="commerceSettings.is_cart_enabled"
        @enable="handleEnableCatalog(catalog)"
        @disable="handleDisableCatalog()"
        @toggleCart="toggleCart"
        @redirectClick="redirectToCatalogProducts(catalog.uuid, catalog.name)"
      />
    </div>
    <div class="whatsapp-catalog-list__pagination">
      <span>{{ currentPageStart }} - {{ currentPageCount }} de {{ totalCount }}</span>
      <unnnic-pagination v-model="page" :max="pageCount" :show="5" />
    </div>
    <unnnic-modal-next
      v-if="openModal"
      type="alert"
      icon="alert-circle-1"
      scheme="feedback-red"
      :validate="connectedCatalog.name"
      :validatePlaceholder="connectedCatalog.name"
      :title="
        catalogToEnable
          ? $t('WhatsApp.catalog.list.disable_modal.title_active')
          : $t('WhatsApp.catalog.list.disable_modal.title')
      "
      :actionPrimaryLabel="$t('WhatsApp.catalog.list.disable_modal.confirm')"
      :actionSecondaryLabel="$t('general.Cancel')"
      @click-action-secondary="closeModal"
      @click-action-primary="handleCatalogConfirmation"
    >
      <template slot="description">
        <div v-if="catalogToEnable">
          {{
            $t('WhatsApp.catalog.list.disable_modal.description_active', {
              name: connectedCatalog.name,
            })
          }}
        </div>
        <div v-else>
          {{ $t('WhatsApp.catalog.list.disable_modal.description') }}
        </div>
        <div>
          {{ $t('WhatsApp.catalog.list.disable_modal.label', { name: connectedCatalog.name }) }}
        </div>
      </template>
    </unnnic-modal-next>
  </div>
</template>

<script>
  import CatalogCard from '@/components/whatsAppCatalogs/CatalogCard';
  import { mapActions, mapState } from 'vuex';
  import debounce from 'lodash.debounce';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'CatalogList',
    components: {
      CatalogCard,
    },
    data() {
      return {
        openModal: false,
        connectedCatalog: null,
        catalogToEnable: null,
        firstLoad: true,
        page: 1,
        pageSize: 15,
        searchTerm: '',
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
      listItems() {
        return this.whatsAppCloudCatalogs?.results || [];
      },
      totalCount() {
        return this.whatsAppCloudCatalogs?.count || this.pageSize;
      },
      pageCount() {
        if (this.whatsAppCloudCatalogs?.count) {
          return Math.ceil(this.whatsAppCloudCatalogs.count / this.pageSize);
        } else {
          return 1;
        }
      },
      currentPageStart() {
        return (this.page - 1) * this.pageSize || 1;
      },
      currentPageCount() {
        const value = this.pageSize * this.page;
        return value > this.whatsAppCloudCatalogs?.count
          ? this.whatsAppCloudCatalogs?.count || 0
          : value;
      },
    },
    methods: {
      ...mapActions('WhatsAppCloud', [
        'getWhatsAppCloudCatalogs',
        'disableWhatsAppCloudCatalogs',
        'enableWhatsAppCloudCatalogs',
        'getCommerceSettings',
        'toggleCartVisibility',
      ]),
      fetchData: debounce(async function (page) {
        const { appUuid } = this.$route.params;
        const params = {
          page: page,
          page_size: this.pageSize,
        };

        if (this.searchTerm && this.searchTerm.trim()) {
          params.name = this.searchTerm.trim();
        }

        await this.getCommerceSettings({ appUuid });
        await this.getWhatsAppCloudCatalogs({ appUuid, params });

        if (this.errorWhatsAppCloudCatalogs) {
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

        this.connectedCatalog =
          this.whatsAppCloudCatalogs?.results?.find((catalog) => catalog.is_connected === true) ||
          {};
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
        this.fetchData(this.page);
      },
      async handleEnableCatalog(catalog) {
        if (this.connectedCatalog?.uuid) {
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

        this.fetchData(this.page);
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

        this.fetchData(this.page);
      },
      redirectToCatalogProducts(catalogUuid, catalogName) {
        this.$router.push({
          name: 'WhatsApp Catalog Products',
          params: {
            appUuid: this.$route.params.appUuid,
            catalogUuid,
          },
          query: {
            catalogName,
          },
        });
      },
    },
    watch: {
      page: {
        immediate: true,
        handler(page) {
          this.fetchData(page);
        },
      },
      whatsAppCloudCatalogs: {
        handler() {
          this.firstLoad = false;
        },
        deep: true,
      },
      searchTerm: {
        handler() {
          if (this.page === 1) {
            this.fetchData(this.page);
          } else {
            this.page = 1;
          }
        },
        deep: true,
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
    gap: $unnnic-spacing-md;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__icon {
        display: flex;
        background-color: #eefffc;
        border-radius: $unnnic-border-radius-sm;
        justify-content: center;
        margin-right: $unnnic-spacing-inline-sm;

        img {
          height: $unnnic-icon-size-xl;
          width: $unnnic-icon-size-xl;
          padding: $unnnic-inset-nano;
        }
      }
      &__text {
        display: flex;
      }
      &__title {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    &__search {
      width: 33%;
      min-width: 250px;
      max-width: 450px;
    }

    &__cards {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: $unnnic-spacing-md;
      overflow: auto;
      padding-right: $unnnic-spacing-xs;
    }

    &__pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
        color: $unnnic-color-neutral-dark;
      }
    }

    ::v-deep .unnnic-modal .container .content {
      padding-right: 0px;
    }

    ::v-deep .unnnic-modal.type-alert .title {
      padding-bottom: $unnnic-spacing-xs;
    }

    ::v-deep .unnnic-modal.type-alert .container .content.with-validation .description {
      margin-bottom: $unnnic-spacing-sm;
    }
  }
</style>
