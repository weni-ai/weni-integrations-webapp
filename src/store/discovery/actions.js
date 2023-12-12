export default {
  set_channel({ commit }, { data }) {
    console.log('entrou');
    commit('SET_COMMUNICATIONS', data);
  },
};
