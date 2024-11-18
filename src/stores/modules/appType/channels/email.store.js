import { defineStore } from 'pinia';
import { captureSentryException } from '@/utils/sentry';
import emailApi from '@/api/appType/email';

export const email_store = defineStore('email', {
  state() {
    return {
      code: null,
      tokens: null,
      loadingTokens: false,
      errorGetTokens: null,
      loggedIn: false,
    };
  },
  persist: true,
  actions: {
    setLogin(value) {
      this.loggedIn = value;
    },
    async getTokens({ code }) {
      this.loadingTokens = true;
      try {
        const data = await emailApi.getTokens(code);
        this.tokens = data;
        this.loadingTokens = false;
        this.loggedIn = true;
      } catch (err) {
        captureSentryException(err);
        this.errorGetTokens = err.response?.data.error || err;
        this.loadingTokens = false;
      }
    },
    async setCode({ code }) {
      if (!code) return;
      this.code = code;
    },
  },
});
