import { defineStore } from 'pinia';
import ecommerce from '@/api/appType/ecommerce';

export const ecommerce_store = defineStore('ecommerce', {
  state() {
    return {
      loadingEcommerceApps: true,
      errorEcommerceApps: null,
      ecommerceAppsList: null,

      loadingConnectVtexCatalog: false,
      errorConnectVtexCatalog: null,
      connectVtexCatalogData: null,

      loadingVtexAppUuid: false,
      errorVtexAppUuid: null,
      generatedVtexAppUuid: null,
    };
  },
  actions: {
    async getEcommerceTypes() {
      this.loadingEcommerceApps = true;
      this.errorEcommerceApps = null;
      this.ecommerceAppsList = null;
      try {
<<<<<<< HEAD
        const { data } = await ecommerce.getAllEcommerceTypes();
        this.ecommerceAppsList = data;
        this.loadingEcommerceApps = false;
      } catch (err) {
        this.errorEcommerceApps = err;
        this.loadingEcommerceApps = false;
      }
=======
        this.ecommerceAppsList = await ecommerce.getAllEcommerceTypes();
      } catch (err) {
        this.errorEcommerceApps = err;
      }
      this.loadingEcommerceApps = false;
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
    },
    async connectVtexCatalog({ code, appUuid, payload }) {
      this.loadingConnectVtexCatalog = true;
      this.errorConnectVtexCatalog = null;
      this.connectVtexCatalogData = null;
      try {
        const { data } = await ecommerce.connectVtexCatalog(code, appUuid, payload);
        this.connectVtexCatalogData = data;
        this.loadingConnectVtexCatalog = false;
      } catch (err) {
        this.errorConnectVtexCatalog = err;
        this.loadingConnectVtexCatalog = false;
      }
    },
    async getVtexAppUuid({ code }) {
      this.loadingVtexAppUuid = true;
      this.errorVtexAppUuid = null;
      this.generatedVtexAppUuid = null;
      try {
<<<<<<< HEAD
        const { data } = await ecommerce.getVtexAppUuid(code);
=======
        const data = await ecommerce.getVtexAppUuid(code);
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
        this.generatedVtexAppUuid = data;
        this.loadingVtexAppUuid = false;
      } catch (err) {
        this.errorVtexAppUuid = err;
        this.loadingVtexAppUuid = false;
      }
    },
  },
});
