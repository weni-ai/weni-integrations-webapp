import { defineStore } from 'pinia';
import whatsAppCloud from '@/api/appType/whatsapp_cloud';
import { captureSentryException } from '@/utils/sentry';

export const whatsapp_cloud = defineStore('whatsapp_cloud', {
  state() {
    return {
      wabaId: null,
      businessId: null,
      whatsAppPhoneNumbers: null,
      selectedPhoneNumber: null,

      loadingDebugToken: false,
      errorDebugToken: false,

      loadingPhoneNumbers: false,
      errorPhoneNumbers: false,

      loadingWhatsAppCloudConfigure: false,
      errorCloudConfigure: false,

      whatsAppCloudCatalogs: null,
      loadingWhatsAppCloudCatalogs: false,
      errorWhatsAppCloudCatalogs: false,

      whatsAppCloudCatalog: null,
      loadingFetchWhatsAppCloudCatalog: false,
      errorFetchWhatsAppCloudCatalog: false,

      disabledCatalog: null,
      loadingDisableCatalog: false,
      errorDisableCatalog: false,

      enabledCatalog: null,
      loadingEnableCatalog: false,
      errorEnableCatalog: false,

      toggledCartVisibility: null,
      loadingToggleCartVisibility: false,
      errorToggleCartVisibility: false,

      toggledCatalogVisibility: null,
      loadingToggleCatalogVisibility: false,
      errorToggleCatalogVisibility: false,

      commerceSettings: null,
      loadingCommerceSettings: false,
      errorCommerceSettings: false,

      catalogProducts: null,
      loadingCatalogProducts: false,
      errorCatalogProducts: false,
    };
  },
  actions: {
    async getDebugToken({ params }) {
      this.loadingDebugToken = true;
      this.wabaId = null;
      this.businessId = null;
      this.errorDebugToken = null;
      try {
        const { data } = await whatsAppCloud.getDebugToken(params);
        this.wabaId = data.waba_id;
        this.businessId = data.business_id;
        this.loadingDebugToken = false;
      } catch (err) {
        captureSentryException(err);
        this.errorDebugToken = err.response?.data.error || err;
        this.loadingDebugToken = false;
      }
    },
    async getWhatsAppPhoneNumbers({ params }) {
      this.loadingPhoneNumbers = true;
      this.whatsAppPhoneNumbers = null;
      this.errorPhoneNumbers = null;
      try {
        const { data } = await whatsAppCloud.getWhatsAppPhoneNumbers(params);
        this.whatsAppPhoneNumbers = data;
        this.loadingPhoneNumbers = false;
      } catch (err) {
        captureSentryException(err);
        this.errorPhoneNumbers = err.response?.data.error || err;
        this.loadingPhoneNumbers = false;
      }
    },
    async configurePhoneNumber({ data }) {
      this.loadingWhatsAppCloudConfigure = true;
      this.errorCloudConfigure = null;
      try {
        const response = await whatsAppCloud.configurePhoneNumber(data);
        this.loadingWhatsAppCloudConfigure = false;
        return response;
      } catch (err) {
        captureSentryException(err);
        this.errorCloudConfigure = err.response?.data.error || err;
        this.loadingWhatsAppCloudConfigure = false;
      }
    },
    setSelectedPhoneNumber({ data }) {
      this.selectedPhoneNumber = data;
    },
    async getWhatsAppCloudCatalogs({ appUuid, params }) {
      this.loadingWhatsAppCloudCatalogs = true;
      this.errorWhatsAppCloudCatalogs = null;
      try {
        const { data } = await whatsAppCloud.getWhatsAppCloudCatalogs(appUuid, params);
        this.whatsAppCloudCatalogs = data;
        this.loadingWhatsAppCloudCatalogs = false;
      } catch (err) {
        captureSentryException(err);
        this.errorWhatsAppCloudCatalogs = err.response?.data.error || err;
        this.loadingWhatsAppCloudCatalogs = false;
      }
    },
    async fetchCatalogData({ appUuid, catalogUuid }) {
      this.loadingFetchWhatsAppCloudCatalog = true;
      this.errorFetchWhatsAppCloudCatalog = null;
      try {
        const { data } = await whatsAppCloud.fetchCatalogData(appUuid, catalogUuid);
        this.whatsAppCloudCatalog = data;
        this.loadingFetchWhatsAppCloudCatalog = false;
      } catch (err) {
        captureSentryException(err);
        this.errorFetchWhatsAppCloudCatalog = err.response?.data.error || err;
        this.loadingFetchWhatsAppCloudCatalog = false;
      }
    },
    async disableWhatsAppCloudCatalogs({ appUuid, catalogUuid }) {
      this.loadingDisableCatalog = true;
      this.disabledCatalog = null;
      this.errorDisableCatalog = null;
      try {
        const { data } = await whatsAppCloud.disableWhatsAppCloudCatalogs(appUuid, catalogUuid);
        this.disabledCatalog = data;
        this.loadingDisableCatalog = false;
      } catch (err) {
        captureSentryException(err);
        this.errorDisableCatalog = err.response?.data.error || err;
        this.loadingDisableCatalog = false;
      }
    },
    async enableWhatsAppCloudCatalogs({ appUuid, catalogUuid }) {
      this.loadingEnableCatalog = true;
      this.enabledCatalog = null;
      this.errorEnableCatalog = null;
      try {
        const { data } = await whatsAppCloud.enableWhatsAppCloudCatalogs(appUuid, catalogUuid);
        this.enabledCatalog = data;
        this.loadingEnableCatalog = false;
      } catch (err) {
        captureSentryException(err);
        this.errorEnableCatalog = err.response?.data.error || err;
        this.loadingEnableCatalog = false;
      }
    },
    async toggleCartVisibility({ appUuid, payload }) {
      this.loadingToggleCartVisibility = true;
      this.toggledCartVisibility = null;
      this.errorToggleCartVisibility = null;
      try {
        const { data } = await whatsAppCloud.toggleCartVisibility(appUuid, payload);
        this.toggledCartVisibility = data;
        this.loadingToggleCartVisibility = false;
      } catch (err) {
        captureSentryException(err);
        this.errorToggleCartVisibility = err.response?.data.error || err;
        this.loadingToggleCartVisibility = false;
      }
    },
    async toggleCatalogVisibility({ appUuid, payload }) {
      this.loadingToggleCatalogVisibility = true;
      this.toggledCatalogVisibility = null;
      this.errorToggleCatalogVisibility = null;
      try {
        const { data } = await whatsAppCloud.toggleCatalogVisibility(appUuid, payload);
        this.toggledCatalogVisibility = data;
        this.loadingToggleCatalogVisibility = false;
      } catch (err) {
        captureSentryException(err);
        this.errorToggleCatalogVisibility = err.response?.data.error || err;
        this.loadingToggleCatalogVisibility = false;
      }
    },
    async getCommerceSettings({ appUuid }) {
      this.loadingCommerceSettings = true;
      this.errorCommerceSettings = null;
      try {
        const { data } = await whatsAppCloud.getCommerceSettings(appUuid);
        const settings = data.data[0];
        this.commerceSettings = settings;
        this.loadingCommerceSettings = false;
      } catch (err) {
        captureSentryException(err);
        this.errorCommerceSettings = err.response?.data.error || err;
        this.loadingCommerceSettings = false;
      }
    },
    async getCatalogProducts({ appUuid, catalogUuid, params }) {
      this.loadingCatalogProducts = true;
      this.errorCatalogProducts = null;
      try {
        const { data } = await whatsAppCloud.getCatalogProducts(appUuid, catalogUuid, params);
        this.catalogProducts = data;
        this.loadingCatalogProducts = false;
      } catch (err) {
        captureSentryException(err);
        this.errorCatalogProducts = err.response?.data.error || err;
        this.loadingCatalogProducts = false;
      }
    },
  },
});
