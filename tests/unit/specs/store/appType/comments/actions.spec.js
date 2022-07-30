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
import state from '@/store/appType/comments/state';
import mutations from '@/store/appType/comments/mutations';
import appTypeApi from '@/api/appType';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('store/appType/comments/actions.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        comments: {
          namespaced: true,
          actions,
          state,
          mutations,
        },
      },
    });

    jest.resetAllMocks();
  });

  describe('Comments', () => {
    describe('listComments()', () => {
      const code = 'code';

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.listComments.mockImplementation(() => {
          return Promise.resolve({ data: ['comment'] });
        });
      });

      it('should call listComments from API', async () => {
        expect(appTypeApi.listComments).not.toHaveBeenCalled();
        await store.dispatch('comments/listComments', code);
        expect(appTypeApi.listComments).toHaveBeenCalledTimes(1);
      });

      it('should set returned comments result data', async () => {
        store.state.comments.commentsList = [];
        expect(store.state.comments.commentsList).not.toEqual(['comment']);
        await store.dispatch('comments/listComments', code);
        expect(store.state.comments.commentsList).toEqual(['comment']);
      });

      it('should set loadingListComments to false', async () => {
        store.state.comments.loadingListComments = true;
        expect(store.state.comments.loadingListComments).toBe(true);
        await store.dispatch('comments/listComments', code);
        expect(store.state.comments.loadingListComments).toBe(false);
      });

      it('should set errorListComments as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.listComments.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.comments.errorListComments = {};
        expect(store.state.comments.errorListComments).not.toEqual(error);
        await store.dispatch('comments/listComments', code);
        expect(store.state.comments.errorListComments).toEqual(error);
      });
    });

    describe('createComment()', () => {
      const data = {
        code: 'code',
        payload: {
          foo: 'bar',
        },
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.createComment.mockImplementation(() => {
          return Promise.resolve({ data: ['comment'] });
        });
      });

      it('should call createComment from API', async () => {
        expect(appTypeApi.createComment).not.toHaveBeenCalled();
        await store.dispatch('comments/createComment', data);
        expect(appTypeApi.createComment).toHaveBeenCalledTimes(1);
        expect(appTypeApi.createComment).toHaveBeenCalledWith(data.code, data.payload);
      });

      it('should set returned data as createCommentResult', async () => {
        store.state.comments.createCommentResult = [];
        expect(store.state.comments.createCommentResult).not.toEqual(['comment']);
        await store.dispatch('comments/createComment', data);
        expect(store.state.comments.createCommentResult).toEqual(['comment']);
      });

      it('should set loadingCreateComment to false', async () => {
        store.state.comments.loadingCreateComment = true;
        expect(store.state.comments.loadingCreateComment).toBe(true);
        await store.dispatch('comments/createComment', data);
        expect(store.state.comments.loadingCreateComment).toBe(false);
      });

      it('should set errorCreateComment as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.createComment.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.comments.errorCreateComment = {};
        expect(store.state.comments.errorCreateComment).not.toEqual(error);
        await store.dispatch('comments/createComment', data);
        expect(store.state.comments.errorCreateComment).toEqual(error);
      });
    });

    describe('deleteComment', () => {
      const data = {
        code: 'code',
        commentUuid: '123',
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.deleteComment.mockImplementation(() => {
          return Promise.resolve({ data: { success: true } });
        });
      });

      it('should call deleteComment from API', async () => {
        expect(appTypeApi.deleteComment).not.toHaveBeenCalled();
        await store.dispatch('comments/deleteComment', data);
        expect(appTypeApi.deleteComment).toHaveBeenCalledTimes(1);
        expect(appTypeApi.deleteComment).toHaveBeenCalledWith(data.code, data.commentUuid);
      });

      it('should set returned data as deleteCommentResult', async () => {
        store.state.comments.deleteCommentResult = null;
        expect(store.state.comments.deleteCommentResult).not.toEqual({ success: true });
        await store.dispatch('comments/deleteComment', data);
        expect(store.state.comments.deleteCommentResult).toEqual({ success: true });
      });

      it('should set loadingDeleteComment to false', async () => {
        store.state.comments.loadingDeleteComment = true;
        expect(store.state.comments.loadingDeleteComment).toBe(true);
        await store.dispatch('comments/deleteComment', data);
        expect(store.state.comments.loadingDeleteComment).toBe(false);
      });

      it('should set errorDeleteComment as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.deleteComment.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.comments.errorDeleteComment = {};
        expect(store.state.comments.errorDeleteComment).not.toEqual(error);
        await store.dispatch('comments/deleteComment', data);
        expect(store.state.comments.errorDeleteComment).toEqual(error);
      });
    });

    describe('updateComment', () => {
      const data = {
        code: 'code',
        commentUuid: '123',
        payload: {
          foo: 'bar',
        },
      };

      beforeEach(() => {
        jest.resetAllMocks();

        appTypeApi.updateComment.mockImplementation(() => {
          return Promise.resolve({ data: { success: true } });
        });
      });

      it('should call updateComment from API', async () => {
        expect(appTypeApi.updateComment).not.toHaveBeenCalled();
        await store.dispatch('comments/updateComment', data);
        expect(appTypeApi.updateComment).toHaveBeenCalledTimes(1);
        expect(appTypeApi.updateComment).toHaveBeenCalledWith(
          data.code,
          data.commentUuid,
          data.payload,
        );
      });

      it('should set returned data as updateCommentResult', async () => {
        store.state.comments.updateCommentResult = null;
        expect(store.state.comments.updateCommentResult).not.toEqual({ success: true });
        await store.dispatch('comments/updateComment', data);
        expect(store.state.comments.updateCommentResult).toEqual({ success: true });
      });

      it('should set loadingUpdateComment to false', async () => {
        store.state.comments.loadingUpdateComment = true;
        expect(store.state.comments.loadingUpdateComment).toBe(true);
        await store.dispatch('comments/updateComment', data);
        expect(store.state.comments.loadingUpdateComment).toBe(false);
      });

      it('should set errorUpdateComment as result data', async () => {
        const error = { error: 'failed' };
        appTypeApi.updateComment.mockImplementation(() => {
          return Promise.reject(error);
        });
        store.state.comments.errorUpdateComment = {};
        expect(store.state.comments.errorUpdateComment).not.toEqual(error);
        await store.dispatch('comments/updateComment', data);
        expect(store.state.comments.errorUpdateComment).toEqual(error);
      });
    });
  });
});
