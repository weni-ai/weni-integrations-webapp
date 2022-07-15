jest.mock('@/api/appType', () => {
  return {
    listComments: jest.fn(),
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
  };
});

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import actions from '@/store/appType/comments/actions';
import appTypeApi from '@/api/appType';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/comments/actions.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
});
