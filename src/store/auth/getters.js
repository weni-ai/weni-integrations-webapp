export default {
  authToken(state) {
    return state.token;
  },
  authenticated(state) {
    return !!state.token;
  },
  getSelectedOrg(state) {
    return state.org;
  },
  getSelectedProject(state) {
    return state.project;
  },
  getSelectedFlowOrg(state) {
    return state.flowOrg;
  },
};
