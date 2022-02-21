jest.mock('@/api/appType', () => {
  return {
    getAllAppTypes: jest.fn(),
    getAppType: jest.fn(),
    listComments: jest.fn(),
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
    postRating: jest.fn(),
    getApp: jest.fn(),
    createApp: jest.fn(),
    fetchFeatured: jest.fn(),
    updateAppConfig: jest.fn(),
    deleteApp: jest.fn(),
    getSharedWabas: jest.fn(),
  };
});

import actions from '@/store/appType/actions';
import appTypeApi from '@/api/appType';

describe('store/appType/actions.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('AppsTypes', () => {
    describe('getAllAppTypes()', () => {
      it('should call appType.getAllAppTypes', async () => {
        expect(appTypeApi.getAllAppTypes).not.toHaveBeenCalled();
        const filter = {
          params: 'param',
        };
        await actions.getAllAppTypes({}, filter);
        expect(appTypeApi.getAllAppTypes).toHaveBeenCalledTimes(1);
        expect(appTypeApi.getAllAppTypes).toHaveBeenCalledWith(filter.params);
      });
    });

    describe('getAppType()', () => {
      it('should call appType.getAppType', async () => {
        expect(appTypeApi.getAppType).not.toHaveBeenCalled();
        const code = 'code';
        await actions.getAppType({}, code);
        expect(appTypeApi.getAppType).toHaveBeenCalledTimes(1);
        expect(appTypeApi.getAppType).toHaveBeenCalledWith(code);
      });
    });
  });

  describe('Comments', () => {
    it('should call appType.listComments', async () => {
      expect(appTypeApi.listComments).not.toHaveBeenCalled();
      const code = 'code';
      await actions.listComments({}, code);
      expect(appTypeApi.listComments).toHaveBeenCalledTimes(1);
      expect(appTypeApi.listComments).toHaveBeenCalledWith(code);
    });

    it('should call appType.createComment', async () => {
      expect(appTypeApi.createComment).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        payload: {
          foo: 'bar',
        },
      };
      await actions.createComment({}, data);
      expect(appTypeApi.createComment).toHaveBeenCalledTimes(1);
      expect(appTypeApi.createComment).toHaveBeenCalledWith(data.code, data.payload);
    });

    it('should call appType.deleteComment', async () => {
      expect(appTypeApi.deleteComment).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        commentUuid: '123',
      };
      await actions.deleteComment({}, data);
      expect(appTypeApi.deleteComment).toHaveBeenCalledTimes(1);
      expect(appTypeApi.deleteComment).toHaveBeenCalledWith(data.code, data.commentUuid);
    });

    it('should call appType.updateComment', async () => {
      expect(appTypeApi.updateComment).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        commentUuid: '123',
        payload: {
          foo: 'bar',
        },
      };
      await actions.updateComment({}, data);
      expect(appTypeApi.updateComment).toHaveBeenCalledTimes(1);
      expect(appTypeApi.updateComment).toHaveBeenCalledWith(
        data.code,
        data.commentUuid,
        data.payload,
      );
    });

    it('should call appType.fetchFeatured', async () => {
      expect(appTypeApi.fetchFeatured).not.toHaveBeenCalled();
      await actions.fetchFeatured();
      expect(appTypeApi.fetchFeatured).toHaveBeenCalledTimes(1);
    });
  });

  describe('Rating', () => {
    it('should call appType.postRating', async () => {
      expect(appTypeApi.postRating).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        payload: {
          foo: 'bar',
        },
      };
      await actions.postRating({}, data);
      expect(appTypeApi.postRating).toHaveBeenCalledTimes(1);
      expect(appTypeApi.postRating).toHaveBeenCalledWith(data.code, data.payload);
    });
  });

  describe('Apps', () => {
    it('should call appType.getApp', async () => {
      expect(appTypeApi.getApp).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        appUuid: '123',
      };
      await actions.getApp({}, data);
      expect(appTypeApi.getApp).toHaveBeenCalledTimes(1);
      expect(appTypeApi.getApp).toHaveBeenCalledWith(data.code, data.appUuid);
    });

    it('should call appType.createApp', async () => {
      expect(appTypeApi.createApp).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        payload: {
          projectUuid: '123',
        },
      };
      await actions.createApp({}, data);
      expect(appTypeApi.createApp).toHaveBeenCalledTimes(1);
      expect(appTypeApi.createApp).toHaveBeenCalledWith(data.code, data.payload);
    });

    it('should call appType.updateAppConfig', async () => {
      expect(appTypeApi.updateAppConfig).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        appUuid: '123',
        payload: {
          projectUuid: '123',
        },
      };
      await actions.updateAppConfig({}, data);
      expect(appTypeApi.updateAppConfig).toHaveBeenCalledTimes(1);
      expect(appTypeApi.updateAppConfig).toHaveBeenCalledWith(
        data.code,
        data.appUuid,
        data.payload,
      );
    });

    it('should call appType.deleteApp', async () => {
      expect(appTypeApi.deleteApp).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        appUuid: '123',
      };
      await actions.deleteApp({}, data);
      expect(appTypeApi.deleteApp).toHaveBeenCalledTimes(1);
      expect(appTypeApi.deleteApp).toHaveBeenCalledWith(data.code, data.appUuid);
    });

    it('should call appType.getSharedWabas', async () => {
      expect(appTypeApi.getSharedWabas).not.toHaveBeenCalled();
      const data = {
        code: 'code',
        params: {},
      };
      await actions.getSharedWabas({}, data);
      expect(appTypeApi.getSharedWabas).toHaveBeenCalledTimes(1);
      expect(appTypeApi.getSharedWabas).toHaveBeenCalledWith(data.code, data.params);
    });
  });
});
