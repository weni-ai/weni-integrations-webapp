import { defineStore } from 'pinia';

export const auth = defineStore('auth', {
  state() {
    return {
      token: null,
      org: null,
      project: null,
      flowOrg: null,

      flowToken: null,
      loadingFlowToken: null,
      errorFlowToken: null,
    };
  },
});
