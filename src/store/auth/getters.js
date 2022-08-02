export default {
  authenticated(state) {
    return !!state.token;
  },
  getSelectedFlowOrg(state) {
    return state.flowOrg;
  },
};
