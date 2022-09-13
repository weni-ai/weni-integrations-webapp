import TYPES from '../types';

import setLocal from '../../utils/storage';

export default {
  [TYPES.SET_TOKEN](state, token) {
    state.token = token;
    setLocal('authToken', token);
  },
  [TYPES.SET_ORG](state, org) {
    state.org = org;
    setLocal('org', org);
  },
  [TYPES.SET_PROJECT](state, project) {
    state.project = project;
    setLocal('project', project);
  },
  [TYPES.SET_FLOW_ORG](state, flowOrg) {
    state.flowOrg = flowOrg;
    setLocal('flowOrg', flowOrg);
  },

  GET_FLOW_TOKEN_REQUEST(state) {
    state.loadingFlowToken = true;
    state.errorFlowToken = null;
    state.flowToken = null;
  },
  GET_FLOW_TOKEN_SUCCESS(state, data) {
    state.flowToken = data.api_token;
    state.loadingFlowToken = false;
  },
  GET_FLOW_TOKEN_ERROR(state, err) {
    state.errorFlowToken = err;
    state.loadingFlowToken = false;
  },
};
