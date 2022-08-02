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
  getSelectedFlowOrg(state) {
    return state.flowOrg;
  },
};
