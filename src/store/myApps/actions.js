import appType from '@/api/myApps';
import { clearHtmlTags } from '@/utils/clearHtmlTags';

/* istanbul ignore next */
function formatGenericApp(appList) {
  return appList.map((app) => {
    const summary =
      app.code === 'generic' ? clearHtmlTags(app.config.channel_claim_blurb) : app.summary;

    return { ...app, generic: app.code === 'generic', summary };
  });
}

export default {
  async getConfiguredApps({ commit }, { params }) {
    commit('GET_CONFIGURED_APPS_REQUEST');
    try {
      let { data } = await appType.getConfiguredApps(params);

      data = formatGenericApp(data);

      commit('GET_CONFIGURED_APPS_SUCCESS', data);
    } catch (err) {
      commit('GET_CONFIGURED_APPS_ERROR', err);
    }
  },
  async getInstalledApps({ commit }, { params }) {
    commit('GET_INSTALLED_APPS_REQUEST');
    try {
      let { data } = await appType.getInstalledApps(params);

      data = formatGenericApp(data);

      commit('GET_INSTALLED_APPS_SUCCESS', data);
    } catch (err) {
      commit('GET_INSTALLED_APPS_ERROR', err);
    }
  },
};
