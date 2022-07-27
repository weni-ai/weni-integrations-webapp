import actions from '../../../../../src/store/auth/actions';

describe('store/auth/actions.js', () => {
  let context = {};
  let state = {};
  beforeEach(() => {
    context = {
      commit: jest.fn(),
    };
    state = {
      token: 123,
      org: 'org1',
      project: 'bacf838a-b7c0-4cb1-9378-88ef972cdfec',
      flowOrg: '88ef972c-9378-4cb1-b7c0-bacf838adfec',
    };
  });

  describe('MISSING', () => {
    it('should NOT login if token is missing', async () => {
      state.token = '';
      await actions.externalLogin(context, state);

      expect(context.commit).not.toHaveBeenCalled();
    });

    it('should NOT set org if org is missing', async () => {
      state.org = '';
      await actions.selectedOrg(context, state);

      expect(context.commit).not.toHaveBeenCalled();
    });

    it('should NOT set project if project is missing', async () => {
      state.project = null;
      await actions.selectedProject(context, state);

      expect(context.commit).not.toHaveBeenCalled();
    });

    it('should NOT set flowOrg if flowOrg is missing', async () => {
      state.flowOrg = null;
      await actions.selectedFlowOrg(context, state);

      expect(context.commit).not.toHaveBeenCalled();
    });
  });

  describe('PROVIDED', () => {
    it('should login if token provided', async () => {
      await actions.externalLogin(context, state);

      expect(context.commit).toHaveBeenCalledTimes(1);
    });

    it('should set org if org is provided', async () => {
      await actions.selectedOrg(context, state);

      expect(context.commit).toHaveBeenCalledTimes(1);
    });

    it('should set project if project provided', async () => {
      await actions.selectedProject(context, state);

      expect(context.commit).toHaveBeenCalledTimes(1);
    });

    it('should set flowOrg if flowOrg provided', async () => {
      await actions.selectedFlowOrg(context, state);

      expect(context.commit).toHaveBeenCalledTimes(1);
    });
  });
});
