jest.mock('@/api/myApps', () => {
  return {
    getConfiguredApps: jest.fn(),
    getInstalledApps: jest.fn(),
  };
});

import actions from '@/store/myApps/actions';
import appTypeApi from '@/api/myApps';

describe('store/myApps/actions.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('myApps', () => {
    describe('getAllAppTypes()', () => {
      it('should call appType.getConfiguredApps', async () => {
        expect(appTypeApi.getConfiguredApps).not.toHaveBeenCalled();
        const params = {
          project_uuid: '123',
        };
        await actions.getConfiguredApps({}, { params });
        expect(appTypeApi.getConfiguredApps).toHaveBeenCalledTimes(1);
        expect(appTypeApi.getConfiguredApps).toHaveBeenCalledWith(params);
      });
    });

    describe('getAppType()', () => {
      it('should call appType.getInstalledApps', async () => {
        expect(appTypeApi.getInstalledApps).not.toHaveBeenCalled();
        const params = {
          project_uuid: '123',
        };
        await actions.getInstalledApps({}, { params });
        expect(appTypeApi.getInstalledApps).toHaveBeenCalledTimes(1);
        expect(appTypeApi.getInstalledApps).toHaveBeenCalledWith(params);
      });
    });
  });
});
