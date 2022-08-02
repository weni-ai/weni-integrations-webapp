export default {
  authToken(state) {
    return state.token;
  },
  authenticated(state) {
    return !!state.token;
  },
  getSelectedFlowOrg(state) {
    return state.flowOrg;
  },
};
