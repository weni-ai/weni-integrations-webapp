import appType from '@/api/appType';

export default {
  async getAllAppTypes({ commit }, { params }) {
    commit('GET_ALL_APP_TYPES_REQUEST');
    try {
      const { data } = await appType.getAllAppTypes(params);
      commit('GET_ALL_APP_TYPES_SUCCESS', data);
    } catch (err) {
      commit('GET_ALL_APP_TYPES_ERROR', err);
    }
  },

  async getAppType({ commit }, { code, shouldLoad }) {
    commit('GET_APP_TYPE_REQUEST', shouldLoad);
    try {
      const { data } = await appType.getAppType(code);
      commit('GET_APP_TYPE_SUCCESS', data);
    } catch (err) {
      commit('GET_APP_TYPE_ERROR', err);
    }
  },

  async postRating({ commit }, { code, payload }) {
    commit('POST_RATING_REQUEST');
    try {
      const { data } = await appType.postRating(code, payload);
      commit('POST_RATING_SUCCESS', data);
    } catch (err) {
      commit('POST_RATING_ERROR', err);
    }
  },

  async getApp({ commit }, { code, appUuid }) {
    commit('GET_APP_REQUEST');
    try {
      const { data } = await appType.getApp(code, appUuid);
      commit('GET_APP_SUCCESS', data);
    } catch (err) {
      commit('GET_APP_ERROR', err);
    }
  },

  async createApp({ commit }, { code, payload }) {
    commit('CREATE_APP_REQUEST');
    try {
      const { data } = await appType.createApp(code, payload);
      commit('CREATE_APP_SUCCESS', data);
    } catch (err) {
      commit('CREATE_APP_ERROR', err);
    }
  },

  async deleteApp({ commit }, { code, appUuid }) {
    commit('DELETE_APP_REQUEST');
    try {
      await appType.deleteApp(code, appUuid);
      commit('DELETE_APP_SUCCESS');
    } catch (err) {
      commit('DELETE_APP_ERROR', err);
    }
  },

  async fetchFeatured({ commit }) {
    commit('FETCH_FEATURED_REQUEST');
    try {
      const { data } = await appType.fetchFeatured();
      commit('FETCH_FEATURED_SUCCESS', data);
    } catch (err) {
      commit('FETCH_FEATURED_ERROR', err);
    }
  },

  async updateAppConfig({ commit }, { code, appUuid, payload }) {
    commit('UPDATE_APP_CONFIG_REQUEST');
    try {
      const { data } = await appType.updateAppConfig(code, appUuid, payload);
      commit('UPDATE_APP_CONFIG_SUCCESS', data);
    } catch (err) {
      commit('UPDATE_APP_CONFIG_ERROR', err);
    }
  },
};
