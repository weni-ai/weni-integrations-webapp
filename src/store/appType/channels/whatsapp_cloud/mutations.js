export default {
  DEBUG_TOKEN_REQUEST(state) {
    state.loadingDebugToken = true;
    state.wabaId = null;
    state.businessId = null;
    state.errorDebugToken = null;
  },
  DEBUG_TOKEN_SUCCESS(state, data) {
    state.wabaId = data.waba_id;
    state.businessId = data.business_id;
    state.loadingDebugToken = false;
  },
  DEBUG_TOKEN_ERROR(state, data) {
    state.errorDebugToken = data;
    state.loadingDebugToken = false;
  },

  PHONE_NUMBERS_REQUEST(state) {
    state.loadingPhoneNumbers = true;
    state.whatsAppPhoneNumbers = null;
    state.errorPhoneNumbers = null;
  },
  PHONE_NUMBERS_SUCCESS(state, data) {
    state.whatsAppPhoneNumbers = data;
    state.loadingPhoneNumbers = false;
  },
  PHONE_NUMBERS_ERROR(state, data) {
    state.errorPhoneNumbers = data;
    state.loadingPhoneNumbers = false;
  },

  CLOUD_CONFIGURE_REQUEST(state) {
    state.loadingWhatsAppCloudConfigure = true;
    state.errorCloudConfigure = null;
  },
  CLOUD_CONFIGURE_SUCCESS(state) {
    state.loadingWhatsAppCloudConfigure = false;
  },
  CLOUD_CONFIGURE_ERROR(state, data) {
    state.errorCloudConfigure = data;
    state.loadingWhatsAppCloudConfigure = false;
  },

  SET_SELECTED_PHONE_NUMBER(state, data) {
    state.selectedPhoneNumber = data;
  },
  GET_WHATSAPP_CATALOGS_REQUEST(state) {
    state.loadingWhatsAppCloudCatalogs = true;
    state.errorWhatsAppCloudCatalogs = null;
  },
  GET_WHATSAPP_CATALOGS_SUCCESS(state, data) {
    state.whatsAppCloudCatalogs = data;
    state.loadingWhatsAppCloudCatalogs = false;
  },
  GET_WHATSAPP_CATALOGS_ERROR(state, data) {
    state.errorWhatsAppCloudCatalogs = data;
    state.loadingWhatsAppCloudCatalogs = false;
  },
  FETCH_WHATSAPP_CATALOG_REQUEST(state) {
    state.loadingFetchWhatsAppCloudCatalog = true;
    state.errorFetchWhatsAppCloudCatalog = null;
  },
  FETCH_WHATSAPP_CATALOG_SUCCESS(state, data) {
    state.whatsAppCloudCatalog = data;
    state.loadingFetchWhatsAppCloudCatalog = false;
  },
  FETCH_WHATSAPP_CATALOG_ERROR(state, data) {
    state.errorFetchWhatsAppCloudCatalog = data;
    state.loadingFetchWhatsAppCloudCatalog = false;
  },
  DISABLE_WHATSAPP_CATALOG_REQUEST(state) {
    state.loadingDisableCatalog = true;
    state.disabledCatalog = null;
    state.errorDisableCatalog = null;
  },
  DISABLE_WHATSAPP_CATALOG_SUCCESS(state, data) {
    state.disabledCatalog = data;
    state.loadingDisableCatalog = false;
  },
  DISABLE_WHATSAPP_CATALOG_ERROR(state, data) {
    state.errorDisableCatalog = data;
    state.loadingDisableCatalog = false;
  },

  ENABLE_WHATSAPP_CATALOG_REQUEST(state) {
    state.loadingEnableCatalog = true;
    state.enabledCatalog = null;
    state.errorEnableCatalog = null;
  },
  ENABLE_WHATSAPP_CATALOG_SUCCESS(state, data) {
    state.enabledCatalog = data;
    state.loadingEnableCatalog = false;
  },
  ENABLE_WHATSAPP_CATALOG_ERROR(state, data) {
    state.errorEnableCatalog = data;
    state.loadingEnableCatalog = false;
  },

  TOGGLE_CART_VISIBILITY_REQUEST(state) {
    state.loadingToggleCartVisibility = true;
    state.toggledCartVisibility = null;
    state.errorToggleCartVisibility = null;
  },
  TOGGLE_CART_VISIBILITY_SUCCESS(state, data) {
    state.toggledCartVisibility = data;
    state.loadingToggleCartVisibility = false;
  },
  TOGGLE_CART_VISIBILITY_ERROR(state, data) {
    state.errorToggleCartVisibility = data;
    state.loadingToggleCartVisibility = false;
  },

  TOGGLE_CATALOG_VISIBILITY_REQUEST(state) {
    state.loadingToggleCatalogVisibility = true;
    state.toggledCatalogVisibility = null;
    state.errorToggleCatalogVisibility = null;
  },
  TOGGLE_CATALOG_VISIBILITY_SUCCESS(state, data) {
    state.toggledCatalogVisibility = data;
    state.loadingToggleCatalogVisibility = false;
  },
  TOGGLE_CATALOG_VISIBILITY_ERROR(state, data) {
    state.errorToggleCatalogVisibility = data;
    state.loadingToggleCatalogVisibility = false;
  },

  GET_COMMERCE_SETTINGS_REQUEST(state) {
    state.loadingCommerceSettings = true;
    state.errorCommerceSettings = null;
  },
  GET_COMMERCE_SETTINGS_SUCCESS(state, data) {
    state.commerceSettings = data;
    state.loadingCommerceSettings = false;
  },
  GET_COMMERCE_SETTINGS_ERROR(state, data) {
    state.errorCommerceSettings = data;
    state.loadingCommerceSettings = false;
  },

  GET_CATALOG_PRODUCTS_REQUEST(state) {
    state.loadingCatalogProducts = true;
    state.errorCatalogProducts = null;
  },
  GET_CATALOG_PRODUCTS_SUCCESS(state, data) {
    state.catalogProducts = data;
    state.loadingCatalogProducts = false;
  },
  GET_CATALOG_PRODUCTS_ERROR(state, data) {
    state.errorCatalogProducts = data;
    state.loadingCatalogProducts = false;
  },
};
