jest.mock('@/api/appType', () => {
  return {
    getAllAppTypes: jest.fn(),
    getAppType: jest.fn(),
  };
});

import actions from '@/store/appType/actions';
import appTypeApi from '@/api/appType';

describe('store/appType/actions.js', () => {
  // let context = {};
  // let state = {};
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call appType.getAllAppTypes', async () => {
    expect(appTypeApi.getAllAppTypes).not.toHaveBeenCalled();
    const filter = 'filter';
    await actions.getAllAppTypes({}, filter);
    expect(appTypeApi.getAllAppTypes).toHaveBeenCalledTimes(1);
    expect(appTypeApi.getAllAppTypes).toHaveBeenCalledWith(filter);
  });

  it('should call appType.getAppType', async () => {
    expect(appTypeApi.getAppType).not.toHaveBeenCalled();
    await actions.getAppType();
    expect(appTypeApi.getAppType).toHaveBeenCalledTimes(1);
  });
});
