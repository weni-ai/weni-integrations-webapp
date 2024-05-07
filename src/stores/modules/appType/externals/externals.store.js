import { defineStore } from 'pinia';
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
<<<<<<< HEAD
        const { data } = await externalServices.getAllExternalServicesTypes();
        this.externalServicesList = data;
        this.loadingExternalServices = false;
      } catch (err) {
        this.errorExternalServices = err;
        this.loadingExternalServices = false;
      }
=======
        this.externalServicesList = await externalServices.getAllExternalServicesTypes();
      } catch (err) {
        this.errorExternalServices = err;
      }
      this.loadingExternalServices = false;
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
    },
    async createPrompts({ code, appUuid, payload }) {
      this.loadingCreatePrompts = true;
      this.errorCreatePrompts = null;
      this.createPromptsResult = null;
      try {
<<<<<<< HEAD
        const { data } = await externalServices.createPrompts(code, appUuid, payload);
=======
        const data = await externalServices.createPrompts(code, appUuid, payload);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
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
<<<<<<< HEAD
        const { data } = await externalServices.getPrompts(code, appUuid);
=======
        const data = await externalServices.getPrompts(code, appUuid);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
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
<<<<<<< HEAD
        const { data } = await externalServices.deletePrompts(code, appUuid, payload);
=======
        const data = await externalServices.deletePrompts(code, appUuid, payload);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
        this.deletePromptsResult = data;
        this.loadingDeletePrompts = false;
      } catch (err) {
        this.errorDeletePrompts = err;
        this.loadingDeletePrompts = false;
      }
    },
  },
});
