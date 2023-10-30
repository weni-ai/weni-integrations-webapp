<template>
  <div class="whatsapp-catalog-card">
    <div class="whatsapp-catalog-card__wrapper">
      <div class="whatsapp-catalog-card__wrapper__header">
        <div class="whatsapp-catalog-card__wrapper__header__title">
          <span class="u font secondary body-lg color-neutral-darkest bold">
            {{ catalog.name }}
          </span>
        </div>
        <div class="whatsapp-catalog-card__wrapper__header__description">
          <span class="u font secondary body-md color-neutral-cloudy">
            {{ $t('WhatsApp.catalog.list.identification') }}
          </span>
          <span class="u font secondary body-md color-brand-weni bold">
            {{ catalog.facebook_catalog_id }}
          </span>
        </div>
      </div>

      <div class="whatsapp-catalog-card__wrapper__actions">
        <unnnic-switch
          :value="catalog.is_connected"
          size="small"
          :textRight="
            catalog.is_connected
              ? $t('WhatsApp.catalog.list.actions.enabled_catalog')
              : $t('WhatsApp.catalog.list.actions.disabled_catalog')
          "
          @click.native="toggleCatalogConnect(!catalog.is_connected)"
        />
        <unnnic-switch
          v-if="catalog.is_connected"
          :value="enabledCart"
          size="small"
          :textRight="
            enabledCart
              ? $t('WhatsApp.catalog.list.actions.enabled_cart')
              : $t('WhatsApp.catalog.list.actions.disabled_cart')
          "
          @click.native="toggleCart()"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'Card',
    props: {
      catalog: {
        type: Object,
        required: true,
        default: () => {},
      },
      enabledCart: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        currentDisable: null,
        catalogStatus: this.catalog.is_connected,
        cartStatus: this.enabledCart,
        listCatalog: [
          {
            uuid: '3081a268-fff5-4366-bf44-ee387c8ddcdc',
            name: 'Teste_localizacao',
            facebook_catalog_id: '312538484461506',
            category: 'commerce',
            is_connected: false,
          },
          {
            uuid: 'eaf96431-9be8-4cbd-8541-f4ae08af0d1e',
            name: 'catalogo marketing token',
            facebook_catalog_id: '339959911815729',
            category: 'commerce',
            is_connected: true,
          },
          {
            uuid: 'e7974bfa-14d8-470a-8b1b-669718bc1036',
            name: 'catalogo criado em dev',
            facebook_catalog_id: '664025605666699',
            category: 'commerce',
            is_connected: false,
          },
        ],
      };
    },
    computed: {
      ...mapState('WhatsAppCloud', ['errorDisableCatalog']),
    },
    methods: {
      ...mapActions('WhatsAppCloud', ['disableWhatsAppCloudCatalogs']),
      toggleCatalogConnect(event) {
        if (event) {
          this.$emit('enable');
        } else {
          this.$emit('disable');
        }
      },
      toggleCart() {
        this.$emit('toggleCart');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-catalog-card {
    &__wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
      border-radius: $unnnic-border-radius-md;
      padding: $unnnic-spacing-md;

      &__actions {
        display: flex;
        gap: $unnnic-spacing-xs;
      }
    }
  }
</style>
