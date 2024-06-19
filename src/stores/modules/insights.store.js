import { defineStore } from 'pinia';
import insights from '@/api/insights';

export const insights_store = defineStore('insights', {
  state() {
    return {
      isActive: false,
      templateAnalytics: [],
      loadingTemplateAnalytics: false,
      errorTemplateAnalytics: null,
      selectedTemplate: null,
      appUuid: null,
      templates: [],
      errorTemplates: null,
    };
  },
  actions: {
    async getTemplateAnalytics({ app_uuid, filters }) {
      this.loadingTemplateAnalytics = true;
      this.errorTemplateAnalytics = null;
      this.templateAnalytics = null;
      try {
        let data = await insights.get_template_analytics(app_uuid, filters);
        this.templateAnalytics = data;
        this.loadingTemplateAnalytics = false;
      } catch (err) {
        this.errorTemplateAnalytics = err.response?.data.error || err;
        this.loadingTemplateAnalytics = false;
      }
    },
    async getTemplates({ app_uuid }) {
      try {
        let data = await insights.get_templates(app_uuid);
        this.errorTemplates = null;
        this.templates = data;
      } catch (err) {
        this.errorTemplates = err.response?.data.error || err;
      }
    },
    async setActiveProject({ app_uuid }) {
      this.isActive = true;
      await insights.set_active_project(app_uuid);
    },
    setHasInsights({ isActive }) {
      this.isActive = isActive;
    },
    setSelectedTemplate({ template }) {
      this.selectedTemplate = template;
    },
    setAppUuid({ appUuid }) {
      this.appUuid = appUuid;
    },
  },
});
