import auth from '@/api/auth';
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
  async selectedFlowOrg({ commit }, { flowOrg }) {
    if (!flowOrg) return;
    commit(TYPES.SET_FLOW_ORG, flowOrg);
  },
  /* istanbul ignore next */
  retriveAuthToken({ commit }) {
    if (window.localStorage) {
      commit(TYPES.SET_TOKEN, window.localStorage.getItem('authToken'));
    }
  },
  /* istanbul ignore next */
  retriveSelectedOrg({ commit }) {
    if (window.localStorage) {
      commit(TYPES.SET_ORG, window.localStorage.getItem('org'));
    }
  },
  /* istanbul ignore next */
  retriveSelectedProject({ commit }) {
    if (window.localStorage) {
      commit(TYPES.SET_PROJECT, window.localStorage.getItem('project'));
    }
  },
  /* istanbul ignore next */
  retriveSelectedFlowOrg({ commit }) {
    if (window.localStorage) {
      commit(TYPES.SET_FLOW_ORG, window.localStorage.getItem('flowOrg'));
    }
  },

  async getFlowToken({ commit }) {
    commit('GET_FLOW_TOKEN_REQUEST');
    try {
      const { data } = await auth.getFlowToken();
      commit('GET_FLOW_TOKEN_SUCCESS', data);
    } catch (err) {
      commit('GET_FLOW_TOKEN_ERROR', err);
    }
  },
};
