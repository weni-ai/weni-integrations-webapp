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
<<<<<<< HEAD
        let { data } = await insights.get_template_analytics(app_uuid, filters);
=======
        let data = await insights.get_template_analytics(app_uuid, filters);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
        this.templateAnalytics = data;
        this.loadingTemplateAnalytics = false;
      } catch (err) {
        this.errorTemplateAnalytics = err;
        this.loadingTemplateAnalytics = false;
      }
    },
    async getTemplates({ app_uuid }) {
      try {
<<<<<<< HEAD
        let { data } = await insights.get_templates(app_uuid);
=======
        let data = await insights.get_templates(app_uuid);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
        this.errorTemplates = null;
        this.templates = data;
      } catch (err) {
        this.errorTemplates = err;
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
