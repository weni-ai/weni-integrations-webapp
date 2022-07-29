import appType from '@/api/appType';

export default {
  async getAllAppTypes(store, { params }) {
    return await appType.getAllAppTypes(params);
  },

  async getAppType(store, code) {
    return await appType.getAppType(code);
  },

  async postRating(store, { code, payload }) {
    return await appType.postRating(code, payload);
  },

  async getApp(store, { code, appUuid }) {
    return await appType.getApp(code, appUuid);
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

  async fetchFeatured() {
    return await appType.fetchFeatured();
  },

  async updateAppConfig(store, { code, appUuid, payload }) {
    return await appType.updateAppConfig(code, appUuid, payload);
  },
};
