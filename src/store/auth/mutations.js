import TYPES from '../types';

import setLocal from '../../utils/storage';

export default {
  [TYPES.SET_TOKEN](state, token) {
    state.token = token;
    setLocal('authToken', token);
  },
  [TYPES.SET_ORG](state, org) {
    state.org = org;
    setLocal('org', org);
  },
  [TYPES.SET_PROJECT](state, project) {
    state.project = project;
    setLocal('project', project);
  },
};
