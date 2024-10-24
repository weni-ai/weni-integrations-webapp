import { defineStore } from 'pinia';
import appType from '@/api/appType';
import genericType from '@/api/appType/generic';
import emailType from '@/api/appType/email';
import { captureSentryException } from '@/utils/sentry';
import { clearHtmlTags } from '@/utils/clearHtmlTags';

export const app_type = defineStore('appType', {
  state() {
    return {
      appUuid: null,
      onboardStatus: true,
      loadingDeleteApp: false,
      errorDeleteApp: false,

      createAppResponse: null,
      loadingCreateApp: false,
      errorCreateApp: false,

      allAppTypes: null,
      loadingAllAppTypes: false,
      errorAllAppTypes: false,

      currentAppType: null,
      loadingCurrentAppType: false,
      errorCurrentAppType: false,

      postRatingResult: null,
      loadingPostRating: false,
      errorPostRating: false,

      currentApp: null,
      loadingCurrentApp: false,
      errorCurrentApp: false,

      featuredApps: null,
      loadingFeaturedApps: false,
      errorFeaturedApps: false,

      loadingUpdateAppConfig: false,
      errorUpdateAppConfig: null,
      updateAppConfigResult: null,

      loadingUpdateApp: false,
      errorUpdateApp: null,
      updateAppResult: null,
    };
  },

  actions: {
    setOnboardStatus(value) {
      this.onboardStatus = value;
    },
    setAppUuid(value) {
      this.appUuid = value;
    },
    async getAllAppTypes({ params }) {
      this.loadingAllAppTypes = true;
      this.errorAllAppTypes = null;
      this.allAppTypes = null;

      try {
        const baseApps = await appType.getAllAppTypes(params);
        const genericAppsData = await genericType.getAllGenericTypes();
        const emailAppsData = await emailType.getAllEmailTypes();
        const iconData = await genericType.getIcons();

        const genericApps = [];

        for (const [code, data] of Object.entries(genericAppsData)) {
          const summary = clearHtmlTags(data.attributes.claim_blurb);

          genericApps.push({
            ...data.attributes,
            generic: true,
            icon: iconData[code],
            summary,
          });
        }
        const fullList = baseApps.concat(genericApps).concat(emailAppsData);

        this.allAppTypes = fullList;
      } catch (err) {
        this.errorAllAppTypes = err;
      } finally {
        this.loadingAllAppTypes = false;
      }
    },
    async getAppType({ code, shouldLoad }) {
      if (shouldLoad) {
        this.loadingCurrentAppType = true;
        this.currentAppType = null;
      }
      this.errorCurrentAppType = null;
      try {
        const { data } = await appType.getAppType(code);
        this.currentAppType = data;
      } catch (err) {
        this.errorCurrentAppType = err;
      } finally {
        this.loadingCurrentAppType = false;
      }
    },
    async postRating({ code, payload }) {
      this.loadingPostRating = true;
      this.errorPostRating = null;
      this.postRatingResult = null;
      try {
        const { data } = await appType.postRating(code, payload);
        this.postRatingResult = data;
        this.loadingPostRating = false;
      } catch (err) {
        this.errorPostRating = err;
        this.loadingPostRating = false;
      }
    },
    async getApp({ code, appUuid }) {
      this.loadingCurrentApp = true;
      this.errorCurrentApp = null;
      this.currentApp = null;
      try {
        const data = await appType.getApp(code, appUuid);
        this.currentApp = data;
        this.loadingCurrentApp = false;
      } catch (err) {
        captureSentryException(err);
        this.errorCurrentApp = err;
        this.loadingCurrentApp = false;
      }
    },
    async createApp({ code, payload }) {
      this.loadingCreateApp = true;
      this.errorCreateApp = null;
      this.createAppResponse = null;
      try {
        const { data } = await appType.createApp(code, payload);
        this.createAppResponse = data;
      } catch (err) {
        this.errorCreateApp = err;
      } finally {
        this.loadingCreateApp = false;
      }
    },
    async deleteApp({ code, appUuid }) {
      this.loadingDeleteApp = true;
      this.errorDeleteApp = null;
      try {
        await appType.deleteApp(code, appUuid);
        this.loadingDeleteApp = false;
      } catch (err) {
        captureSentryException(err);
        this.errorDeleteApp = err;
        this.loadingDeleteApp = false;
      }
    },
    async fetchFeatured() {
      this.loadingFeaturedApps = true;
      this.errorFeaturedApps = null;
      this.featuredApps = null;
      try {
        const data = await appType.fetchFeatured();
        this.featuredApps = data;
      } catch (err) {
        this.errorFeaturedApps = err;
      } finally {
        this.loadingFeaturedApps = false;
      }
    },
    async updateAppConfig({ code, appUuid, payload }) {
      this.loadingUpdateAppConfig = true;
      this.errorUpdateAppConfig = null;
      this.updateAppConfigResult = null;
      try {
        const { data } = await appType.updateAppConfig(code, appUuid, payload);
        this.updateAppConfigResult = data;
      } catch (err) {
        captureSentryException(err);
        this.errorUpdateAppConfig = err;
      }
      this.loadingUpdateAppConfig = false;
    },
    async updateApp({ code, appUuid, payload }) {
      this.loadingUpdateApp = true;
      this.errorUpdateApp = null;
      this.updateAppResult = null;
      try {
        const { data } = await appType.updateApp(code, appUuid, payload);
        this.updateAppResult = data;
        this.loadingUpdateApp = false;
      } catch (err) {
        captureSentryException(err);
        this.errorUpdateApp = err;
        this.loadingUpdateApp = false;
      }
    },
  },
});
