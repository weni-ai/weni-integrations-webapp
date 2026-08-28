<template>
  <div class="whatsapp-catalog-card">
    <div
      class="whatsapp-catalog-card__wrapper"
      @click="$emit('redirectClick')"
    >
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

      <div
        class="whatsapp-catalog-card__wrapper__actions"
        @click.stop
      >
        <UnnnicSwitch
          ref="catalogConnectSwitch"
          :modelValue="catalogStatus"
          useVModel
          size="small"
          :textRight="
            catalog.is_connected
              ? $t('WhatsApp.catalog.list.actions.active_catalog')
              : $t('WhatsApp.catalog.list.actions.inactive_catalog')
          "
          @update:model-value="toggleCatalogConnect"
        />
        <UnnnicSwitch
          v-if="catalog.is_connected"
          ref="cartEnableSwitch"
          :modelValue="cartStatus"
          useVModel
          size="small"
          :textRight="
            enabledCart
              ? $t('WhatsApp.catalog.list.actions.active_cart')
              : $t('WhatsApp.catalog.list.actions.inactive_cart')
          "
          @update:model-value="toggleCart"
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
    catalogStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentDisable: null,
      cartStatus: this.enabledCart,
    };
  },
  computed: {
    ...mapState(whatsapp_cloud, ['errorDisableCatalog']),
  },
  methods: {
    ...mapActions(whatsapp_cloud, ['disableWhatsAppCloudCatalogs']),
    toggleCatalogConnect(event) {
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
    border: 1px solid $unnnic-color-border-base;
    border-radius: $unnnic-border-radius-md;
    padding: $unnnic-spacing-md;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: $unnnic-color-bg-base-soft;
    }

    &__actions {
      display: flex;
      gap: $unnnic-spacing-xs;
      cursor: auto;
    }
  }
}
</style>
