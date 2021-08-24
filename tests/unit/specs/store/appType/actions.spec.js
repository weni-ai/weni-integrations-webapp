jest.mock('@/api/appType', () => {
  return {
    getAllAppTypes: jest.fn(),
    getAppType: jest.fn(),
    listComments: jest.fn(),
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
    postRating: jest.fn(),
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

  describe('Apps', () => {
    describe('getAllAppTypes()', () => {
      it('should call appType.getAllAppTypes', async () => {
        expect(appTypeApi.getAllAppTypes).not.toHaveBeenCalled();
        const filter = 'filter';
        await actions.getAllAppTypes({}, filter);
        expect(appTypeApi.getAllAppTypes).toHaveBeenCalledTimes(1);
        expect(appTypeApi.getAllAppTypes).toHaveBeenCalledWith(filter);
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
});
