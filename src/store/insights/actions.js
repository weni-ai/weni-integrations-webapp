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
  async getTemplates({ commit }, { app_uuid }) {
    try {
      let { data } = await insights.get_templates(app_uuid);
      commit('GET_TEMPLATES', data);
    } catch (err) {
      commit('GET_TEMPLATES_ERROR', err);
    }
  },
  async setActiveProject({ commit }, { app_uuid }) {
    commit('GET_IS_ACTIVE', true);
    await insights.set_active_project(app_uuid);
  },

  setHasInsights({ commit }, { isActive }) {
    commit('GET_IS_ACTIVE', isActive);
  },

  setSelectedTemplate({ commit }, { template }) {
    commit('GET_SELECTED_TEMPLATE', template);
  },
  setAppUuid({ commit }, { appUuid }) {
    commit('GET_APP_UUID', appUuid);
  },
};
