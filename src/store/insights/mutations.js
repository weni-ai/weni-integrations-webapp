export default {
  GET_TEMPLATE_ANALYTICS_REQUEST(state) {
    state.loadingTemplateAnalytics = true;
    state.errorTemplateAnalytics = null;
    state.templateAnalytics = null;
  },
  GET_TEMPLATE_ANALYTICS_SUCCESS(state, data) {
    state.templateAnalytics = data;
    state.loadingTemplateAnalytics = false;
  },
  GET_TEMPLATE_ANALYTICS_ERROR(state, err) {
    state.errorTemplateAnalytics = err;
    state.loadingTemplateAnalytics = false;
  },
  GET_SELECTED_TEMPLATE(state, data) {
    state.selectedTemplate = data;
  },
  GET_APP_UUID(state, data) {
    state.appUuid = data;
  },
  GET_TEMPLATES(state, data) {
    state.errorTemplates = null;
    state.templates = data;
  },
  GET_TEMPLATES_ERROR(state, err) {
    state.errorTemplates = err;
  },
};
