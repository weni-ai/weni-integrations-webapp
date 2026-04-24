import { defineStore } from 'pinia';
import auth from '@/api/auth';
import { moduleStorage } from '@/utils/storage';

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
      moduleStorage.setItem('authToken', token);
    },
    async selectedOrg({ org }) {
      if (!org) return;
      this.org = org;
      moduleStorage.setItem('org', org);
    },
    async selectedProject({ project }) {
      if (!project) return;
      this.project = project;
      moduleStorage.setItem('project', project);
    },
    async selectedFlowOrg({ flowOrg }) {
      if (!flowOrg) return;
      this.flowOrg = flowOrg;
      moduleStorage.setItem('flowOrg', flowOrg);
    },
    retriveAuthToken() {
      if (moduleStorage.getItem('authToken')) {
        this.token = moduleStorage.getItem('authToken');
        moduleStorage.setItem('authToken', moduleStorage.getItem('authToken'));
      }
    },
    retriveSelectedOrg() {
      if (moduleStorage.getItem('org')) {
        this.org = moduleStorage.getItem('org');
        moduleStorage.setItem('org', moduleStorage.getItem('org'));
      }
    },
    retriveSelectedProject() {
      if (moduleStorage.getItem('project')) {
        this.project = moduleStorage.getItem('project');
        moduleStorage.setItem('project', moduleStorage.getItem('project'));
      }
    },
    retriveSelectedFlowOrg() {
      if (moduleStorage.getItem('flowOrg')) {
        this.flowOrg = moduleStorage.getItem('flowOrg');
        moduleStorage.setItem('flowOrg', moduleStorage.getItem('flowOrg'));
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
