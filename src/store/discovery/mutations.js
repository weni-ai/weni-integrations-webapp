export default {
  SET_COMMUNICATIONS(state, data) {
    state.channel = data;
  },
  SET_EXTERNAL(state, data) {
    state.communications = data;
  },
  SET_BI(state, data) {
    state.communications = data;
  },
};
