<template>
  <div class="whatsapp-catalog-card">
    <div class="whatsapp-catalog-card__wrapper" @click="$emit('redirectClick')">
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

      <div class="whatsapp-catalog-card__wrapper__actions" @click.stop>
        <unnnic-switch
          ref="catalogConnectSwitch"
          :modelValue="catalogStatus"
          use-v-model
          size="small"
          :textRight="
            catalog.is_connected
              ? $t('WhatsApp.catalog.list.actions.active_catalog')
              : $t('WhatsApp.catalog.list.actions.inactive_catalog')
          "
          @update:modelValue="toggleCatalogConnect"
        />
        <unnnic-switch
          v-if="catalog.is_connected"
          ref="cartEnableSwitch"
          :modelValue="cartStatus"
          use-v-model
          size="small"
          :textRight="
            enabledCart
              ? $t('WhatsApp.catalog.list.actions.active_cart')
              : $t('WhatsApp.catalog.list.actions.inactive_cart')
          "
          @update:modelValue="toggleCart"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';

  export default {
    name: 'CatalogCard',
    props: {
      catalog: {
        type: Object,
        required: true,
        default: /* istanbul ignore next */ () => {},
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
      ...mapState(whatsapp_cloud, ['errorDisableCatalog']),
    },
    methods: {
      ...mapActions(whatsapp_cloud, ['disableWhatsAppCloudCatalogs']),
      toggleCatalogConnect(event) {
        this.catalogStatus = event;
        if (event) {
          this.$emit('enable');
        } else {
          this.$emit('disable');
        }
      },
      toggleCart(event) {
        this.cartStatus = event;
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
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: $unnnic-color-neutral-lightest;
      }

      &__actions {
        display: flex;
        gap: $unnnic-spacing-xs;
        cursor: auto;
      }
    }
  }
</style>
