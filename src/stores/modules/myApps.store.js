import { defineStore } from 'pinia';
import appType from '@/api/myApps';
import { formatGenericApp } from '@/stores/utils';

export const my_apps = defineStore('myApps', {
  state() {
    return {
      configuredApps: [],
      loadingConfiguredApps: false,
      errorConfiguredApps: null,

      installedApps: [],
      loadingInstalledApps: false,
      errorInstalledApps: null,
    };
  },
  actions: {
    async getConfiguredApps({ params = null, skipLoading = false }) {
      this.loadingConfiguredApps = !skipLoading;
      this.errorConfiguredApps = null;

      if (!skipLoading) {
        this.configuredApps = null;
      }
      try {
        let { data } = await appType.getConfiguredApps(params);

        data = formatGenericApp(data);

        this.configuredApps = data;
        this.loadingConfiguredApps = false;
      } catch (err) {
        this.errorConfiguredApps = err;
        this.loadingConfiguredApps = false;
      }
    },
    async getInstalledApps({ params }) {
      this.loadingInstalledApps = true;
      this.errorInstalledApps = null;
      this.installedApps = null;
      try {
        let { data } = await appType.getInstalledApps(params);

        data = formatGenericApp(data);

        this.installedApps = data;
        this.loadingInstalledApps = false;
      } catch (err) {
        this.errorInstalledApps = err;
        this.loadingInstalledApps = false;
      }
    },
  },
});
