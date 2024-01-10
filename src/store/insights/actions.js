import insights from '@/api/insights';

export default {
  async getTemplateAnalytics({ commit }, { app_uuid, filters }) {
    commit('GET_TEMPLATE_ANALYTICS_REQUEST');
    try {
      let { data } = await insights.get_template_analytics(app_uuid, filters);
      commit('GET_TEMPLATE_ANALYTICS_SUCCESS', data);
    } catch (err) {
      commit('GET_TEMPLATE_ANALYTICS_ERROR', err);
    }
  },

  setSelectedTemplate({ commit }, { template }) {
    commit('GET_SELECTED_TEMPLATE', template);
  },
  setAppUuid({ commit }, { appUuid }) {
    commit('GET_APP_UUID', appUuid);
  },
};
