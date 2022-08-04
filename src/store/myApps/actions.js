import appType from '@/api/myApps';

export default {
  async getConfiguredApps({ commit }, { params }) {
    commit('GET_CONFIGURED_APPS_REQUEST');
    try {
      const { data } = await appType.getConfiguredApps(params);
      commit('GET_CONFIGURED_APPS_SUCCESS', data);
    } catch (err) {
      commit('GET_CONFIGURED_APPS_ERROR', err);
    }
  },
  async getInstalledApps({ commit }, { params }) {
    commit('GET_INSTALLED_APPS_REQUEST');
    try {
      const { data } = await appType.getInstalledApps(params);
      commit('GET_INSTALLED_APPS_SUCCESS', data);
    } catch (err) {
      commit('GET_INSTALLED_APPS_ERROR', err);
    }
  },
};
