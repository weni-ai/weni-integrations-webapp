import mutations from '../../../../../src/store/auth/mutations';
import TYPES from '../../../../../src/store/types';

describe('mutations', () => {
  it('should set token to state.token', () => {
    const token = 123;
    const state = {
      token: null,
    };

    mutations[TYPES.SET_TOKEN](state, token);
    expect(state.token).toEqual(token);
  });

  it('should set org to state.org', () => {
    const org = 'organization1';
    const state = {
      org: null,
    };

    mutations[TYPES.SET_ORG](state, org);
    expect(state.org).toEqual(org);
  });

  it('should set project to state.project', () => {
    const project = 'bacf838a-b7c0-4cb1-9378-88ef972cdfec';
    const state = {
      project: null,
    };

    mutations[TYPES.SET_PROJECT](state, project);
    expect(state.org).toEqual(project);
  });
});
