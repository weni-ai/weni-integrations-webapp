export default {
  GET_EXTERNAL_SERVICES_REQUEST(state) {
    state.loadingExternalServices = true;
    state.errorExternalServices = null;
    state.externalServicesList = null;
  },
  GET_EXTERNAL_SERVICES_SUCCESS(state, data) {
    state.externalServicesList = data;
    state.loadingExternalServices = false;
  },
  GET_EXTERNAL_SERVICES_ERROR(state, err) {
    state.errorExternalServices = err;
    state.loadingExternalServices = false;
  },

  CREATE_PROMPTS_REQUEST(state) {
    state.loadingCreatePrompts = true;
    state.errorCreatePrompts = null;
    state.createPromptsResult = null;
  },
  CREATE_PROMPTS_SUCCESS(state, data) {
    state.createPromptsResult = data;
    state.loadingCreatePrompts = false;
  },
  CREATE_PROMPTS_ERROR(state, err) {
    state.errorCreatePrompts = err;
    state.loadingCreatePrompts = false;
  },

  GET_PROMPTS_REQUEST(state) {
    state.loadingGetPrompts = true;
    state.errorGetPrompts = null;
    state.getPromptsResult = null;
  },
  GET_PROMPTS_SUCCESS(state, data) {
    state.getPromptsResult = data;
    state.loadingGetPrompts = false;
  },
  GET_PROMPTS_ERROR(state, err) {
    state.errorGetPrompts = err;
    state.loadingGetPrompts = false;
  },

  DELETE_PROMPTS_REQUEST(state) {
    state.loadingDeletePrompts = true;
    state.errorDeletePrompts = null;
    state.deletePromptsResult = null;
  },
  DELETE_PROMPTS_SUCCESS(state, data) {
    state.deletePromptsResult = data;
    state.loadingDeletePrompts = false;
  },
  DELETE_PROMPTS_ERROR(state, err) {
    state.errorDeletePrompts = err;
    state.loadingDeletePrompts = false;
  },
};
