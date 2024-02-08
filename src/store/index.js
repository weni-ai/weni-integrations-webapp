import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import appType from './appType';
import myApps from './myApps';
import survey from './survey';
import insights from './insights';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    appType,
    myApps,
    survey,
    insights,
  },
});

store.dispatch('retriveAuthToken');
store.dispatch('retriveSelectedOrg');
store.dispatch('retriveSelectedProject');
store.dispatch('retriveSelectedFlowOrg');
store.dispatch('survey/retrieveSurveyStatus');

export default store;
