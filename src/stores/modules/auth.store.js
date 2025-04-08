import { defineStore } from 'pinia';
import auth from '@/api/auth';
import window from 'global/window';
import setLocal from '../../utils/storage';

export const auth_store = defineStore('auth', {
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
  getters: {
    authenticated(state) {
      return !!state.token;
    },
  },
  actions: {
    async externalLogin({ token }) {
      if (!token) return;
      this.token = token;
      this.authenticated = true;
    },
    async selectedOrg({ org }) {
      if (!org) return;
      this.org = org;
      setLocal('org', org);
    },
    async selectedProject({ project }) {
      if (!project) return;
      this.project = project;
      setLocal('project', project);
    },
    async selectedFlowOrg({ flowOrg }) {
      if (!flowOrg) return;
      this.flowOrg = flowOrg;
      setLocal('flowOrg', flowOrg);
    },
    retriveAuthToken() {
      if (window.localStorage) {
        this.token = window.localStorage.getItem('authToken');
        setLocal('authToken', window.localStorage.getItem('authToken'));
      }
    },
    retriveSelectedOrg() {
      if (window.localStorage) {
        this.org = window.localStorage.getItem('org');
        setLocal('org', window.localStorage.getItem('org'));
      }
    },
    retriveSelectedProject() {
      if (window.localStorage) {
        this.project = window.localStorage.getItem('project');
        setLocal('project', window.localStorage.getItem('project'));
      }
    },
    retriveSelectedFlowOrg() {
      if (window.localStorage) {
        this.flowOrg = window.localStorage.getItem('flowOrg');
        setLocal('flowOrg', window.localStorage.getItem('flowOrg'));
      }
    },
    async getFlowToken() {
      this.loadingFlowToken = true;
      this.errorFlowToken = null;
      this.flowToken = null;
      try {
        const { data } = await auth.getFlowToken();
        this.flowToken = data.api_token;
        this.loadingFlowToken = false;
      } catch (err) {
        this.errorFlowToken = err;
        this.loadingFlowToken = false;
      }
    },
    async getFlowOrganization() {
      if (!this.flowOrg) {
        const { data } = await auth.getFlowOrganization(this.project);
        this.flowOrg = data;
      }
    },
  },
});
