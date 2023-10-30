import whatsAppCloud from '@/api/appType/whatsapp_cloud';
import { captureSentryException } from '@/utils/sentry';

export default {
  async getDebugToken({ commit }, { params }) {
    commit('DEBUG_TOKEN_REQUEST');
    try {
      const { data } = await whatsAppCloud.getDebugToken(params);
      commit('DEBUG_TOKEN_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('DEBUG_TOKEN_ERROR', err);
    }
  },
  async getWhatsAppPhoneNumbers({ commit }, { params }) {
    commit('PHONE_NUMBERS_REQUEST');
    try {
      const { data } = await whatsAppCloud.getWhatsAppPhoneNumbers(params);
      commit('PHONE_NUMBERS_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('PHONE_NUMBERS_ERROR', err);
    }
  },
  async configurePhoneNumber({ commit }, { data }) {
    commit('CLOUD_CONFIGURE_REQUEST');
    try {
      await whatsAppCloud.configurePhoneNumber(data);
      commit('CLOUD_CONFIGURE_SUCCESS');
    } catch (err) {
      captureSentryException(err);
      commit('CLOUD_CONFIGURE_ERROR', err);
    }
  },
  setSelectedPhoneNumber({ commit }, { data }) {
    commit('SET_SELECTED_PHONE_NUMBER', data);
  },
  async getWhatsAppCloudCatalogs({ commit }, { appUuid }) {
    commit('GET_WHATSAPP_CATALOGS_REQUEST');
    try {
      const { data } = await whatsAppCloud.getWhatsAppCloudCatalogs(appUuid);
      commit('GET_WHATSAPP_CATALOGS_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('GET_WHATSAPP_CATALOGS_ERROR', err);
    }
  },
  async fetchCatalogData({ commit }, { appUuid, catalogUuid }) {
    commit('FETCH_WHATSAPP_CATALOG_REQUEST');
    try {
      const { data } = await whatsAppCloud.fetchCatalogData(appUuid, catalogUuid);
      commit('FETCH_WHATSAPP_CATALOG_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('FETCH_WHATSAPP_CATALOG_ERROR', err);
    }
  },
  async disableWhatsAppCloudCatalogs({ commit }, { appUuid, catalogUuid }) {
    commit('DISABLE_WHATSAPP_CATALOG_REQUEST');
    try {
      const { data } = await whatsAppCloud.disableWhatsAppCloudCatalogs(appUuid, catalogUuid);
      commit('DISABLE_WHATSAPP_CATALOG_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('DISABLE_WHATSAPP_CATALOG_ERROR', err);
    }
  },
  async enableWhatsAppCloudCatalogs({ commit }, { appUuid, catalogUuid }) {
    commit('ENABLE_WHATSAPP_CATALOG_REQUEST');
    try {
      const { data } = await whatsAppCloud.enableWhatsAppCloudCatalogs(appUuid, catalogUuid);
      commit('ENABLE_WHATSAPP_CATALOG_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('ENABLE_WHATSAPP_CATALOG_ERROR', err);
    }
  },
  async toggleCartVisibility({ commit }, { appUuid, payload }) {
    commit('TOGGLE_CART_VISIBILITY_REQUEST');
    try {
      const { data } = await whatsAppCloud.toggleCartVisibility(appUuid, payload);
      commit('TOGGLE_CART_VISIBILITY_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('TOGGLE_CART_VISIBILITY_ERROR', err);
    }
  },
  async toggleCatalogVisibility({ commit }, { appUuid, payload }) {
    commit('TOGGLE_CATALOG_VISIBILITY_REQUEST');
    try {
      const { data } = await whatsAppCloud.toggleCatalogVisibility(appUuid, payload);
      commit('TOGGLE_CATALOG_VISIBILITY_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('TOGGLE_CATALOG_VISIBILITY_ERROR', err);
    }
  },
  async getCommerceSettings({ commit }, { appUuid }) {
    commit('GET_COMMERCE_SETTINGS_REQUEST');
    try {
      const { data } = await whatsAppCloud.getCommerceSettings(appUuid);
      const settings = data.data[0];
      commit('GET_COMMERCE_SETTINGS_SUCCESS', settings);
    } catch (err) {
      captureSentryException(err);
      commit('GET_COMMERCE_SETTINGS_ERROR', err);
    }
  },
};
