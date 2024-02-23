import { defineStore } from 'pinia';
import genericTypeApi from '@/api/appType/generic';
import { captureSentryException } from '@/utils/sentry';

export const generic = defineStore('generic', {
  state() {
    return {
      genericAppForm: null,
      genericAppAttributes: null,
      loadingAppForm: false,
      errorAppForm: false,
    };
  },
  actions: {
    async getAppForm({ channelCode }) {
      this.loadingAppForm = true;
      this.genericAppForm = null;
      this.genericAppAttributes = null;
      this.errorAppForm = null;
      try {
        const { data } = await genericTypeApi.getAppForm(channelCode);
        this.genericAppForm = data.form;
        this.genericAppAttributes = data.attributes;
        this.loadingAppForm = false;
      } catch (err) {
        captureSentryException(err);
        this.errorAppForm = err;
        this.loadingAppForm = false;
      }
    },
  },
});
