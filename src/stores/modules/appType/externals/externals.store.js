const { defineStore } = require('pinia');
import externalServices from '@/api/appType/externalServices';

export const externals_store = defineStore('externals', {
  state() {
    return {
      loadingExternalServices: true,
      errorExternalServices: null,
      externalServicesList: null,

      loadingCreatePrompts: false,
      errorCreatePrompts: null,
      createPromptsResult: null,

      loadingGetPrompts: false,
      errorGetPrompts: null,
      getPromptsResult: null,

      loadingDeletePrompts: false,
      errorDeletePrompts: null,
      deletePromptsResult: null,
    };
  },
  actions: {
    async getExternalServicesTypes() {
      this.loadingExternalServices = true;
      this.errorExternalServices = null;
      this.externalServicesList = null;
      try {
        const { data } = await externalServices.getAllExternalServicesTypes();
        this.externalServicesList = data;
        this.loadingExternalServices = false;
      } catch (err) {
        this.errorExternalServices = err;
        this.loadingExternalServices = false;
      }
    },
    async createPrompts({ code, appUuid, payload }) {
      this.loadingCreatePrompts = true;
      this.errorCreatePrompts = null;
      this.createPromptsResult = null;
      try {
        const { data } = await externalServices.createPrompts(code, appUuid, payload);
        this.createPromptsResult = data;
        this.loadingCreatePrompts = false;
      } catch (err) {
        this.errorCreatePrompts = err;
        this.loadingCreatePrompts = false;
      }
    },
    async getPrompts({ code, appUuid }) {
      this.loadingGetPrompts = true;
      this.errorGetPrompts = null;
      this.getPromptsResult = null;
      try {
        const { data } = await externalServices.getPrompts(code, appUuid);
        this.getPromptsResult = data;
        this.loadingGetPrompts = false;
      } catch (err) {
        this.errorGetPrompts = err;
        this.loadingGetPrompts = false;
      }
    },
    async deletePrompts({ code, appUuid, payload }) {
      this.loadingDeletePrompts = true;
      this.errorDeletePrompts = null;
      this.deletePromptsResult = null;
      try {
        const { data } = await externalServices.deletePrompts(code, appUuid, payload);
        this.deletePromptsResult = data;
        this.loadingDeletePrompts = false;
      } catch (err) {
        this.errorDeletePrompts = err;
        this.loadingDeletePrompts = false;
      }
    },
  },
});
