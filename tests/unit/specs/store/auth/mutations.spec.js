import mutations from '../../../../../src/store/auth/mutations';
import TYPES from '../../../../../src/store/types';

describe('store/auth/mutations.js', () => {
  let state = {};

  beforeEach(() => {
    state = {
      token: null,
      org: null,
      project: null,
      flowOrg: null,
    };
  });

  it('should set token to state.token', () => {
    const token = 123;

    mutations[TYPES.SET_TOKEN](state, token);
    expect(state.token).toEqual(token);
  });

  it('should set org to state.org', () => {
    const org = 'organization1';

    mutations[TYPES.SET_ORG](state, org);
    expect(state.org).toEqual(org);
  });

  it('should set project to state.project', () => {
    const project = 'bacf838a-b7c0-4cb1-9378-88ef972cdfec';

    mutations[TYPES.SET_PROJECT](state, project);
    expect(state.project).toEqual(project);
  });

  it('should set flowOrg to state.flowOrg', () => {
    const flowOrg = '88ef972c-9378-4cb1-b7c0-bacf838adfec';

    mutations[TYPES.SET_FLOW_ORG](state, flowOrg);
    expect(state.flowOrg).toEqual(flowOrg);
  });
});
