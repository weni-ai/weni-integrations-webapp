import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import appType from './appType';
import myApps from './myApps';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    appType,
    myApps,
  },
});

store.dispatch('retriveAuthToken');
store.dispatch('retriveSelectedOrg');
store.dispatch('retriveSelectedProject');

export default store;
