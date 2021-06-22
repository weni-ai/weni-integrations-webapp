import Vue from 'vue';
import Vuex from 'vuex';

import Auth from './auth';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Auth,
  },
});

store.dispatch('retriveAuthToken');
store.dispatch('retriveSelectedOrg');
store.dispatch('retriveSelectedProject');

export default store;
