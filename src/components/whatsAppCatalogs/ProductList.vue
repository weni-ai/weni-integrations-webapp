<template>
  <div class="whatsapp-product-list">
    <div class="whatsapp-product-list__header">
      <div class="whatsapp-product-list__header__text">
        <div class="whatsapp-product-list__header__icon">
          <img src="@/assets/svgs/storefront.svg" />
        </div>
        <div class="whatsapp-product-list__header__title">
          <span class="u font primary title-sm color-neutral-darkest">
            {{ catalogName }}
          </span>
          <span class="u font secondary body-gt color-neutral-darkest">
            {{ $t('WhatsApp.product.list.description') }}
          </span>
        </div>
      </div>
    </div>

    <unnnic-table :items="listItems" class="whatsapp-product-list__table">
      <template v-slot:header>
        <unnnic-table-row :headers="headers" />
      </template>

      <template v-slot:item="{ item }">
        <unnnic-table-row :headers="headers">
          <template v-slot:title>
            <div class="whatsapp-product-list__table__title">
              <img :src="item.image_link" class="whatsapp-product-list__table__title__image" />
              <span :data-title="item.title">{{ item.title }}</span>
            </div>
          </template>

          <template v-slot:available>
            <div :title="item.available" class="break-text whatsapp-product-list__table__status">
              <span :class="`whatsapp-product-list__table__status__indicator ${item.available}`" />
              <span>{{ item.available ? 'Disponível' : 'Indisponível' }}</span>
            </div>
          </template>

          <template v-slot:price>
            <div :title="item.price" class="break-text whatsapp-product-list__table__price">
              <span>{{ item.price }}</span>
              <span
                v-if="item.base_price !== item.price"
                class="whatsapp-product-list__table__price__discount"
              >
                {{ item.base_price }}
              </span>
            </div>
          </template>

          <template v-slot:facebook_product_id>
            <div :title="item.facebook_product_id" class="break-text">
              {{ item.facebook_product_id }}
            </div>
          </template>
        </unnnic-table-row>
      </template>
    </unnnic-table>
    <div class="whatsapp-product-list__pagination">
      <span>{{ currentPageStart }} - {{ currentPageCount }} de {{ totalCount }}</span>
      <unnnic-pagination
        :modelValue="page"
        @update:modelValue="onPageChange"
        :max="pageCount"
        :show="5"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';

  export default {
    name: 'ProductList',
    props: {
      catalogName: {
        type: String,
        required: true,
        default: '',
      },
    },
    data() {
      return {
        firstLoad: true,
        page: 1,
        pageSize: 15,
        headers: [
          {
            id: 'title',
            text: this.$t('WhatsApp.product.table.headers.name'),
            flex: 2,
          },
          {
            id: 'available',
            text: this.$t('WhatsApp.product.table.headers.availability'),
            flex: 1,
          },
          {
            id: 'price',
            text: this.$t('WhatsApp.product.table.headers.price'),
            flex: 1,
          },
          {
            id: 'facebook_product_id',
            text: this.$t('WhatsApp.product.table.headers.facebook_id'),
            flex: 1,
          },
        ],
      };
    },
    async mounted() {
      await this.fetchProducts(this.page);
    },
    computed: {
      ...mapState(whatsapp_cloud, [
        'catalogProducts',
        'loadingCatalogProducts',
        'errorCatalogProducts',
      ]),
      listItems() {
        return this.catalogProducts?.results || [];
      },
      totalCount() {
        return this.catalogProducts?.count || this.pageSize;
      },
      pageCount() {
        if (this.catalogProducts?.count) {
          return Math.ceil(this.catalogProducts.count / this.pageSize);
        } else {
          return 1;
        }
      },
      currentPageStart() {
        return (this.page - 1) * this.pageSize || 1;
      },
      currentPageCount() {
        const value = this.pageSize * this.page;
        return value > this.catalogProducts?.count ? this.catalogProducts?.count || 0 : value;
      },
    },
    methods: {
      ...mapActions(whatsapp_cloud, ['getCatalogProducts']),
      async fetchProducts(page) {
        const { appUuid, catalogUuid } = this.$route.params;
        const params = {
          page: page,
          page_size: this.pageSize,
        };

        await this.getCatalogProducts({ appUuid, catalogUuid, params });
      },
      onPageChange(value) {
        this.page = value;
        this.currentPage = value;
      },
    },
    watch: {
      page: {
        immediate: true,
        handler(page) {
          this.fetchProducts(page);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-product-list {
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
        gap: $unnnic-spacing-nano;
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

    &__table {
      display: flex;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;

      ::v-deep .scroll {
        overflow-x: hidden;
        overflow-y: auto;

        padding-right: unset;
      }

      &__title {
        display: flex;
        align-items: center;

        // add ellipsis if it breaks text
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &__image {
          height: $unnnic-avatar-size-sm;
          width: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;
          margin-right: $unnnic-spacing-inline-sm;
          object-fit: cover;
          aspect-ratio: 1 / 1;
        }
      }

      &__status {
        display: flex;
        align-items: center;
        gap: $unnnic-spacing-nano;

        &__indicator {
          display: inline-block;
          height: $unnnic-spacing-xs;
          width: $unnnic-spacing-xs;
          margin: 0 6px;
          border-radius: $unnnic-border-radius-pill;
          &.false {
            background-color: $unnnic-color-aux-red-500;
          }

          &.true {
            background-color: $unnnic-color-aux-green-500;
          }
        }
      }

      &__price {
        display: flex;
        gap: $unnnic-spacing-nano;
        &__discount {
          text-decoration: line-through;
          color: $unnnic-color-neutral-cleanest;
        }
      }
    }

    &__pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $unnnic-spacing-stack-md;

      span {
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
        color: $unnnic-color-neutral-dark;
      }
    }
  }
</style>
