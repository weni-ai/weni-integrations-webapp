import mutations from '../../../../../src/store/auth/mutations';
import TYPES from '../../../../../src/store/types';

describe('mutations', () => {
  let state = {};

  beforeEach(() => {
    state = {
      token: null,
      org: null,
      project: null,
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
});
