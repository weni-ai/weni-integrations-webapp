import getters from '../../../../../src/store/auth/getters';

describe('store/auth/getters.js', () => {
  let state = {};

  beforeEach(() => {
    state = {
      token: 123,
      org: 'org1',
      project: 'bacf838a-b7c0-4cb1-9378-88ef972cdfec',
      flowOrg: '88ef972c-9378-4cb1-b7c0-bacf838adfec',
    };
  });

  it('should return state.token', () => {
    const token = getters.authToken(state);
    expect(token).toEqual(state.token);
  });

  it('should return true if token not null or empty', () => {
    const authenticated = getters.authenticated(state);
    expect(authenticated).toBeTruthy();
  });

  it('should return state.flowOrg', () => {
    const flowOrg = getters.getSelectedFlowOrg(state);
    expect(flowOrg).toEqual(state.flowOrg);
  });
});
