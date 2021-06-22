import TYPES from '../types';
import window from 'global/window';

export default {
  async externalLogin({ commit }, { token }) {
    if (!token) return;
    commit(TYPES.SET_TOKEN, token);
  },
  async selectedOrg({ commit }, { org }) {
    if (!org) return;
    commit(TYPES.SET_ORG, org);
  },
  async selectedProject({ commit }, { project }) {
    if (!project) return;
    commit(TYPES.SET_PROJECT, project);
  },
  retriveAuthToken({ commit }) {
    /* istanbul ignore next */
    if (window.localStorage) {
      commit(TYPES.SET_TOKEN, window.localStorage.getItem('authToken'));
    }
  },
  retriveSelectedOrg({ commit }) {
    /* istanbul ignore next */
    if (window.localStorage) {
      commit(TYPES.SET_ORG, window.localStorage.getItem('org'));
    }
  },
  retriveSelectedProject({ commit }) {
    /* istanbul ignore next */
    if (window.localStorage) {
      commit(TYPES.SET_PROJECT, window.localStorage.getItem('project'));
    }
  },
};
