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
          <template v-slot:name>
            <div class="whatsapp-product-list__table__name">
              <img :src="item.image" class="whatsapp-product-list__table__name__image" />
              <span>{{ item.name }}</span>
            </div>
          </template>

          <template v-slot:availability>
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

          <template v-slot:sku>
            <div :title="item.sku" class="break-text">
              {{ item.sku }}
            </div>
          </template>
        </unnnic-table-row>
      </template>
    </unnnic-table>
    <div class="whatsapp-product-list__pagination">
      <span>{{ currentPageStart }} - {{ currentPageCount }} de {{ totalCount }}</span>
      <unnnic-pagination v-model="page" :max="pageCount" :show="5" />
    </div>
  </div>
</template>

<script>
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
            id: 'name',
            text: this.$t('WhatsApp.product.table.headers.name'),
            flex: 2,
          },
          {
            id: 'availability',
            text: this.$t('WhatsApp.product.table.headers.availability'),
            flex: 1,
          },
          {
            id: 'price',
            text: this.$t('WhatsApp.product.table.headers.price'),
            flex: 1,
          },
          {
            id: 'sku',
            text: this.$t('WhatsApp.product.table.headers.sku'),
            flex: 1,
          },
        ],
        mockedProductList: [
          {
            name: 'Mamão Papaya',
            available: false,
            price: 'R$ 3,99',
            base_price: 'R$ 4,99',
            sku: '123456789',
            image:
              'https://www.verdurixhortifruti.com.br/cdn/shop/products/mamaopapaia.jpg?v=1590606817',
          },
          {
            name: 'Pão de Forma Panco 500g',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 3,99',
            sku: '987654321',
            image:
              'https://superprix.vteximg.com.br/arquivos/ids/177070-292-292/Pao-Panco-Leite-500g.png?v=636559216471630000',
          },
          {
            name: 'Banana',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 2,99',
            sku: '456789123',
            image: 'https://frutasbrasilsul.com.br/wp-content/uploads/banana-terra.png',
          },
          {
            name: 'Mamão Papaya',
            available: false,
            price: 'R$ 3,99',
            base_price: 'R$ 4,99',
            sku: '123456789',
            image:
              'https://www.verdurixhortifruti.com.br/cdn/shop/products/mamaopapaia.jpg?v=1590606817',
          },
          {
            name: 'Pão de Forma Panco 500g',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 3,99',
            sku: '987654321',
            image:
              'https://superprix.vteximg.com.br/arquivos/ids/177070-292-292/Pao-Panco-Leite-500g.png?v=636559216471630000',
          },
          {
            name: 'Banana',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 2,99',
            sku: '456789123',
            image: 'https://frutasbrasilsul.com.br/wp-content/uploads/banana-terra.png',
          },
          {
            name: 'Mamão Papaya',
            available: false,
            price: 'R$ 3,99',
            base_price: 'R$ 4,99',
            sku: '123456789',
            image:
              'https://www.verdurixhortifruti.com.br/cdn/shop/products/mamaopapaia.jpg?v=1590606817',
          },
          {
            name: 'Pão de Forma Panco 500g',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 3,99',
            sku: '987654321',
            image:
              'https://superprix.vteximg.com.br/arquivos/ids/177070-292-292/Pao-Panco-Leite-500g.png?v=636559216471630000',
          },
          {
            name: 'Banana',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 2,99',
            sku: '456789123',
            image: 'https://frutasbrasilsul.com.br/wp-content/uploads/banana-terra.png',
          },
          {
            name: 'Mamão Papaya',
            available: false,
            price: 'R$ 3,99',
            base_price: 'R$ 4,99',
            sku: '123456789',
            image:
              'https://www.verdurixhortifruti.com.br/cdn/shop/products/mamaopapaia.jpg?v=1590606817',
          },
          {
            name: 'Pão de Forma Panco 500g',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 3,99',
            sku: '987654321',
            image:
              'https://superprix.vteximg.com.br/arquivos/ids/177070-292-292/Pao-Panco-Leite-500g.png?v=636559216471630000',
          },
          {
            name: 'Banana',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 2,99',
            sku: '456789123',
            image: 'https://frutasbrasilsul.com.br/wp-content/uploads/banana-terra.png',
          },
          {
            name: 'Mamão Papaya',
            available: false,
            price: 'R$ 3,99',
            base_price: 'R$ 4,99',
            sku: '123456789',
            image:
              'https://www.verdurixhortifruti.com.br/cdn/shop/products/mamaopapaia.jpg?v=1590606817',
          },
          {
            name: 'Pão de Forma Panco 500g',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 3,99',
            sku: '987654321',
            image:
              'https://superprix.vteximg.com.br/arquivos/ids/177070-292-292/Pao-Panco-Leite-500g.png?v=636559216471630000',
          },
          {
            name: 'Banana',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 2,99',
            sku: '456789123',
            image: 'https://frutasbrasilsul.com.br/wp-content/uploads/banana-terra.png',
          },
          {
            name: 'Mamão Papaya',
            available: false,
            price: 'R$ 3,99',
            base_price: 'R$ 4,99',
            sku: '123456789',
            image:
              'https://www.verdurixhortifruti.com.br/cdn/shop/products/mamaopapaia.jpg?v=1590606817',
          },
          {
            name: 'Pão de Forma Panco 500g',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 3,99',
            sku: '987654321',
            image:
              'https://superprix.vteximg.com.br/arquivos/ids/177070-292-292/Pao-Panco-Leite-500g.png?v=636559216471630000',
          },
          {
            name: 'Banana',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 2,99',
            sku: '456789123',
            image: 'https://frutasbrasilsul.com.br/wp-content/uploads/banana-terra.png',
          },
          {
            name: 'Mamão Papaya',
            available: false,
            price: 'R$ 3,99',
            base_price: 'R$ 4,99',
            sku: '123456789',
            image:
              'https://www.verdurixhortifruti.com.br/cdn/shop/products/mamaopapaia.jpg?v=1590606817',
          },
          {
            name: 'Pão de Forma Panco 500g',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 3,99',
            sku: '987654321',
            image:
              'https://superprix.vteximg.com.br/arquivos/ids/177070-292-292/Pao-Panco-Leite-500g.png?v=636559216471630000',
          },
          {
            name: 'Banana',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 2,99',
            sku: '456789123',
            image: 'https://frutasbrasilsul.com.br/wp-content/uploads/banana-terra.png',
          },
          {
            name: 'Mamão Papaya',
            available: false,
            price: 'R$ 3,99',
            base_price: 'R$ 4,99',
            sku: '123456789',
            image:
              'https://www.verdurixhortifruti.com.br/cdn/shop/products/mamaopapaia.jpg?v=1590606817',
          },
          {
            name: 'Pão de Forma Panco 500g',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 3,99',
            sku: '987654321',
            image:
              'https://superprix.vteximg.com.br/arquivos/ids/177070-292-292/Pao-Panco-Leite-500g.png?v=636559216471630000',
          },
          {
            name: 'Banana',
            available: true,
            price: 'R$ 2,99',
            base_price: 'R$ 2,99',
            sku: '456789123',
            image: 'https://frutasbrasilsul.com.br/wp-content/uploads/banana-terra.png',
          },
        ],
      };
    },
    // TODO: change to get pages from product list after backend integration
    computed: {
      listItems() {
        return this.mockedProductList || [];
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

      &__name {
        display: flex;
        align-items: center;

        &__image {
          height: $unnnic-avatar-size-sm;
          width: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;
          margin-right: $unnnic-spacing-inline-sm;
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
