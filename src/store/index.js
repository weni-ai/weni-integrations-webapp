import Vue from 'vue';
import Vuex from 'vuex';

import Auth from './auth';
import AppType from './appType';
import MyApps from './myApps';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Auth,
    AppType,
    MyApps,
  },
});

store.dispatch('retriveAuthToken');
store.dispatch('retriveSelectedOrg');
store.dispatch('retriveSelectedProject');

export default store;
