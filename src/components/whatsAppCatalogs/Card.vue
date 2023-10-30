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
          <span class="u font secondary body-md color-weni-600 bold">
            {{ catalog.facebook_catalog_id }}
          </span>
        </div>
      </div>

      <div class="whatsapp-catalog-card__wrapper__actions">
        <unnnic-switch
          :value="catalog.is_connected"
          use-v-model
          size="small"
          :textRight="
            catalog.is_connected
              ? $t('WhatsApp.catalog.list.actions.enabled_catalog')
              : $t('WhatsApp.catalog.list.actions.disabled_catalog')
          "
          @input="toggleCatalogConnect($event)"
        />
        <unnnic-switch
          v-if="catalog.is_connected"
          :value="enabledCart"
          use-v-model
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
